import { db } from './firebase-config.js';
import { requireAuth, signOutUser } from './auth.js';
import {
  collection,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  getDocs,
  query,
  limit,
  orderBy,
  startAfter,
  serverTimestamp,
  getCountFromServer,
  onSnapshot,
  writeBatch,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { parseBulkInput, upsertBulkVocabs, normalizeEntry } from './parser.js';
import {
  showToast,
  debounce,
  formatTimestamp,
  downloadTextFile,
  parseFirebaseError,
  confirmAction,
} from './utils.js';

const state = {
  user: null,
  lists: [],
  listUnsub: null,
  selectedListId: null,
  selectedListName: '',
  pageSize: 20,
  sortField: 'createdAt',
  sortDirection: 'desc',
  currentPageIndex: 0,
  pageCache: new Map(),
  cursors: [],
  hasNextPage: false,
  totalCount: 0,
  searchTerm: '',
  searchResults: [],
  allVocabsCache: null,
  isSearchMode: false,
  loading: false,
  practiceMode: 'meaning',
  audioCache: new Map(),
  audioPrefetch: {
    active: false,
    cancelled: false,
    total: 0,
    completed: 0,
  },
  draggingListId: null,
  isBackfillingOrder: false,
  quiz: {
    active: false,
    items: [],
    unseen: [],
    wrongQueue: [],
    current: null,
    score: 0,
    attempts: 0,
    hintIndex: 0,
    total: 0,
    mode: 'meaning',
    meaningRevealed: false,
    usedMeaningHint: false,
    audioUrl: '',
    audioLoading: false,
    audioError: false,
    audioObjectUrl: '',
    useSpeechFallback: false,
    audioPrefetchPromise: null,
    audioPlayCount: 0,
  },
};

const AUDIO_PREFETCH_CONCURRENCY = 3;

const refs = {
  listItems: document.getElementById('list-items'),
  createListBtn: document.getElementById('create-list-btn'),
  renameListBtn: document.getElementById('rename-list-btn'),
  deleteListBtn: document.getElementById('delete-list-btn'),
  exportBtn: document.getElementById('export-list-btn'),
  startPracticeBtn: document.getElementById('start-practice-btn'),
  paginationInfo: document.getElementById('pagination-info'),
  prevPageBtn: document.getElementById('prev-page-btn'),
  nextPageBtn: document.getElementById('next-page-btn'),
  tableBody: document.getElementById('vocab-tbody'),
  searchInput: document.getElementById('search-input'),
  sortSelect: document.getElementById('sort-select'),
  pageSizeSelect: document.getElementById('page-size-select'),
  bulkTextarea: document.getElementById('bulk-input'),
  bulkBtn: document.getElementById('bulk-add-btn'),
  bulkFeedback: document.getElementById('bulk-feedback'),
  bulkHelpBtn: document.getElementById('bulk-help-btn'),
  listTitle: document.getElementById('current-list-name'),
  signOutBtn: document.getElementById('sign-out-btn'),
  modal: document.getElementById('modal'),
  modalTitle: document.getElementById('modal-title'),
  modalLabel: document.getElementById('modal-label'),
  modalInput: document.getElementById('modal-input'),
  modalConfirm: document.getElementById('modal-confirm'),
  modalCancel: document.getElementById('modal-cancel'),
  practiceModeSelect: document.getElementById('practice-mode-select'),
  quizPanel: document.getElementById('quiz-panel'),
  exitQuizBtn: document.getElementById('exit-quiz-btn'),
  quizProgress: document.getElementById('quiz-progress'),
  quizMeaning: document.getElementById('quiz-meaning-text'),
  quizMeaningHintBtn: document.getElementById('quiz-meaning-hint-btn'),
  quizSubtitle: document.getElementById('quiz-subtitle'),
  quizWordInput: document.getElementById('quiz-word-input'),
  quizTypeInput: document.getElementById('quiz-type-input'),
  quizCheckBtn: document.getElementById('quiz-check-btn'),
  quizSkipBtn: document.getElementById('quiz-skip-btn'),
  quizFeedback: document.getElementById('quiz-feedback'),
  quizWordHintBtn: document.getElementById('quiz-word-hint-btn'),
  quizTypeHintBtn: document.getElementById('quiz-type-hint-btn'),
  quizLetterHint: document.getElementById('quiz-letter-hint'),
  quizTypeHint: document.getElementById('quiz-type-hint'),
  quizAudioControls: document.getElementById('quiz-audio-controls'),
  quizAudioBtn: document.getElementById('quiz-audio-btn'),
  quizAudioStatus: document.getElementById('quiz-audio-status'),
  quizAudioPlayer: document.getElementById('quiz-audio-player'),
  audioPrefetchOverlay: document.getElementById('audio-prefetch-overlay'),
  audioPrefetchStatus: document.getElementById('audio-prefetch-status'),
  audioPrefetchProgressBar: document.getElementById('audio-prefetch-progress-bar'),
  audioPrefetchCancelBtn: document.getElementById('audio-prefetch-cancel-btn'),
  correctSound: document.getElementById('correct-sound'),
  wrongSound: document.getElementById('wrong-sound'),
};

async function init() {
  try {
    state.user = await requireAuth();
    bindEvents();
    await subscribeToLists();
  } catch (error) {
    if (error?.message === 'AUTH_REQUIRED') {
      return;
    }
    showToast(parseFirebaseError(error), 'error');
  }
}

function bindEvents() {
  refs.createListBtn?.addEventListener('click', handleCreateList);
  refs.renameListBtn?.addEventListener('click', handleRenameList);
  refs.deleteListBtn?.addEventListener('click', handleDeleteList);
  refs.exportBtn?.addEventListener('click', handleExportList);
  refs.prevPageBtn?.addEventListener('click', () => changePage(state.currentPageIndex - 1));
  refs.nextPageBtn?.addEventListener('click', () => changePage(state.currentPageIndex + 1));
  refs.sortSelect?.addEventListener('change', handleSortChange);
  refs.pageSizeSelect?.addEventListener('change', handlePageSizeChange);
  refs.bulkBtn?.addEventListener('click', handleBulkAdd);
  refs.bulkHelpBtn?.addEventListener('click', showBulkHelp);
  refs.signOutBtn?.addEventListener('click', handleSignOut);
  refs.startPracticeBtn?.addEventListener('click', handleStartPractice);
  refs.practiceModeSelect?.addEventListener('change', handlePracticeModeChange);
  refs.exitQuizBtn?.addEventListener('click', exitQuizMode);
  refs.quizCheckBtn?.addEventListener('click', checkQuizAnswer);
  refs.quizSkipBtn?.addEventListener('click', skipQuizQuestion);
  refs.quizWordHintBtn?.addEventListener('click', showQuizWordHint);
  refs.quizTypeHintBtn?.addEventListener('click', showQuizTypeHint);
  refs.quizMeaningHintBtn?.addEventListener('click', revealQuizMeaning);
  refs.quizAudioBtn?.addEventListener('click', playQuizAudio);
  refs.audioPrefetchCancelBtn?.addEventListener('click', cancelAudioPrefetch);
  refs.quizAudioPlayer?.addEventListener('ended', () => updateQuizAudioStatus('Bấm để nghe lại'));
  refs.quizAudioPlayer?.addEventListener('error', () => {
    releaseCurrentAudioUrl();
    const canUseSpeech = typeof window !== 'undefined' && 'speechSynthesis' in window;
    state.quiz.audioUrl = '';
    state.quiz.audioObjectUrl = '';
    if (canUseSpeech) {
      state.quiz.useSpeechFallback = true;
      state.quiz.audioError = false;
      state.quiz.audioPlayCount = 0;
      updateQuizAudioStatus('Bấm để nghe');
    } else {
      state.quiz.useSpeechFallback = false;
      state.quiz.audioError = true;
      updateQuizAudioStatus('Không phát được audio');
    }
    updateQuizAudioControls();
  });

  if (refs.searchInput) {
    refs.searchInput.addEventListener(
      'input',
      debounce((event) => handleSearch(event.target.value), 250)
    );
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey) {
      const target = event.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      event.preventDefault();
      refs.searchInput?.focus();
    }
  });

  refs.quizWordInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      checkQuizAnswer();
    }
  });
  refs.quizTypeInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      checkQuizAnswer();
    }
  });

  refs.listItems?.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-list-id]');
    if (!button) return;
    selectList(button.dataset.listId);
  });

  refs.listItems?.addEventListener('dragstart', handleListDragStart);
  refs.listItems?.addEventListener('dragover', handleListDragOver);
  refs.listItems?.addEventListener('drop', handleListDrop);
  refs.listItems?.addEventListener('dragend', handleListDragEnd);

  handlePracticeModeChange();
  updatePracticeModeControl();
}

