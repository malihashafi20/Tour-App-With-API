// src/utils/validation.js
export function validateRegister({ name, email, password }) {
  const errors = {};
  if (!name || name.trim().length < 2) errors.name = "Name must be at least 2 characters";
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.email = "Valid email is required";
  if (!password || password.length < 6) errors.password = "Password must be at least 6 characters";
  return errors;
}

export function validateLogin({ email, password }) {
  const errors = {};
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.email = "Valid email is required";
  if (!password) errors.password = "Password is required";
  return errors;
}
