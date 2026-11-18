/**
 * seatLayout.js - Utility to organize flat seat array into rows for rendering.
 * Returns an array of row objects: { rowNum, groups: [[seat, ...], ...] }
 */
export function organizeByRows(seats, layoutType) {
  // Group seats by row
  const rowMap = new Map();
  for (const seat of seats) {
    if (!rowMap.has(seat.row)) rowMap.set(seat.row, []);
    rowMap.get(seat.row).push(seat);
  }

  const rows = [];
  const sortedRows = [...rowMap.keys()].sort((a, b) => a - b);

  for (const rowNum of sortedRows) {
    const rowSeats = rowMap.get(rowNum).sort((a, b) =>
      a.label.localeCompare(b.label)
    );

    // Group into aisle sections
    const groupMap = new Map();
    for (const seat of rowSeats) {
      if (!groupMap.has(seat.layoutGroup)) groupMap.set(seat.layoutGroup, []);
      groupMap.get(seat.layoutGroup).push(seat);
    }
    const groups = [...groupMap.keys()]
      .sort((a, b) => a - b)
      .map((g) => groupMap.get(g));

    rows.push({ rowNum, groups });
  }

  return rows;
}

export function getLayoutLabels(layoutType) {
  if (layoutType === '3-2') {
    return { sections: ['A B C', 'D E'], totalCols: 5 };
  }
  return { sections: ['A B', 'C D E', 'F G'], totalCols: 7 };
}
