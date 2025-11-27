import { useStore } from "@tanstack/react-store";
import { AlertCircle, Landmark } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  budgetStore,
  getRemainingFunds,
  getTotalAllocated,
  getTotalBudget,
} from "@/store/budget-store";

export function WalletBar() {
  const state = useStore(budgetStore);
  const remaining = getRemainingFunds(state);
  const totalBudget = getTotalBudget();
  const totalAllocated = getTotalAllocated(state);

  // Calculate color based on remaining percentage
  const percentRemaining = totalBudget > 0 ? remaining / totalBudget : 1;

  const getStatusColor = () => {
    if (remaining <= 0) {
      return "bg-gray-400";
    }
    if (percentRemaining <= 0.05) {
      return "bg-amber-500";
    }
    if (percentRemaining <= 0.15) {
      return "bg-yellow-500";
    }
    return "bg-teal-700";
  };

  const getTextColor = () => {
    if (remaining <= 0) {
      return "text-gray-500";
    }
    if (percentRemaining <= 0.05) {
      return "text-amber-600";
    }
    if (percentRemaining <= 0.15) {
      return "text-yellow-600";
    }
    return "text-teal-700";
  };

  const fmt = (value: number) => formatCurrency(value, state.currencySymbol);

  // Calculate allocation percentage
  const allocationPercent =
    totalBudget > 0 ? (totalAllocated / totalBudget) * 100 : 0;

  return (
    <div className="sticky top-0 z-30 border-gray-200 border-b bg-white">
      <div className="mx-auto max-w-2xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Logo/Title */}
          <div className="flex items-center gap-3">
            <div
              className={`h-9 w-9 rounded-lg ${getStatusColor()} flex items-center justify-center`}
            >
              <Landmark className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-400 text-xs">
                National Budget
              </p>
              <p className="font-semibold text-gray-900 text-sm">
                {fmt(totalBudget)}
              </p>
            </div>
          </div>

          {/* Center - Progress info */}
          <div className="hidden items-center gap-4 text-gray-500 text-xs sm:flex">
            <span>Allocated: {fmt(totalAllocated)}</span>
            <span className="text-gray-300">•</span>
            <span>{allocationPercent.toFixed(1)}% of budget</span>
          </div>

          {/* Right side - Remaining funds */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="font-medium text-gray-400 text-xs">Unallocated</p>
              <p className={`font-bold text-lg tabular-nums ${getTextColor()}`}>
                {fmt(Math.round(remaining))}
              </p>
            </div>

            {/* Warning indicator */}
            {remaining < 0 && (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-4 w-4 text-red-500" />
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full ${getStatusColor()} rounded-full transition-all duration-300`}
            style={{
              width: `${Math.max(0, Math.min(100, allocationPercent))}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
