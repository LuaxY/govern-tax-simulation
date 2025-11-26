
# 📁 Project Specification: "The People's Ledger"
**Type:** Interactive Web Simulation / Gamified Dashboard
**Core Concept:** A "Civilization Skill Tree" where users allocate their real-world tax payments to unlock societal perks.

## 1. Core Architecture & Data Model

### A. Global State Management
The application relies on a central "Budget State" that updates in real-time.
*   **`totalTaxInput`**: (Float) The user's input (e.g., 15,000).
*   **`bureaucracyOverhead`**: (Const) Fixed % (e.g., 5%) removed immediately for "Admin Costs."
*   **`spendableBudget`**: `totalTaxInput` - `bureaucracyOverhead`.
*   **`remainingFunds`**: The dynamic pool of money left to allocate.
*   **`allocations`**: Object tracking the current spend per category.

### B. The "Service" Object Structure
Every service (e.g., Health, Defense) must follow this strict schema:
*   **`id`**: string (e.g., "health_services")
*   **`name`**: string
*   **`minCostPercent`**: float (The minimum % required to avoid collapse)
*   **`maxCostPercent`**: float (The amount required to unlock the final tier)
*   **`currentAllocation`**: float (User's current spend)
*   **`tiers`**: Array of objects [Level 1, Level 2, Level 3, Level 4]
    *   *Each Tier contains:* `thresholdCost`, `title`, `description`, `icon`, `isUnlocked` (boolean).

---

## 2. User Experience Flow (The "Game Loop")

### Phase 1: The Setup (Input)
*   **UI:** Minimalist landing page.
*   **Input:** A single numerical input field: *"Enter your total Income Tax paid last year."*
*   **Optional Input:** Currency Selector (€, $, £) + Country Selector (adjusts default presets).
*   **Action:** User clicks "Start Simulation."
*   **Transition:** An animation of the money filling a "Digital Wallet."

### Phase 2: The Dashboard (The Main Interface)
*   **Layout:**
    *   **Top Bar (Sticky):** Shows `Remaining Funds`. Changes color (Green > Yellow > Red) as funds deplete.
    *   **Main Grid:** A grid of "Service Cards" (Health, Infrastructure, Defense, etc.).
    *   **Side Panel (Desktop) / Bottom Drawer (Mobile):** "Society Status" (Shows warnings or achievements).

### Phase 3: The Allocation Mechanic (Gamification)
This is the core interactive element.
*   **The Input Mechanism:** A slider on each card.
*   **The Visual Feedback:** As the slider moves right:
    1.  Money subtracts from the Global Top Bar.
    2.  A "Liquid fill" animation rises inside the card.
    3.  **Tier Unlocking:** The liquid passes markers (locks). When a marker is passed:
        *   **Animation:** The lock bursts/transforms into a colored icon.
        *   **Effect:** A tooltip/toast pops up: *"Unlocked: Free Dental Care!"*
*   **The Constraint:** The user cannot drag a slider further if `remainingFunds` is 0. They must reduce another category first.

### Phase 4: The Result (Impact)
*   **Trigger:** User clicks "Finalize Budget" (only enabled if `remainingFunds` ≈ 0).
*   **Output:** A generated "Profile Card" displaying:
    *   Their Political Archetype (calculated based on highest spend).
    *   List of "Maxed Out" perks.
    *   List of "Collapsed" sectors (if any).

---

## 3. Gamification Logic & Rules

### A. The "Tier" System (Kickstarter Logic)
Each category has 4 Tiers.
*   **Tier 0 (Collapse):** If allocation < `minCostPercent`.
    *   *UI:* Card turns gray/red. Icon shows a "Warning" symbol.
*   **Tier 1 (Survival):** Basic functionality.
*   **Tier 2 (Standard):** Good service.
*   **Tier 3 (Advanced):** Great service.
*   **Tier 4 (Utopia):** Maximum perks unlocked.

### B. Loss Aversion (Psychology)
If a user drags a slider *backwards* (reducing funding):
*   If they cross a Tier threshold downwards:
    *   **UI:** The icon turns gray/cracks.
    *   **Feedback:** A small "break" sound or red flash.
    *   **Tooltip:** *"Perk Lost: High Speed Rail disabled."*

### C. Dynamic Text Updates
The description text on the card must change dynamically based on the slider position.
*   *0-10%:* "Critical Failure"
*   *11-40%:* "Basic Maintenance"
*   *41-70%:* "Modernization"
*   *71-100%:* "World Class"

---

## 4. UI/UX Components Specification

### The "Service Card" Component
*   **Header:** Icon + Category Name.
*   **The Progress Track:** A horizontal bar with 4 notches (the Tiers).
*   **The Slider:** Smooth drag handle.
*   **The Perk Display:**
    *   Below the slider, display the *current* active Tier Name (e.g., "Tier 3: The Knowledge Economy").
    *   Show the *next* Tier ghosted out (incentive to spend more).

### The "Wallet" Component (Top Bar)
*   Must use a "Count Up/Count Down" animation library.
*   If `Remaining Funds` < 0: Shake animation and turn Text Red.

### The "Impact" Modal
*   When a user unlocks a Tier 3 or Tier 4 perk, a confetti effect or a distinct "Level Up" glow should occur around that card.
