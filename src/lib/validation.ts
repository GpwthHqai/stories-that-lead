/**
 * Shared validation utilities for API routes
 */

// RFC 5322 simplified email regex — catches the vast majority of invalid inputs
// without being so strict that it rejects valid edge cases
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Validates an email address format.
 * Max length 254 chars (RFC 5321), must match simplified RFC 5322 pattern.
 */
export function isValidEmail(email: unknown): email is string {
  if (typeof email !== "string") return false;
  if (email.length === 0 || email.length > 254) return false;
  return EMAIL_REGEX.test(email);
}

/**
 * Sanitizes a string input: trims whitespace and caps length.
 * Returns empty string if input is not a string.
 */
export function sanitizeString(
  value: unknown,
  maxLength: number = 500
): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}
