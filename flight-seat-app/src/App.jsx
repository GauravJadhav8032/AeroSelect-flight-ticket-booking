import React, { useState } from 'react';
import { useSeatSelection } from './hooks/useSeatSelection';
import PassengerSelector from './components/PassengerSelector';
import PassengerList from './components/PassengerList';
import AircraftLayoutSelector from './components/AircraftLayoutSelector';
import SeatMap from './components/SeatMap';
import SeatLegend from './components/SeatLegend';
import BookingSummary from './components/BookingSummary';
import MealSelector from './components/MealSelector';
import Notification from './components/Notification';
import './styles/global.css';
import './styles/components.css';

export default function App() {
  const {
    passengers,
    passengerCount,
    activePassengerId,
    activePassenger,
    layoutType,
    seats,
    seatMap,
    assignedSeatMap,
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
  } = useSeatSelection();

  const [showMeals, setShowMeals] = useState(false);

  const handleConfirm = () => {
    const unassigned = passengers.filter((p) => !p.seatId);
    if (unassigned.length > 0) {
      notify(
        `Please select seats for all passengers (${unassigned.map((p) => p.name).join(', ')} still need seats).`,
        'warning'
      );
      return;
    }
    notify('Selection confirmed! Your seats and meal preferences are reserved.', 'success');
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-mark">✦</span>
            <span className="brand-name">AeroSelect</span>
          </div>
          <div className="flight-info">
            <span className="flight-route">DEL → BOM</span>
            <span className="flight-meta">AI 101 · Economy · 17 Nov</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <Notification notification={notification} />

        <div className="app-layout">
          {/* ─── Left Panel ─── */}
          <aside className="left-panel">
            <PassengerSelector
              count={passengerCount}
              onCountChange={updatePassengerCount}
            />

            <PassengerList
              passengers={passengers}
              activePassengerId={activePassengerId}
              seatMap={seatMap}
              onSelect={selectPassenger}
              onRemoveSeat={removeSeat}
            />

            <AircraftLayoutSelector
              layoutType={layoutType}
              onSwitch={switchLayout}
            />

            <SeatLegend />
          </aside>

          {/* ─── Center: Seat Map ─── */}
          <section className="center-panel">
            <div className="center-header">
              <h2 className="map-title">Select Your Seat</h2>
              {activePassenger ? (
                <p className="map-hint">
                  Selecting for{' '}
                  <strong>{activePassenger.name}</strong>
                  {activePassenger.seatId && (
                    <> — currently <strong>{activePassenger.seatId}</strong></>
                  )}
                </p>
              ) : (
                <p className="map-hint map-hint-warn">
                  ← Choose a passenger to begin
                </p>
              )}
            </div>
            <SeatMap
              seats={seats}
              layoutType={layoutType}
              assignedSeatMap={assignedSeatMap}
              activePassengerId={activePassengerId}
              onSelectSeat={selectSeat}
            />
          </section>

          {/* ─── Right Panel ─── */}
          <aside className="right-panel">
            <BookingSummary
              passengers={passengers}
              seatMap={seatMap}
              seatTotal={seatTotal}
              mealTotal={mealTotal}
              grandTotal={grandTotal}
            />

            <div className="meal-toggle-row">
              <button
                className="meal-toggle-btn"
                onClick={() => setShowMeals((v) => !v)}
                aria-expanded={showMeals}
              >
                {showMeals ? '− Hide' : '+ Add'} Meal Preferences
              </button>
            </div>

            {showMeals && (
              <MealSelector
                passengers={passengers}
                onSelectMeal={selectMeal}
              />
            )}

            <button
              className="confirm-btn"
              disabled={!passengers.some((p) => p.seatId)}
              onClick={handleConfirm}
            >
              Confirm Selection
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}
