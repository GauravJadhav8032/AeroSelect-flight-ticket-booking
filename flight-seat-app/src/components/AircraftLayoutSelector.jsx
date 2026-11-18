import React from 'react';

export default function AircraftLayoutSelector({ layoutType, onSwitch }) {
  return (
    <div className="layout-selector">
      <div className="section-label">Aircraft Configuration</div>
      <div className="layout-toggle" role="group" aria-label="Aircraft layout">
        <button
          className={`layout-btn ${layoutType === '3-2' ? 'layout-active' : ''}`}
          onClick={() => onSwitch('3-2')}
          aria-pressed={layoutType === '3-2'}
        >
          <span className="layout-icon">
            <span className="cabin-block">▪▪▪</span>
            <span className="cabin-aisle"> </span>
            <span className="cabin-block">▪▪</span>
          </span>
          <span className="layout-name">Narrow-body</span>
          <span className="layout-desc">3 – 2 · 5 seats/row</span>
        </button>
        <button
          className={`layout-btn ${layoutType === '2-3-2' ? 'layout-active' : ''}`}
          onClick={() => onSwitch('2-3-2')}
          aria-pressed={layoutType === '2-3-2'}
        >
          <span className="layout-icon">
            <span className="cabin-block">▪▪</span>
            <span className="cabin-aisle"> </span>
            <span className="cabin-block">▪▪▪</span>
            <span className="cabin-aisle"> </span>
            <span className="cabin-block">▪▪</span>
          </span>
          <span className="layout-name">Wide-body</span>
          <span className="layout-desc">2 – 3 – 2 · 7 seats/row</span>
        </button>
      </div>
    </div>
  );
}
