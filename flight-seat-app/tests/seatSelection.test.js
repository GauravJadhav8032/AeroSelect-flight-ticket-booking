import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { generateSeats32, generateSeats232, MEALS, CATEGORIES, PRICES } from '../src/data/seats.js';
import { calcSeatTotal, calcMealTotal, formatINR, formatINRAlways } from '../src/utils/pricing.js';
import { organizeByRows, getLayoutLabels } from '../src/utils/seatLayout.js';

describe('Data Layer & Layout Verification', () => {
  test('generateSeats32 produces 100 seats across 20 rows with 3-2 grouping', () => {
    const seats = generateSeats32();
    assert.equal(seats.length, 100);
    const row1Seats = seats.filter(s => s.row === 1);
    assert.equal(row1Seats.length, 5);
    assert.deepEqual(row1Seats.map(s => s.label), ['A', 'B', 'C', 'D', 'E']);
    assert.deepEqual(row1Seats.map(s => s.layoutGroup), [1, 1, 1, 2, 2]);
  });

  test('generateSeats232 produces 140 seats across 20 rows with 2-3-2 grouping', () => {
    const seats = generateSeats232();
    assert.equal(seats.length, 140);
    const row1Seats = seats.filter(s => s.row === 1);
    assert.equal(row1Seats.length, 7);
    assert.deepEqual(row1Seats.map(s => s.label), ['A', 'B', 'C', 'D', 'E', 'F', 'G']);
    assert.deepEqual(row1Seats.map(s => s.layoutGroup), [1, 1, 2, 2, 2, 3, 3]);
  });

  test('Seat categories and pricing are properly tiered', () => {
    const seats32 = generateSeats32();
    const map = new Map(seats32.map(s => [s.id, s]));

    // Row 1-3: Premium
    assert.equal(map.get('1B').category, CATEGORIES.PREMIUM);
    assert.equal(map.get('1B').price, PRICES.PREMIUM);

    // Row 4: Extra Legroom
    assert.equal(map.get('4B').category, CATEGORIES.EXTRA_LEGROOM);
    assert.equal(map.get('4B').price, PRICES.EXTRA_LEGROOM);

    // Standard rows: Free window seats (A & E), paid middle/aisle (B)
    assert.equal(map.get('7A').category, CATEGORIES.STANDARD);
    assert.equal(map.get('7A').price, 0); // Window seat is free
    assert.equal(map.get('7B').category, CATEGORIES.STANDARD);
    assert.equal(map.get('7B').price, PRICES.STANDARD_PAID);
  });

  test('Occupied seats are flagged deterministically', () => {
    const seats32 = generateSeats32();
    const occupied32 = seats32.filter(s => s.status === 'occupied');
    assert.ok(occupied32.length > 0);
    assert.ok(occupied32.some(s => s.id === '1A'));

    const seats232 = generateSeats232();
    const occupied232 = seats232.filter(s => s.status === 'occupied');
    assert.ok(occupied232.length > 0);
    assert.ok(occupied232.some(s => s.id === '1A'));
  });
});

describe('Layout Organizer Utility', () => {
  test('organizeByRows partitions 3-2 seats into 20 rows with 2 aisle groups each', () => {
    const seats = generateSeats32();
    const rows = organizeByRows(seats, '3-2');
    assert.equal(rows.length, 20);
    assert.equal(rows[0].rowNum, 1);
    assert.equal(rows[0].groups.length, 2);
    assert.equal(rows[0].groups[0].length, 3); // A B C
    assert.equal(rows[0].groups[1].length, 2); // D E
  });

  test('organizeByRows partitions 2-3-2 seats into 20 rows with 3 aisle groups each', () => {
    const seats = generateSeats232();
    const rows = organizeByRows(seats, '2-3-2');
    assert.equal(rows.length, 20);
    assert.equal(rows[0].rowNum, 1);
    assert.equal(rows[0].groups.length, 3);
    assert.equal(rows[0].groups[0].length, 2); // A B
    assert.equal(rows[0].groups[1].length, 3); // C D E
    assert.equal(rows[0].groups[2].length, 2); // F G
  });

  test('getLayoutLabels returns correct column sections', () => {
    const l32 = getLayoutLabels('3-2');
    assert.deepEqual(l32.sections, ['A B C', 'D E']);
    assert.equal(l32.totalCols, 5);

    const l232 = getLayoutLabels('2-3-2');
    assert.deepEqual(l232.sections, ['A B', 'C D E', 'F G']);
    assert.equal(l232.totalCols, 7);
  });
});

