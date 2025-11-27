import { useStore } from "@tanstack/react-store";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Lock, MinusCircle, Sparkles, Unlock } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/utils";
import {
  budgetStore,
  getServiceAllocationPercentage,
  getServiceTierLevel,
  getStatusDescription,
  getSubAllocationPercentage,
  isServiceAtMinimum,
  updateAllocation,
  updateSubAllocation,
} from "@/store/budget-store";
import type { Service } from "@/types";
import { ServiceIcon } from "./ServiceIcon";

type ServiceCardProps = {
  service: Service;
};

// Helper functions to replace nested ternaries
function getBorderClass(atMinimum: boolean, currentTier: number): string {
  if (atMinimum) {
    return "border-amber-200 bg-amber-50/30";
  }
  if (currentTier === 4) {
    return "border-teal-200 bg-teal-50/30";
  }
  return "border-gray-200";
}

function getIconBgClass(atMinimum: boolean, currentTier: number): string {
  if (atMinimum) {
    return "bg-amber-100";
  }
  if (currentTier === 4) {
    return "bg-teal-100";
  }
  return "bg-emerald-50";
}

function getIconTextClass(atMinimum: boolean, currentTier: number): string {
  if (atMinimum) {
    return "text-amber-600";
  }
  if (currentTier === 4) {
    return "text-teal-700";
  }
  return "text-emerald-500";
}

function getStatusTextClass(atMinimum: boolean, currentTier: number): string {
  if (atMinimum) {
    return "text-amber-600";
  }
  if (currentTier === 4) {
    return "text-teal-600";
  }
  return "text-emerald-500";
}

function getProgressBarClass(atMinimum: boolean, currentTier: number): string {
  if (atMinimum) {
    return "bg-amber-400";
  }
  if (currentTier === 4) {
    return "bg-teal-600";
  }
  return "bg-emerald-400";
}

function getSubProgressBarClass(isAtMin: boolean, currentTier: number): string {
  if (isAtMin) {
    return "bg-amber-300";
  }
  if (currentTier === 4) {
    return "bg-teal-400";
  }
  return "bg-emerald-300";
}

