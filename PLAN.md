# Plan: The People's Ledger (MVP)

## 1. Project Initialization & Configuration

- [ ] Initialize Vite project with React + TypeScript.
- [ ] Configure Tailwind CSS and install `lucide-react`, `framer-motion`, `clsx`, `tailwind-merge`.
- [ ] Install TanStack dependencies: `@tanstack/react-router`, `@tanstack/store`, `@tanstack/react-store`.
- [ ] Initialize Shadcn UI (CLI) and add base components (Button, Input, Slider, Card, Toast/Tooltip).
- [ ] Set up project structure: `src/{routes,components,store,data,lib}`.

## 2. State Management & Data Model

- [ ] Create `src/types/index.ts` to define `Service`, `Tier`, and `BudgetState` interfaces.
- [ ] Create `src/data/services.ts` with initial mock data for categories (Health, Defense, Infrastructure, etc.) including tiers and thresholds.
- [ ] Implement `src/store/budgetStore.ts` using TanStack Store:
    - **State**: `totalTaxInput`, `allocations` (map/object), `bureaucracyOverhead` (const), `remainingFunds` (derived).
    - **Actions**: `setTaxInput`, `updateAllocation(serviceId, amount)`, `finalizeBudget`.
    - **Logic**: Ensure `remainingFunds` calculation accounts for overhead.

## 3. Routing & Core Layout

- [ ] Configure TanStack Router in `src/main.tsx` and `src/routes`.
- [ ] Create `src/routes/__root.tsx`:
    - Implement the Main Layout.
    - Include the **Sticky Top Bar** (`WalletBar`) component which persists across Dashboard and Result.
- [ ] Create route placeholders:
    - `src/routes/index.tsx` (Setup/Input).
    - `src/routes/dashboard.tsx` (Main Simulation).
    - `src/routes/result.tsx` (Final Profile).

## 4. Phase 1: The Setup (Input)

- [ ] Implement `src/routes/index.tsx`:
    - Minimalist landing page.
    - Numerical input for "Income Tax Paid".
    - "Start Simulation" button that updates store and navigates to `/dashboard`.
    - Optional: Simple currency selector (stored in state).

## 5. Phase 2: The Dashboard (Simulation)

- [ ] Create `src/components/layout/WalletBar.tsx`:
    - Display `Remaining Funds` with count-up/down animation.
    - Change color (Green/Yellow/Red) based on funds.
- [ ] Create `src/components/dashboard/ServiceCard.tsx`:
    - **Props**: `service` object.
    - **UI**: Header (Icon+Name), Progress Track (visual tiers), Slider input.
    - **Interaction**:
        - Update store allocation on slider change.
        - Prevent increasing if `remainingFunds <= 0` (clamping logic).
    - **Feedback**:
        - Liquid fill animation using Framer Motion (height/width based on %).
        - Dynamic text description based on % (Critical -> World Class).
- [ ] Implement `src/routes/dashboard.tsx`:
    - Render grid of `ServiceCard`s connected to the store.
    - Mobile: Bottom drawer or collapsible panel for status.
    - Desktop: Side panel for status summary.

## 6. Phase 3: Gamification & Result

- [ ] Enhance `ServiceCard.tsx`:
    - **Tier Unlocking**: Visual feedback (icon burst/glow) when crossing thresholds.
    - **Loss Aversion**: Visual cues (cracks/gray out) when dropping below thresholds.
    - Implement Tooltips/Toasts for "Unlocked: [Perk Name]" events.
- [ ] Implement `src/routes/result.tsx`:
    - Calculate "Political Archetype" based on highest allocation categories.
    - Display "Profile Card" with Maxed Perks and Collapsed Sectors.
    - "Restart" button.

## 7. Polish & UX

- [ ] Add "Impact Modal" or overlay for major achievements (Tier 4 unlocks).
- [ ] Refine responsive design (mobile-first grid).
- [ ] Add sound effect placeholders (optional, helper functions).