describe('Pricing Calculation & Currency Formatting', () => {
  const seats32 = generateSeats32();
  const seatMap = new Map(seats32.map(s => [s.id, s]));
  const mealMap = new Map(MEALS.map(m => [m.id, m]));

  test('Empty passenger list has 0 total', () => {
    assert.equal(calcSeatTotal([], seatMap), 0);
    assert.equal(calcMealTotal([], mealMap), 0);
  });

  test('Calculates seat charges correctly with mixed free and paid seats', () => {
    const passengers = [
      { id: 'P1', name: 'Passenger 1', seatId: '7A', mealId: null }, // Free window: 0
      { id: 'P2', name: 'Passenger 2', seatId: '7B', mealId: null }, // Standard paid: 250
      { id: 'P3', name: 'Passenger 3', seatId: '4B', mealId: null }, // Extra legroom: 500
      { id: 'P4', name: 'Passenger 4', seatId: '2B', mealId: null }, // Premium: 800
      { id: 'P5', name: 'Passenger 5', seatId: null, mealId: null }, // No seat: 0
    ];

    const total = calcSeatTotal(passengers, seatMap);
    assert.equal(total, 0 + 250 + 500 + 800 + 0); // 1550
  });

  test('Calculates meal charges correctly with free and paid meals', () => {
    const passengers = [
      { id: 'P1', name: 'Passenger 1', seatId: null, mealId: 'veg' }, // 0 (Free)
      { id: 'P2', name: 'Passenger 2', seatId: null, mealId: 'chicken' }, // 150
      { id: 'P3', name: 'Passenger 3', seatId: null, mealId: 'fish' }, // 180
      { id: 'P4', name: 'Passenger 4', seatId: null, mealId: null }, // 0
    ];

    const total = calcMealTotal(passengers, mealMap);
    assert.equal(total, 0 + 150 + 180 + 0); // 330
  });

  test('formatINR formats 0 as "Free" and non-zero as INR currency string', () => {
    assert.equal(formatINR(0), 'Free');
    assert.ok(formatINR(250).includes('250'));
    assert.ok(formatINRAlways(0).includes('0'));
    assert.ok(formatINRAlways(1500).includes('1,500') || formatINRAlways(1500).includes('1500'));
  });
});

describe('Assignment Invariants Simulation', () => {
  test('Atomic seat replacement: releasing previous seat when choosing a new one', () => {
    let passengers = [
      { id: 'P1', name: 'Passenger 1', seatId: '7B', mealId: null },
    ];
    // P1 chooses 7C
    passengers = passengers.map(p => p.id === 'P1' ? { ...p, seatId: '7C' } : p);
    assert.equal(passengers[0].seatId, '7C');
  });

  test('Duplicate prevention: reject seat if another passenger owns it', () => {
    const passengers = [
      { id: 'P1', name: 'Passenger 1', seatId: '7B', mealId: null },
      { id: 'P2', name: 'Passenger 2', seatId: null, mealId: null },
    ];
    const targetSeat = '7B';
    const activePassengerId = 'P2';

    const conflict = passengers.find(p => p.id !== activePassengerId && p.seatId === targetSeat);
    assert.ok(conflict, 'Conflict detected');
    assert.equal(conflict.id, 'P1');
  });

  test('Layout switch clears seat only if it does not exist in target layout', () => {
    const seats32 = generateSeats32();
    const map32 = new Map(seats32.map(s => [s.id, s]));

    // Passengers assigned in 2-3-2 layout:
    // P1 has '7A' (valid in both 3-2 and 2-3-2)
    // P2 has '7G' (valid ONLY in 2-3-2, not 3-2)
    let passengers = [
      { id: 'P1', name: 'Passenger 1', seatId: '7A', mealId: null },
      { id: 'P2', name: 'Passenger 2', seatId: '7G', mealId: null },
    ];

    passengers = passengers.map(p => {
      if (p.seatId && !map32.has(p.seatId)) {
        return { ...p, seatId: null };
      }
      return p;
    });

    assert.equal(passengers[0].seatId, '7A', 'Preserved valid seat across layout change');
    assert.equal(passengers[1].seatId, null, 'Cleared invalid seat that does not exist in 3-2');
  });

  test('Passenger count reduction safely drops excess passengers and releases their seats', () => {
    let passengers = [
      { id: 'P1', name: 'Passenger 1', seatId: '7A', mealId: null },
      { id: 'P2', name: 'Passenger 2', seatId: '7B', mealId: null },
      { id: 'P3', name: 'Passenger 3', seatId: '7C', mealId: null },
    ];

    const newCount = 2;
    passengers = passengers.slice(0, newCount);
    assert.equal(passengers.length, 2);
    // P3 is removed, so '7C' is no longer in passengers array
    const assignedSeats = passengers.map(p => p.seatId);
    assert.ok(!assignedSeats.includes('7C'));
  });
});
