import { db } from './firebase-config.js';
import { requireAuth, signOutUser } from './auth.js';
import {
  collection,
  onSnapshot,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { showToast, formatTimestamp, parseFirebaseError } from './utils.js';
import { isAdminUser } from './admin-config.js';

const refs = {
  userEmail: document.getElementById('user-email'),
  signOutBtn: document.getElementById('sign-out-btn'),
  tableBody: document.getElementById('admin-users-tbody'),
  message: document.getElementById('admin-message'),
  updatedAt: document.getElementById('admin-updated'),
};

const state = {
  user: null,
  unsubscribe: null,
};

async function init() {
  try {
    state.user = await requireAuth();
    if (refs.userEmail) {
      refs.userEmail.textContent = state.user.email ? `Admin: ${state.user.email}` : 'Admin';
    }
    bindEvents();
    if (!isAdminUser(state.user)) {
      renderAccessDenied();
      return;
    }
    subscribeToUsers();
  } catch (error) {
    if (error?.message === 'AUTH_REQUIRED') {
      return;
    }
    showToast(parseFirebaseError(error), 'error');
  }
}

function bindEvents() {
  refs.signOutBtn?.addEventListener('click', handleSignOut);
}

async function handleSignOut(event) {
  event?.preventDefault?.();
  try {
    await signOutUser();
  } catch (error) {
    showToast(parseFirebaseError(error, 'Unable to sign out'), 'error');
  }
}

function renderAccessDenied() {
  if (refs.message) {
    refs.message.textContent = 'This account is not authorized to view admin activity.';
    refs.message.classList.remove('hidden');
  }
  if (refs.tableBody) {
    refs.tableBody.innerHTML =
      '<tr><td colspan="8" class="empty-state">Access denied.</td></tr>';
  }
}

function subscribeToUsers() {
  const usersRef = collection(db, 'users');
  state.unsubscribe = onSnapshot(
    usersRef,
    (snapshot) => {
      const users = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
      renderUsers(users);
      if (refs.updatedAt) {
        refs.updatedAt.textContent = `Updated ${new Date().toLocaleString()}`;
      }
    },
    (error) => {
      showToast(parseFirebaseError(error, 'Unable to load users'), 'error');
    }
  );
}

function renderUsers(users) {
  if (!refs.tableBody) return;
  refs.tableBody.innerHTML = '';
  if (!users.length) {
    refs.tableBody.innerHTML = '<tr><td colspan="8" class="empty-state">No users found.</td></tr>';
    return;
  }
  const sorted = [...users].sort((a, b) => getSortValue(b) - getSortValue(a));
  sorted.forEach((entry) => {
    const tr = document.createElement('tr');
    const email = entry.email || entry.id || '--';
    const lastSeen = formatTimestamp(entry.lastSeenAt);
    const lastPractice = formatTimestamp(entry.lastPracticeAt);
    const sessions =
      typeof entry.practiceSessions === 'number' && Number.isFinite(entry.practiceSessions)
        ? entry.practiceSessions
        : 0;
    const score = Number(entry.lastPracticeScore);
    const total = Number(entry.lastPracticeTotal);
    const hasScore = Number.isFinite(score) && Number.isFinite(total) && total > 0;
    const scoreLabel = hasScore ? `${score}/${total}` : '--';
    const mode = formatMode(entry.lastPracticeMode);
    const listName = entry.lastPracticeListName || '--';
    const hasPractice = Boolean(entry.lastPracticeAt);

    tr.append(createCell(email, 'admin-col-email'));

    const statusCell = document.createElement('td');
    statusCell.className = 'admin-col-status';
    const pill = document.createElement('span');
    pill.className = `status-pill ${hasPractice ? 'active' : 'inactive'}`;
    pill.textContent = hasPractice ? 'Practiced' : 'Not yet';
    statusCell.append(pill);
    tr.append(statusCell);

    tr.append(createCell(lastSeen, 'admin-col-seen'));
    tr.append(createCell(lastPractice, 'admin-col-practice'));
    tr.append(createCell(String(sessions), 'admin-col-sessions'));
    tr.append(createCell(scoreLabel, 'admin-col-score'));
    tr.append(createCell(mode, 'admin-col-mode'));
    tr.append(createCell(listName, 'admin-col-list'));

    refs.tableBody.append(tr);
  });
}

function createCell(text, className) {
  const td = document.createElement('td');
  if (className) td.className = className;
  td.textContent = text;
  return td;
}

function getSortValue(entry) {
  return Math.max(toMillis(entry.lastPracticeAt), toMillis(entry.lastSeenAt), 0);
}

function toMillis(value) {
  if (!value) return 0;
  if (typeof value.toMillis === 'function') return value.toMillis();
  if (value instanceof Date) return value.getTime();
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatMode(mode) {
  if (mode === 'word') return 'Meaning check';
  if (mode === 'audio') return 'Listening';
  if (mode === 'meaning') return 'Word check';
  return '--';
}

init();
