import { db } from './firebase-config.js';
import { requireAuth, signOutUser } from './auth.js';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  getDocs,
  query,
  limit,
  orderBy,
  startAfter,
  serverTimestamp,
  increment,
  getCountFromServer,
  onSnapshot,
  writeBatch,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { parseBulkInput, upsertBulkVocabs, normalizeEntry } from './parser.js';
import { isAdminUser } from './admin-config.js';
import {
  showToast,
  debounce,
  formatTimestamp,
  downloadTextFile,
  parseFirebaseError,
  confirmAction,
} from './utils.js';
import { pinyin } from "https://cdn.jsdelivr.net/npm/pinyin-pro@3.18.2/+esm";
import { phonemize, toIPA, toARPABET } from "https://cdn.jsdelivr.net/npm/phonemize/+esm";const LISTENING_MODE_DEFAULT_CHUNK_SIZE = 25;
const LISTENING_MODE_PREFETCH_RATIO = 0.5;
const AUDIO_CACHE_LIMIT = 150;
const AUDIO_VOICE_PROFILES = Object.freeze({
  english: {
    id: 'english',
    label: 'EN',
    language: 'en-GB',
    voice: 'Amy',
    engines: ['generative', 'neural'],
    speechLang: 'en-GB',
  },
  chinese: {
    id: 'chinese',
    label: '中文',
    language: 'cmn-CN',
    voice: 'Zhiyu',
    engines: ['neural'],
    speechLang: 'cmn-CN',
  },
});
const DEFAULT_AUDIO_VOICE = 'english';
const PUTER_TTS_MAX_RETRIES = 3;
const PUTER_TTS_TIMEOUT_MS = 15000;
const QUIZ_AUDIO_GAIN = 2;

function getVoiceProfile(voiceId) {
  const key = voiceId && AUDIO_VOICE_PROFILES[voiceId] ? voiceId : DEFAULT_AUDIO_VOICE;
  return AUDIO_VOICE_PROFILES[key];
}

function getCurrentVoiceId() {
  return getVoiceProfile(state?.audioVoice)?.id ?? DEFAULT_AUDIO_VOICE;
}

function normalizeWord(word) {
  return (word || '').trim().toLowerCase();
}

function getAudioCacheKey(word, voiceId = getCurrentVoiceId()) {
  const normalized = normalizeWord(word);
  if (!normalized) return '';
  const profile = getVoiceProfile(voiceId);
  return `${profile.id}:${normalized}`;
}

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
  audioVoice: DEFAULT_AUDIO_VOICE,
  typeCheckEnabled: true,
  singleEntryMode: true,
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
    voice: DEFAULT_AUDIO_VOICE,
    audioUrl: '',
    audioLoading: false,
    audioError: false,
    audioObjectUrl: '',
    useSpeechFallback: false,
    audioPrefetchPromise: null,
    audioPlayCount: 0,
    usedTypeHint: false,
    typeCheckEnabled: true,
    stream: {
      enabled: false,
      chunkSize: LISTENING_MODE_DEFAULT_CHUNK_SIZE,
      prefetchRatio: LISTENING_MODE_PREFETCH_RATIO,
      sourceItems: [],
      cursorIndex: 0,
      exhausted: false,
      fetching: false,
      nextChunkPromise: null,
      chunkCounter: 0,
      activeChunkId: null,
      chunkOrder: [],
      chunkMeta: new Map(),
      completedCount: 0,
    },
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
  singleInputToggle: document.getElementById('single-input-toggle'),
  singleEntryForm: document.getElementById('single-entry-form'),
  singleWordInput: document.getElementById('single-word-input'),
  singleTypeInput: document.getElementById('single-type-input'),
  singleMeaningInput: document.getElementById('single-meaning-input'),
  singleTagsInput: document.getElementById('single-tags-input'),
  listTitle: document.getElementById('current-list-name'),
  signOutBtn: document.getElementById('sign-out-btn'),
  adminLink: document.getElementById('admin-link-btn'),
  modal: document.getElementById('modal'),
  modalTitle: document.getElementById('modal-title'),
  modalLabel: document.getElementById('modal-label'),
  modalInput: document.getElementById('modal-input'),
  modalConfirm: document.getElementById('modal-confirm'),
  modalCancel: document.getElementById('modal-cancel'),
  practiceModeSelect: document.getElementById('practice-mode-select'),
  typeCheckToggle: document.getElementById('type-check-toggle'),
  quizPanel: document.getElementById('quiz-panel'),
  exitQuizBtn: document.getElementById('exit-quiz-btn'),
  quizProgress: document.getElementById('quiz-progress'),
  quizMeaning: document.getElementById('quiz-meaning-text'),
  quizMeaningHintBtn: document.getElementById('quiz-meaning-hint-btn'),
  quizMeaningLabel: document.getElementById('quiz-meaning-label'),
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
  quizWordLabel: document.getElementById('quiz-word-label'),
  quizTypeLabel: document.getElementById('quiz-type-label'),
  voiceToggle: document.getElementById('global-voice-toggle'),
  voiceButtons: Array.from(
    document.querySelectorAll('#global-voice-toggle button[data-voice]')
  ),
  quizPronunciation: document.getElementById('quiz-pronunciation'),
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
    updateAdminLink();
    recordUserPresence();
    bindEvents();
    await subscribeToLists();
  } catch (error) {
    if (error?.message === 'AUTH_REQUIRED') {
      return;
    }
    showToast(parseFirebaseError(error), 'error');
  }
}

function updateAdminLink() {
  if (!refs.adminLink) return;
  refs.adminLink.classList.toggle('hidden', !isAdminUser(state.user));
}

async function recordUserPresence() {
  if (!state.user) return;
  try {
    await setDoc(
      doc(db, 'users', state.user.uid),
      { lastSeenAt: serverTimestamp() },
      { merge: true }
    );
  } catch (error) {
    console.warn('Unable to update last seen timestamp', error);
  }
}

function recordPracticeStart() {
  if (!state.user || !state.selectedListId) return;
  const payload = {
    lastPracticeAt: serverTimestamp(),
    lastPracticeMode: state.quiz.mode,
    lastPracticeListId: state.selectedListId,
    lastPracticeListName: state.selectedListName || '',
    lastPracticeTotal: state.quiz.total,
    practiceSessions: increment(1),
  };
  setDoc(doc(db, 'users', state.user.uid), payload, { merge: true }).catch((error) => {
    console.warn('Unable to update practice start stats', error);
  });
}

