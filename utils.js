const TOAST_TIMEOUT_MS = 4000;

function ensureToastContainer() {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.append(container);
  }
  return container;
}

/**
 * Show a transient toast message.
 * @param {string} message
 * @param {'success'|'error'|'info'} [variant]
 * @param {number} [timeout]
 */
export function showToast(message, variant = 'info', timeout = TOAST_TIMEOUT_MS) {
  const container = ensureToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${variant}`;
  toast.textContent = message;
  container.append(toast);

  window.setTimeout(() => {
    toast.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200 });
    window.setTimeout(() => toast.remove(), 180);
  }, timeout);
}

/**
 * Lightweight debounce helper for inputs and search boxes.
 * @param {Function} fn
 * @param {number} delay
 */
export function debounce(fn, delay = 250) {
  let timer;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), delay);
  };
}

/**
 * Convert Firestore timestamps or ISO strings into a human-friendly value.
 * @param {import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js').Timestamp|string|Date|null} value
 */
export function formatTimestamp(value) {
  if (!value) return '--';
  let date;
  if (typeof value.toDate === 'function') {
    date = value.toDate();
  } else if (value instanceof Date) {
    date = value;
  } else {
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) return '--';
    date = new Date(parsed);
  }
  return date.toLocaleString();
}

export function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function chunkArray(items, size = 450) {
  const result = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}

export function sanitizeTags(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag).trim()).filter(Boolean);
  }
  return String(value)
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function parseFirebaseError(error, fallback = 'Đã xảy ra lỗi, vui lòng thử lại.') {
  if (!error || typeof error !== 'object') return fallback;
  const code = error.code || '';
  if (code.includes('auth/invalid-credential')) return 'Email hoặc mật khẩu không đúng.';
  if (code.includes('auth/email-already-in-use')) return 'Email này đã được đăng ký.';
  if (code.includes('auth/weak-password')) return 'Mật khẩu phải có ít nhất 6 ký tự.';
  if (code.includes('auth/too-many-requests')) return 'Bạn thao tác quá nhiều, vui lòng đợi.';
  if (code.includes('permission-denied')) return 'Bạn không có quyền thực hiện thao tác này.';
  if (code.includes('unavailable')) return 'Lỗi kết nối, vui lòng kiểm tra internet.';
  return error.message || fallback;
}

export function confirmAction(message) {
  return window.confirm(message);
}