async function subscribeToLists() {
  if (state.listUnsub) state.listUnsub();
  const listsRef = collection(db, 'users', state.user.uid, 'lists');
  const listsQuery = query(listsRef, orderBy('createdAt', 'desc'));
  state.listUnsub = onSnapshot(
    listsQuery,
    (snapshot) => {
      const rawLists = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
      state.lists = sortListsByOrder(rawLists);
      renderLists();
      if (!state.selectedListId && state.lists.length) {
        selectList(state.lists[0].id);
      } else if (state.selectedListId && !state.lists.find((l) => l.id === state.selectedListId)) {
        resetListSelection();
      }
      backfillListOrderIfNeeded(rawLists);
    },
    (error) => {
      showToast(parseFirebaseError(error, 'Không thể tải danh sách'), 'error');
    }
  );
}

function renderLists() {
  if (!refs.listItems) return;
  refs.listItems.innerHTML = '';
  if (!state.lists.length) {
    const emptyLi = document.createElement('li');
    emptyLi.textContent = 'Chưa có danh sách nào. Tạo mới để bắt đầu.';
    emptyLi.className = 'empty-state';
    refs.listItems.append(emptyLi);
    return;
  }
  state.lists.forEach((list) => {
    const li = document.createElement('li');
    li.dataset.listId = list.id;
    const isDraggable = state.lists.length > 1;
    if (isDraggable) {
      li.setAttribute('draggable', 'true');
    }
    const button = document.createElement('button');
    button.className = 'list-item-btn';
    if (list.id === state.selectedListId) button.classList.add('active');
    button.dataset.listId = list.id;
    if (isDraggable) {
      button.setAttribute('draggable', 'true');
    }
    button.innerHTML = `<span>${list.name ?? 'Chưa đặt tên'}</span>`;
    li.append(button);
    refs.listItems.append(li);
  });
}

function sortListsByOrder(lists) {
  return [...lists].sort((a, b) => {
    const orderA = typeof a.order === 'number' ? a.order : Number.POSITIVE_INFINITY;
    const orderB = typeof b.order === 'number' ? b.order : Number.POSITIVE_INFINITY;
    if (orderA !== orderB) return orderA - orderB;
    const timeA = a.createdAt?.toMillis?.() ?? 0;
    const timeB = b.createdAt?.toMillis?.() ?? 0;
    return timeB - timeA;
  });
}

async function backfillListOrderIfNeeded(lists) {
  if (!state.user || state.isBackfillingOrder) return;
  const needsBackfill = lists.some((list) => typeof list.order !== 'number');
  if (!needsBackfill) return;
  state.isBackfillingOrder = true;
  try {
    const sorted = sortListsByOrder(lists);
    const batch = writeBatch(db);
    let hasChanges = false;
    sorted.forEach((list, index) => {
      if (typeof list.order === 'number' && list.order === index) {
        return;
      }
      hasChanges = true;
      const listRef = doc(db, 'users', state.user.uid, 'lists', list.id);
      batch.update(listRef, { order: index });
    });
    if (hasChanges) {
      await batch.commit();
    }
  } catch (error) {
    showToast(parseFirebaseError(error, 'Unable to sync list order'), 'error');
  } finally {
    state.isBackfillingOrder = false;
  }
}

function handleListDragStart(event) {
  if (state.lists.length < 2) return;
  const li = event.target.closest('li[data-list-id]');
  if (!li) return;
  state.draggingListId = li.dataset.listId;
  li.classList.add('dragging');
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', state.draggingListId);
  }
}

function handleListDragOver(event) {
  if (!state.draggingListId || !refs.listItems) return;
  event.preventDefault();
  const draggingEl = refs.listItems.querySelector('li.dragging');
  if (!draggingEl) return;
  const li = event.target.closest('li[data-list-id]');
  if (!li || li === draggingEl) return;
  const rect = li.getBoundingClientRect();
  const shouldInsertBefore = event.clientY < rect.top + rect.height / 2;
  if (shouldInsertBefore) {
    refs.listItems.insertBefore(draggingEl, li);
  } else {
    refs.listItems.insertBefore(draggingEl, li.nextElementSibling);
  }
}

function handleListDrop(event) {
  if (!state.draggingListId) return;
  event.preventDefault();
  applyListOrderFromDom();
  handleListDragEnd();
}

function handleListDragEnd() {
  const draggingEl = refs.listItems?.querySelector('li.dragging');
  draggingEl?.classList.remove('dragging');
  state.draggingListId = null;
}

function applyListOrderFromDom() {
  if (!refs.listItems) return;
  const orderedIds = Array.from(refs.listItems.querySelectorAll('li[data-list-id]')).map(
    (item) => item.dataset.listId
  );
  if (!orderedIds.length || orderedIds.length !== state.lists.length) return;
  const orderedLists = orderedIds
    .map((id) => state.lists.find((list) => list.id === id))
    .filter(Boolean);
  if (orderedLists.length !== state.lists.length) return;
  const updates = [];
  const reordered = orderedLists.map((list, index) => {
    if (list.order !== index) {
      updates.push({ id: list.id, order: index });
    }
    return { ...list, order: index };
  });
  if (!updates.length) return;
  state.lists = reordered;
  renderLists();
  persistListOrder(updates);
}

async function persistListOrder(updates) {
  if (!state.user || !updates.length) return;
  try {
    const batch = writeBatch(db);
    updates.forEach(({ id, order }) => {
      const listRef = doc(db, 'users', state.user.uid, 'lists', id);
      batch.update(listRef, { order });
    });
    await batch.commit();
  } catch (error) {
    showToast(parseFirebaseError(error, 'Unable to save list order'), 'error');
  }
}

function resetListSelection() {
  exitQuizMode({ silent: true });
  state.selectedListId = null;
  state.selectedListName = '';
  refs.listTitle.textContent = 'Chọn một danh sách';
  toggleListControls(false);
  if (refs.startPracticeBtn) {
    refs.startPracticeBtn.disabled = true;
  }
  renderTableRows([]);
  refs.paginationInfo.textContent = '';
  refs.bulkTextarea.value = '';
  refs.bulkFeedback.textContent = '';
}

function toggleListControls(enabled) {
  [
    refs.renameListBtn,
    refs.deleteListBtn,
    refs.exportBtn,
    refs.startPracticeBtn,
    refs.searchInput,
    refs.sortSelect,
    refs.bulkTextarea,
    refs.bulkBtn,
    refs.pageSizeSelect,
  ].forEach((control) => {
    if (!control) return;
    control.disabled = !enabled;
  });
  if (!enabled && refs.practiceModeSelect) {
    refs.practiceModeSelect.disabled = true;
  }
  updatePracticeModeControl();
}

function updatePracticeModeControl() {
  if (!refs.practiceModeSelect) return;
  const hasList = Boolean(state.selectedListId);
  const inQuiz = state.quiz.active;
  const shouldEnable = hasList && !inQuiz;
  refs.practiceModeSelect.disabled = !shouldEnable;
  if (!hasList) {
    state.practiceMode = 'meaning';
    refs.practiceModeSelect.value = 'meaning';
  } else {
    refs.practiceModeSelect.value = state.practiceMode;
  }
}

function updatePracticeAvailability() {
  if (!refs.startPracticeBtn) return;
  const enabled = Boolean(state.selectedListId && state.totalCount > 0 && !state.quiz.active);
  refs.startPracticeBtn.disabled = !enabled;
  updatePracticeModeControl();
}

function handlePracticeModeChange() {
  if (!refs.practiceModeSelect) return;
  const value = refs.practiceModeSelect.value === 'audio' ? 'audio' : 'meaning';
  state.practiceMode = value;
}

async function handleSignOut(event) {
  event?.preventDefault?.();
  try {
    await signOutUser();
  } catch (error) {
    showToast(parseFirebaseError(error, 'Không thể đăng xuất'), 'error');
  }
}