function recordPracticeCompletion() {
  if (!state.user) return;
  const payload = {
    lastPracticeCompletedAt: serverTimestamp(),
    lastPracticeScore: state.quiz.score,
    lastPracticeTotal: state.quiz.total,
  };
  setDoc(doc(db, 'users', state.user.uid), payload, { merge: true }).catch((error) => {
    console.warn('Unable to update practice completion stats', error);
  });
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
  refs.bulkBtn?.addEventListener('click', handleAddWord);
  refs.bulkHelpBtn?.addEventListener('click', showBulkHelp);
  refs.singleInputToggle?.addEventListener('click', handleSingleInputToggle);
  [
    refs.singleWordInput, refs.singleTypeInput, refs.singleMeaningInput,
    refs.singleTagsInput,
  ].forEach((input) => input?.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleAddWord(); }));
  refs.signOutBtn?.addEventListener('click', handleSignOut);
  refs.startPracticeBtn?.addEventListener('click', handleStartPractice);
  refs.practiceModeSelect?.addEventListener('change', handlePracticeModeChange);
  refs.typeCheckToggle?.addEventListener('click', handleTypeCheckToggle);
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
      updateQuizAudioStatus('Bấm để nghe lại');
    } else {
      state.quiz.useSpeechFallback = false;
  state.quiz.usedTypeHint = false;
      state.quiz.audioError = true;
      updateQuizAudioStatus('Không phát được audio');
    }
    updateQuizAudioControls();
  });

  if (Array.isArray(refs.voiceButtons)) {
    refs.voiceButtons.forEach((button) => {
      if (!button) return;
      button.addEventListener('click', (event) => {
        const target = event.currentTarget;
        const voice = target?.dataset?.voice;
        if (!voice) return;
        handleAudioVoiceChange(voice);
      });
    });
  }

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
  updateTypeCheckToggle();
  updateVoiceToggle();
  updateSingleInputToggle();
  updateAddFormVisibility();
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
  [
    refs.singleWordInput, refs.singleTypeInput, refs.singleMeaningInput, refs.singleTagsInput,
  ].forEach((input) => { if (input) input.value = ''; });
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
    refs.singleWordInput,
    refs.singleTypeInput,
    refs.singleMeaningInput,
    refs.singleTagsInput,
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
  const value = refs.practiceModeSelect.value;
  const allowedModes = new Set(['meaning', 'audio', 'word']);
  state.practiceMode = allowedModes.has(value) ? value : 'meaning';
}

function handleTypeCheckToggle() {
  state.typeCheckEnabled = !state.typeCheckEnabled;
  state.quiz.typeCheckEnabled = state.typeCheckEnabled;
  if (!state.typeCheckEnabled) {
    state.quiz.usedTypeHint = false;
    if (refs.quizTypeHint) {
      refs.quizTypeHint.textContent = '';
    }
    if (refs.quizTypeInput) {
      refs.quizTypeInput.classList.remove('error');
    }
  }
  updateTypeCheckToggle();
  updateQuizModeUI();
}

function updateTypeCheckToggle() {
  const button = refs.typeCheckToggle;
  if (!button) return;
  const enabled = Boolean(state.typeCheckEnabled);
  button.setAttribute('aria-pressed', enabled ? 'true' : 'false');
  button.setAttribute('aria-label', `Kiểm tra loại từ: ${enabled ? 'Bật' : 'Tắt'}`);
}

function updateSingleInputToggle() {
  const button = refs.singleInputToggle;
  if (!button) return;
  const enabled = Boolean(state.singleEntryMode);
  button.setAttribute('aria-pressed', enabled ? 'true' : 'false');
  button.setAttribute('aria-label', `Nhập từ đơn: ${enabled ? 'Bật' : 'Tắt'}`);
}

function handleSingleInputToggle() {
  state.singleEntryMode = !state.singleEntryMode;
  updateSingleInputToggle();
  updateAddFormVisibility();
}

function updateAddFormVisibility() {
  const single = state.singleEntryMode;
  refs.singleEntryForm?.classList.toggle('hidden', !single);
  refs.bulkTextarea?.classList.toggle('hidden', single);
  refs.bulkHelpBtn?.classList.toggle('hidden', single);
  if (refs.bulkFeedback) refs.bulkFeedback.textContent = '';
}

function handleAddWord() {
  if (state.singleEntryMode) {
    handleSingleAdd();
  } else {
    handleBulkAdd();
  }
}

async function handleSingleAdd() {
  if (!state.selectedListId) {
    showToast('Hãy chọn một danh sách trước.', 'info');
    return;
  }
  const word = refs.singleWordInput?.value.trim() ?? '';
  const type = refs.singleTypeInput?.value.trim() ?? '';
  const meaning = refs.singleMeaningInput?.value.trim() ?? '';
  if (!word || !type || !meaning) {
    showToast('Từ, loại từ và nghĩa là bắt buộc.', 'info');
    return;
  }
  const tags = (refs.singleTagsInput?.value.trim() ?? '')
    .split(',').map((t) => t.trim()).filter(Boolean);
  const pronunciation = await Promise.resolve(getPronunciation(word));
  const entry = {
    word,
    wordLower: word.toLowerCase(),
    type,
    meaning,
    tags,
    pronunciation: pronunciation || null,
    dueAt: null,
  };
  refs.bulkBtn.disabled = true;
  refs.bulkBtn.textContent = 'Đang xử lý...';
  try {
    await upsertBulkVocabs(db, state.user.uid, state.selectedListId, [entry]);
    [
      refs.singleWordInput, refs.singleTypeInput, refs.singleMeaningInput, refs.singleTagsInput,
    ].forEach((input) => { if (input) input.value = ''; });
    refs.singleWordInput?.focus();
    await refreshDataAfterMutation();
  } catch (error) {
    showToast(parseFirebaseError(error, 'Thêm từ thất bại'), 'error');
  } finally {
    refs.bulkBtn.disabled = false;
    refs.bulkBtn.textContent = 'Thêm';
  }
}

function handleAudioVoiceChange(voiceId) {
  const profile = getVoiceProfile(voiceId);
  if (!profile) return;
  const currentVoice = getCurrentVoiceId();
  if (profile.id === currentVoice) return;
  state.audioVoice = profile.id;
  state.quiz.voice = profile.id;
  updateVoiceToggle();
  if (state.quiz.mode === 'audio') {
    state.quiz.audioLoading = true;
    state.quiz.audioError = false;
    state.quiz.useSpeechFallback = false;
    updateQuizAudioControls();
    releaseCurrentAudioUrl();
    state.quiz.audioUrl = '';
    state.quiz.audioObjectUrl = '';
    state.quiz.audioPlayCount = 0;
    if (state.quiz.current?.word) {
      loadAudioForCurrentWord(state.quiz.current.word);
    } else {
      state.quiz.audioLoading = false;
      updateQuizAudioControls();
    }
  }
}

