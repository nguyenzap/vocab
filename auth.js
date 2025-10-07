import { app, db } from './firebase-config.js';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { showToast, parseFirebaseError } from './utils.js';

export const auth = getAuth(app);

const persistenceReady = setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.warn('Không thể thiết lập chế độ ghi nhớ', error);
  showToast('Không thể lưu phiên đăng nhập, sẽ sử dụng tạm thời.', 'error');
});

let currentUser = null;
let firstAuthEvent = false;
const waiters = [];

function resolveWaiters(user) {
  firstAuthEvent = true;
  currentUser = user;
  while (waiters.length) {
    const resolver = waiters.shift();
    resolver(user);
  }
}

function waitForAuthResolution() {
  if (firstAuthEvent) {
    return Promise.resolve(currentUser);
  }
  return new Promise((resolve) => waiters.push(resolve));
}

async function ensureUserProfile(user) {
  if (!user) return;
  const profileRef = doc(db, 'users', user.uid);
  const snap = await getDoc(profileRef);
  if (!snap.exists()) {
    await setDoc(profileRef, { email: user.email, createdAt: serverTimestamp() }, { merge: true });
  }
}

const page = document.body?.dataset.page;

async function initAuthWatcher() {
  await persistenceReady;
  onAuthStateChanged(auth, async (user) => {
    resolveWaiters(user);
    if (user) {
      await ensureUserProfile(user);
    }
    if (page === 'auth' && user) {
      window.location.replace('./app.html');
      return;
    }
    if (page === 'app' && !user) {
      window.location.replace('./index.html');
      return;
    }
    if (page === 'app' && user) {
      const emailEl = document.getElementById('user-email');
      if (emailEl) {
        emailEl.textContent = user.email ?? '';
      }
    }
  });
}

initAuthWatcher();

function initAuthPage() {
  const form = document.getElementById('auth-form');
  if (!form) return;

  const emailInput = document.getElementById('auth-email');
  const passwordInput = document.getElementById('auth-password');
  const confirmField = document.querySelector('[data-auth-mode="signup"]');
  const confirmInput = document.getElementById('auth-confirm');
  const submitBtn = document.getElementById('auth-submit-btn');
  const toggleBtn = document.getElementById('auth-toggle-btn');
  const forgotBtn = document.getElementById('auth-forgot-btn');
  const feedbackEl = document.getElementById('auth-feedback');

  let mode = 'signin';

  const setMode = (nextMode) => {
    mode = nextMode;
    const isSignup = mode === 'signup';
    form.dataset.mode = mode;
    submitBtn.textContent = isSignup ? 'Tạo tài khoản' : 'Đăng nhập';
    toggleBtn.textContent = isSignup ? 'Tôi đã có tài khoản' : 'Tôi chưa có tài khoản';
    forgotBtn.classList.toggle('hidden', isSignup);
    confirmField.classList.toggle('hidden', !isSignup);
    feedbackEl.textContent = '';
  };

  toggleBtn.addEventListener('click', () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  });

  forgotBtn.addEventListener('click', async () => {
    feedbackEl.textContent = '';
    const email = emailInput.value.trim();
    if (!email) {
      feedbackEl.textContent = 'Hãy nhập email trước.';
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      feedbackEl.textContent = 'Vui lòng kiểm tra hộp thư để đặt lại mật khẩu.';
      feedbackEl.style.color = '#38bdf8';
    } catch (error) {
      feedbackEl.textContent = parseFirebaseError(error);
      feedbackEl.style.color = '#f87171';
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    feedbackEl.textContent = '';
    submitBtn.disabled = true;
    submitBtn.textContent = mode === 'signup' ? 'Đang tạo...' : 'Đang đăng nhập...';

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      feedbackEl.textContent = 'Cần nhập email và mật khẩu.';
      submitBtn.disabled = false;
      submitBtn.textContent = mode === 'signup' ? 'Tạo tài khoản' : 'Đăng nhập';
      return;
    }

    if (mode === 'signup') {
      const confirm = confirmInput.value;
      if (confirm !== password) {
        feedbackEl.textContent = 'Mật khẩu không trùng khớp.';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Tạo tài khoản';
        return;
      }
    }

    try {
      if (mode === 'signup') {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await ensureUserProfile(credential.user);
        showToast('Chào mừng bạn!', 'success');
      } else {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        await ensureUserProfile(credential.user);
        showToast('Đăng nhập thành công.', 'success');
      }
    } catch (error) {
      const message = parseFirebaseError(error);
      feedbackEl.textContent = message;
      feedbackEl.style.color = '#f87171';
      showToast(message, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = mode === 'signup' ? 'Tạo tài khoản' : 'Đăng nhập';
    }
  });
}

if (page === 'auth') {
  initAuthPage();
}

export async function requireAuth() {
  await persistenceReady;
  const user = await waitForAuthResolution();
  if (!user) {
    showToast('Vui lòng đăng nhập để tiếp tục.', 'info');
    throw new Error('AUTH_REQUIRED');
  }
  return user;
}

export function getCurrentUser() {
  return currentUser;
}

export async function signOutUser() {
  await signOut(auth);
  showToast('Đã đăng xuất.', 'info');
}
