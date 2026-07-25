export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export function validateLogin({ email, password }) {
  if (!isValidEmail(email)) return "Enter a valid email address.";
  if (password.length < 6) return "Password must contain at least 6 characters.";
  return "";
}

export function validateRegistration({ name, email, password }) {
  if (name.trim().length < 2) return "Name must contain at least 2 characters.";
  return validateLogin({ email, password });
}

export function validateContact({ name, email, message }) {
  if (name.trim().length < 2) return "Please enter your name.";
  if (!isValidEmail(email)) return "Enter a valid email address.";
  if (message.trim().length < 10) return "Message must contain at least 10 characters.";
  return "";
}