async function selectList(listId) {
  if (state.quiz.active) {
    exitQuizMode({ silent: true });
  }
  if (state.selectedListId === listId) return;
  state.selectedListId = listId;
  const list = state.lists.find((item) => item.id === listId);
  state.selectedListName = list?.name ?? 'Chưa đặt tên';
  refs.listTitle.textContent = state.selectedListName;
  renderLists();
  toggleListControls(true);
  if (refs.startPracticeBtn) {
    refs.startPracticeBtn.disabled = true;
  }
  refs.searchInput.value = '';
  state.searchTerm = '';
  state.isSearchMode = false;
  state.currentPageIndex = 0;
  state.pageCache.clear();
  state.cursors = [];
  state.hasNextPage = false;
  state.totalCount = 0;
  state.allVocabsCache = null;
  refs.bulkFeedback.textContent = '';
  await fetchTotalCount();
  await loadPage(0, { force: true });
}

async function fetchTotalCount() {
  if (!state.selectedListId) return;
  const vocabsRef = collection(db, 'users', state.user.uid, 'lists', state.selectedListId, 'vocabs');
  try {
    const aggregate = await getCountFromServer(query(vocabsRef));
    state.totalCount = aggregate.data().count;
  } catch (error) {
    console.warn('Failed to get count', error);
    state.totalCount = 0;
  }
  updatePracticeAvailability();
}

function handleSortChange() {
  const [field, direction] = refs.sortSelect.value.split('_');
  state.sortField = field === 'word' ? 'wordLower' : 'createdAt';
  state.sortDirection = direction;
  resetPagination();
}

function handlePageSizeChange() {
  state.pageSize = Number(refs.pageSizeSelect.value) || 20;
  resetPagination();
}

function resetPagination() {
  state.pageCache.clear();
  state.cursors = [];
  state.currentPageIndex = 0;
  state.hasNextPage = false;
  state.searchTerm = '';
  refs.searchInput.value = '';
  state.isSearchMode = false;
  loadPage(0, { force: true });
}

async function loadPage(index, { force = false } = {}) {
  if (!state.selectedListId) return;
  if (state.isSearchMode) {
    renderSearchPage(index);
    return;
  }
  if (!force && state.pageCache.has(index)) {
    state.currentPageIndex = index;
    const cached = state.pageCache.get(index);
    renderTableRows(cached);
    updatePaginationControls(cached.length);
    return;
  }
  try {
    state.loading = true;
    const docs = await fetchPageFromFirestore(index);
    state.pageCache.set(index, docs);
    state.currentPageIndex = index;
    renderTableRows(docs);
    updatePaginationControls(docs.length);
  } catch (error) {
    showToast(parseFirebaseError(error, 'Unable to load vocabulary'), 'error');
  } finally {
    state.loading = false;
  }
}

async function fetchPageFromFirestore(index) {
  const vocabsRef = collection(db, 'users', state.user.uid, 'lists', state.selectedListId, 'vocabs');
  const constraints = [
    orderBy(state.sortField, state.sortDirection),
    limit(state.pageSize),
  ];
  if (index > 0) {
    const cursor = state.cursors[index - 1];
    if (cursor) {
      constraints.push(startAfter(cursor));
    }
  }
  const snapshot = await getDocs(query(vocabsRef, ...constraints));
  const docs = snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
  state.hasNextPage = snapshot.size === state.pageSize;
  state.cursors[index] = snapshot.docs[snapshot.docs.length - 1] ?? null;
  return docs;
}

function changePage(nextIndex) {
  if (nextIndex < 0) return;
  if (!state.isSearchMode && !state.pageCache.has(nextIndex) && !state.hasNextPage) return;
  loadPage(nextIndex);
}

function updatePaginationControls(currentPageSize) {
  const total = state.isSearchMode ? state.searchResults.length : state.totalCount;
  const start = total === 0 ? 0 : state.currentPageIndex * state.pageSize + 1;
  const end = total === 0 ? 0 : start + currentPageSize - 1;
  refs.paginationInfo.textContent = total
    ? `Hiện ${start}-${end} trên tổng ${total}`
    : 'Không có dữ liệu';
  refs.prevPageBtn.disabled = state.currentPageIndex === 0;
  refs.nextPageBtn.disabled = state.isSearchMode
    ? end >= total
    : !state.hasNextPage && !state.pageCache.has(state.currentPageIndex + 1);
}

function renderTableRows(items) {
  refs.tableBody.innerHTML = '';
  if (!items.length) {
    const empty = document.createElement('tr');
    empty.innerHTML = `<td colspan="5" class="empty-state">Chưa có dữ liệu. Thêm từ mới để bắt đầu!</td>`;
    refs.tableBody.append(empty);
    return;
  }
  items.forEach((item) => {
    const tr = document.createElement('tr');
    const tags = Array.isArray(item.tags) ? item.tags.filter(Boolean) : [];
    const tagsHtml = tags.length
      ? tags.map((tag) => `<span class="tag">${tag}</span>`).join('')
      : '--';
    const meaningContent = item.meaning + (item.example ? `<br><small>${item.example}</small>` : '');
    tr.innerHTML = `
      <td title="${item.phonetic ?? ''}">${item.word}</td>
      <td>${item.type}</td>
      <td>${meaningContent}</td>
      <td>${tagsHtml}</td>
      <td>${formatTimestamp(item.createdAt)}</td>
    `;
    refs.tableBody.append(tr);
  });
}

async function handleCreateList() {
  const name = await openPrompt({
    title: 'Tạo danh sách mới',
    label: 'Tên danh sách',
    placeholder: 'Ví dụ: Từ vựng TOEIC',
  });
  if (!name) return;
  try {
    await addDoc(collection(db, 'users', state.user.uid, 'lists'), {
      name: name.trim(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      order: state.lists.length,
    });
    showToast('Đã tạo danh sách mới.', 'success');
  } catch (error) {
    showToast(parseFirebaseError(error, 'Không thể tạo danh sách mới'), 'error');
  }
}

async function handleRenameList() {
  if (!state.selectedListId) return;
  const name = await openPrompt({
    title: 'Đổi tên danh sách',
    label: 'Tên mới',
    value: state.selectedListName,
  });
  if (!name || !name.trim()) return;
  try {
    await updateDoc(doc(db, 'users', state.user.uid, 'lists', state.selectedListId), {
      name: name.trim(),
      updatedAt: serverTimestamp(),
    });
    showToast('Đã đổi tên danh sách.', 'success');
  } catch (error) {
    showToast(parseFirebaseError(error, 'Không thể đổi tên danh sách'), 'error');
  }
}

async function handleDeleteList() {
  if (!state.selectedListId) return;
  const confirmed = confirmAction(
    `Xóa "${state.selectedListName}"? Tất cả từ vựng bên trong sẽ mất.`
  );
  if (!confirmed) return;
  try {
    const listRef = doc(db, 'users', state.user.uid, 'lists', state.selectedListId);
    const vocabsRef = collection(listRef, 'vocabs');
    const snapshot = await getDocs(vocabsRef);
    const batchCommits = [];
    let batch = writeBatch(db);
    let counter = 0;
    snapshot.forEach((docSnap) => {
      batch.delete(docSnap.ref);
      counter += 1;
      if (counter === 450) {
        batchCommits.push(batch.commit());
        batch = writeBatch(db);
        counter = 0;
      }
    });
    if (counter > 0) {
      batchCommits.push(batch.commit());
    }
    await Promise.all(batchCommits);
    await deleteDoc(listRef);
    showToast('Đã xóa danh sách.', 'success');
    resetListSelection();
  } catch (error) {
    showToast(parseFirebaseError(error, 'Không thể xóa danh sách'), 'error');
  }
}

async function handleExportList() {
  if (!state.selectedListId) return;
  try {
    const vocabsRef = collection(db, 'users', state.user.uid, 'lists', state.selectedListId, 'vocabs');
    const snapshot = await getDocs(query(vocabsRef, orderBy('wordLower', 'asc')));
    const lines = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      const serialisable = {
        word: data.word,
        type: data.type,
        meaning: data.meaning,
        tags: data.tags ?? [],
        example: data.example ?? undefined,
        note: data.note ?? undefined,
        phonetic: data.phonetic ?? undefined,
        createdAt: data.createdAt?.toDate?.().toISOString?.() ?? null,
      };
      return JSON.stringify(serialisable);
    });
    const filename = `${state.selectedListName || 'tuvung'}-${new Date().toISOString().slice(0, 10)}.jsonl`;
    downloadTextFile(filename, lines.join('\n'));
    showToast('Đã tạo file JSONL.', 'success');
  } catch (error) {
    showToast(parseFirebaseError(error, 'Không thể xuất danh sách'), 'error');
  }
}

