export interface Tier {
  level: number;
  name: string;
  threshold: number; // 0.25, 0.50, 0.75, 1.0
  perk: string;
  benefit: string;
  visualState: string;
}

export interface Service {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  description: string;
  minCost: number; // Min dollar amount (Tier 1 threshold)
  maxCost: number; // Max dollar amount (Tier 4 / Utopia)
  tiers: Tier[];
}

export interface BudgetState {
  totalTaxInput: number;
  currencySymbol: string;
  allocations: Record<string, number>; // serviceId -> allocation amount
  isFinalized: boolean;
}

export type TierStatus = "locked" | "unlocked" | "current";

export interface AllocationInfo {
  serviceId: string;
  amount: number;
  percentage: number; // 0-1 percentage within the service's range
  currentTier: number; // 0-4
  tierStatus: Record<number, TierStatus>;
}

export type PoliticalArchetype =
  | "The Humanitarian"
  | "The Builder"
  | "The Guardian"
  | "The Visionary"
  | "The Naturalist"
  | "The Caretaker"
  | "The Diplomat"
  | "The Balanced";

