import React from 'react';
import { formatINR } from '../utils/pricing';

export default function PassengerList({
  passengers,
  activePassengerId,
  seatMap,
  onSelect,
  onRemoveSeat,
}) {
  return (
    <div className="passenger-list">
      <div className="section-label">Select Passenger</div>
      <ul className="pax-list" role="list">
        {passengers.map((p, idx) => {
          const seat = p.seatId ? seatMap.get(p.seatId) : null;
          const isActive = p.id === activePassengerId;
          return (
            <li key={p.id} className={`pax-item ${isActive ? 'pax-active' : ''}`}>
              <button
                className="pax-btn"
                onClick={() => onSelect(p.id)}
                aria-pressed={isActive}
                aria-label={`Select ${p.name}${seat ? `, seat ${seat.id}` : ''}`}
              >
                <span className="pax-index">{idx + 1}</span>
                <span className="pax-name">{p.name}</span>
                {isActive && <span className="pax-active-badge">Active</span>}
              </button>
              <div className="pax-seat-info">
                {seat ? (
                  <>
                    <span className="pax-seat-id">{seat.id}</span>
                    <span className="pax-seat-cat">{seat.category}</span>
                    <span className="pax-seat-price">{formatINR(seat.price)}</span>
                    <button
                      className="pax-remove-btn"
                      onClick={() => onRemoveSeat(p.id)}
                      aria-label={`Remove seat ${seat.id} from ${p.name}`}
                      title="Remove seat"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <span className="pax-no-seat">No seat</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