async function handleStartPractice() {
  if (!state.selectedListId) {
    showToast('Hãy chọn một danh sách trước.', 'info');
    return;
  }
  try {
    const items = await fetchAllVocabs();
    if (!items.length) {
      showToast('Danh sách chưa có từ nào để luyện tập.', 'info');
      updatePracticeAvailability();
      return;
    }
    if (state.practiceMode === 'audio') {
      const ready = await prepareAudioPractice(items);
      if (!ready) {
        return;
      }
    }
    enterQuizMode(items, state.practiceMode);
  } catch (error) {
    showToast(parseFirebaseError(error, 'Không thể tải dữ liệu luyện tập'), 'error');
  } finally {
    updatePracticeAvailability();
  }
}

function enterQuizMode(items, mode = 'meaning') {
  if (
    !refs.quizPanel ||
    !refs.quizWordInput ||
    !refs.quizTypeInput ||
    !refs.quizFeedback ||
    !refs.quizMeaning
  ) {
    showToast('Không thể hiển thị giao diện luyện tập.', 'error');
    updatePracticeAvailability();
    return;
  }
  resetQuizState();
  state.quiz.active = true;
  state.quiz.items = items;
  state.quiz.unseen = shuffleArray([...items]);
  state.quiz.total = items.length;
  state.quiz.mode = mode === 'audio' ? 'audio' : 'meaning';
  if (state.quiz.mode === 'audio') {
    const wordsToPrefetch = items.map((item) => item?.word || '');
    state.quiz.audioPrefetchPromise = prefetchAudioForWords(wordsToPrefetch, {
      allowDictionary: false,
      allowPuter: true,
      concurrency: Math.min(2, Math.max(1, wordsToPrefetch.length)),
      shouldContinue: () => state.quiz.active && state.quiz.mode === 'audio',
    })
      .catch((error) => {
        console.warn('Audio prefetch failed', error);
      })
      .finally(() => {
        state.quiz.audioPrefetchPromise = null;
      });
  } else {
    state.quiz.audioPrefetchPromise = null;
  }
  if (refs.startPracticeBtn) {
    refs.startPracticeBtn.disabled = true;
  }
  refs.quizFeedback.textContent = '';
  refs.quizFeedback.style.color = 'var(--muted)';
  refs.quizLetterHint.textContent = '';
  refs.quizTypeHint.textContent = '';
  refs.quizWordInput.disabled = false;
  refs.quizTypeInput.disabled = false;
  refs.quizWordInput.value = '';
  refs.quizTypeInput.value = '';
  refs.quizWordInput.classList.remove('error');
  refs.quizTypeInput.classList.remove('error');
  updateQuizModeUI();
  updateQuizModeUI();
  if (refs.quizSubtitle) {
    refs.quizSubtitle.textContent = `Đang luyện danh sách: ${state.selectedListName || 'Chưa đặt tên'}`;
  }
  if (refs.quizPanel) {
    refs.quizPanel.classList.remove('hidden');
  }
  document.body.classList.add('quiz-active');
  updatePracticeModeControl();
  updatePracticeAvailability();
  updateQuizProgress();
  prepareNextQuizQuestion();
}

function releaseCurrentAudioUrl() {
  if (refs.quizAudioPlayer) {
    try {
      refs.quizAudioPlayer.pause();
      refs.quizAudioPlayer.removeAttribute('src');
    } catch (error) {
      /* ignore */
    }
  }
  if (state.quiz.audioObjectUrl) {
    try {
      URL.revokeObjectURL(state.quiz.audioObjectUrl);
    } catch (error) {
      /* ignore */
    }
    state.quiz.audioObjectUrl = '';
  }
}

function resetQuizState() {
  releaseCurrentAudioUrl();
  Object.assign(state.quiz, {
    active: false,
    items: [],
    unseen: [],
    wrongQueue: [],
    current: null,
    score: 0,
    attempts: 0,
    hintIndex: 0,
    total: 0,
    mode: 'meaning',
    meaningRevealed: false,
    usedMeaningHint: false,
    audioUrl: '',
    audioLoading: false,
    audioError: false,
    audioObjectUrl: '',
    useSpeechFallback: false,
    audioPrefetchPromise: null,
    audioPlayCount: 0,
  });
}

function updateQuizProgress() {
  if (!refs.quizProgress) return;
  const remaining = state.quiz.unseen.length + state.quiz.wrongQueue.length;
  refs.quizProgress.textContent = `Đúng: ${state.quiz.score}/${state.quiz.total} - Còn lại: ${remaining}`;
}

function prepareNextQuizQuestion() {
  if (!state.quiz.active) return;
  if (!refs.quizMeaning || !refs.quizWordInput || !refs.quizTypeInput) return;
  if (state.quiz.unseen.length === 0 && state.quiz.wrongQueue.length === 0) {
    endQuizSession();
    return;
  }
  releaseCurrentAudioUrl();
  if (state.quiz.unseen.length > 0) {
    const randomIndex = Math.floor(Math.random() * state.quiz.unseen.length);
    state.quiz.current = state.quiz.unseen.splice(randomIndex, 1)[0];
  } else {
    state.quiz.current = state.quiz.wrongQueue.shift();
  }
  state.quiz.attempts = 0;
  state.quiz.hintIndex = 0;
  state.quiz.usedMeaningHint = false;
  state.quiz.meaningRevealed = state.quiz.mode === 'meaning';
  state.quiz.audioUrl = '';
  state.quiz.audioLoading = state.quiz.mode === 'audio';
  state.quiz.audioError = false;
  state.quiz.audioPlayCount = 0;
  state.quiz.useSpeechFallback = false;
  refs.quizLetterHint.textContent = '';
  refs.quizTypeHint.textContent = '';
  refs.quizFeedback.textContent = '';
  refs.quizFeedback.style.color = 'var(--muted)';
  refs.quizWordInput.value = '';
  refs.quizTypeInput.value = '';
  refs.quizWordInput.classList.remove('error');
  refs.quizTypeInput.classList.remove('error');
  refs.quizWordInput.disabled = false;
  refs.quizTypeInput.disabled = false;
  if (refs.quizAudioPlayer) {
    try {
      refs.quizAudioPlayer.pause();
      refs.quizAudioPlayer.currentTime = 0;
      refs.quizAudioPlayer.removeAttribute('src');
      if (typeof refs.quizAudioPlayer.load === 'function') {
        refs.quizAudioPlayer.load();
      }
    } catch (error) {
      console.warn('Không thể đặt lại trình phát audio', error);
    }
  }
  updateMeaningDisplay();
  updateQuizModeUI();
  updateQuizAudioControls();
  if (state.quiz.mode === 'audio') {
    updateQuizAudioStatus('Đang tải audio...');
    loadAudioForCurrentWord(state.quiz.current.word);
  } else {
    updateQuizAudioStatus('');
  }
  refs.quizWordInput.focus();
  updateQuizProgress();
}

function updateMeaningDisplay() {
  if (!refs.quizMeaning || !refs.quizMeaningHintBtn) return;
  const meaning = state.quiz.current?.meaning || '(Chưa có nghĩa)';
  if (!state.quiz.current) {
    refs.quizMeaning.textContent = '';
    refs.quizMeaningHintBtn.classList.add('hidden');
    refs.quizMeaningHintBtn.disabled = true;
    return;
  }
  if (state.quiz.mode === 'meaning') {
    refs.quizMeaning.textContent = meaning;
    refs.quizMeaningHintBtn.classList.add('hidden');
    refs.quizMeaningHintBtn.disabled = true;
  } else {
    refs.quizMeaningHintBtn.classList.remove('hidden');
    if (state.quiz.meaningRevealed) {
      refs.quizMeaning.textContent = meaning;
      refs.quizMeaningHintBtn.textContent = 'Đã hiện';
      refs.quizMeaningHintBtn.disabled = true;
    } else {
      refs.quizMeaning.textContent = '???';
      refs.quizMeaningHintBtn.textContent = 'Hiển thị';
      refs.quizMeaningHintBtn.disabled = false;
    }
  }
}

