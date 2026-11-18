import React from 'react';

export default function PassengerSelector({ count, onCountChange }) {
  return (
    <div className="passenger-selector">
      <div className="section-label">Passengers</div>
      <div className="counter-row">
        <button
          className="counter-btn"
          onClick={() => onCountChange(count - 1)}
          disabled={count <= 1}
          aria-label="Remove passenger"
        >
          −
        </button>
        <span className="counter-value" aria-live="polite">
          {count}
        </span>
        <button
          className="counter-btn"
          onClick={() => onCountChange(count + 1)}
          disabled={count >= 9}
          aria-label="Add passenger"
        >
          +
        </button>
        <span className="counter-hint">
          {count === 1 ? '1 traveller' : `${count} travellers`}
        </span>
      </div>
    </div>
  );
}
