import React from 'react';
import { formatINR, formatINRAlways } from '../utils/pricing';
import { MEALS } from '../data/seats';

const mealMap = new Map(MEALS.map((m) => [m.id, m]));

export default function BookingSummary({
  passengers,
  seatMap,
  seatTotal,
  mealTotal,
  grandTotal,
}) {
  const assignedCount = passengers.filter((p) => p.seatId).length;

  return (
    <div className="booking-summary">
      <div className="summary-header">
        <span className="summary-title">Booking Summary</span>
        <span className="summary-assigned">
          {assignedCount}/{passengers.length} seats assigned
        </span>
      </div>

      <ul className="summary-list">
        {passengers.map((p) => {
          const seat = p.seatId ? seatMap.get(p.seatId) : null;
          const meal = p.mealId ? mealMap.get(p.mealId) : null;
          return (
            <li key={p.id} className="summary-item">
              <div className="summary-pax-name">{p.name}</div>
              <div className="summary-details">
                {seat ? (
                  <span className="summary-seat">
                    <span className="summary-seat-id">{seat.id}</span>
                    <span className="summary-seat-cat">{seat.category}</span>
                    <span className="summary-seat-price">{formatINR(seat.price)}</span>
                  </span>
                ) : (
                  <span className="summary-no-seat">No seat selected</span>
                )}
                {meal && (
                  <span className="summary-meal">
                    {meal.icon} {meal.name}
                    {meal.price > 0 && (
                      <span className="summary-meal-price">
                        {' '}+ {formatINRAlways(meal.price)}
                      </span>
                    )}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="summary-totals">
        <div className="summary-row">
          <span>Seat charges</span>
          <span>{formatINRAlways(seatTotal)}</span>
        </div>
        {mealTotal > 0 && (
          <div className="summary-row">
            <span>Meal charges</span>
            <span>{formatINRAlways(mealTotal)}</span>
          </div>
        )}
        <div className="summary-row summary-grand">
          <span>Total</span>
          <span>{formatINRAlways(grandTotal)}</span>
        </div>
      </div>
    </div>
  );
}