function updateQuizModeUI() {
  const isAudioMode = state.quiz.mode === 'audio';
  const typeLabel = refs.quizTypeInput?.closest('label');
  if (typeLabel) {
    typeLabel.classList.toggle('hidden', isAudioMode);
  }
  if (refs.quizTypeInput) {
    refs.quizTypeInput.disabled = isAudioMode;
    if (isAudioMode) {
      refs.quizTypeInput.value = '';
      refs.quizTypeInput.classList.remove('error');
    }
  }
  if (refs.quizTypeHintBtn) {
    refs.quizTypeHintBtn.classList.toggle('hidden', isAudioMode);
    refs.quizTypeHintBtn.disabled = isAudioMode;
    const hintWrapper = refs.quizTypeHintBtn.parentElement;
    if (hintWrapper) {
      hintWrapper.classList.toggle('hidden', isAudioMode);
    }
  }
  if (refs.quizTypeHint) {
    refs.quizTypeHint.classList.toggle('hidden', isAudioMode);
    if (isAudioMode) {
      refs.quizTypeHint.textContent = '';
    }
  }
}

function revealQuizMeaning() {
  if (!state.quiz.active || !state.quiz.current) return;
  if (state.quiz.mode !== 'audio') return;
  if (state.quiz.meaningRevealed) return;
  state.quiz.meaningRevealed = true;
  state.quiz.usedMeaningHint = true;
  updateMeaningDisplay();
}

function updateQuizAudioStatus(message) {
  if (!refs.quizAudioStatus) return;
  refs.quizAudioStatus.textContent = message || '';
}

function updateQuizAudioControls() {
  if (!refs.quizAudioControls || !refs.quizAudioBtn) return;
  if (!state.quiz.current || state.quiz.mode !== 'audio') {
    refs.quizAudioControls.classList.add('hidden');
    refs.quizAudioBtn.disabled = true;
    updateQuizAudioStatus('');
    return;
  }
  refs.quizAudioControls.classList.remove('hidden');
  if (state.quiz.audioLoading) {
    refs.quizAudioBtn.disabled = true;
    updateQuizAudioStatus('Đang tải audio...');
    return;
  }
  if (state.quiz.audioError) {
    refs.quizAudioBtn.disabled = true;
    updateQuizAudioStatus('Lỗi tải audio');
    return;
  }
  if (state.quiz.audioUrl || state.quiz.useSpeechFallback) {
    refs.quizAudioBtn.disabled = false;
    updateQuizAudioStatus('Bấm để nghe');
    return;
  }
  refs.quizAudioBtn.disabled = true;
  updateQuizAudioStatus('Không có audio');
}

function getAudioCacheKey(word) {
  return (word || '').trim().toLowerCase();
}

async function ensureAudioEntry(word, options = {}) {
  const key = getAudioCacheKey(word);
  if (!key) return null;
  const force = Boolean(options.force);
  const existing = state.audioCache.get(key);
  const allowDictionary =
    typeof options.allowDictionary === 'boolean'
      ? options.allowDictionary
      : existing?.errorCode !== 'NO_DICTIONARY_AUDIO';
  const allowPuter =
    typeof options.allowPuter === 'boolean' ? options.allowPuter : true;
  if (existing && !force) {
    if (existing.status === 'ready') return existing;
    if (existing.status === 'pending') return existing.promise;
  }
  if (existing && (force || existing.status === 'error')) {
    state.audioCache.delete(key);
  }
  const entry = {
    status: 'pending',
    promise: null,
    blob: null,
    source: null,
    error: null,
    errorCode: null,
  };
  const promise = (async () => {
    try {
      const asset = await fetchAudioAsset(key, { allowDictionary, allowPuter });
      entry.status = 'ready';
      entry.blob = asset?.blob ?? null;
      entry.source = asset?.source ?? null;
      entry.error = null;
      entry.errorCode = null;
      return entry;
    } catch (error) {
      entry.status = 'error';
      entry.blob = null;
      entry.source = null;
      entry.error = error;
      entry.errorCode = error?.code ?? null;
      return entry;
    }
  })();
  entry.promise = promise;
  state.audioCache.set(key, entry);
  return promise;
}

async function fetchAudioAsset(word, options = {}) {
  const normalized = getAudioCacheKey(word);
  if (!normalized) return null;
  const allowDictionary = options.allowDictionary !== false;
  const allowPuter = options.allowPuter !== false;
  let lastError = null;
  if (allowDictionary) {
    try {
      const audioUrl = await fetchDictionaryAudioUrl(normalized);
      if (audioUrl) {
        const blob = await downloadAudioBlob(audioUrl);
        if (blob?.size) {
          return { blob, source: 'dictionary' };
        }
        const emptyError = new Error('DICTIONARY_AUDIO_EMPTY');
        emptyError.code = 'DICTIONARY_AUDIO_EMPTY';
        lastError = emptyError;
      } else {
        const missingError = new Error('NO_DICTIONARY_AUDIO');
        missingError.code = 'NO_DICTIONARY_AUDIO';
        lastError = missingError;
      }
    } catch (error) {
      const taggedError = error;
      if (!taggedError.code) {
        taggedError.code = 'DICTIONARY_AUDIO_FAILED';
      }
      console.warn('Dictionary audio download failed', taggedError);
      lastError = taggedError;
    }
  }
  if (allowPuter) {
    try {
      const blob = await fetchPuterTts(normalized);
      if (blob?.size) {
        return { blob, source: 'puter' };
      }
      const emptyError = new Error('PUTER_TTS_EMPTY');
      emptyError.code = 'PUTER_TTS_EMPTY';
      lastError = emptyError;
    } catch (error) {
      const taggedError = error;
      if (!taggedError.code) {
        taggedError.code = 'PUTER_TTS_FAILED';
      }
      console.warn('Unable to generate audio via Puter TTS', taggedError);
      lastError = taggedError;
    }
  }
  if (lastError) {
    throw lastError;
  }
  const fallbackError = new Error('AUDIO_NOT_AVAILABLE');
  fallbackError.code = 'AUDIO_NOT_AVAILABLE';
  throw fallbackError;
}

async function downloadAudioBlob(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('AUDIO_DOWNLOAD_FAILED_' + response.status);
  }
  const blob = await response.blob();
  return blob && blob.size ? blob : null;
}

async function convertPuterAudioToBlob(audio) {
  if (!audio) return null;
  const globalScope = typeof window !== 'undefined' ? window : globalThis;
  if (globalScope?.Blob && audio instanceof globalScope.Blob) {
    return audio;
  }
  if (globalScope?.ArrayBuffer && audio instanceof globalScope.ArrayBuffer) {
    return new Blob([audio], { type: 'audio/mpeg' });
  }
  if (audio instanceof Blob) {
    return audio;
  }
  if (audio instanceof ArrayBuffer) {
    return new Blob([audio], { type: 'audio/mpeg' });
  }
  if (typeof audio === 'string') {
    return downloadAudioBlob(audio);
  }
  if (typeof audio?.src === 'string') {
    return downloadAudioBlob(audio.src);
  }
  if (typeof audio?.url === 'string') {
    return downloadAudioBlob(audio.url);
  }
  if (typeof audio?.audioUrl === 'string') {
    return downloadAudioBlob(audio.audioUrl);
  }
  if (audio?.blob) {
    if (audio.blob instanceof Blob) return audio.blob;
    if (audio.blob instanceof ArrayBuffer) return new Blob([audio.blob], { type: 'audio/mpeg' });
  }
  const AudioElement =
    globalScope?.HTMLAudioElement && typeof globalScope.HTMLAudioElement === 'function'
      ? globalScope.HTMLAudioElement
      : null;
  if (AudioElement && audio instanceof AudioElement) {
    const src = audio.currentSrc || audio.src;
    if (src) {
      return downloadAudioBlob(src);
    }
  }
  return null;
}

