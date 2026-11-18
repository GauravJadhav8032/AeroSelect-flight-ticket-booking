# ✦ AeroSelect — Flight Seat Selection

A premium, minimalist flight seat-selection web application built with **React 19**, **Vite 8**, and plain **CSS3**. No external UI libraries. No backend.

---

## ✈ Live Demo

> Deploy to Vercel or GitHub Pages (see [Deployment](#deployment) below).

---

## 🚀 Setup

```bash
# 1. Enter the project folder
cd flight-seat-app

# 2. Install dependencies (use --legacy-peer-deps for Vite 8 compatibility)
npm install --legacy-peer-deps

# 3. Start the development server
npm run dev
# → http://localhost:5173

# 4. Run automated test suite (15 unit & integration tests)
npm test

# 5. Production build
npm run build

# 6. Preview production build locally
npm run preview
```

---

## 🗂 Project Structure

```
src/
├── components/
│   ├── PassengerSelector.jsx   – Passenger count ± control
│   ├── PassengerList.jsx       – Passenger cards; seat status; active switcher
│   ├── AircraftLayoutSelector.jsx – 3-2 / 2-3-2 toggle
│   ├── SeatMap.jsx             – Row/aisle grid renderer
│   ├── Seat.jsx                – Individual seat button (all 5 states)
│   ├── SeatLegend.jsx          – Visual key for seat states
│   ├── BookingSummary.jsx      – Per-passenger summary + running totals
│   ├── MealSelector.jsx        – Optional meal picker per passenger
│   └── Notification.jsx        – Ephemeral toast alerts
├── data/
│   └── seats.js                – Deterministic mock seat data for both layouts; meal list
├── hooks/
│   └── useSeatSelection.js     – Central state & all assignment logic
├── utils/
│   ├── pricing.js              – formatINR, calcSeatTotal, calcMealTotal
│   └── seatLayout.js           – organizeByRows; getLayoutLabels
└── styles/
    ├── global.css              – CSS custom properties, reset, typography, shell
    └── components.css          – Component-level styles, seat states, responsive breakpoints
```

---

## 🧠 State Management

All mutable state lives in a single custom hook **`useSeatSelection`** (`src/hooks/useSeatSelection.js`). No external state library is used.

| State field          | Type            | Purpose                                         |
|----------------------|-----------------|-------------------------------------------------|
| `passengers`         | `Passenger[]`   | Names, assigned `seatId`, optional `mealId`     |
| `passengerCount`     | `number`        | Controls list length (1–9)                      |
| `activePassengerId`  | `string`        | Which passenger receives the next seat click    |
| `layoutType`         | `'3-2'│'2-3-2'` | Active aircraft configuration                   |
| `seats32` / `seats232` | `Seat[]`     | Frozen mock data for each layout (never mutated) |
| `notification`       | `object│null`   | Toast message shown for 3 seconds               |

**Derived values** (computed on every render from the above, never stored):

- `seatMap` — `Map<seatId, Seat>` for O(1) lookups  
- `assignedSeatMap` — `Map<seatId, passengerId>` for conflict detection  
- `seatTotal`, `mealTotal`, `grandTotal` — recalculated via `useMemo`

---

## 🎯 Seat Assignment Rules

1. **Active passenger required** — clicking a seat with no active passenger shows an error toast.  
2. **One seat per passenger** — assigning a new seat automatically releases the old one (atomic swap: `seatId` is overwritten in a single `setPassengers` call).  
3. **One passenger per seat** — before assigning, `assignedSeatMap` is checked; a conflict shows a toast and aborts.  
4. **Occupied seats** — seats with `status: 'occupied'` are `disabled` and visually distinct; clicking is impossible.  
5. **Deselect** — clicking the seat you already own toggles it off (`seatId → null`).  
6. **Remove button** — the × button in the passenger list sets `seatId: null` for that passenger.  
7. **Passenger removed** — reducing the count with `updatePassengerCount` slices the array; removed passengers' seats are automatically freed (no orphan references).  
8. **Layout switch** — seats are keyed by ID (`1A`, `2B`, …). IDs that exist in both layouts (most standard ones) are preserved. Seats valid only in the 2-3-2 layout (e.g., `1F`, `1G`) are cleared with a toast warning when switching to 3-2.

---

## 💰 Pricing Calculation

```
seatTotal  = Σ seat.price  for every passenger with an assigned seat
mealTotal  = Σ meal.price  for every passenger with a paid meal selected
grandTotal = seatTotal + mealTotal
```

Prices are formatted with `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })`.

| Category      | Price  |
|---------------|--------|
| Standard (window/middle) | ₹0 (Free) |
| Standard (aisle) | ₹250 |
| Extra Legroom  | ₹500  |
| Premium (rows 1–3) | ₹800  |

---

## 🛩 Aircraft Layouts

### 3-2 Narrow-body (20 rows × 5 seats = 100 seats)
```
Row  [ A  B  C ] | [ D  E ]
```
- Groups 1 (A B C) and 2 (D E) separated by an aisle

### 2-3-2 Wide-body (20 rows × 7 seats = 140 seats)
```
Row  [ A  B ] | [ C  D  E ] | [ F  G ]
```
- Groups 1, 2, 3 separated by two aisles

Both layouts are generated deterministically from `src/data/seats.js` with a fixed set of occupied seats, ensuring consistent, testable behavior.

---

## 🌐 Deployment

### Vercel (recommended)
```bash
npm i -g vercel
vercel --cwd flight-seat-app
```

### GitHub Pages
```bash
# In vite.config.js, add: base: '/your-repo-name/'
npm run build
# Push dist/ to gh-pages branch or use the peaceiris/actions-gh-pages action
```

---

## ♿ Accessibility

- All seat buttons have `aria-label` with seat ID, category, price, and state.
- Passenger list uses `aria-pressed` on active passenger.
- Notifications use `role="alert"` with `aria-live="assertive"`.
- Seat map uses `role="grid"` and `role="row"`.
- Occupied/assigned-other seats are `disabled` (not just styled).

---

## 🎨 Design System

| Token              | Value           | Usage                   |
|--------------------|-----------------|-------------------------|
| `--ivory`          | `#F5F2ED`       | Page background          |
| `--charcoal`       | `#2C2825`       | Primary text, header     |
| `--bronze`         | `#9B7E5A`       | Accent, prices           |
| `--stone`          | `#9A9189`       | Secondary text           |
| `--seat-selected`  | `#2C2825`       | Selected seat fill       |
| `--seat-free`      | `#D4EAD4`       | Free-seat fill           |
| `--seat-premium-bg`| `#EDE2D4`       | Premium cabin tint       |

Typography: **Inter** (UI) + **Playfair Display** (headings/brand) via Google Fonts.
