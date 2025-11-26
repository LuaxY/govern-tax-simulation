import { useStore } from "@tanstack/react-store";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ServiceIcon } from "./ServiceIcon";
import type { Service } from "@/types";
import {
  budgetStore,
  updateAllocation,
  getSpendableBudget,
  getServiceAllocationPercentage,
  getServiceTierLevel,
  isServiceCollapsed,
  getStatusDescription,
} from "@/store/budgetStore";
import { Lock, Unlock, AlertTriangle, Sparkles } from "lucide-react";
import { useRef, useCallback, useEffect } from "react";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const state = useStore(budgetStore);
  const allocation = state.allocations[service.id] || 0;
  const spendable = getSpendableBudget(state);
  const percentage = getServiceAllocationPercentage(state, service);
  const currentTier = getServiceTierLevel(state, service);
  const collapsed = isServiceCollapsed(state, service);
  const statusText = getStatusDescription(percentage);

  const previousTier = useRef(currentTier);

  // Max allocation for this service
  const maxForService = spendable * service.maxCost;

  // Calculate slider value (0-100)
  const sliderValue = maxForService > 0 ? (allocation / maxForService) * 100 : 0;

  // Handle slider change
  const handleSliderChange = useCallback(
    (values: number[]) => {
      const newPercentage = values[0] / 100;
      const newAllocation = newPercentage * maxForService;
      updateAllocation(service.id, newAllocation);
    },
    [service.id, maxForService]
  );

  // Detect tier changes for toasts only
  useEffect(() => {
    if (currentTier > previousTier.current) {
      const tier = service.tiers.find((t) => t.level === currentTier);
      if (tier) {
        toast.success(`Unlocked: ${tier.perk}`, {
          description: tier.benefit,
          icon: <Sparkles className="w-4 h-4 text-amber-500" />,
        });
      }
    } else if (currentTier < previousTier.current && previousTier.current > 0) {
      const lostTier = service.tiers.find((t) => t.level === previousTier.current);
      if (lostTier) {
        toast.error(`Perk Lost: ${lostTier.perk}`, {
          description: "Funding dropped below threshold",
          icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
        });
      }
    }
    previousTier.current = currentTier;
  }, [currentTier, service.tiers]);

  // Get current tier info
  const activeTier = service.tiers.find((t) => t.level === currentTier);
  const nextTier = service.tiers.find((t) => t.level === currentTier + 1);

  return (
    <TooltipProvider>
      <Card
        className={`bg-white border rounded-xl transition-colors ${
          collapsed
            ? "border-red-200 bg-red-50/50"
            : currentTier === 4
            ? "border-teal-200 bg-teal-50/30"
            : "border-gray-200"
        }`}
      >
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start gap-4 mb-5">
            <div
              className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${
                collapsed
                  ? "bg-red-100"
                  : currentTier === 4
                  ? "bg-teal-100"
                  : "bg-emerald-50"
              }`}
            >
              <ServiceIcon
                iconName={service.icon}
                className={`w-5 h-5 ${
                  collapsed
                    ? "text-red-600"
                    : currentTier === 4
                    ? "text-teal-700"
                    : "text-emerald-500"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-0.5">
                {service.name}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-1">
                {service.description}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-semibold text-gray-900 tabular-nums">
                {state.currencySymbol}{Math.round(allocation).toLocaleString()}
              </p>
              <p className={`text-xs font-medium ${
                collapsed ? "text-red-600" : currentTier === 4 ? "text-teal-600" : "text-emerald-500"
              }`}>
                {collapsed ? "COLLAPSED" : statusText}
              </p>
            </div>
          </div>

          {/* Tier Progress Track */}
          <div className="relative mb-4">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-200 ${
                  collapsed
                    ? "bg-red-500"
                    : currentTier === 4
                    ? "bg-teal-600"
                    : "bg-emerald-400"
                }`}
                style={{ width: `${percentage * 100}%` }}
              />
            </div>

            {/* Tier markers */}
            <div className="absolute inset-0 flex">
              {service.tiers.map((tier) => (
                <Tooltip key={tier.level}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                      style={{ left: `${tier.threshold * 100}%` }}
                    >
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center border-2 transition-colors ${
                          percentage >= tier.threshold
                            ? "bg-teal-600 border-teal-600"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        {percentage >= tier.threshold ? (
                          <Unlock className="w-2 h-2 text-white" />
                        ) : (
                          <Lock className="w-2 h-2 text-gray-400" />
                        )}
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-white border-gray-200 shadow-lg max-w-xs"
                  >
                    <p className="font-medium text-gray-900">
                      Tier {tier.level}: {tier.name}
                    </p>
                    <p className="text-xs text-teal-600 font-medium">{tier.perk}</p>
                    <p className="text-xs text-gray-500 mt-1">{tier.benefit}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>

          {/* Slider */}
          <Slider
            value={[sliderValue]}
            onValueChange={handleSliderChange}
            max={100}
            step={1}
            className="mb-4"
          />

          {/* Current tier / Next tier info */}
          <div className="flex items-center justify-between text-sm">
            {activeTier && !collapsed ? (
              <div>
                <span className="text-gray-500">Tier {activeTier.level}:</span>{" "}
                <span className="font-medium text-gray-700">{activeTier.perk}</span>
              </div>
            ) : collapsed ? (
              <div className="flex items-center gap-1.5 text-red-600">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span className="font-medium">Below minimum threshold</span>
              </div>
            ) : (
              <div className="text-gray-400">No allocation</div>
            )}

            {nextTier && (
              <div className="flex items-center gap-1.5 text-gray-400">
                <Lock className="w-3 h-3" />
                <span className="text-xs">Next: {nextTier.perk}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
}