async function prefetchAudioForWords(words, options = {}) {
  if (!Array.isArray(words) || words.length === 0) {
    const total = typeof options.total === 'number' ? options.total : 0;
    const completed =
      typeof options.initialCompleted === 'number' ? options.initialCompleted : 0;
    if (options.onProgress) {
      options.onProgress(Math.min(completed, total), total, null);
    }
    return;
  }
  const unique = Array.from(
    new Set(
      words
        .map((word) => getAudioCacheKey(word))
        .filter((word) => {
          if (!word) return false;
          const entry = state.audioCache.get(word);
          return !entry || entry.status !== 'ready';
        })
    )
  );
  const total =
    typeof options.total === 'number' && options.total > 0
      ? options.total
      : unique.length;
  let completed =
    typeof options.initialCompleted === 'number' && options.initialCompleted >= 0
      ? Math.min(options.initialCompleted, total)
      : 0;
  if (!unique.length) {
    if (options.onProgress) {
      options.onProgress(total, total, null);
    }
    return;
  }
  if (options.onProgress) {
    options.onProgress(completed, total, null);
  }
  const shouldContinue =
    typeof options.shouldContinue === 'function' ? options.shouldContinue : () => true;
  const allowDictionary = options.allowDictionary !== false;
  const allowPuter = options.allowPuter !== false;
  const force = Boolean(options.force);
  const maxConcurrency =
    typeof options.concurrency === 'number' && options.concurrency > 0
      ? Math.min(Math.floor(options.concurrency), unique.length)
      : Math.min(AUDIO_PREFETCH_CONCURRENCY, unique.length);
  let cursor = 0;
  const takeNext = () => {
    if (cursor >= unique.length) return null;
    const nextWord = unique[cursor];
    cursor += 1;
    return nextWord;
  };
  const worker = async () => {
    while (shouldContinue()) {
      const nextWord = takeNext();
      if (!nextWord) break;
      try {
        await ensureAudioEntry(nextWord, { force, allowDictionary, allowPuter });
      } catch (error) {
        if (error?.code !== 'NO_DICTIONARY_AUDIO') {
          console.warn('Audio prefetch failed for word', nextWord, error);
        }
      } finally {
        completed += 1;
        if (options.onProgress) {
          options.onProgress(Math.min(completed, total), total, nextWord);
        }
        if (!shouldContinue()) break;
      }
    }
  };
  await Promise.all(
    Array.from({ length: Math.max(1, maxConcurrency) }, () => worker())
  );
  if (options.onProgress) {
    options.onProgress(Math.min(completed, total), total, null);
  }
}

function showAudioPrefetchOverlay(total, completed = 0) {
  state.audioPrefetch.active = true;
  state.audioPrefetch.total = total;
  state.audioPrefetch.completed = completed;
  state.audioPrefetch.cancelled = false;
  if (refs.audioPrefetchOverlay) {
    refs.audioPrefetchOverlay.classList.remove('hidden');
  }
  updateAudioPrefetchOverlay(completed, total);
}

function updateAudioPrefetchOverlay(completed, total) {
  if (!refs.audioPrefetchStatus || !refs.audioPrefetchProgressBar) return;
  const safeTotal = total > 0 ? total : 0;
  const safeCompleted = Math.min(completed, safeTotal);
  const percent = safeTotal === 0 ? 100 : Math.round((safeCompleted / safeTotal) * 100);
  refs.audioPrefetchStatus.textContent = safeTotal
    ? `Dang chuan bi audio: ${safeCompleted}/${safeTotal} (${percent}%)`
    : 'Dang kiem tra cache audio...';
  refs.audioPrefetchProgressBar.style.width = `${percent}%`;
}

function hideAudioPrefetchOverlay() {
  if (refs.audioPrefetchOverlay) {
    refs.audioPrefetchOverlay.classList.add('hidden');
  }
  if (refs.audioPrefetchStatus) {
    refs.audioPrefetchStatus.textContent = '';
  }
  if (refs.audioPrefetchProgressBar) {
    refs.audioPrefetchProgressBar.style.width = '0%';
  }
  state.audioPrefetch.total = 0;
  state.audioPrefetch.completed = 0;
  state.audioPrefetch.active = false;
}

function cancelAudioPrefetch() {
  if (!state.audioPrefetch.active) return;
  state.audioPrefetch.cancelled = true;
  hideAudioPrefetchOverlay();
  showToast('Da huy viec tai audio truoc khi luyen tap.', 'info');
}

async function prepareAudioPractice(items) {
  const uniqueWords = Array.from(
    new Set(
      (Array.isArray(items) ? items : [])
        .map((item) => getAudioCacheKey(item?.word))
        .filter(Boolean)
    )
  );
  if (!uniqueWords.length) {
    state.audioPrefetch.cancelled = false;
    state.audioPrefetch.active = false;
    state.audioPrefetch.total = 0;
    state.audioPrefetch.completed = 0;
    return true;
  }
  const pendingWords = uniqueWords.filter((word) => {
    const entry = state.audioCache.get(word);
    return !entry || entry.status !== 'ready';
  });
  const total = uniqueWords.length;
  const alreadyReady = total - pendingWords.length;
  if (!pendingWords.length) {
    state.audioPrefetch.cancelled = false;
    state.audioPrefetch.total = total;
    state.audioPrefetch.completed = total;
    state.audioPrefetch.active = false;
    return true;
  }
  showAudioPrefetchOverlay(total, alreadyReady);
  await new Promise((resolve) => setTimeout(resolve, 0));
  let wasCancelled = false;
  try {
    await prefetchAudioForWords(pendingWords, {
      total,
      initialCompleted: alreadyReady,
      allowDictionary: true,
      allowPuter: false,
      shouldContinue: () => !state.audioPrefetch.cancelled,
      onProgress: (completed, totalCount) => {
        state.audioPrefetch.completed = completed;
        updateAudioPrefetchOverlay(completed, totalCount);
      },
    });
  } finally {
    wasCancelled = state.audioPrefetch.cancelled;
    hideAudioPrefetchOverlay();
    state.audioPrefetch.cancelled = false;
  }
  if (wasCancelled) {
    return false;
  }
  const missing = pendingWords.filter((word) => {
    const entry = state.audioCache.get(word);
    return !entry || entry.status !== 'ready';
  });
  if (missing.length) {
    showToast(
      `Khong tim thay audio tu dien cho ${missing.length} tu. Se tao giong noi bo sung trong qua trinh luyen tap.`,
      'info'
    );
  }
  return true;
}

async function loadAudioForCurrentWord(word) {
  const normalized = getAudioCacheKey(word);
  releaseCurrentAudioUrl();
  if (!normalized) {
    state.quiz.audioLoading = false;
    state.quiz.audioUrl = '';
    state.quiz.audioError = false;
    state.quiz.audioObjectUrl = '';
    state.quiz.useSpeechFallback = false;
    updateQuizAudioControls();
    return;
  }
  const canUseSpeech = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const attemptDictionaryFetch = async () => {
    try {
      const entry = await ensureAudioEntry(normalized, { allowDictionary: true, allowPuter: false });
      return entry;
    } catch (error) {
      return state.audioCache.get(normalized);
    }
  };
  let entry = state.audioCache.get(normalized);
  try {
    if (!entry) {
      entry = await attemptDictionaryFetch();
    } else if (entry.status === 'pending') {
      try {
        await entry.promise;
      } catch (_) {
        /* ignore */
      }
      entry = state.audioCache.get(normalized);
    } else if (entry.status === 'error' && entry.errorCode !== 'NO_DICTIONARY_AUDIO') {
      entry = await attemptDictionaryFetch();
    }
  } catch (error) {
    entry = state.audioCache.get(normalized);
    if (error?.code !== 'NO_DICTIONARY_AUDIO') {
      console.warn('Dictionary audio lookup encountered an error', error);
    }
  }
  const currentWord = getAudioCacheKey(state.quiz.current?.word);
  if (normalized !== currentWord) {
    return;
  }
  if (entry && entry.status === 'ready' && entry.blob) {
    const audioUrl = URL.createObjectURL(entry.blob);
    state.quiz.useSpeechFallback = false;
    state.quiz.audioError = false;
    state.quiz.audioUrl = audioUrl;
    state.quiz.audioPlayCount = 0;
    state.quiz.audioObjectUrl = audioUrl;
    if (refs.quizAudioPlayer) {
      try {
        refs.quizAudioPlayer.pause();
        refs.quizAudioPlayer.src = audioUrl;
        refs.quizAudioPlayer.playbackRate = 1;
        if (typeof refs.quizAudioPlayer.load === 'function') {
          refs.quizAudioPlayer.load();
        }
      } catch (error) {
        console.warn('Unable to update audio player', error);
      }
    }
    state.quiz.audioLoading = false;
    updateQuizAudioControls();
    return;
  }
  state.quiz.audioUrl = '';
  state.quiz.audioObjectUrl = '';
  state.quiz.audioPlayCount = 0;
  state.quiz.useSpeechFallback = canUseSpeech;
  state.quiz.audioError = !canUseSpeech;
  state.quiz.audioLoading = false;
  updateQuizAudioControls();
  const attachWhenReady = (promise) => {
    if (!promise?.then) return;
    promise
      .then((result) => {
        const activeWord = getAudioCacheKey(state.quiz.current?.word);
        if (activeWord !== normalized) return;
        if (result?.status !== 'ready' || !result.blob) return;
        releaseCurrentAudioUrl();
        const audioUrl = URL.createObjectURL(result.blob);
        state.quiz.audioUrl = audioUrl;
        state.quiz.audioObjectUrl = audioUrl;
        state.quiz.audioPlayCount = 0;
        state.quiz.useSpeechFallback = false;
        state.quiz.audioError = false;
        if (refs.quizAudioPlayer) {
          try {
            refs.quizAudioPlayer.pause();
            refs.quizAudioPlayer.src = audioUrl;
            refs.quizAudioPlayer.playbackRate = 1;
            if (typeof refs.quizAudioPlayer.load === 'function') {
              refs.quizAudioPlayer.load();
            }
          } catch (playerError) {
            console.warn('Unable to update audio player', playerError);
          }
        }
        updateQuizAudioControls();
      })
      .catch((error) => {
        if (error?.code !== 'NO_DICTIONARY_AUDIO') {
          console.warn('Unable to generate audio via Puter TTS', error);
        }
      })
      .finally(() => {
        const activeWord = getAudioCacheKey(state.quiz.current?.word);
        if (activeWord === normalized) {
          state.quiz.audioError = state.quiz.audioUrl ? false : !canUseSpeech;
          updateQuizAudioControls();
        }
      });
  };
  const ongoingEntry = state.audioCache.get(normalized);
  if (ongoingEntry?.status === 'pending' && ongoingEntry.promise) {
    attachWhenReady(ongoingEntry.promise);
    return;
  }
  const fetchPromise = ensureAudioEntry(normalized, { allowDictionary: false, allowPuter: true });
  attachWhenReady(fetchPromise);
}


