import { Store } from "@tanstack/store";
import type { BudgetState, Service } from "@/types";
import { APP_CONFIG, SERVICES_DATA } from "@/data/services";

// Initialize allocations with minCost for each service
const initialAllocations: Record<string, number> = {};
SERVICES_DATA.forEach((service) => {
  initialAllocations[service.id] = service.minCost;
});

// Initialize sub-allocations based on service allocations and default percentages
function initializeSubAllocations(
  allocations: Record<string, number>
): Record<string, Record<string, number>> {
  const subAllocations: Record<string, Record<string, number>> = {};

  SERVICES_DATA.forEach((service) => {
    if (service.subServices && service.subServices.length > 0) {
      const serviceAllocation = allocations[service.id] || 0;
      subAllocations[service.id] = {};

      service.subServices.forEach((subService) => {
        subAllocations[service.id][subService.id] =
          serviceAllocation * subService.defaultPercentage;
      });
    }
  });

  return subAllocations;
}

const initialSubAllocations = initializeSubAllocations(initialAllocations);

export const budgetStore = new Store<BudgetState>({
  totalTaxInput: APP_CONFIG.fixedBudget,
  currencySymbol: APP_CONFIG.currencySymbol,
  allocations: initialAllocations,
  subAllocations: initialSubAllocations,
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

    // Proportionally adjust sub-allocations when parent allocation changes
    let newSubAllocations = { ...state.subAllocations };
    if (service.subServices && service.subServices.length > 0) {
      const currentSubAllocs = state.subAllocations[serviceId] || {};
      const currentTotal = Object.values(currentSubAllocs).reduce((sum, v) => sum + v, 0);
      
      if (currentTotal > 0) {
        // Scale proportionally
        const scale = clampedAmount / currentTotal;
        newSubAllocations[serviceId] = {};
        for (const [subId, subAmount] of Object.entries(currentSubAllocs)) {
          newSubAllocations[serviceId][subId] = subAmount * scale;
        }
      } else {
        // Initialize with defaults if no current sub-allocations
        newSubAllocations[serviceId] = {};
        service.subServices.forEach((sub) => {
          newSubAllocations[serviceId][sub.id] = clampedAmount * sub.defaultPercentage;
        });
      }
    }

    return {
      ...state,
      allocations: {
        ...state.allocations,
        [serviceId]: clampedAmount,
      },
      subAllocations: newSubAllocations,
    };
  });
}

// Update a sub-allocation within a service
export function updateSubAllocation(
  serviceId: string,
  subServiceId: string,
  amount: number
): void {
  budgetStore.setState((state) => {
    const service = SERVICES_DATA.find((s) => s.id === serviceId);
    if (!service || !service.subServices) return state;

    const parentAllocation = state.allocations[serviceId] || 0;
    const currentSubAllocs = state.subAllocations[serviceId] || {};
    
    // Find the target sub-service to get its minimum
    const targetSubService = service.subServices.find((s) => s.id === subServiceId);
    if (!targetSubService) return state;

    // Calculate minimum amount for this sub-service
    const minAmount = parentAllocation * targetSubService.minPercentage;
    
    // Calculate the sum of minimum amounts for OTHER sub-services
    const otherMinTotal = service.subServices
      .filter((s) => s.id !== subServiceId)
      .reduce((sum, s) => sum + parentAllocation * s.minPercentage, 0);
    
    // Maximum this sub-service can have is parent - sum of other minimums
    const maxAmount = parentAllocation - otherMinTotal;
    
    // Clamp the requested amount between min and max
    const clampedAmount = Math.max(minAmount, Math.min(amount, maxAmount));

    // Remaining budget for other sub-services
    const remainingForOthers = parentAllocation - clampedAmount;
    
    // Calculate current total for other sub-services (excluding target)
    const otherCurrentTotal = Object.entries(currentSubAllocs)
      .filter(([id]) => id !== subServiceId)
      .reduce((sum, [, val]) => sum + val, 0);

    // Distribute remaining to other sub-services proportionally, respecting minimums
    const newSubAllocs: Record<string, number> = {};
    newSubAllocs[subServiceId] = clampedAmount;
    
    if (otherCurrentTotal > 0) {
      // First pass: calculate proportional amounts
      const proportionalAmounts: Record<string, number> = {};
      let totalProportional = 0;
      
      for (const sub of service.subServices) {
        if (sub.id === subServiceId) continue;
        const currentVal = currentSubAllocs[sub.id] || 0;
        const proportion = currentVal / otherCurrentTotal;
        const proposed = remainingForOthers * proportion;
        proportionalAmounts[sub.id] = proposed;
        totalProportional += proposed;
      }
      
      // Second pass: enforce minimums and redistribute excess
      let deficit = 0;
      let surplus = 0;
      const aboveMinimum: string[] = [];
      
      for (const sub of service.subServices) {
        if (sub.id === subServiceId) continue;
        const minVal = parentAllocation * sub.minPercentage;
        const proposed = proportionalAmounts[sub.id];
        
        if (proposed < minVal) {
          deficit += minVal - proposed;
          newSubAllocs[sub.id] = minVal;
        } else {
          aboveMinimum.push(sub.id);
          surplus += proposed - minVal;
          newSubAllocs[sub.id] = proposed;
        }
      }
      
      // If there's a deficit, take from those above minimum proportionally
      if (deficit > 0 && surplus > 0) {
        for (const subId of aboveMinimum) {
          const sub = service.subServices.find((s) => s.id === subId)!;
          const minVal = parentAllocation * sub.minPercentage;
          const excess = newSubAllocs[subId] - minVal;
          const reduction = (excess / surplus) * deficit;
          newSubAllocs[subId] = Math.max(minVal, newSubAllocs[subId] - reduction);
        }
      }
    } else {
      // If others are zero, distribute remaining proportionally to their defaults (above min)
      const otherSubs = service.subServices.filter((s) => s.id !== subServiceId);
      const totalDefaultPercentage = otherSubs.reduce((sum, s) => sum + s.defaultPercentage, 0);
      
      for (const sub of otherSubs) {
        const proportion = sub.defaultPercentage / totalDefaultPercentage;
        const proposed = remainingForOthers * proportion;
        const minVal = parentAllocation * sub.minPercentage;
        newSubAllocs[sub.id] = Math.max(minVal, proposed);
      }
    }

    return {
      ...state,
      subAllocations: {
        ...state.subAllocations,
        [serviceId]: newSubAllocs,
      },
    };
  });
}

// Get sub-allocation percentage within parent (0-1)
export function getSubAllocationPercentage(
  state: BudgetState,
  serviceId: string,
  subServiceId: string
): number {
  const parentAllocation = state.allocations[serviceId] || 0;
  if (parentAllocation <= 0) return 0;

  const subAmount = state.subAllocations[serviceId]?.[subServiceId] || 0;
  return subAmount / parentAllocation;
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
    subAllocations: initializeSubAllocations(initialAllocations),
    isFinalized: false,
  }));
}

// Set allocations with corresponding sub-allocations (used by distribute/randomize)
export function setAllocationsWithSubAllocations(
  newAllocations: Record<string, number>
): void {
  budgetStore.setState((state) => ({
    ...state,
    allocations: newAllocations,
    subAllocations: initializeSubAllocations(newAllocations),
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
