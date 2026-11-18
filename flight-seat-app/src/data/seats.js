// Seat data for both aircraft layouts
// layoutGroup: used to determine aisle gaps
// 3-2: groups [1,2,3] | [4,5]
// 2-3-2: groups [1,2] | [3,4,5] | [6,7]

export const CATEGORIES = {
  STANDARD: 'Standard',
  PREMIUM: 'Premium',
  EXTRA_LEGROOM: 'Extra Legroom',
};

export const PRICES = {
  FREE: 0,
  STANDARD_PAID: 250,
  EXTRA_LEGROOM: 500,
  PREMIUM: 800,
};

function makeId(row, label) {
  return `${row}${label}`;
}

// Deterministic occupied seats
const OCCUPIED_32 = new Set([
  '1A', '1C', '2D', '3B', '4E', '5A', '5C',
  '6D', '7B', '8A', '8E', '9C', '10D', '11B', '12A',
  '13C', '13E', '14D', '15A', '16B', '17E', '18C', '19A', '20D',
]);

const OCCUPIED_232 = new Set([
  '1A', '1C', '1G', '2B', '2E', '3A', '3D',
  '4F', '5B', '5G', '6C', '7A', '7E', '8D', '9B', '9G',
  '10A', '10F', '11C', '12E', '13A', '13D', '14B', '15G',
  '16C', '17A', '17F', '18D', '19B', '20G',
]);

function getCategory(row) {
  if (row <= 3) return CATEGORIES.PREMIUM;
  if (row === 4 || row === 10 || row === 15) return CATEGORIES.EXTRA_LEGROOM;
  return CATEGORIES.STANDARD;
}

function getPrice(category, label) {
  if (category === CATEGORIES.PREMIUM) return PRICES.PREMIUM;
  if (category === CATEGORIES.EXTRA_LEGROOM) return PRICES.EXTRA_LEGROOM;
  // Window seats (A, E in 3-2 or G in 2-3-2) and selected standard seats are free
  if (label === 'A' || label === 'E' || label === 'G' || label === 'C' || label === 'D') {
    return PRICES.FREE;
  }
  return PRICES.STANDARD_PAID;
}

export function generateSeats32() {
  // 3-2 layout: 20 rows, columns A B C | D E
  // Groups: [0,1,2] = cols A,B,C ; [3,4] = cols D,E
  const labels = ['A', 'B', 'C', 'D', 'E'];
  const groups = [1, 1, 1, 2, 2]; // aisle group per column
  const seats = [];

  for (let row = 1; row <= 20; row++) {
    for (let col = 0; col < 5; col++) {
      const label = labels[col];
      const id = makeId(row, label);
      const category = getCategory(row);
      const price = getPrice(category, label);

      seats.push({
        id,
        row,
        label,
        layoutGroup: groups[col],
        category,
        price,
        status: OCCUPIED_32.has(id) ? 'occupied' : 'available',
      });
    }
  }
  return seats;
}

export function generateSeats232() {
  // 2-3-2 layout: 20 rows, columns A B | C D E | F G
  // Groups: [0,1]=1, [2,3,4]=2, [5,6]=3
  const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const groups = [1, 1, 2, 2, 2, 3, 3];
  const seats = [];

  for (let row = 1; row <= 20; row++) {
    for (let col = 0; col < 7; col++) {
      const label = labels[col];
      const id = makeId(row, label);
      const category = getCategory(row);
      const price = getPrice(category, label);

      seats.push({
        id,
        row,
        label,
        layoutGroup: groups[col],
        category,
        price,
        status: OCCUPIED_232.has(id) ? 'occupied' : 'available',
      });
    }
  }
  return seats;
}

export const MEALS = [
  { id: 'none', name: 'No Meal', price: 0, description: 'Skip meal service', icon: '—' },
  { id: 'veg', name: 'Vegetarian', price: 0, description: 'Paneer curry with rice', icon: '🥗' },
  { id: 'chicken', name: 'Chicken', price: 150, description: 'Grilled chicken with vegetables', icon: '🍗' },
  { id: 'fish', name: 'Fish & Chips', price: 180, description: 'Pan-seared fish with fries', icon: '🐟' },
  { id: 'jain', name: 'Jain Meal', price: 0, description: 'No root vegetables', icon: '🌿' },
  { id: 'vegan', name: 'Vegan', price: 120, description: 'Plant-based meal', icon: '🥦' },
];
