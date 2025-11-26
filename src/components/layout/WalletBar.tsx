import { useStore } from "@tanstack/react-store";
import { Wallet, AlertCircle } from "lucide-react";
import {
  budgetStore,
  getRemainingFunds,
  getSpendableBudget,
  getTotalAllocated,
  getBureaucracyCost,
} from "@/store/budgetStore";

export function WalletBar() {
  const state = useStore(budgetStore);
  const remaining = getRemainingFunds(state);
  const spendable = getSpendableBudget(state);
  const totalAllocated = getTotalAllocated(state);
  const bureaucracyCost = getBureaucracyCost(state);

  // Calculate color based on remaining percentage
  const percentRemaining = spendable > 0 ? remaining / spendable : 1;

  const getStatusColor = () => {
    if (remaining <= 0) return "bg-gray-400";
    if (percentRemaining <= 0.1) return "bg-amber-500";
    if (percentRemaining <= 0.3) return "bg-yellow-500";
    return "bg-teal-700";
  };

  const getTextColor = () => {
    if (remaining <= 0) return "text-red-600";
    if (percentRemaining <= 0.1) return "text-amber-600";
    if (percentRemaining <= 0.3) return "text-yellow-600";
    return "text-teal-700";
  };

  const formatCurrency = (value: number) => {
    const absValue = Math.abs(value);
    const formatted = absValue.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return value < 0 ? `-${state.currencySymbol}${formatted}` : `${state.currencySymbol}${formatted}`;
  };

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Logo/Title */}
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg ${getStatusColor()} flex items-center justify-center`}>
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">
                Total Budget
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {formatCurrency(state.totalTaxInput)}
              </p>
            </div>
          </div>

          {/* Center - Progress info */}
          <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500">
            <span>Allocated: {formatCurrency(totalAllocated)}</span>
            <span className="text-gray-300">•</span>
            <span>Overhead: {formatCurrency(bureaucracyCost)}</span>
          </div>

          {/* Right side - Remaining funds */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs text-gray-400 font-medium">
                Remaining
              </p>
              <p className={`text-lg font-bold tabular-nums ${getTextColor()}`}>
                {formatCurrency(Math.round(remaining))}
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
            style={{ width: `${Math.max(0, Math.min(100, (totalAllocated / spendable) * 100))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
