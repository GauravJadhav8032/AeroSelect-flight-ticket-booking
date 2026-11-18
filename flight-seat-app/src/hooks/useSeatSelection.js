import { useState, useCallback, useMemo, useRef } from 'react';
import { generateSeats32, generateSeats232, MEALS } from '../data/seats';
import { calcSeatTotal, calcMealTotal } from '../utils/pricing';

function createPassenger(index) {
  return {
    id: `P${index + 1}`,
    name: `Passenger ${index + 1}`,
    seatId: null,
    mealId: null,
  };
}

function buildSeatMap(seats) {
  return new Map(seats.map((s) => [s.id, s]));
}

const mealMap = new Map(MEALS.map((m) => [m.id, m]));

export function useSeatSelection() {
  const [passengers, setPassengers] = useState([createPassenger(0)]);
  const [activePassengerId, setActivePassengerId] = useState('P1');
  const [layoutType, setLayoutType] = useState('3-2');
  const [seats32] = useState(() => generateSeats32());
  const [seats232] = useState(() => generateSeats232());
  const [notification, setNotification] = useState(null);

  // Track timeout so we can cancel it before showing a new notification
  const notifTimerRef = useRef(null);

  const seats = layoutType === '3-2' ? seats32 : seats232;
  const seatMap = useMemo(() => buildSeatMap(seats), [seats]);

  // Derive passengerCount instead of storing it separately
  const passengerCount = passengers.length;

  // ─── Notifications ────────────────────────────────────────────────────────
  const notify = useCallback((message, type = 'info') => {
    if (notifTimerRef.current) clearTimeout(notifTimerRef.current);
    setNotification({ message, type, id: Date.now() });
    notifTimerRef.current = setTimeout(() => setNotification(null), 3500);
  }, []);

  // ─── Passenger Count ──────────────────────────────────────────────────────
  const updatePassengerCount = useCallback((count) => {
    const clamped = Math.max(1, Math.min(9, count));

    setPassengers((prev) => {
      if (clamped > prev.length) {
        const added = Array.from({ length: clamped - prev.length }, (_, i) =>
          createPassenger(prev.length + i)
        );
        return [...prev, ...added];
      }
      return prev.slice(0, clamped);
    });

    setActivePassengerId((prev) => {
      const idx = parseInt(prev.replace('P', ''), 10) - 1;
      if (idx >= clamped) return `P${clamped}`;
      return prev;
    });
  }, []);

  // ─── Active Passenger ─────────────────────────────────────────────────────
  const selectPassenger = useCallback((id) => {
    setActivePassengerId(id);
  }, []);

  // ─── Layout ───────────────────────────────────────────────────────────────
  const switchLayout = useCallback(
    (type) => {
      if (type === layoutType) return;
      const nextSeats = type === '3-2' ? seats32 : seats232;
      const nextSeatMap = buildSeatMap(nextSeats);

      // Collect which passengers will lose their seat BEFORE updating state
      let invalidatedNames = [];
      setPassengers((prev) => {
        const updated = prev.map((p) => {
          if (p.seatId && !nextSeatMap.has(p.seatId)) {
            invalidatedNames.push(p.name);
            return { ...p, seatId: null };
          }
          return p;
        });
        return updated;
      });

      setLayoutType(type);

      // Notify after state updates — use setTimeout(0) to ensure it runs
      // after the batched state updates so the notification reflects new state
      if (invalidatedNames.length > 0) {
        setTimeout(() => {
          notify(
            `Seat assignment cleared for: ${invalidatedNames.join(', ')} — not available in the new layout.`,
            'warning'
          );
        }, 0);
      }
    },
    [layoutType, seats32, seats232, notify]
  );

  // ─── Seat Selection ───────────────────────────────────────────────────────
  const selectSeat = useCallback(
    (seatId) => {
      const seat = seatMap.get(seatId);
      if (!seat) return;

      if (!activePassengerId) {
        notify('Please select a passenger first.', 'error');
        return;
      }

      if (seat.status === 'occupied') {
        // Occupied seats are disabled in the DOM, but guard anyway
        notify('This seat is occupied and cannot be selected.', 'error');
        return;
      }

      // We must NOT call notify() inside the setPassengers updater (it's a pure fn).
      // Read current passengers snapshot first, then decide.
      setPassengers((prev) => {
        const activeP = prev.find((p) => p.id === activePassengerId);
        if (!activeP) return prev;

        // Toggle off: clicking the seat you already own
        if (activeP.seatId === seatId) {
          return prev.map((p) =>
            p.id === activePassengerId ? { ...p, seatId: null } : p
          );
        }

        // Conflict: another passenger already has this seat
        const conflict = prev.find(
          (p) => p.id !== activePassengerId && p.seatId === seatId
        );
        if (conflict) {
          // Schedule notification outside the updater
          setTimeout(() => notify(`${conflict.name} already has this seat.`, 'error'), 0);
          return prev; // no change
        }

        // Assign — previous seatId is released implicitly (overwritten)
        return prev.map((p) =>
          p.id === activePassengerId ? { ...p, seatId } : p
        );
      });
    },
    [activePassengerId, seatMap, notify]
  );

  // ─── Remove Seat ──────────────────────────────────────────────────────────
  const removeSeat = useCallback((passengerId) => {
    setPassengers((prev) =>
      prev.map((p) => (p.id === passengerId ? { ...p, seatId: null } : p))
    );
  }, []);

  // ─── Meal Selection ───────────────────────────────────────────────────────
  const selectMeal = useCallback((passengerId, mealId) => {
    setPassengers((prev) =>
      prev.map((p) => (p.id === passengerId ? { ...p, mealId } : p))
    );
  }, []);

  // ─── Derived values ───────────────────────────────────────────────────────
  const seatTotal = useMemo(() => calcSeatTotal(passengers, seatMap), [passengers, seatMap]);
  const mealTotal = useMemo(() => calcMealTotal(passengers, mealMap), [passengers]);
  const grandTotal = seatTotal + mealTotal;

  const assignedSeatMap = useMemo(() => {
    const m = new Map();
    for (const p of passengers) {
      if (p.seatId) m.set(p.seatId, p.id);
    }
    return m;
  }, [passengers]);

  const activePassenger = passengers.find((p) => p.id === activePassengerId) || null;

  return {
    passengers,
    passengerCount,
    activePassengerId,
    activePassenger,
    layoutType,
    seats,
    seatMap,
    assignedSeatMap,
    mealMap,
    notification,
    seatTotal,
    mealTotal,
    grandTotal,
    updatePassengerCount,
    selectPassenger,
    switchLayout,
    selectSeat,
    removeSeat,
    selectMeal,
    notify,
  };
}
