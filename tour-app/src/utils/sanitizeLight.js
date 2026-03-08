/**
 * Light frontend sanitizer: trims and strips obvious script tags.
 * Do NOT rely on this for security; backend must sanitize/validate again.
 *
 * @param {any} input
 * @returns {string}
 */
const sanitizeLight = (input) => {
  if (input === null || input === undefined) return '';
  const str = String(input).trim();
  return str.replace(/<script.*?>.*?<\/script>/gi, '').replace(/javascript:/gi, '');
};

export default sanitizeLight;
