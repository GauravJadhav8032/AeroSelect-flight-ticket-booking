import React, { useMemo } from 'react';
import Seat from './Seat';
import { organizeByRows, getLayoutLabels } from '../utils/seatLayout';

export default function SeatMap({
  seats,
  layoutType,
  assignedSeatMap,
  activePassengerId,
  onSelectSeat,
}) {
  const rows = useMemo(() => organizeByRows(seats, layoutType), [seats, layoutType]);
  const { sections } = getLayoutLabels(layoutType);

  return (
    <div className="seat-map-wrapper">
      {/* Aircraft nose indicator */}
      <div className="aircraft-nose">
        <span className="nose-label">✈ Front of Aircraft</span>
      </div>

      <div className="seat-map" role="grid" aria-label="Aircraft seat map">
        {/* Column headers */}
        <div className="seat-map-header" role="row">
          <div className="row-num-spacer" aria-hidden="true" />
          {sections.map((section, si) => (
            <React.Fragment key={si}>
              <div className="col-header-group" role="presentation">
                {section.split(' ').map((lbl) => (
                  <div key={lbl} className="col-header-cell" role="columnheader" aria-label={`Column ${lbl}`}>
                    {lbl}
                  </div>
                ))}
              </div>
              {si < sections.length - 1 && (
                <div className="aisle-spacer" aria-hidden="true" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Rows */}
        <div className="seat-map-rows">
          {rows.map(({ rowNum, groups }) => (
            <div key={rowNum} className="seat-row" role="row">
              <div className="row-num" role="rowheader" aria-label={`Row ${rowNum}`}>
                {rowNum}
              </div>
              {groups.map((groupSeats, gi) => (
                <React.Fragment key={gi}>
                  <div className="seat-group" role="group" aria-label={`Row ${rowNum} section ${gi + 1}`}>
                    {groupSeats.map((seat) => (
                      <Seat
                        key={seat.id}
                        seat={seat}
                        assignedSeatMap={assignedSeatMap}
                        activePassengerId={activePassengerId}
                        onSelect={onSelectSeat}
                      />
                    ))}
                  </div>
                  {gi < groups.length - 1 && (
                    <div className="aisle" aria-hidden="true" />
                  )}
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="aircraft-tail">
        <span className="tail-label">Rear of Aircraft</span>
      </div>
    </div>
  );
}
