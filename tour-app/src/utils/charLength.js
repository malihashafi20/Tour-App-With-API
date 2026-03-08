/**
 * Checks if input length is within a given range.
 *
 * @param {any} data
 * @param {number} min
 * @param {number} max
 * @returns {boolean}
 */
const charLength = (data, min, max) => {
  if (data === null || data === undefined) return false;
  const str = String(data).trim();
  if (typeof min !== 'number' || typeof max !== 'number' || min < 0 || max < min) return false;
  const len = str.length;
  return len >= min && len <= max;
};

export default charLength;
