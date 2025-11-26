import { Store } from "@tanstack/store";
import type { BudgetState, Service } from "@/types";
import { APP_CONFIG, SERVICES_DATA } from "@/data/services";

// Initialize allocations with minCost for each service
const initialAllocations: Record<string, number> = {};
SERVICES_DATA.forEach((service) => {
  initialAllocations[service.id] = service.minCost;
});

export const budgetStore = new Store<BudgetState>({
  totalTaxInput: APP_CONFIG.fixedBudget,
  currencySymbol: APP_CONFIG.currencySymbol,
  allocations: initialAllocations,
  isFinalized: false,
});

// Get total budget (fixed)
export function getTotalBudget(): number {
  return APP_CONFIG.fixedBudget;
}

export function getTotalAllocated(state: BudgetState): number {
  return Object.values(state.allocations).reduce((sum, val) => sum + val, 0);
}

export function getRemainingFunds(state: BudgetState): number {
  return APP_CONFIG.fixedBudget - getTotalAllocated(state);
}

// Get allocation percentage for a service (0-1 within its min-max range)
export function getServiceAllocationPercentage(
  state: BudgetState,
  service: Service
): number {
  const allocation = state.allocations[service.id] || 0;
  if (service.maxCost <= 0) return 0;

  return Math.min(1, allocation / service.maxCost);
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

  return 0;
}

// Check if a service is at minimum (Tier 1 exactly)
export function isServiceAtMinimum(
  state: BudgetState,
  service: Service
): boolean {
  const allocation = state.allocations[service.id] || 0;
  return allocation === service.minCost;
}

// Get status description based on percentage
export function getStatusDescription(percentage: number): string {
  if (percentage <= 0.25) return "Minimum Viable";
  if (percentage <= 0.5) return "Basic Operations";
  if (percentage <= 0.75) return "Modernization";
  return "World Class";
}

// Actions
export function setTaxInput(amount: number): void {
  budgetStore.setState((state) => ({
    ...state,
    totalTaxInput: amount,
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
    // Find the service to get its minCost
    const service = SERVICES_DATA.find((s) => s.id === serviceId);
    if (!service) return state;

    const currentAllocation = state.allocations[serviceId] || 0;
    const remaining = getRemainingFunds(state);

    // Enforce minimum (cannot go below minCost)
    const minAllowed = service.minCost;
    
    // Calculate the maximum we can allocate (remaining + current allocation for this service)
    const maxAllowable = Math.min(
      service.maxCost,
      remaining + currentAllocation
    );

    // Clamp the amount between minCost and maxAllowable
    const clampedAmount = Math.max(minAllowed, Math.min(amount, maxAllowable));

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
    totalTaxInput: APP_CONFIG.fixedBudget,
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
    debt: {
      name: "The Fiscal Hawk",
      description: "You prioritize financial stability and debt reduction above all.",
      emoji: "🦅",
    },
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
