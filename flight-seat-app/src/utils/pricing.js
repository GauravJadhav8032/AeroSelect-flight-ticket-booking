// Pricing utilities

const INR_FORMAT = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatINR(amount) {
  if (amount === 0) return 'Free';
  return INR_FORMAT.format(amount);
}

export function formatINRAlways(amount) {
  return INR_FORMAT.format(amount);
}

/**
 * Calculate seat total from passengers and seat lookup map.
 * @param {Array} passengers
 * @param {Map} seatMap - Map<seatId, seat>
 */
export function calcSeatTotal(passengers, seatMap) {
  return passengers.reduce((sum, p) => {
    if (!p.seatId) return sum;
    const seat = seatMap.get(p.seatId);
    return sum + (seat ? seat.price : 0);
  }, 0);
}

/**
 * Calculate meal total from passengers and meal lookup map.
 * @param {Array} passengers
 * @param {Map} mealMap - Map<mealId, meal>
 */
export function calcMealTotal(passengers, mealMap) {
  return passengers.reduce((sum, p) => {
    if (!p.mealId) return sum;
    const meal = mealMap.get(p.mealId);
    return sum + (meal ? meal.price : 0);
  }, 0);
}