function playQuizAudio() {
  if (!state.quiz.current || state.quiz.mode !== 'audio') return;
  const canUseSpeech = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const hasAudio = Boolean(state.quiz.audioUrl);
  const canUseFallback = !hasAudio && state.quiz.useSpeechFallback && canUseSpeech;
  if (!hasAudio && !canUseFallback) return;

  const nextCount = state.quiz.audioPlayCount + 1;
  const shouldSlow = nextCount % 3 === 0;
  state.quiz.audioPlayCount = nextCount;

  if (!hasAudio && canUseFallback) {
    state.quiz.audioError = false;
    const utterance = new SpeechSynthesisUtterance(state.quiz.current.word);
    utterance.lang = 'en-US';
    utterance.rate = shouldSlow ? 0.5 : 1;
    updateQuizAudioStatus(shouldSlow ? 'Dang phat cham...' : 'Dang phat...');
    utterance.onend = () => updateQuizAudioStatus('Bam de nghe lai');
    utterance.onerror = () => {
      updateQuizAudioStatus('Khong phat duoc audio');
      state.quiz.audioError = true;
      state.quiz.useSpeechFallback = false;
      updateQuizAudioControls();
    };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return;
  }

  if (!refs.quizAudioPlayer) return;
  try {
    state.quiz.audioError = false;
    updateQuizAudioStatus(shouldSlow ? 'Dang phat cham...' : 'Dang phat...');
    refs.quizAudioPlayer.pause();
    refs.quizAudioPlayer.currentTime = 0;
    refs.quizAudioPlayer.playbackRate = shouldSlow ? 0.5 : 1;
    const playPromise = refs.quizAudioPlayer.play();
    if (playPromise?.catch) {
      playPromise.catch(() => {});
    }
  } catch (error) {
    console.warn('Khong the phat audio', error);
    state.quiz.audioError = true;
    updateQuizAudioStatus('Khong phat duoc audio');
    updateQuizAudioControls();
  }
}


function checkQuizAnswer() {
  if (!state.quiz.active || !state.quiz.current) return;
  const userWord = refs.quizWordInput.value.trim().toLowerCase();
  const userType = refs.quizTypeInput.value.trim().toLowerCase();
  const correctWord = (state.quiz.current.word || '').trim().toLowerCase();
  const correctType = (state.quiz.current.type || '').trim().toLowerCase();

  refs.quizWordInput.classList.remove('error');
  refs.quizTypeInput.classList.remove('error');

  const requiresType = state.quiz.mode !== 'audio';
  const wordMatches = userWord === correctWord;
  const typeMatches = !requiresType || userType === correctType;

  if (wordMatches && typeMatches) {
    const usedHints = state.quiz.hintIndex > 0 || state.quiz.usedMeaningHint;
    if (state.quiz.attempts === 0 && !usedHints) {
      state.quiz.score += 1;
      refs.quizFeedback.textContent = 'Chính xác!';
      refs.quizFeedback.style.color = '#22c55e';
    } else {
      refs.quizFeedback.textContent = 'Đúng nhưng không cộng điểm vì đã sử dụng gợi ý hoặc sai trước đó.';
      refs.quizFeedback.style.color = '#facc15';
      state.quiz.wrongQueue.push(state.quiz.current);
    }
    playSound(refs.correctSound);
    updateQuizProgress();
    prepareNextQuizQuestion();
  } else {
    if (!wordMatches) {
      refs.quizWordInput.classList.add('error');
    }
    if (!typeMatches && requiresType) {
      refs.quizTypeInput.classList.add('error');
    }
    state.quiz.attempts += 1;
    refs.quizFeedback.textContent = 'Chưa đúng. Thử lại nhé!';
    refs.quizFeedback.style.color = '#f87171';
    playSound(refs.wrongSound);
  }
}

function skipQuizQuestion() {
  if (!state.quiz.active || !state.quiz.current) return;
  state.quiz.wrongQueue.push(state.quiz.current);
  refs.quizFeedback.textContent = 'Đã bỏ qua. Từ này sẽ quay lại sau.';
  refs.quizFeedback.style.color = '#facc15';
  prepareNextQuizQuestion();
}

function showQuizWordHint() {
  if (!state.quiz.active || !state.quiz.current) return;
  const answer = (state.quiz.current.word || '').toLowerCase();
  if (state.quiz.hintIndex < answer.length) {
    state.quiz.hintIndex += 1;
  }
  refs.quizLetterHint.textContent = answer.slice(0, state.quiz.hintIndex);
}

function showQuizTypeHint() {
  if (!state.quiz.active || !state.quiz.current) return;
  if (state.quiz.mode === 'audio') return;
  refs.quizTypeHint.textContent = state.quiz.current.type || '';
}

function endQuizSession() {
  releaseCurrentAudioUrl();
  if (!refs.quizMeaning || !refs.quizWordInput || !refs.quizTypeInput) return;
  refs.quizMeaning.textContent = 'Hoàn tất!';
  refs.quizFeedback.textContent = `Tổng điểm: ${state.quiz.score}/${state.quiz.total}`;
  refs.quizFeedback.style.color = '#38bdf8';
  refs.quizLetterHint.textContent = '';
  refs.quizTypeHint.textContent = '';
  refs.quizWordInput.value = '';
  refs.quizTypeInput.value = '';
  refs.quizWordInput.disabled = true;
  refs.quizTypeInput.disabled = true;
  if (refs.quizMeaningHintBtn) {
    refs.quizMeaningHintBtn.classList.add('hidden');
    refs.quizMeaningHintBtn.disabled = true;
  }
  state.quiz.audioUrl = '';
  state.quiz.audioLoading = false;
  state.quiz.audioError = false;
  updateQuizAudioControls();
  updateQuizAudioStatus('');
  if (refs.quizAudioPlayer) {
    try {
      refs.quizAudioPlayer.pause();
      refs.quizAudioPlayer.currentTime = 0;
    } catch (error) {
      console.warn('Không thể dừng audio', error);
    }
  }
  state.quiz.current = null;
  updateQuizProgress();
}

