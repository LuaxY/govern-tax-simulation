import { Store } from "@tanstack/store";
import type { BudgetState, Service } from "@/types";
import { APP_CONFIG, SERVICES_DATA } from "@/data/services";

// Initialize allocations with 0 for each service
const initialAllocations: Record<string, number> = {};
SERVICES_DATA.forEach((service) => {
  initialAllocations[service.id] = 0;
});

export const budgetStore = new Store<BudgetState>({
  totalTaxInput: 0,
  currencySymbol: APP_CONFIG.currencySymbol,
  allocations: initialAllocations,
  isFinalized: false,
});

// Derived values - computed from store state
export function getSpendableBudget(state: BudgetState): number {
  return state.totalTaxInput * (1 - APP_CONFIG.bureaucracyTaxRate);
}

export function getTotalAllocated(state: BudgetState): number {
  return Object.values(state.allocations).reduce((sum, val) => sum + val, 0);
}

export function getRemainingFunds(state: BudgetState): number {
  return getSpendableBudget(state) - getTotalAllocated(state);
}

export function getBureaucracyCost(state: BudgetState): number {
  return state.totalTaxInput * APP_CONFIG.bureaucracyTaxRate;
}

// Get allocation percentage for a service (0-1 within its min-max range)
export function getServiceAllocationPercentage(
  state: BudgetState,
  service: Service
): number {
  const spendable = getSpendableBudget(state);
  if (spendable <= 0) return 0;

  const allocation = state.allocations[service.id] || 0;
  const maxAllocationForService = spendable * service.maxCost;

  return Math.min(1, allocation / maxAllocationForService);
}

// Get the current tier level for a service (0-4)
export function getServiceTierLevel(
  state: BudgetState,
  service: Service
): number {
  const percentage = getServiceAllocationPercentage(state, service);

  // Check thresholds from highest to lowest
  for (let i = service.tiers.length - 1; i >= 0; i--) {
    if (percentage >= service.tiers[i].threshold) {
      return service.tiers[i].level;
    }
  }

  // Check for collapse (below minimum)
  const spendable = getSpendableBudget(state);
  const allocation = state.allocations[service.id] || 0;
  const minRequired = spendable * service.minCost;

  if (allocation < minRequired && allocation > 0) {
    return 0; // Collapse state
  }

  return 0;
}

// Check if a service is in collapse state
export function isServiceCollapsed(
  state: BudgetState,
  service: Service
): boolean {
  const spendable = getSpendableBudget(state);
  if (spendable <= 0) return false;

  const allocation = state.allocations[service.id] || 0;
  const minRequired = spendable * service.minCost;

  // Collapsed if allocated something but less than minimum
  return allocation > 0 && allocation < minRequired;
}

// Get status description based on percentage
export function getStatusDescription(percentage: number): string {
  if (percentage <= 0.1) return "Critical Failure";
  if (percentage <= 0.4) return "Basic Maintenance";
  if (percentage <= 0.7) return "Modernization";
  return "World Class";
}

// Actions
export function setTaxInput(amount: number): void {
  budgetStore.setState((state) => ({
    ...state,
    totalTaxInput: amount,
    allocations: { ...initialAllocations }, // Reset allocations when tax input changes
    isFinalized: false,
  }));
}

export function setCurrencySymbol(symbol: string): void {
  budgetStore.setState((state) => ({
    ...state,
    currencySymbol: symbol,
  }));
}

export function updateAllocation(serviceId: string, amount: number): void {
  budgetStore.setState((state) => {
    const currentAllocation = state.allocations[serviceId] || 0;
    const remaining = getRemainingFunds(state);

    // Calculate the maximum we can allocate (remaining + current allocation for this service)
    const maxAllowable = remaining + currentAllocation;

    // Clamp the amount to not exceed remaining funds
    const clampedAmount = Math.max(0, Math.min(amount, maxAllowable));

    return {
      ...state,
      allocations: {
        ...state.allocations,
        [serviceId]: clampedAmount,
      },
    };
  });
}

export function finalizeBudget(): void {
  budgetStore.setState((state) => ({
    ...state,
    isFinalized: true,
  }));
}

export function resetBudget(): void {
  budgetStore.setState(() => ({
    totalTaxInput: 0,
    currencySymbol: APP_CONFIG.currencySymbol,
    allocations: { ...initialAllocations },
    isFinalized: false,
  }));
}

// Get political archetype based on allocations
export function getPoliticalArchetype(
  state: BudgetState
): { id: string; name: string; description: string; emoji: string } | null {
  const allocations = state.allocations;
  let maxId = "";
  let maxAmount = 0;

  Object.entries(allocations).forEach(([id, amount]) => {
    if (amount > maxAmount) {
      maxAmount = amount;
      maxId = id;
    }
  });

  if (!maxId || maxAmount === 0) return null;

  const archetypes: Record<
    string,
    { name: string; description: string; emoji: string }
  > = {
    health: {
      name: "The Humanitarian",
      description: "You prioritize the health and wellbeing of all citizens.",
      emoji: "❤️",
    },
    infrastructure: {
      name: "The Builder",
      description:
        "You believe in connecting and empowering through infrastructure.",
      emoji: "🏗️",
    },
    defense: {
      name: "The Guardian",
      description: "Security and protection are your primary concerns.",
      emoji: "🛡️",
    },
    education: {
      name: "The Visionary",
      description: "You invest in the future through knowledge and innovation.",
      emoji: "🎓",
    },
    environment: {
      name: "The Naturalist",
      description: "You champion the planet and sustainable living.",
      emoji: "🌳",
    },
    social: {
      name: "The Caretaker",
      description: "You ensure no citizen is left behind in society.",
      emoji: "🤝",
    },
    governance: {
      name: "The Diplomat",
      description: "You value efficient governance and global cooperation.",
      emoji: "🏛️",
    },
  };

  return archetypes[maxId]
    ? { id: maxId, ...archetypes[maxId] }
    : { id: maxId, name: "The Balanced", description: "You seek equilibrium across all sectors.", emoji: "⚖️" };
}

