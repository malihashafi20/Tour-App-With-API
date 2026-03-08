//src/data/destinaation.js
export const moods = [
  { id: 'relax', label: 'Relax', tags: ['beach', 'spa', 'slow'] },
  { id: 'adventure', label: 'Adventure', tags: ['hike', 'raft', 'climb'] },
  { id: 'romantic', label: 'Romantic', tags: ['sunset', 'quiet', 'view'] },
  { id: 'family', label: 'Family Fun', tags: ['park', 'zoo', 'museum'] },
]

export const destinations = [
  { id: 'hunza', name: 'Hunza Valley', mood: ['relax', 'adventure'], coords: { lat: 36.31, lng: 74.65 } },
  { id: 'skardu', name: 'Skardu', mood: ['adventure', 'romantic'], coords: { lat: 35.30, lng: 75.63 } },
  { id: 'lahore', name: 'Lahore', mood: ['family', 'romantic'], coords: { lat: 31.56, lng: 74.35 } },
  { id: 'karachi', name: 'Karachi', mood: ['relax', 'family'], coords: { lat: 24.86, lng: 67.01 } },
]
