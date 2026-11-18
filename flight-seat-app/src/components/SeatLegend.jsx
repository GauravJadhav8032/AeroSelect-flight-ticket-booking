import React from 'react';

const LEGEND_ITEMS = [
  { className: 'seat seat-standard seat-available', label: 'Available (Standard)', desc: '₹250 or free' },
  { className: 'seat seat-extra seat-available', label: 'Available (Extra Legroom)', desc: '₹500' },
  { className: 'seat seat-premium seat-available', label: 'Available (Premium)', desc: '₹800' },
  { className: 'seat seat-standard seat-free', label: 'Free Seat', desc: '₹0' },
  { className: 'seat seat-standard seat-selected', label: 'Your Seat', desc: 'Selected' },
  { className: 'seat seat-standard seat-assigned-other', label: 'Other Passenger', desc: 'Taken' },
  { className: 'seat seat-standard seat-occupied', label: 'Occupied', desc: 'Unavailable' },
];

export default function SeatLegend() {
  return (
    <div className="seat-legend" aria-label="Seat legend">
      <div className="section-label">Legend</div>
      <ul className="legend-list">
        {LEGEND_ITEMS.map(({ className, label, desc }) => (
          <li key={label} className="legend-item">
            <span className={className} aria-hidden="true">
              <span className="seat-label">A</span>
            </span>
            <span className="legend-text">
              <span className="legend-label">{label}</span>
              <span className="legend-desc">{desc}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
