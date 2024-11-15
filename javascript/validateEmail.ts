/**
 * Uses simple regex to validate email format
 */
export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // ex. email@domain
  return emailRegex.test(email);
};