# TRD — Flight Seat Selection & Passenger Management

## 1. Technical Approach
- **Application:** Frontend web application
- **Framework:** React.js
- **Build tool:** Vite
- **Language:** JavaScript (ES6+)
- **Styling:** CSS3 (responsive CSS; use the project's existing styling approach if already configured)
- **State:** React state (`useState` / `useReducer`); no external state library required
- **Data:** Local mock data; no backend or API required
- **Deployment:** Vercel or GitHub Pages

## 2. Suggested Project Structure
```text
src/
  components/
    PassengerSelector.jsx
    PassengerList.jsx
    AircraftLayoutSelector.jsx
    SeatMap.jsx
    Seat.jsx
    SeatLegend.jsx
    BookingSummary.jsx
  data/
    passengers.js
    seats.js
  hooks/
    useSeatSelection.js
  utils/
    pricing.js
    seatLayout.js
  App.jsx
  main.jsx
  styles/
    global.css
    components.css
```
Keep the existing repository structure if the project is already initialized; adapt these names rather than duplicating files.

## 3. Data Model

### Passenger
```js
{
  id: "P1",
  name: "Passenger 1",
  seatId: null,
  mealId: null // optional bonus
}
```

### Seat
```js
{
  id: "1A",
  row: 1,
  label: "A",
  layoutGroup: 1,
  category: "Standard", // Standard | Extra Legroom | Premium
  price: 0,
  status: "available" // available | occupied
}
```

Use deterministic mock data for both layouts. Include free seats and paid examples based on the assessment (for example ₹0, ₹250, ₹350). Keep occupied-seat status separate from passenger selection.

## 4. State Design
Maintain a single source of truth for:
- `passengers`: passenger records and their assigned seat IDs.
- `seats`: seat definitions, layout, prices, and occupied status.
- `activePassengerId`: currently selected passenger.
- `layoutType`: `3-2` or `2-3-2`.
- Optional `selectedMeals` or `mealId` per passenger if implementing the bonus.

Derive selected seats and total cost from state; do not store duplicate calculated totals.

## 5. Core Logic
1. **Passenger count:** create or remove passenger records to match the selected count. When reducing the count, safely release seats assigned to removed passengers.
2. **Seat selection:** accept a selection only when an active passenger exists and the seat is available or is already assigned to that same passenger.
3. **One seat per passenger:** when assigning a new seat, release the passenger's previous seat before assigning the new one.
4. **One passenger per seat:** reject a seat already assigned to another passenger or marked occupied.
5. **Remove assignment:** set the passenger's `seatId` to `null`.
6. **Layout switching:** render the selected configuration from its corresponding seat data. Preserve assignments only when the seat IDs remain valid; otherwise clear invalid assignments with clear user feedback. Never silently map a passenger to a different seat.
7. **Pricing:** `seatTotal = sum(price of each passenger's assigned seat)`. Recompute from current state after every assignment change.
8. **Optional meals:** `grandTotal = seatTotal + sum(selected paid meal prices)`.

## 6. Seat Map Rendering
- Render rows from structured seat data, not hard-coded repeated markup.
- Use layout-group/aisle metadata to create the correct aisle gaps.
- Display row numbers and seat labels.
- Apply distinct styles and accessible labels for available, occupied, selected, and free seats.
- Disable occupied seats and expose the price/category on hover, focus, or selection.
- Ensure selected state is tied to passenger assignments, not only to the currently active UI element.

## 7. Component Responsibilities
- `PassengerSelector`: passenger-count control.
- `PassengerList`: passenger switching and assigned-seat status.
- `AircraftLayoutSelector`: layout toggle.
- `SeatMap`: rows, aisle gaps, and seat rendering.
- `Seat`: individual seat state, category, and price.
- `SeatLegend`: explanation of visual states.
- `BookingSummary`: passenger assignments and total cost.

Keep components presentational where possible; centralize assignment rules in a hook or reducer.

## 8. Validation & Edge Cases
- No active passenger: prevent assignment and show a clear prompt.
- Occupied seat: prevent selection.
- Seat assigned to another passenger: prevent duplicate assignment.
- Passenger changes seat: release old seat and assign new seat atomically.
- Passenger removed: release their seat.
- Seat removed by layout change: clear the invalid assignment and notify the user.
- No assigned seats: show an empty summary and ₹0 total.
- Prevent negative or invalid prices; format currency using `Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" })`.

## 9. Quality Requirements
- Responsive layout for mobile, tablet, and desktop.
- Semantic buttons and accessible names/states for seat controls.
- Reusable components and meaningful names.
- No unnecessary dependencies or duplicated assignment logic.
- Handle empty and invalid states gracefully.
- Verify both layouts, passenger switching, seat conflicts, price updates, and seat removal manually.

## 10. Delivery
- Provide complete source code in GitHub.
- Deploy to Vercel or GitHub Pages.
- Add a README with setup instructions, state-management approach, seat-assignment rules, pricing calculation, and deployment URL.
