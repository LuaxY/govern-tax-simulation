import { useStore } from "@tanstack/react-store";
import { Landmark, AlertCircle } from "lucide-react";
import {
  budgetStore,
  getRemainingFunds,
  getTotalBudget,
  getTotalAllocated,
} from "@/store/budgetStore";
import { formatCurrency } from "@/lib/utils";

export function WalletBar() {
  const state = useStore(budgetStore);
  const remaining = getRemainingFunds(state);
  const totalBudget = getTotalBudget();
  const totalAllocated = getTotalAllocated(state);

  // Calculate color based on remaining percentage
  const percentRemaining = totalBudget > 0 ? remaining / totalBudget : 1;

  const getStatusColor = () => {
    if (remaining <= 0) return "bg-gray-400";
    if (percentRemaining <= 0.05) return "bg-amber-500";
    if (percentRemaining <= 0.15) return "bg-yellow-500";
    return "bg-teal-700";
  };

  const getTextColor = () => {
    if (remaining <= 0) return "text-gray-500";
    if (percentRemaining <= 0.05) return "text-amber-600";
    if (percentRemaining <= 0.15) return "text-yellow-600";
    return "text-teal-700";
  };

  const fmt = (value: number) => formatCurrency(value, state.currencySymbol);

  // Calculate allocation percentage
  const allocationPercent = totalBudget > 0 ? (totalAllocated / totalBudget) * 100 : 0;

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Logo/Title */}
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg ${getStatusColor()} flex items-center justify-center`}>
              <Landmark className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">
                National Budget
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {fmt(totalBudget)}
              </p>
            </div>
          </div>

          {/* Center - Progress info */}
          <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500">
            <span>Allocated: {fmt(totalAllocated)}</span>
            <span className="text-gray-300">•</span>
            <span>{allocationPercent.toFixed(1)}% of budget</span>
          </div>

          {/* Right side - Remaining funds */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs text-gray-400 font-medium">
                Unallocated
              </p>
              <p className={`text-lg font-bold tabular-nums ${getTextColor()}`}>
                {fmt(Math.round(remaining))}
              </p>
            </div>

            {/* Warning indicator */}
            {remaining < 0 && (
              <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-500" />
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${getStatusColor()} rounded-full transition-all duration-300`}
            style={{ width: `${Math.max(0, Math.min(100, allocationPercent))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