function exitQuizMode(options = {}) {
  if (options && typeof options.preventDefault === 'function') {
    options.preventDefault();
  }
  const silent = Boolean(options.silent);
  if (!state.quiz.active && silent) {
    resetQuizState();
    if (refs.quizPanel) refs.quizPanel.classList.add('hidden');
    document.body.classList.remove('quiz-active');
    return;
  }
  resetQuizState();
  updateQuizModeUI();
  if (refs.quizPanel) {
    refs.quizPanel.classList.add('hidden');
  }
  if (refs.quizMeaningHintBtn) {
    refs.quizMeaningHintBtn.classList.add('hidden');
    refs.quizMeaningHintBtn.disabled = true;
  }
  if (refs.quizAudioPlayer) {
    try {
      refs.quizAudioPlayer.pause();
      refs.quizAudioPlayer.currentTime = 0;
    } catch (error) {
      console.warn('Không thể dừng audio', error);
    }
  }
  updateQuizAudioControls();
  updateQuizAudioStatus('');
  document.body.classList.remove('quiz-active');
  if (refs.quizWordInput) refs.quizWordInput.disabled = false;
  if (refs.quizTypeInput) refs.quizTypeInput.disabled = false;
  if (refs.quizFeedback) refs.quizFeedback.textContent = '';
  if (refs.quizLetterHint) refs.quizLetterHint.textContent = '';
  if (refs.quizTypeHint) refs.quizTypeHint.textContent = '';
  if (!silent) {
    showToast('Đã thoát chế độ luyện tập.', 'info');
  }
  updatePracticeAvailability();
  updatePracticeModeControl();
}

function playSound(audioEl) {
  if (!audioEl) return;
  try {
    audioEl.currentTime = 0;
    audioEl.play().catch(() => {});
  } catch (error) {
    console.warn('Không phát được âm thanh', error);
  }
}

function shuffleArray(items) {
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[i], clone[j]];
  }
  return clone;
}

async function fetchPuterTts(word) {
  const text = (word || '').trim();
  if (!text) return null;
  const globalScope = typeof window !== 'undefined' ? window : globalThis;
  const puterAi =
    globalScope?.puter?.ai ||
    globalScope?.Puter?.ai ||
    globalThis?.puter?.ai ||
    globalThis?.Puter?.ai ||
    null;
  if (puterAi?.txt2speech) {
    try {
      const audio = await puterAi.txt2speech(text, {
        voice: 'Amy',
        engine: 'neural',
        language: 'en-GB',
      });
      const blob = await convertPuterAudioToBlob(audio);
      if (blob?.size) {
        return blob;
      }
    } catch (error) {
      console.warn('puter.ai txt2speech failed', error);
    }
  }
  return fetchPuterTtsViaApi(text);
}

async function fetchPuterTtsViaApi(word) {
  if (!word) return null;
  try {
    const response = await fetch('https://api.puter.com/v2/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: word, voice: 'en-GB', format: 'mp3' }),
    });
    if (!response.ok) {
      console.warn('Puter REST TTS returned', response.status);
      return null;
    }
    const arrayBuffer = await response.arrayBuffer();
    if (!arrayBuffer || !arrayBuffer.byteLength) {
      return null;
    }
    return new Blob([arrayBuffer], { type: 'audio/mpeg' });
  } catch (error) {
    console.warn('Puter REST TTS failed', error);
    return null;
  }
}

async function fetchDictionaryAudioUrl(word) {
  const key = (word || '').trim().toLowerCase();
  if (!key) return '';
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(key)}`);
    if (!response.ok) {
      if (response.status === 404) {
        return '';
      }
      throw new Error('Dictionary lookup failed with status ' + response.status);
    }
    const data = await response.json();
    let audioUrl = '';
    if (Array.isArray(data)) {
      for (const entry of data) {
        const phonetics = Array.isArray(entry?.phonetics) ? entry.phonetics : [];
        for (const phonetic of phonetics) {
          const candidate = typeof phonetic?.audio === 'string' ? phonetic.audio.trim() : '';
          if (!candidate) continue;
          audioUrl = candidate.startsWith('//') ? `https:${candidate}` : candidate;
          if (audioUrl) break;
        }
        if (audioUrl) break;
      }
    }
    return audioUrl || '';
  } catch (error) {
    console.warn('Dictionary audio request failed', error);
    return '';
  }
}

async function handleBulkAdd() {
  if (!state.selectedListId) {
    showToast('Hãy chọn một danh sách trước.', 'info');
    return;
  }
  const raw = refs.bulkTextarea.value.trim();
  if (!raw) {
    showToast('Hãy dán nội dung cần thêm vào ô văn bản.', 'info');
    return;
  }
  refs.bulkBtn.disabled = true;
  refs.bulkBtn.textContent = 'Đang xử lý...';
  refs.bulkFeedback.textContent = '';
  try {
    const { entries, errors } = parseBulkInput(raw);
    if (errors.length) {
      refs.bulkFeedback.textContent = errors.join('\n');
    }
    if (!entries.length) {
      showToast('Không có dòng hợp lệ nào được thêm.', 'info');
      return;
    }
    await upsertBulkVocabs(db, state.user.uid, state.selectedListId, entries);
    refs.bulkTextarea.value = '';
    await refreshDataAfterMutation();
  } catch (error) {
    showToast(parseFirebaseError(error, 'Thêm từ hàng loạt thất bại'), 'error');
  } finally {
    refs.bulkBtn.disabled = false;
    refs.bulkBtn.textContent = 'Phân tích và thêm';
  }
}

async function refreshDataAfterMutation() {
  state.pageCache.clear();
  state.cursors = [];
  state.allVocabsCache = null;
  await fetchTotalCount();
  await loadPage(0, { force: true });
}

function handleSearch(term) {
  state.searchTerm = term.trim().toLowerCase();
  state.currentPageIndex = 0;
  if (!state.searchTerm) {
    state.isSearchMode = false;
    loadPage(0, { force: true });
    return;
  }
  state.isSearchMode = true;
  applySearch();
}

async function applySearch() {
  if (!state.allVocabsCache) {
    state.allVocabsCache = await fetchAllVocabs();
  }
  const filtered = state.allVocabsCache.filter((entry) => {
    const haystack = `${entry.wordLower} ${entry.meaning.toLowerCase()}`;
    return haystack.includes(state.searchTerm);
  });
  state.searchResults = filtered.sort((a, b) => {
    if (state.sortField === 'wordLower') {
      return state.sortDirection === 'asc'
        ? a.wordLower.localeCompare(b.wordLower)
        : b.wordLower.localeCompare(a.wordLower);
    }
    const aTime = a.createdAt?.toMillis?.() ?? 0;
    const bTime = b.createdAt?.toMillis?.() ?? 0;
    return state.sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
  });
  renderSearchPage(0);
}

function renderSearchPage(pageIndex) {
  const start = pageIndex * state.pageSize;
  const slice = state.searchResults.slice(start, start + state.pageSize);
  state.currentPageIndex = pageIndex;
  renderTableRows(slice);
  updatePaginationControls(slice.length);
}

async function fetchAllVocabs() {
  const vocabsRef = collection(db, 'users', state.user.uid, 'lists', state.selectedListId, 'vocabs');
  const snapshot = await getDocs(query(vocabsRef, orderBy('createdAt', 'desc')));
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
    wordLower: (docSnap.data().word || '').toLowerCase(),
  }));
}

function showBulkHelp() {
  refs.bulkFeedback.textContent =
    `Mỗi dòng là một object:\n` +
    `{"word":"gather","type":"v","meaning":"tụ hợp","tags":["group","verb"]}\n` +
    `{'word': 'curate', 'type': 'v', 'meaning': 'chọn và sắp xếp'}\n`;
}

function openPrompt({ title, label, value = '', placeholder = '' }) {
  if (!refs.modal) {
    const fallback = window.prompt(title, value);
    return Promise.resolve(fallback?.trim() || '');
  }
  const input = refs.modalInput;
  if (refs.modalTitle) refs.modalTitle.textContent = title;
  if (refs.modalLabel) refs.modalLabel.textContent = label;
  if (input) {
    input.value = value;
    input.placeholder = placeholder;
  }
  const handleKeyDown = (event) => {
    if (event.key !== 'Enter') return;
    if (event.isComposing || event.shiftKey || event.ctrlKey || event.metaKey || event.altKey) return;
    event.preventDefault();
    refs.modalConfirm?.click();
  };
  input?.addEventListener('keydown', handleKeyDown);
  refs.modal.showModal();
  input?.focus();
  return new Promise((resolve) => {
    const handleClose = () => {
      input?.removeEventListener('keydown', handleKeyDown);
      refs.modal.removeEventListener('close', handleClose);
      const confirmed = refs.modal.returnValue === 'confirm';
      const inputValue = confirmed ? input?.value.trim() ?? '' : '';
      resolve(inputValue);
    };
    refs.modal.addEventListener('close', handleClose, { once: true });
  });
}

init();