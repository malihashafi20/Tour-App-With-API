//src/data/itiniries.ks
export const weekendItineraries = [
  {
    id: 'lahore-heritage',
    city: 'Lahore',
    days: 3,
    summary: 'Walled City heritage + food safari',
    plan: [
      { day: 1, items: ['Badshahi Mosque', 'Lahore Fort', 'Food Street'] },
      { day: 2, items: ['Walled City walk', 'National Museum', 'Haveli dinner'] },
      { day: 3, items: ['Shalimar Gardens', 'Anarkali bazaar'] },
    ],
    cover: '/src/assets/lhre.png',
  },
  {
    id: 'murree-retreat',
    city: 'Murree',
    days: 2,
    summary: 'Quick hill-station reset',
    plan: [
      { day: 1, items: ['Mall Road', 'Patriata chairlift'] },
      { day: 2, items: ['Kashmir Point', 'Scenic tea break'] },
    ],
    cover: '/src/assets/Murree expressway Pakistan.jpg',
  },
]
