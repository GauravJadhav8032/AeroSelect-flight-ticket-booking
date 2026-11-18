import React from 'react';
import { formatINR } from '../utils/pricing';
import { CATEGORIES } from '../data/seats';

function getSeatState(seat, assignedSeatMap, activePassengerId) {
  if (seat.status === 'occupied') return 'occupied';
  if (assignedSeatMap.has(seat.id)) {
    const ownerId = assignedSeatMap.get(seat.id);
    if (ownerId === activePassengerId) return 'selected';
    return 'assigned-other'; // assigned to another passenger
  }
  return 'available';
}

export default function Seat({ seat, assignedSeatMap, activePassengerId, onSelect }) {
  const state = getSeatState(seat, assignedSeatMap, activePassengerId);
  const isDisabled = state === 'occupied' || state === 'assigned-other';

  const categoryClass =
    seat.category === CATEGORIES.PREMIUM
      ? 'seat-premium'
      : seat.category === CATEGORIES.EXTRA_LEGROOM
      ? 'seat-extra'
      : 'seat-standard';

  const isFree = seat.price === 0;

  const tooltipLines = [
    `Seat ${seat.id}`,
    seat.category,
    formatINR(seat.price),
    state === 'occupied' ? '— Occupied' : '',
    state === 'assigned-other' ? '— Taken by another passenger' : '',
    state === 'selected' ? '— Your seat (click to remove)' : '',
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <button
      role="gridcell"
      className={`seat ${categoryClass} seat-${state} ${isFree && state === 'available' ? 'seat-free' : ''}`}
      onClick={() => !isDisabled && onSelect(seat.id)}
      disabled={isDisabled}
      aria-label={tooltipLines}
      aria-pressed={state === 'selected'}
      title={tooltipLines}
    >
      <span className="seat-label">{seat.label}</span>
      {state === 'selected' && <span className="seat-check" aria-hidden="true">✓</span>}
    </button>
  );
}