export function ServiceCard({ service }: ServiceCardProps) {
  const state = useStore(budgetStore);
  const allocation = state.allocations[service.id] || service.minCost;
  const percentage = getServiceAllocationPercentage(state, service);
  const currentTier = getServiceTierLevel(state, service);
  const atMinimum = isServiceAtMinimum(state, service);
  const statusText = getStatusDescription(percentage);

  const [isExpanded, setIsExpanded] = useState(false);
  const previousTier = useRef(currentTier);

  const hasSubServices = service.subServices && service.subServices.length > 0;

  // Calculate slider value (0-100 based on maxCost)
  const sliderValue =
    service.maxCost > 0 ? (allocation / service.maxCost) * 100 : 0;

  // Calculate minimum slider position (can't go below this)
  const minSliderValue =
    service.maxCost > 0 ? (service.minCost / service.maxCost) * 100 : 0;

  // Handle slider change
  const handleSliderChange = useCallback(
    (values: number[]) => {
      const newPercentage = values[0] / 100;
      const newAllocation = newPercentage * service.maxCost;

      // Enforce minimum - can't go below minCost
      if (newAllocation < service.minCost) {
        updateAllocation(service.id, service.minCost);
      } else {
        updateAllocation(service.id, newAllocation);
      }
    },
    [service.id, service.maxCost, service.minCost]
  );

  // Handle sub-service slider change
  const handleSubSliderChange = useCallback(
    (subServiceId: string, values: number[]) => {
      const newPercentage = values[0] / 100;
      const newAmount = newPercentage * allocation;
      updateSubAllocation(service.id, subServiceId, newAmount);
    },
    [service.id, allocation]
  );

  // Detect tier changes for toasts only
  useEffect(() => {
    if (currentTier > previousTier.current) {
      const tier = service.tiers.find((t) => t.level === currentTier);
      if (tier) {
        toast.success(`Unlocked: ${tier.perk}`, {
          description: tier.benefit,
          icon: <Sparkles className="h-4 w-4 text-amber-500" />,
        });
      }
    } else if (currentTier < previousTier.current && previousTier.current > 0) {
      const lostTier = service.tiers.find(
        (t) => t.level === previousTier.current
      );
      if (lostTier) {
        toast.error(`Perk Lost: ${lostTier.perk}`, {
          description: "Funding dropped below threshold",
          icon: <MinusCircle className="h-4 w-4 text-red-500" />,
        });
      }
    }
    previousTier.current = currentTier;
  }, [currentTier, service.tiers]);

  // Get current tier info
  const activeTier = service.tiers.find((t) => t.level === currentTier);
  const nextTier = service.tiers.find((t) => t.level === currentTier + 1);

  return (
    <Card
      className={`rounded-xl border bg-white transition-colors ${getBorderClass(atMinimum, currentTier)}`}
    >
      <div className="p-5">
        {/* Header */}
        <div className="mb-5 flex items-start gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${getIconBgClass(atMinimum, currentTier)}`}
          >
            <ServiceIcon
              className={`h-5 w-5 ${getIconTextClass(atMinimum, currentTier)}`}
              iconName={service.icon}
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="mb-0.5 font-semibold text-gray-900">
              {service.name}
            </h3>
            <p className="line-clamp-1 text-gray-500 text-sm">
              {service.description}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-semibold text-gray-900 text-lg tabular-nums">
              {formatCurrency(Math.round(allocation), state.currencySymbol)}
            </p>
            <p
              className={`font-medium text-xs ${getStatusTextClass(atMinimum, currentTier)}`}
            >
              {atMinimum ? "AT MINIMUM" : statusText}
            </p>
          </div>
        </div>

        {/* Tier Progress Track */}
        <div className="relative mb-4">
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all duration-200 ${getProgressBarClass(atMinimum, currentTier)}`}
              style={{ width: `${percentage * 100}%` }}
            />
          </div>

          {/* Minimum marker */}
          <div
            className="-translate-y-1/2 absolute top-1/2 h-4 w-0.5 bg-amber-500"
            style={{ left: `${minSliderValue}%` }}
            title="Minimum required"
          />

          {/* Tier markers - using Popover for touch support */}
          <div className="absolute inset-0 flex">
            {service.tiers.map((tier) => (
              <Popover key={tier.level}>
                <PopoverTrigger asChild>
                  <button
                    className="-translate-y-1/2 -translate-x-1/2 absolute top-1/2 touch-manipulation"
                    style={{ left: `${tier.threshold * 100}%` }}
                    type="button"
                  >
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                        percentage >= tier.threshold
                          ? "border-teal-600 bg-teal-600"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {percentage >= tier.threshold ? (
                        <Unlock className="h-2.5 w-2.5 text-white" />
                      ) : (
                        <Lock className="h-2.5 w-2.5 text-gray-400" />
                      )}
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-64 border-gray-200 bg-white p-3 shadow-lg"
                  side="top"
                  sideOffset={8}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                        percentage >= tier.threshold
                          ? "bg-teal-100"
                          : "bg-gray-100"
                      }`}
                    >
                      {percentage >= tier.threshold ? (
                        <Unlock className="h-3 w-3 text-teal-600" />
                      ) : (
                        <Lock className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-sm">
                        Tier {tier.level}: {tier.name}
                      </p>
                      <p className="mt-0.5 font-medium text-teal-600 text-xs">
                        {tier.perk}
                      </p>
                      <p className="mt-1.5 text-gray-500 text-xs leading-relaxed">
                        {tier.benefit}
                      </p>
                      <p className="mt-2 border-gray-100 border-t pt-2 text-gray-400 text-xs">
                        Requires:{" "}
                        {formatCurrency(
                          Math.round(tier.threshold * service.maxCost),
                          state.currencySymbol
                        )}
                      </p>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            ))}
          </div>
        </div>

        {/* Slider - range from 0 to 100 but enforces minimum */}
        <Slider
          className="mb-4"
          max={100}
          min={0}
          onValueChange={handleSliderChange}
          step={0.5}
          value={[sliderValue]}
        />

        {/* Min/Max labels */}
        <div className="mb-3 flex justify-between text-gray-400 text-xs">
          <span>
            Min: {formatCurrency(service.minCost, state.currencySymbol)}
          </span>
          <span>
            Max: {formatCurrency(service.maxCost, state.currencySymbol)}
          </span>
        </div>

        {/* Current tier / Next tier info */}
        <div className="flex items-center justify-between text-sm">
          {activeTier ? (
            <div>
              <span className="text-gray-500">Tier {activeTier.level}:</span>{" "}
              <span className="font-medium text-gray-700">
                {activeTier.perk}
              </span>
            </div>
          ) : (
            <div className="text-gray-400">No tier unlocked</div>
          )}

          {nextTier && (
            <div className="flex items-center gap-1.5 text-gray-400">
              <Lock className="h-3 w-3" />
              <span className="text-xs">Next: {nextTier.perk}</span>
            </div>
          )}
        </div>

        {/* Expand/Collapse Button for Sub-Services */}
        {hasSubServices && (
          <button
            className="mt-4 flex w-full items-center justify-center gap-2 border-gray-100 border-t pt-4 text-gray-500 text-sm transition-colors hover:text-gray-700"
            onClick={() => setIsExpanded(!isExpanded)}
            type="button"
          >
            <span>
              {isExpanded ? "Hide" : "Show"} breakdown (
              {service.subServices?.length} sub-services)
            </span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </button>
        )}

        {/* Sub-Services Accordion */}
        <AnimatePresence>
          {isExpanded && hasSubServices && (
            <motion.div
              animate={{ height: "auto", opacity: 1 }}
              className="overflow-hidden"
              exit={{ height: 0, opacity: 0 }}
              initial={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="mt-4 space-y-4 border-gray-100 border-t pt-4">
                {service.subServices?.map((subService) => {
                  const subAllocation =
                    state.subAllocations[service.id]?.[subService.id] || 0;
                  const subPercentage = getSubAllocationPercentage(
                    state,
                    service.id,
                    subService.id
                  );
                  const subSliderValue = subPercentage * 100;
                  const subMinSliderValue = subService.minPercentage * 100;
                  const isSubAtMinimum =
                    subPercentage <= subService.minPercentage + 0.001;

                  return (
                    <div className="space-y-2" key={subService.id}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-700 text-sm">
                            {subService.name}
                          </span>
                          {isSubAtMinimum && (
                            <span className="rounded bg-amber-50 px-1.5 py-0.5 font-medium text-[10px] text-amber-600">
                              MIN
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="font-medium text-gray-900 text-sm tabular-nums">
                            {formatCurrency(
                              Math.round(subAllocation),
                              state.currencySymbol
                            )}
                          </span>
                          <span className="ml-2 text-gray-400 text-xs">
                            ({Math.round(subPercentage * 100)}%)
                          </span>
                        </div>
                      </div>

                      {/* Sub-service progress bar */}
                      <div className="relative h-1.5 overflow-hidden rounded-full bg-gray-100">
                        {/* Minimum marker */}
                        <div
                          className="absolute top-0 bottom-0 z-10 w-px bg-amber-400"
                          style={{ left: `${subMinSliderValue}%` }}
                        />
                        <motion.div
                          animate={{ width: `${subPercentage * 100}%` }}
                          className={`h-full rounded-full ${getSubProgressBarClass(isSubAtMinimum, currentTier)}`}
                          initial={{ width: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      </div>

                      {/* Sub-service slider */}
                      <Slider
                        className="py-1"
                        max={100}
                        min={0}
                        onValueChange={(values) =>
                          handleSubSliderChange(subService.id, values)
                        }
                        step={1}
                        value={[subSliderValue]}
                      />

                      {/* Min label */}
                      <div className="text-[10px] text-gray-400">
                        <span>Min: {Math.round(subMinSliderValue)}%</span>
                      </div>
                    </div>
                  );
                })}

                {/* Sub-allocation total check */}
                <div className="border-gray-200 border-t border-dashed pt-2">
                  <div className="flex items-center justify-between text-gray-500 text-xs">
                    <span>Total allocated to sub-services:</span>
                    <span className="font-medium tabular-nums">
                      {formatCurrency(
                        Math.round(
                          Object.values(
                            state.subAllocations[service.id] || {}
                          ).reduce((sum, val) => sum + val, 0)
                        ),
                        state.currencySymbol
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