function updateVoiceToggle() {
  if (!refs.voiceToggle || !Array.isArray(refs.voiceButtons)) return;
  const currentVoice = getCurrentVoiceId();
  const voiceLabels = {
    english: 'Tiếng Anh',
    chinese: 'Tiếng Trung',
  };
  refs.voiceToggle.setAttribute(
    'aria-label',
    `Giọng đọc: ${voiceLabels[currentVoice] || currentVoice}`
  );
  refs.voiceButtons.forEach((button) => {
    if (!button) return;
    const voice = button.dataset.voice;
    const isActive = voice === currentVoice;
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    button.classList.toggle('active', isActive);
  });
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
    empty.innerHTML = `<td colspan="6" class="empty-state">Chưa có dữ liệu. Thêm từ mới để bắt đầu!</td>`;
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
      <td>${item.pronunciation ?? '--'}</td>
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
    showToast(parseFirebaseError(error, 'Không thấy danh sách nào'), 'error');
  }
}

async function handleStartPractice() {
  if (!state.selectedListId) {
    showToast('Hãy chọn một danh sách trước.', 'info');
    return;
  }
  try {
    if (state.practiceMode === 'audio') {
      await startListeningPractice();
      return;
    }
    const items = await fetchAllVocabs();
    if (!items.length) {
      showToast('Danh sách chưa có từ nào để luyện tập.', 'info');
      updatePracticeAvailability();
      return;
    }
    resetQuizState();
    enterQuizMode(items, state.practiceMode);
  } catch (error) {
    showToast(parseFirebaseError(error, 'Không thể bắt đầu luyện tập'), 'error');
  } finally {
    updatePracticeAvailability();
  }
}

async function startListeningPractice() {
  let overlayVisible = false;
  const cancelButton = refs.audioPrefetchCancelBtn ?? null;
  const previousCancelDisabled = cancelButton ? cancelButton.disabled : null;
  try {
    showAudioPrefetchOverlay(0, 0);
    overlayVisible = true;
    if (cancelButton) {
      cancelButton.disabled = true;
    }
    if (refs.audioPrefetchStatus) {
      refs.audioPrefetchStatus.textContent = 'Đang chuẩn bị bộ từ đầu tiên...';
    }
    if (refs.audioPrefetchProgressBar) {
      refs.audioPrefetchProgressBar.style.width = '0%';
    }
    const allItems = await fetchAllVocabs();
    if (!allItems.length) {
      showToast('Danh sách chưa có từ nào để luyện tập.', 'info');
      updatePracticeAvailability();
      return;
    }
    const shuffledItems = shuffleArray(allItems);
    resetQuizState();
    state.quiz.stream.enabled = true;
    state.quiz.stream.chunkSize = LISTENING_MODE_DEFAULT_CHUNK_SIZE;
    state.quiz.stream.prefetchRatio = LISTENING_MODE_PREFETCH_RATIO;
    state.quiz.stream.sourceItems = shuffledItems;
    state.quiz.stream.cursorIndex = 0;
    state.quiz.stream.exhausted = shuffledItems.length === 0;
    const chunk = await loadNextListeningChunk({ resetCursor: true });
    if (!chunk.items.length) {
      state.quiz.stream.enabled = false;
      showToast('Danh sách chưa có từ nào để luyện tập.', 'info');
      updatePracticeAvailability();
      return;
    }
    enterQuizMode(chunk.items, 'audio', {
      streamChunk: chunk,
      totalFromStream: shuffledItems.length,
    });
  } catch (error) {
    state.quiz.stream.enabled = false;
    showToast(parseFirebaseError(error, 'Không thể khởi động chế độ nghe'), 'error');
  } finally {
    if (cancelButton && previousCancelDisabled !== null) {
      cancelButton.disabled = previousCancelDisabled;
    }
    if (overlayVisible) {
      hideAudioPrefetchOverlay();
    }
  }
}

async function loadNextListeningChunk(options = {}) {
  const { resetCursor = false } = options || {};
  const stream = state.quiz.stream;
  if (!stream.enabled) {
    return { id: null, items: [], exhausted: true };
  }
  if (resetCursor) {
    stream.cursorIndex = 0;
    stream.exhausted = false;
    stream.chunkOrder = [];
    stream.chunkMeta = new Map();
    stream.activeChunkId = null;
    stream.chunkCounter = 0;
    stream.completedCount = 0;
  }
  if (stream.exhausted && !resetCursor) {
    return { id: null, items: [], exhausted: true };
  }
  if (stream.fetching && stream.nextChunkPromise && !resetCursor) {
    return stream.nextChunkPromise;
  }
  const promise = (async () => {
    stream.fetching = true;
    try {
      const source = Array.isArray(stream.sourceItems) ? stream.sourceItems : [];
      if (stream.cursorIndex >= source.length) {
        stream.exhausted = true;
        return {
          id: null,
          items: [],
          exhausted: true,
        };
      }
      const size = Math.max(1, stream.chunkSize || LISTENING_MODE_DEFAULT_CHUNK_SIZE);
      const slice = source.slice(stream.cursorIndex, stream.cursorIndex + size);
      stream.cursorIndex += slice.length;
      if (stream.cursorIndex >= source.length) {
        stream.exhausted = true;
      }
      stream.chunkCounter += 1;
      const chunkId = `chunk-${stream.chunkCounter}`;
      const annotated = slice.map((item) => ({
        ...item,
        __chunkId: chunkId,
      }));
      return {
        id: chunkId,
        items: annotated,
        exhausted: stream.exhausted,
      };
    } finally {
      stream.fetching = false;
      stream.nextChunkPromise = null;
    }
  })();
  stream.nextChunkPromise = promise;
  return promise;
}

function integrateListeningChunk(chunk, options = {}) {
  if (!chunk || !Array.isArray(chunk.items) || !chunk.items.length) return;
  const stream = state.quiz.stream;
  const replaceQueue = Boolean(options.replaceQueue);
  if (!stream.chunkMeta) {
    stream.chunkMeta = new Map();
  }
  if (!stream.chunkMeta.has(chunk.id)) {
    stream.chunkMeta.set(chunk.id, {
      total: chunk.items.length,
      completed: 0,
      prefetchTriggered: false,
      audioPrefetchPromise: null,
      audioReady: false,
    });
    stream.chunkOrder.push(chunk.id);
  }
  if (!stream.activeChunkId) {
    stream.activeChunkId = chunk.id;
  }
  if (replaceQueue) {
    state.quiz.items = [...chunk.items];
    state.quiz.unseen = [...chunk.items];
  } else {
    state.quiz.items = [...state.quiz.items, ...chunk.items];
    state.quiz.unseen.push(...chunk.items);
  }
}

