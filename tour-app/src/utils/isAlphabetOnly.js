/**
 * Validates a name with letters and up to two spaces (e.g., "Abdullah Khan Afridi").
 * Looser than backend; still user-friendly.
 *
 * @param {any} data
 * @returns {boolean}
 */
const isAlphabetOnly = (data) => {
  if (typeof data !== 'string') return false;
  const name = data.trim();

  // Allow multiple words, single spaces, no digits/symbols
  const namePattern = /^[A-Za-z]+(?:\s[A-Za-z]+){0,2}$/;

  return namePattern.test(name);
};

export default isAlphabetOnly;
