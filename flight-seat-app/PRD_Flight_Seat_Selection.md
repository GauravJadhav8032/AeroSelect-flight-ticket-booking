# PRD — Flight Seat Selection & Passenger Management

## 1. Product Overview
Build a responsive flight seat-selection web application that lets users choose passengers, explore aircraft seating layouts, assign seats, and view the total seat-selection cost.

## 2. Objective
Deliver an intuitive, reliable seat-selection experience that demonstrates passenger management, dynamic seat assignment, pricing calculations, and responsive UI. This is a frontend-only assessment; no real booking or backend integration is required.

## 3. Target User
A traveler selecting seats for one or more passengers before a flight.

## 4. Core User Flow
1. Choose the number of passengers.
2. View the generated passenger list and select a passenger.
3. Choose an aircraft layout: **3–2** or **2–3–2**.
4. Review seat availability, category, and price.
5. Select an available seat for the active passenger.
6. Switch passengers, retaining previous assignments.
7. Change or remove a passenger's seat when needed.
8. Review each passenger's seat and the automatically updated total.

## 5. Functional Requirements

### Passenger Management
- Allow selection of passenger count.
- Generate one passenger entry per passenger, using clear identifiers (for example, Passenger 1).
- Allow switching the active passenger.
- Show each passenger's assigned seat.
- Each passenger can hold at most one seat.

### Seat Map
- Support 3–2 and 2–3–2 configurations and allow switching between them.
- Display row numbers, seat labels, aisle gaps, and seat categories.
- Show distinct states: available, occupied, selected, and free.
- Occupied seats cannot be selected.
- Show the seat category and price.
- Include a useful mix of free and paid seats.

### Seat Assignment
- Require an active passenger before assigning a seat.
- Assign a clicked available seat to the active passenger.
- Prevent duplicate seat assignments.
- Preserve assignments when switching passengers.
- Allow changing or removing an assigned seat.

### Pricing
- Show each passenger's selected seat and price.
- Calculate the sum of all assigned-seat prices.
- Recalculate immediately after selection, replacement, or removal.

### Optional Bonus
- Provide one meal choice per passenger, including free and paid options.
- Include meal charges in the final total only if meal selection is implemented.

## 6. UI/UX Requirements
- Clean, modern, accessible, and responsive interface.
- Consistent visual legend for seat states and pricing categories.
- Clear active-passenger indicator and booking summary.
- Helpful feedback for unavailable seats or invalid actions.
- Layout should remain usable on mobile, tablet, and desktop.

## 7. Out of Scope
- Authentication, APIs, database, payment, flight search, real-time inventory, and actual ticket booking.
- Backend integration is not required; use local mock data and frontend state.

## 8. Acceptance Criteria
- User can switch between both required aircraft layouts.
- Passenger count controls the passenger list.
- A passenger can be assigned no more than one seat.
- A seat can belong to no more than one passenger.
- Occupied seats are not selectable.
- Passenger assignments persist while switching passengers.
- Seat changes/removals update the passenger summary and total immediately.
- UI works without runtime errors at common screen sizes.

## 9. Success Measures
The solution satisfies the assessment's functional requirements, demonstrates clear UX and reusable components, handles assignment edge cases, and is deployable with a concise README explaining the state and assignment logic.
