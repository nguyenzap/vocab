// Replace with your admin email(s).
export const ADMIN_EMAILS = ['zap@gmail.com'];

const NORMALIZED_ADMIN_EMAILS = ADMIN_EMAILS.map((email) =>
  String(email || '').trim().toLowerCase()
).filter(Boolean);

export function isAdminUser(user) {
  const email = String(user?.email || '').trim().toLowerCase();
  return Boolean(email && NORMALIZED_ADMIN_EMAILS.includes(email));
}
