import { Store } from "@tanstack/store";
import {
  APP_CONFIG,
  ARCHETYPES,
  COMPOUND_ARCHETYPES,
  POLICY_TRAITS,
  type PolicyTrait,
  SERVICES_DATA,
} from "@/data/services";
import type { BudgetState, Service } from "@/types";

// Initialize allocations with minCost for each service
const initialAllocations: Record<string, number> = {};
for (const service of SERVICES_DATA) {
  initialAllocations[service.id] = service.minCost;
}

// Initialize sub-allocations based on service allocations and default percentages
function initializeSubAllocations(
  allocations: Record<string, number>
): Record<string, Record<string, number>> {
  const subAllocations: Record<string, Record<string, number>> = {};

  for (const service of SERVICES_DATA) {
    if (service.subServices && service.subServices.length > 0) {
      const serviceAllocation = allocations[service.id] || 0;
      subAllocations[service.id] = {};

      for (const subService of service.subServices) {
        subAllocations[service.id][subService.id] =
          serviceAllocation * subService.defaultPercentage;
      }
    }
  }

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
  if (service.maxCost <= 0) {
    return 0;
  }

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
  if (percentage <= 0.25) {
    return "Minimum Viable";
  }
  if (percentage <= 0.5) {
    return "Basic Operations";
  }
  if (percentage <= 0.75) {
    return "Modernization";
  }
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
    if (!service) {
      return state;
    }

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
    const newSubAllocations = { ...state.subAllocations };
    if (service.subServices && service.subServices.length > 0) {
      const currentSubAllocs = state.subAllocations[serviceId] || {};
      const currentTotal = Object.values(currentSubAllocs).reduce(
        (sum, v) => sum + v,
        0
      );

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
        for (const sub of service.subServices) {
          newSubAllocations[serviceId][sub.id] =
            clampedAmount * sub.defaultPercentage;
        }
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

type SubAllocationContext = {
  service: Service;
  subServiceId: string;
  parentAllocation: number;
  currentSubAllocs: Record<string, number>;
  remainingForOthers: number;
  newSubAllocs: Record<string, number>;
};

// Helper: Calculate proportional distribution for sub-services
function calculateProportionalAmounts(
  ctx: SubAllocationContext
): Record<string, number> {
  const proportionalAmounts: Record<string, number> = {};
  if (!ctx.service.subServices) {
    return proportionalAmounts;
  }

  const otherCurrentTotal = Object.entries(ctx.currentSubAllocs)
    .filter(([id]) => id !== ctx.subServiceId)
    .reduce((sum, [, val]) => sum + val, 0);

  for (const sub of ctx.service.subServices) {
    if (sub.id === ctx.subServiceId) {
      continue;
    }
    const currentVal = ctx.currentSubAllocs[sub.id] || 0;
    const proportion = currentVal / otherCurrentTotal;
    proportionalAmounts[sub.id] = ctx.remainingForOthers * proportion;
  }
  return proportionalAmounts;
}

// Helper: Distribute remaining budget to other sub-services with existing allocations
function distributeWithExistingAllocations(ctx: SubAllocationContext): void {
  if (!ctx.service.subServices) {
    return;
  }

  const proportionalAmounts = calculateProportionalAmounts(ctx);

  // Enforce minimums and track deficit/surplus
  let deficit = 0;
  let surplus = 0;
  const aboveMinimum: string[] = [];

  for (const sub of ctx.service.subServices) {
    if (sub.id === ctx.subServiceId) {
      continue;
    }
    const minVal = ctx.parentAllocation * sub.minPercentage;
    const proposed = proportionalAmounts[sub.id];

    if (proposed < minVal) {
      deficit += minVal - proposed;
      ctx.newSubAllocs[sub.id] = minVal;
    } else {
      aboveMinimum.push(sub.id);
      surplus += proposed - minVal;
      ctx.newSubAllocs[sub.id] = proposed;
    }
  }

  // Redistribute deficit from those above minimum
  if (deficit > 0 && surplus > 0) {
    for (const subId of aboveMinimum) {
      const sub = ctx.service.subServices.find((s) => s.id === subId);
      if (!sub) {
        continue;
      }
      const minVal = ctx.parentAllocation * sub.minPercentage;
      const excess = ctx.newSubAllocs[subId] - minVal;
      const reduction = (excess / surplus) * deficit;
      ctx.newSubAllocs[subId] = Math.max(
        minVal,
        ctx.newSubAllocs[subId] - reduction
      );
    }
  }
}

// Helper: Distribute remaining budget based on default percentages
function distributeWithDefaults(ctx: SubAllocationContext): void {
  if (!ctx.service.subServices) {
    return;
  }

  const otherSubs = ctx.service.subServices.filter(
    (s) => s.id !== ctx.subServiceId
  );
  const totalDefaultPercentage = otherSubs.reduce(
    (sum, s) => sum + s.defaultPercentage,
    0
  );

  for (const sub of otherSubs) {
    const proportion = sub.defaultPercentage / totalDefaultPercentage;
    const proposed = ctx.remainingForOthers * proportion;
    const minVal = ctx.parentAllocation * sub.minPercentage;
    ctx.newSubAllocs[sub.id] = Math.max(minVal, proposed);
  }
}

// Update a sub-allocation within a service
export function updateSubAllocation(
  serviceId: string,
  subServiceId: string,
  amount: number
): void {
  budgetStore.setState((state) => {
    const service = SERVICES_DATA.find((s) => s.id === serviceId);
    if (!service?.subServices) {
      return state;
    }

    const parentAllocation = state.allocations[serviceId] || 0;
    const currentSubAllocs = state.subAllocations[serviceId] || {};

    const targetSubService = service.subServices.find(
      (s) => s.id === subServiceId
    );
    if (!targetSubService) {
      return state;
    }

    // Calculate bounds for this sub-service
    const minAmount = parentAllocation * targetSubService.minPercentage;
    const otherMinTotal = service.subServices
      .filter((s) => s.id !== subServiceId)
      .reduce((sum, s) => sum + parentAllocation * s.minPercentage, 0);
    const maxAmount = parentAllocation - otherMinTotal;
    const clampedAmount = Math.max(minAmount, Math.min(amount, maxAmount));

    const remainingForOthers = parentAllocation - clampedAmount;
    const otherCurrentTotal = Object.entries(currentSubAllocs)
      .filter(([id]) => id !== subServiceId)
      .reduce((sum, [, val]) => sum + val, 0);

    const newSubAllocs: Record<string, number> = {};
    newSubAllocs[subServiceId] = clampedAmount;

    const ctx: SubAllocationContext = {
      service,
      subServiceId,
      parentAllocation,
      currentSubAllocs,
      remainingForOthers,
      newSubAllocs,
    };

    if (otherCurrentTotal > 0) {
      distributeWithExistingAllocations(ctx);
    } else {
      distributeWithDefaults(ctx);
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
  if (parentAllocation <= 0) {
    return 0;
  }

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

// Threshold for considering two services "close" in spending (within 20%)
const COMPOUND_THRESHOLD = 0.2;

// Get sorted allocations for archetype determination
function getSortedAllocations(
  state: BudgetState
): Array<{ id: string; amount: number }> {
  return Object.entries(state.allocations)
    .map(([id, amount]) => ({ id, amount }))
    .sort((a, b) => b.amount - a.amount);
}

// Generate compound key from two service IDs (alphabetically sorted)
function getCompoundKey(id1: string, id2: string): string {
  return [id1, id2].sort().join("-");
}

// Get political archetype based on allocations (supports compound archetypes)
export function getPoliticalArchetype(state: BudgetState): {
  id: string;
  name: string;
  description: string;
  emoji: string;
  isCompound: boolean;
  primaryId: string;
  secondaryId?: string;
} | null {
  const sorted = getSortedAllocations(state);

  if (sorted.length === 0 || sorted[0].amount === 0) {
    return null;
  }

  const primary = sorted[0];
  const secondary = sorted.length > 1 ? sorted[1] : null;

  // Check if secondary is close enough to primary for a compound archetype
  if (secondary && secondary.amount > 0) {
    const difference = (primary.amount - secondary.amount) / primary.amount;

    if (difference <= COMPOUND_THRESHOLD) {
      // Try to find a compound archetype
      const compoundKey = getCompoundKey(primary.id, secondary.id);
      const compound = COMPOUND_ARCHETYPES[compoundKey];

      if (compound) {
        return {
          id: compoundKey,
          ...compound,
          isCompound: true,
          primaryId: primary.id,
          secondaryId: secondary.id,
        };
      }
    }
  }

  // Fall back to single archetype
  const archetype = ARCHETYPES[primary.id];

  return archetype
    ? { id: primary.id, ...archetype, isCompound: false, primaryId: primary.id }
    : {
        id: primary.id,
        name: "The Balanced",
        description: "You seek equilibrium across all sectors.",
        emoji: "⚖️",
        isCompound: false,
        primaryId: primary.id,
      };
}

// Get policy traits based on subservice allocations that exceed their thresholds
export function getPolicyTraits(state: BudgetState): PolicyTrait[] {
  const activeTraits: PolicyTrait[] = [];

  for (const trait of POLICY_TRAITS) {
    const parentAllocation = state.allocations[trait.serviceId] || 0;
    if (parentAllocation <= 0) {
      continue;
    }

    const subAllocation =
      state.subAllocations[trait.serviceId]?.[trait.subServiceId] || 0;
    const percentage = subAllocation / parentAllocation;

    // Check if this subservice exceeds its threshold
    if (percentage >= trait.threshold) {
      activeTraits.push(trait);
    }
  }

  // Sort by how much they exceed their threshold (most notable first)
  activeTraits.sort((a, b) => {
    const aParent = state.allocations[a.serviceId] || 0;
    const bParent = state.allocations[b.serviceId] || 0;
    const aPercent =
      aParent > 0
        ? (state.subAllocations[a.serviceId]?.[a.subServiceId] || 0) / aParent
        : 0;
    const bPercent =
      bParent > 0
        ? (state.subAllocations[b.serviceId]?.[b.subServiceId] || 0) / bParent
        : 0;
    const aExcess = aPercent - a.threshold;
    const bExcess = bPercent - b.threshold;
    return bExcess - aExcess;
  });

  // Return top 4 most notable traits
  return activeTraits.slice(0, 4);
}

// Get a governance style modifier based on overall spending patterns
export function getGovernanceStyle(
  state: BudgetState
): { name: string; emoji: string } | null {
  const servicesAtMinimum = SERVICES_DATA.filter((s) =>
    isServiceAtMinimum(state, s)
  ).length;
  const servicesAtTier4 = SERVICES_DATA.filter(
    (s) => getServiceTierLevel(state, s) === 4
  ).length;

  // Check foreign aid percentage for internationalist modifier
  const govAllocation = state.allocations.governance || 0;
  const foreignAid = state.subAllocations.governance?.["foreign-aid"] || 0;
  const foreignAidPercent = govAllocation > 0 ? foreignAid / govAllocation : 0;

  if (servicesAtMinimum >= 5) {
    return { name: "Focused", emoji: "🎯" };
  }

  if (servicesAtTier4 >= 3) {
    return { name: "Ambitious", emoji: "🌟" };
  }

  if (foreignAidPercent >= 0.35) {
    return { name: "Internationalist", emoji: "🌍" };
  }

  return null;
}
