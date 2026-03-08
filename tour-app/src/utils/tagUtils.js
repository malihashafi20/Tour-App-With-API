export const normalizeTag = (tag) => {
  const map = { Romantic: 'Scenic' };
  return map[tag] || tag;
};
