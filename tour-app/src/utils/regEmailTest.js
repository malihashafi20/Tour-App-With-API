/**
 * Validates whether input is a properly formatted email address.
 * Frontend-friendly (no heavy sanitization).
 *
 * @param {any} data
 * @returns {boolean}
 */
const regEmailTest = (data) => {
  if (typeof data !== 'string') return false;
  const email = data.trim().toLowerCase();
  if (!email || email.length > 250) return false;

  const emailPattern =
    /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]{0,63}[a-zA-Z0-9])?@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[A-Za-z]{2,}$/i;

  return emailPattern.test(email);
};

export default regEmailTest;
