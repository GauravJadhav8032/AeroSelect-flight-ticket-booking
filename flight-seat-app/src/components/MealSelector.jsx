import React from 'react';
import { MEALS } from '../data/seats';
import { formatINRAlways } from '../utils/pricing';

export default function MealSelector({ passengers, onSelectMeal }) {
  return (
    <div className="meal-selector">
      <div className="section-label">Meal Preferences</div>
      <p className="meal-hint">Optional — add a meal for each passenger</p>
      <div className="meal-pax-list">
        {passengers.map((p) => (
          <div key={p.id} className="meal-pax-row">
            <div className="meal-pax-name">{p.name}</div>
            <div className="meal-options">
              {MEALS.map((meal) => {
                const isSelected = p.mealId === meal.id || (!p.mealId && meal.id === 'none');
                return (
                  <button
                    key={meal.id}
                    className={`meal-option ${isSelected ? 'meal-selected' : ''}`}
                    onClick={() => onSelectMeal(p.id, meal.id === 'none' ? null : meal.id)}
                    aria-pressed={isSelected}
                    aria-label={`${meal.name}, ${meal.price === 0 ? 'Free' : formatINRAlways(meal.price)}`}
                    title={meal.description}
                  >
                    <span className="meal-icon">{meal.icon}</span>
                    <span className="meal-name">{meal.name}</span>
                    <span className="meal-price">
                      {meal.price === 0 ? 'Free' : formatINRAlways(meal.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