function startChunkAudioPrefetch(chunk) {
  if (!chunk || !Array.isArray(chunk.items) || !chunk.items.length) return null;
  const stream = state.quiz.stream;
  if (!stream.enabled) return null;
  const meta = stream.chunkMeta?.get(chunk.id);
  if (!meta) return null;
  if (meta.audioReady) return null;
  if (meta.audioPrefetchPromise) {
    return meta.audioPrefetchPromise;
  }
  const words = chunk.items
    .map((item) => (item?.word || '').trim())
    .filter(Boolean);
  if (!words.length) return null;
  const promise = prefetchAudioForWords(words, {
    allowDictionary: state.quiz.voice === 'english',
    allowPuter: true,
    voiceId: state.quiz.voice,
    concurrency: Math.min(AUDIO_PREFETCH_CONCURRENCY, words.length),
    shouldContinue: () =>
      state.quiz.active && state.quiz.mode === 'audio' && state.quiz.stream.enabled,
  }).catch((error) => {
    console.warn('Audio prefetch failed for chunk', chunk.id, error);
  }).finally(() => {
    if (!state.quiz.stream.enabled) return;
    const latestMeta = state.quiz.stream.chunkMeta?.get(chunk.id);
    if (!latestMeta) return;
    if (latestMeta.audioPrefetchPromise === promise) {
      latestMeta.audioPrefetchPromise = null;
    }
    if (!latestMeta.audioReady) {
      latestMeta.audioReady = true;
    }
    if (state.quiz.audioPrefetchPromise === promise) {
      state.quiz.audioPrefetchPromise = null;
    }
  });
  meta.audioPrefetchPromise = promise;
  return promise;
}

function handleStreamingItemCompletion(item, options = {}) {
  if (!item || !state.quiz.stream.enabled) return;
  if (item.__chunkCompleted) return;
  const stream = state.quiz.stream;
  const revisit = Boolean(options.revisit);
  if (revisit) return;
  const chunkId = item.__chunkId;
  if (!chunkId) return;
  const meta = stream.chunkMeta?.get(chunkId);
  if (!meta) return;
  item.__chunkCompleted = true;
  meta.completed += 1;
  stream.completedCount += 1;
  if (stream.activeChunkId === chunkId) {
    maybeTriggerNextListeningChunk(chunkId, meta);
  }
  if (meta.completed >= meta.total) {
    advanceActiveListeningChunk(chunkId);
  }
}

function maybeTriggerNextListeningChunk(chunkId, meta) {
  const stream = state.quiz.stream;
  if (!stream.enabled || stream.exhausted) return;
  if (!meta || meta.prefetchTriggered) return;
  if (stream.nextChunkPromise) return;
  const ratio = meta.total > 0 ? meta.completed / meta.total : 1;
  if (ratio < stream.prefetchRatio) return;
  meta.prefetchTriggered = true;
  triggerListeningChunkFetch();
}

function triggerListeningChunkFetch() {
  const stream = state.quiz.stream;
  if (!stream.enabled || stream.exhausted) return null;
  const alreadyPending = Boolean(stream.nextChunkPromise);
  const pending = loadNextListeningChunk();
  if (alreadyPending) {
    return pending;
  }
  pending
    .then((chunk) => {
      if (!state.quiz.active || !stream.enabled) return;
      if (!chunk || !Array.isArray(chunk.items) || !chunk.items.length) {
        if (chunk && chunk.exhausted) {
          stream.exhausted = true;
        }
        return;
      }
      integrateListeningChunk(chunk, { replaceQueue: false });
      startChunkAudioPrefetch(chunk);
      const totalPlanned = Array.isArray(stream.sourceItems)
        ? stream.sourceItems.length
        : state.quiz.total;
      state.quiz.total = totalPlanned || state.quiz.total;
      updateQuizProgress();
      if (!state.quiz.current && state.quiz.active) {
        setTimeout(() => prepareNextQuizQuestion(), 0);
      }
    })
    .catch((error) => {
      if (!state.quiz.active || !stream.enabled) return;
      console.warn('Failed to fetch next listening chunk', error);
      if (stream.activeChunkId && stream.chunkMeta?.has(stream.activeChunkId)) {
        const activeMeta = stream.chunkMeta.get(stream.activeChunkId);
        if (activeMeta && !stream.exhausted) {
          activeMeta.prefetchTriggered = false;
        }
      }
    });
  return pending;
}

function advanceActiveListeningChunk(completedChunkId) {
  const stream = state.quiz.stream;
  const index = stream.chunkOrder.indexOf(completedChunkId);
  if (index !== -1) {
    stream.chunkOrder.splice(index, 1);
  }
  if (stream.chunkMeta?.has(completedChunkId)) {
    stream.chunkMeta.delete(completedChunkId);
  }
  stream.activeChunkId = stream.chunkOrder.length ? stream.chunkOrder[0] : null;
}

function enterQuizMode(items, mode = 'meaning', options = {}) {
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
  const providedItems = Array.isArray(items) ? items : [];
  const stream = state.quiz.stream;
  const streamingActive = mode === 'audio' && stream?.enabled;
  state.quiz.active = true;
  state.quiz.mode = mode === 'audio' ? 'audio' : mode === 'word' ? 'word' : 'meaning';
  state.quiz.voice = getCurrentVoiceId();
  state.quiz.typeCheckEnabled = Boolean(state.typeCheckEnabled);
  if (streamingActive && options.streamChunk) {
    integrateListeningChunk(options.streamChunk, { replaceQueue: true });
    const totalPlanned =
      Array.isArray(stream.sourceItems) && stream.sourceItems.length
        ? stream.sourceItems.length
        : typeof options.totalFromStream === 'number' && options.totalFromStream > 0
        ? options.totalFromStream
        : state.quiz.items.length;
    state.quiz.total = totalPlanned;
    state.quiz.audioPrefetchPromise = startChunkAudioPrefetch(options.streamChunk) || null;
  } else {
    state.quiz.items = providedItems;
    state.quiz.unseen = shuffleArray([...providedItems]);
    state.quiz.total = providedItems.length;
  }
  if (state.quiz.mode === 'audio' && !streamingActive) {
    const wordsToPrefetch = items.map((item) => item?.word || '');
    state.quiz.audioPrefetchPromise = prefetchAudioForWords(wordsToPrefetch, {
      allowDictionary: state.quiz.voice === 'english',
      allowPuter: true,
      voiceId: state.quiz.voice,
      concurrency: Math.min(2, Math.max(1, wordsToPrefetch.length)),
      shouldContinue: () => state.quiz.active && state.quiz.mode === 'audio',
    })
      .catch((error) => {
        console.warn('Audio prefetch failed', error);
      })
      .finally(() => {
        state.quiz.audioPrefetchPromise = null;
      });
  } else if (!streamingActive) {
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
  recordPracticeStart();
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
  state.quiz.stream.enabled = false;
  state.quiz.stream.chunkSize = LISTENING_MODE_DEFAULT_CHUNK_SIZE;
  state.quiz.stream.prefetchRatio = LISTENING_MODE_PREFETCH_RATIO;
  state.quiz.stream.sourceItems = [];
  state.quiz.stream.cursorIndex = 0;
  state.quiz.stream.exhausted = false;
  state.quiz.stream.fetching = false;
  state.quiz.stream.nextChunkPromise = null;
  state.quiz.stream.chunkCounter = 0;
  state.quiz.stream.activeChunkId = null;
  state.quiz.stream.chunkOrder = [];
  state.quiz.stream.chunkMeta = new Map();
  state.quiz.stream.completedCount = 0;
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
    voice: getCurrentVoiceId(),
    audioUrl: '',
    audioLoading: false,
    audioError: false,
    audioObjectUrl: '',
    useSpeechFallback: false,
    audioPrefetchPromise: null,
    audioPlayCount: 0,
    usedTypeHint: false,
    typeCheckEnabled: Boolean(state.typeCheckEnabled),
  });
}

