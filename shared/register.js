// Registration form validation. Same convention as validateValue in
// shared/activities.js: returns { value } when accepted, { message } when
// rejected — one function per field, so the caller decides how to combine
// them (web shows them as inline field errors under each input).

export const MIN_PASSWORD_LENGTH = 8;

export function validateName(rawName) {
  const value = String(rawName || "").trim();
  if (!value) return { message: "Nama wajib diisi." };
  return { value };
}

export function validateEmail(rawEmail) {
  const value = String(rawEmail || "").trim();
  if (!value) return { message: "Email wajib diisi." };
  return { value };
}

export function validatePassword(rawPassword) {
  const value = String(rawPassword || "");
  if (value.length < MIN_PASSWORD_LENGTH) {
    return { message: `Password minimal ${MIN_PASSWORD_LENGTH} karakter.` };
  }
  return { value };
}

export function validateConfirmPassword(rawConfirmPassword, password) {
  const value = String(rawConfirmPassword || "");
  if (value !== password) return { message: "Konfirmasi password tidak sama." };
  return { value };
}