function updateQuizProgress() {
  if (!refs.quizProgress) return;
  let remaining = state.quiz.unseen.length + state.quiz.wrongQueue.length;
  if (state.quiz.stream.enabled) {
    const totalPlanned = state.quiz.total || 0;
    const outstanding = totalPlanned
      ? Math.max(totalPlanned - state.quiz.stream.completedCount, 0)
      : remaining;
    remaining = Math.max(remaining, outstanding);
  }
  refs.quizProgress.textContent = `Đúng: ${state.quiz.score}/${state.quiz.total} - Còn lại: ${remaining}`;
}

function prepareNextQuizQuestion() {
  if (!state.quiz.active) return;
  if (!refs.quizMeaning || !refs.quizWordInput || !refs.quizTypeInput) return;
  const streamingActive = state.quiz.mode === 'audio' && state.quiz.stream?.enabled;
  const stream = state.quiz.stream;
  state.quiz.voice = getCurrentVoiceId();
  state.quiz.typeCheckEnabled = Boolean(state.typeCheckEnabled);
  releaseCurrentAudioUrl();
  const noPendingQuestions = state.quiz.unseen.length === 0 && state.quiz.wrongQueue.length === 0;
  const waitingForChunk =
    streamingActive &&
    (!stream.exhausted || Boolean(stream.nextChunkPromise) || stream.fetching);
  if (noPendingQuestions && waitingForChunk) {
    triggerListeningChunkFetch();
    state.quiz.current = null;
    state.quiz.audioUrl = '';
    state.quiz.audioObjectUrl = '';
    state.quiz.audioPlayCount = 0;
    state.quiz.audioLoading = true;
    state.quiz.audioError = false;
    state.quiz.useSpeechFallback = false;
    state.quiz.usedTypeHint = false;
    if (refs.quizWordInput) {
      refs.quizWordInput.value = '';
      refs.quizWordInput.disabled = true;
      refs.quizWordInput.classList.remove('error');
    }
    if (refs.quizTypeInput) {
      refs.quizTypeInput.value = '';
      refs.quizTypeInput.disabled = true;
      refs.quizTypeInput.classList.remove('error');
    }
    if (refs.quizFeedback) {
      refs.quizFeedback.textContent = '';
      refs.quizFeedback.style.color = 'var(--muted)';
    }
    if (refs.quizLetterHint) refs.quizLetterHint.textContent = '';
    if (refs.quizTypeHint) refs.quizTypeHint.textContent = '';
    if (refs.quizPronunciation) refs.quizPronunciation.textContent = '';
    updateQuizAudioStatus('Đang tải bộ từ tiếp theo...');
    updateQuizAudioControls();
    updateQuizProgress();
    return;
  }
  if (noPendingQuestions) {
    endQuizSession();
    return;
  }
  if (state.quiz.unseen.length > 0) {
    if (streamingActive) {
      state.quiz.current = state.quiz.unseen.shift();
    } else {
      const randomIndex = Math.floor(Math.random() * state.quiz.unseen.length);
      state.quiz.current = state.quiz.unseen.splice(randomIndex, 1)[0];
    }
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
  state.quiz.usedTypeHint = false;
  refs.quizLetterHint.textContent = '';
  refs.quizTypeHint.textContent = '';
  refs.quizFeedback.textContent = '';
  refs.quizFeedback.style.color = 'var(--muted)';
  if (refs.quizPronunciation) refs.quizPronunciation.textContent = state.quiz.current?.pronunciation ?? '';
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
  const current = state.quiz.current;
  const meaning = current?.meaning || 'Chưa có nghĩa';
  const word = current?.word || 'Chưa có từ';
  if (!current) {
    refs.quizMeaning.textContent = '';
    refs.quizMeaningHintBtn.classList.add('hidden');
    refs.quizMeaningHintBtn.disabled = true;
    return;
  }
  if (state.quiz.mode === 'meaning') {
    refs.quizMeaning.textContent = meaning;
    refs.quizMeaningHintBtn.classList.add('hidden');
    refs.quizMeaningHintBtn.disabled = true;
  } else if (state.quiz.mode === 'word') {
    refs.quizMeaning.textContent = word;
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
  const mode = state.quiz.mode;
  const isAudioMode = mode === 'audio';
  const typeCheckActive = !isAudioMode && state.quiz.typeCheckEnabled;

  const typeLabel = refs.quizTypeInput?.closest('label');
  if (typeLabel) {
    typeLabel.classList.toggle('hidden', !typeCheckActive);
  }
  if (refs.quizTypeInput) {
    refs.quizTypeInput.disabled = !typeCheckActive;
    if (!typeCheckActive) {
      refs.quizTypeInput.value = '';
      refs.quizTypeInput.classList.remove('error');
    }
  }
  if (refs.quizTypeHintBtn) {
    refs.quizTypeHintBtn.classList.toggle('hidden', !typeCheckActive);
    refs.quizTypeHintBtn.disabled = !typeCheckActive;
    const hintWrapper = refs.quizTypeHintBtn.parentElement;
    if (hintWrapper) {
      hintWrapper.classList.toggle('hidden', !typeCheckActive);
    }
  }
  if (refs.quizTypeHint) {
    refs.quizTypeHint.classList.toggle('hidden', !typeCheckActive);
    if (!typeCheckActive) {
      refs.quizTypeHint.textContent = '';
    }
  }

  if (refs.quizWordLabel) {
    refs.quizWordLabel.textContent = mode === 'word' ? 'Nghĩa tiếng Việt' : 'Từ tiếng Anh';
  }
  if (refs.quizWordInput) {
    refs.quizWordInput.placeholder = mode === 'word' ? 'Nhập nghĩa ở đây' : 'Nhập từ ở đây';
  }
  if (refs.quizTypeLabel) {
    refs.quizTypeLabel.textContent = 'Loại từ';
  }
  if (refs.quizMeaningLabel) {
    refs.quizMeaningLabel.textContent = mode === 'word' ? 'Từ tiếng Anh' : 'Nghĩa tiếng Việt';
  }
  if (refs.quizSubtitle) {
    let subtitle = 'Nhập đúng từ tiếng Anh và loại từ tương ứng.';
    if (mode === 'word') {
      subtitle = 'Nhập đúng nghĩa tiếng Việt và loại từ tương ứng.';
    } else if (mode === 'audio') {
      subtitle = 'Nghe và nhập đúng từ tiếng Anh cùng loại từ.';
    }
    refs.quizSubtitle.textContent = subtitle;
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
function getAudioCacheEntry(key) {
  if (!key) return null;
  if (!state.audioCache.has(key)) return null;
  const entry = state.audioCache.get(key);
  state.audioCache.delete(key);
  state.audioCache.set(key, entry);
  return entry;
}

function peekAudioCacheEntry(key) {
  if (!key) return null;
  return state.audioCache.get(key) || null;
}

function setAudioCacheEntry(key, entry) {
  if (!key) return entry;
  if (state.audioCache.has(key)) {
    state.audioCache.delete(key);
  }
  state.audioCache.set(key, entry);
  enforceAudioCacheLimit();
  return entry;
}

function deleteAudioCacheEntry(key) {
  if (!key) return;
  state.audioCache.delete(key);
}

function enforceAudioCacheLimit() {
  if (!AUDIO_CACHE_LIMIT || AUDIO_CACHE_LIMIT <= 0) return;
  while (state.audioCache.size > AUDIO_CACHE_LIMIT) {
    const oldestKey = state.audioCache.keys().next().value;
    if (!oldestKey) break;
    state.audioCache.delete(oldestKey);
  }
}

function withTimeout(promise, timeoutMs, label = 'TIMEOUT') {
  if (!promise || typeof promise.then !== 'function') {
    return Promise.resolve(promise);
  }
  if (!timeoutMs || timeoutMs <= 0) {
    return promise;
  }
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const timeoutError = new Error(label || 'TIMEOUT');
      timeoutError.code = 'TIMEOUT';
      reject(timeoutError);
    }, timeoutMs);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

let puterAiClient = null;
let puterAiClientPromise = null;
const quizAudioBoost = {
  context: null,
  sourceNode: null,
  gainNode: null,
};

async function resolvePuterAi() {
  if (puterAiClient) return puterAiClient;
  if (typeof window === 'undefined') return null;
  if (!puterAiClientPromise) {
    puterAiClientPromise = (async () => {
      const deadline = Date.now() + Math.max(PUTER_TTS_TIMEOUT_MS, 5000);
      const pollInterval = 200;
      while (Date.now() < deadline) {
        const sdk = window.puter || window.Puter || null;
        const ai = sdk?.ai || null;
        if (ai) {
          try {
            if (typeof sdk.ready === 'function') {
              await sdk.ready();
            } else if (sdk.ready && typeof sdk.ready.then === 'function') {
              await sdk.ready;
            }
          } catch (error) {
            console.warn('Puter SDK ready() failed', error);
          }
          return ai;
        }
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
      }
      return null;
    })().catch((error) => {
      console.warn('Unable to resolve Puter SDK', error);
      return null;
    }).finally(() => {
      if (!puterAiClient) {
        puterAiClientPromise = null;
      }
    });
  }
  puterAiClient = await puterAiClientPromise;
  if (!puterAiClient) {
    puterAiClientPromise = null;
  }
  return puterAiClient;
}

function ensureQuizAudioBoost() {
  if (!refs.quizAudioPlayer) return null;
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!quizAudioBoost.context) {
    try {
      quizAudioBoost.context = new AudioCtx();
    } catch (error) {
      console.warn('Unable to create AudioContext for quiz audio', error);
      return null;
    }
  }
  if (!quizAudioBoost.sourceNode) {
    try {
      quizAudioBoost.sourceNode = quizAudioBoost.context.createMediaElementSource(
        refs.quizAudioPlayer
      );
    } catch (error) {
      if (error?.name === 'InvalidStateError' || /already been used/i.test(error?.message || '')) {
        return quizAudioBoost.context;
      }
      console.warn('Unable to attach quiz audio player to AudioContext', error);
      return quizAudioBoost.context;
    }
  }
  if (!quizAudioBoost.gainNode) {
    quizAudioBoost.gainNode = quizAudioBoost.context.createGain();
    quizAudioBoost.gainNode.gain.value = QUIZ_AUDIO_GAIN;
    quizAudioBoost.sourceNode.connect(quizAudioBoost.gainNode);
    quizAudioBoost.gainNode.connect(quizAudioBoost.context.destination);
  } else {
    quizAudioBoost.gainNode.gain.value = QUIZ_AUDIO_GAIN;
  }
  return quizAudioBoost.context;
}

async function ensureAudioEntry(word, options = {}) {
  const normalized = normalizeWord(word);
  if (!normalized) return null;
  const voiceId =
    options.voiceId && AUDIO_VOICE_PROFILES[options.voiceId]
      ? options.voiceId
      : getCurrentVoiceId();
  const key = getAudioCacheKey(normalized, voiceId);
  if (!key) return null;
  const force = Boolean(options.force);
  const existing = getAudioCacheEntry(key);
  const allowDictionary =
    typeof options.allowDictionary === 'boolean'
      ? options.allowDictionary
      : voiceId === 'english' && existing?.errorCode !== 'NO_DICTIONARY_AUDIO';
  const allowPuter =
    typeof options.allowPuter === 'boolean' ? options.allowPuter : true;
  if (existing && !force) {
    if (existing.status === 'ready') return existing;
    if (existing.status === 'pending') return existing.promise;
  }
  if (existing && (force || existing.status === 'error')) {
    deleteAudioCacheEntry(key);
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
      const asset = await fetchAudioAsset(normalized, {
        allowDictionary,
        allowPuter,
        voiceId,
      });
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
  setAudioCacheEntry(key, entry);
  return promise;
}

async function fetchAudioAsset(word, options = {}) {
  const normalized = normalizeWord(word);
  if (!normalized) return null;
  const voiceId =
    options.voiceId && AUDIO_VOICE_PROFILES[options.voiceId]
      ? options.voiceId
      : getCurrentVoiceId();
  const allowDictionary =
    options.allowDictionary !== false && voiceId === 'english';
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
      const blob = await fetchPuterTts(normalized, voiceId);
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
  const voiceId =
    options.voiceId && AUDIO_VOICE_PROFILES[options.voiceId]
      ? options.voiceId
      : getCurrentVoiceId();
  const force = Boolean(options.force);
  const targets = [];
  const seenKeys = new Set();
  for (const word of words) {
    const normalized = normalizeWord(word);
    if (!normalized) continue;
    const key = getAudioCacheKey(normalized, voiceId);
    if (!key || seenKeys.has(key)) continue;
    seenKeys.add(key);
    const entry = peekAudioCacheEntry(key);
    if (entry && entry.status === 'ready' && !force) continue;
    targets.push(normalized);
  }
  const total =
    typeof options.total === 'number' && options.total > 0
      ? options.total
      : targets.length;
  let completed =
    typeof options.initialCompleted === 'number' && options.initialCompleted >= 0
      ? Math.min(options.initialCompleted, total)
      : 0;
  if (!targets.length) {
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
  const allowDictionary =
    typeof options.allowDictionary === 'boolean'
      ? options.allowDictionary
      : voiceId === 'english';
  const allowPuter = options.allowPuter !== false;
  const maxConcurrency =
    typeof options.concurrency === 'number' && options.concurrency > 0
      ? Math.min(Math.floor(options.concurrency), targets.length)
      : Math.min(AUDIO_PREFETCH_CONCURRENCY, targets.length);
  let cursor = 0;
  const takeNext = () => {
    if (cursor >= targets.length) return null;
    const nextWord = targets[cursor];
    cursor += 1;
    return nextWord;
  };
  const worker = async () => {
    while (shouldContinue()) {
      const nextWord = takeNext();
      if (!nextWord) break;
      try {
        await ensureAudioEntry(nextWord, {
          force,
          allowDictionary,
          allowPuter,
          voiceId,
        });
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
    ? `Đang chuẩn bị audio ${safeCompleted}/${safeTotal} (${percent}%)`
    : 'Đang kiểm tra cache audio...';
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
  showToast('Đã hủy việc tải audio trước khi luyện tập.', 'info');
}

async function loadAudioForCurrentWord(word) {
  const normalizedWord = normalizeWord(word);
  const voiceId = state.quiz.voice || getCurrentVoiceId();
  state.quiz.voice = voiceId;
  const cacheKey = getAudioCacheKey(normalizedWord, voiceId);
  releaseCurrentAudioUrl();
  if (!normalizedWord) {
    state.quiz.audioLoading = false;
    state.quiz.audioUrl = '';
    state.quiz.audioError = false;
    state.quiz.audioObjectUrl = '';
    state.quiz.useSpeechFallback = false;
    state.quiz.usedTypeHint = false;
    updateQuizAudioControls();
    return;
  }
  const canUseSpeech = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const allowDictionary = voiceId === 'english';
  const attemptDictionaryFetch = async () => {
    if (!allowDictionary) return null;
    try {
      const entry = await ensureAudioEntry(normalizedWord, {
        allowDictionary: true,
        allowPuter: false,
        voiceId,
      });
      return entry;
    } catch (error) {
      return getAudioCacheEntry(cacheKey);
    }
  };
  let entry = getAudioCacheEntry(cacheKey);
  try {
    if (!entry) {
      entry = await attemptDictionaryFetch();
    } else if (entry.status === 'pending') {
      try {
        await entry.promise;
      } catch (_) {
        /* ignore */
      }
      entry = getAudioCacheEntry(cacheKey);
    } else if (entry.status === 'error' && entry.errorCode !== 'NO_DICTIONARY_AUDIO') {
      entry = await attemptDictionaryFetch();
    }
  } catch (error) {
    entry = getAudioCacheEntry(cacheKey);
    if (error?.code !== 'NO_DICTIONARY_AUDIO') {
      console.warn('Dictionary audio lookup encountered an error', error);
    }
  }
  const currentKey = getAudioCacheKey(state.quiz.current?.word, voiceId);
  if (cacheKey !== currentKey) {
    return;
  }
  if (entry && entry.status === 'ready' && entry.blob) {
    const audioUrl = URL.createObjectURL(entry.blob);
    state.quiz.useSpeechFallback = false;
    state.quiz.usedTypeHint = false;
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
        const activeKey = getAudioCacheKey(state.quiz.current?.word, voiceId);
        if (activeKey !== cacheKey) return;
        if (result?.status !== 'ready' || !result.blob) return;
        releaseCurrentAudioUrl();
        const audioUrl = URL.createObjectURL(result.blob);
        state.quiz.audioUrl = audioUrl;
        state.quiz.audioObjectUrl = audioUrl;
        state.quiz.audioPlayCount = 0;
        state.quiz.useSpeechFallback = false;
        state.quiz.usedTypeHint = false;
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
        const activeKey = getAudioCacheKey(state.quiz.current?.word, voiceId);
        if (activeKey === cacheKey) {
          state.quiz.audioError = state.quiz.audioUrl ? false : !canUseSpeech;
          updateQuizAudioControls();
        }
      });
  };
  const ongoingEntry = peekAudioCacheEntry(cacheKey);
  if (ongoingEntry?.status === 'pending' && ongoingEntry.promise) {
    attachWhenReady(ongoingEntry.promise);
    return;
  }
  const fetchPromise = ensureAudioEntry(normalizedWord, {
    allowDictionary: false,
    allowPuter: true,
    voiceId,
  });
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
  const voiceProfile = getVoiceProfile(state.quiz.voice);

  if (!hasAudio && canUseFallback) {
    state.quiz.audioError = false;
    const utterance = new SpeechSynthesisUtterance(state.quiz.current.word);
    utterance.lang = voiceProfile.speechLang || voiceProfile.language || 'en-GB';
    utterance.rate = shouldSlow ? 0.5 : 1;
    updateQuizAudioStatus(shouldSlow ? 'Đang phát chậm...' : 'Đang phát...');
    utterance.onend = () => updateQuizAudioStatus('Bấm để nghe lại');
    utterance.onerror = () => {
      updateQuizAudioStatus('Không phát được audio');
      state.quiz.audioError = true;
      state.quiz.useSpeechFallback = false;
  state.quiz.usedTypeHint = false;
      updateQuizAudioControls();
    };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return;
  }

  if (!refs.quizAudioPlayer) return;
  try {
    state.quiz.audioError = false;
    updateQuizAudioStatus(shouldSlow ? 'Đang phát chậm...' : 'Đang phát...');
    const audioContext = ensureQuizAudioBoost();
    if (audioContext?.state === 'suspended') {
      audioContext.resume().catch(() => {});
    }
    refs.quizAudioPlayer.volume = 1;
    refs.quizAudioPlayer.pause();
    refs.quizAudioPlayer.currentTime = 0;
    refs.quizAudioPlayer.playbackRate = shouldSlow ? 0.5 : 1;
    const playPromise = refs.quizAudioPlayer.play();
    if (playPromise?.catch) {
      playPromise.catch(() => {});
    }
  } catch (error) {
    console.warn('Không thể phát audio', error);
    state.quiz.audioError = true;
    updateQuizAudioStatus('Không phát được audio');
    updateQuizAudioControls();
  }
}


function checkQuizAnswer() {
  if (!state.quiz.active || !state.quiz.current) return;
  const userAnswer = refs.quizWordInput.value.trim().toLowerCase();
  const userType = refs.quizTypeInput.value.trim().toLowerCase();
  const correctAnswer =
    state.quiz.mode === 'word'
      ? (state.quiz.current.meaning || '').trim().toLowerCase()
      : (state.quiz.current.word || '').trim().toLowerCase();
  const correctType = (state.quiz.current.type || '').trim().toLowerCase();

  refs.quizWordInput.classList.remove('error');
  refs.quizTypeInput.classList.remove('error');

  const requiresType = state.quiz.mode !== 'audio' && state.quiz.typeCheckEnabled;
  const answerMatches = userAnswer === correctAnswer;
  const typeMatches = !requiresType || userType === correctType;

  if (answerMatches && typeMatches) {
    const meaningPenalty = state.quiz.mode === 'audio' ? state.quiz.usedMeaningHint : false;
    const typeHintPenalty = requiresType ? state.quiz.usedTypeHint : false;
    const usedHints = state.quiz.hintIndex > 0 || meaningPenalty || typeHintPenalty;
    const revisit = state.quiz.attempts > 0 || usedHints;
    if (state.quiz.stream.enabled) {
      handleStreamingItemCompletion(state.quiz.current, { revisit });
    }
    if (state.quiz.attempts === 0 && !usedHints) {
      state.quiz.score += 1;
      refs.quizFeedback.textContent = 'Chính xác!';
      refs.quizFeedback.style.color = '#22c55e';
    } else {
      refs.quizFeedback.textContent = 'Đúng nhưng không cộng điểm vì đã sử dụng gợi ý hoặc sai trước đó.';
      refs.quizFeedback.style.color = '#facc15';
      if (revisit) {
        state.quiz.wrongQueue.push(state.quiz.current);
      }
    }
    playSound(refs.correctSound);
    updateQuizProgress();
    prepareNextQuizQuestion();
  } else {
    if (!answerMatches) {
      refs.quizWordInput.classList.add('error');
    }
    if (!typeMatches && requiresType) {
      refs.quizTypeInput.classList.add('error');
    }
    state.quiz.attempts += 1;
    refs.quizFeedback.textContent = 'Câu trả lời không đúng. Thử lại nhé!';
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
  const answerSource =
    state.quiz.mode === 'word' ? state.quiz.current.meaning || '' : state.quiz.current.word || '';
  const answer = answerSource.trim().toLowerCase();
  if (state.quiz.hintIndex < answer.length) {
    state.quiz.hintIndex += 1;
  }
  refs.quizLetterHint.textContent = answer.slice(0, state.quiz.hintIndex);
}

function showQuizTypeHint() {
  if (!state.quiz.active || !state.quiz.current) return;
  if (state.quiz.mode === 'audio' || !state.quiz.typeCheckEnabled) return;
  state.quiz.usedTypeHint = true;
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
      console.warn('Không thể sử dụng audio', error);
    }
  }
  state.quiz.current = null;
  updateQuizProgress();
  recordPracticeCompletion();
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
      console.warn('Không thể sử dụng audio', error);
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
  if (clone.length <= 1) {
    return clone;
  }
  const cryptoApi = typeof globalThis !== 'undefined' ? globalThis.crypto : null;
  if (cryptoApi?.getRandomValues) {
    const buffer = new Uint32Array(clone.length);
    cryptoApi.getRandomValues(buffer);
    for (let i = clone.length - 1; i > 0; i -= 1) {
      const j = buffer[i] % (i + 1);
      [clone[i], clone[j]] = [clone[j], clone[i]];
    }
    return clone;
  }
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

async function fetchPuterTts(word, voiceId = getCurrentVoiceId()) {
  const text = (word || '').trim();
  if (!text) return null;
  const profile = getVoiceProfile(voiceId);
  const engines = Array.isArray(profile.engines) && profile.engines.length
    ? Array.from(new Set(profile.engines))
    : ['neural'];
  const puterAi = await resolvePuterAi();
  if (!puterAi || typeof puterAi.txt2speech !== 'function') {
    const unavailableError = new Error('PUTER_TTS_UNAVAILABLE');
    unavailableError.code = 'PUTER_TTS_UNAVAILABLE';
    throw unavailableError;
  }

  let fallbackLogged = false;
  let lastError = null;
  for (let index = 0; index < engines.length; index += 1) {
    const engine = engines[index];
    if (index > 0 && !fallbackLogged) {
      console.info(`Falling back to Puter TTS engine "${engine}" for voice "${profile.id}"`);
      fallbackLogged = true;
    }
    try {
      const audio = await withTimeout(
        puterAi.txt2speech(text, {
          language: profile.language,
          voice: profile.voice,
          engine,
        }),
        PUTER_TTS_TIMEOUT_MS,
        `PUTER_TTS_${engine.toUpperCase()}_ATTEMPT_TIMEOUT`
      );
      const blob = await withTimeout(
        convertPuterAudioToBlob(audio),
        PUTER_TTS_TIMEOUT_MS,
        `PUTER_TTS_${engine.toUpperCase()}_BLOB_TIMEOUT`
      );
      if (blob?.size) {
        return blob;
      }
      const emptyError = new Error('PUTER_TTS_EMPTY_AUDIO');
      emptyError.code = 'PUTER_TTS_EMPTY';
      lastError = emptyError;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error || 'PUTER_TTS_FAILED'));
      if (!err.code) {
        err.code = err.message?.includes('TIMEOUT') ? 'PUTER_TTS_TIMEOUT' : 'PUTER_TTS_FAILED';
      }
      lastError = err;
      console.warn(
        `puter.ai txt2speech failed with engine ${engine} for voice "${profile.id}"`,
        err
      );
    }
  }
  if (lastError) {
    throw lastError;
  }
  const fallbackError = new Error('PUTER_TTS_FAILED');
  fallbackError.code = 'PUTER_TTS_FAILED';
  throw fallbackError;
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
      showToast('Không có đồng hợp lệ nào được thêm.', 'info');
      return;
    }
    await upsertBulkVocabs(db, state.user.uid, state.selectedListId, entries);
    refs.bulkTextarea.value = '';
    await refreshDataAfterMutation();
  } catch (error) {
    showToast(parseFirebaseError(error, 'Thêm từ thất bại'), 'error');
  } finally {
    refs.bulkBtn.disabled = false;
    refs.bulkBtn.textContent = 'Thêm';
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
    `Mỗi dòng là 1 object:\n` +
    `{"word":"gather","type":"v","meaning":"tập hợp","tags":["group","verb"]}\n` +
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

const hasChinese = (text) => /\p{Script=Han}/u.test(text);

function getPronunciation(text) {
  if (hasChinese(text)) {
    return pinyin(text, { style: "tone", segment: "@node-rs/jieba" })
      .flat()
      .join(" ");
  }
  return phonemize(text);
}

init();
