import { useStore } from "@tanstack/react-store";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ServiceIcon } from "./ServiceIcon";
import type { Service } from "@/types";
import {
  budgetStore,
  updateAllocation,
  updateSubAllocation,
  getServiceAllocationPercentage,
  getServiceTierLevel,
  isServiceAtMinimum,
  getStatusDescription,
  getSubAllocationPercentage,
} from "@/store/budgetStore";
import { formatCurrency } from "@/lib/utils";
import { Lock, Unlock, Sparkles, MinusCircle, ChevronDown } from "lucide-react";
import { useRef, useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ServiceCardProps {
  service: Service;
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
  const sliderValue = service.maxCost > 0 ? (allocation / service.maxCost) * 100 : 0;
  
  // Calculate minimum slider position (can't go below this)
  const minSliderValue = service.maxCost > 0 ? (service.minCost / service.maxCost) * 100 : 0;

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
          icon: <Sparkles className="w-4 h-4 text-amber-500" />,
        });
      }
    } else if (currentTier < previousTier.current && previousTier.current > 0) {
      const lostTier = service.tiers.find((t) => t.level === previousTier.current);
      if (lostTier) {
        toast.error(`Perk Lost: ${lostTier.perk}`, {
          description: "Funding dropped below threshold",
          icon: <MinusCircle className="w-4 h-4 text-red-500" />,
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
      className={`bg-white border rounded-xl transition-colors ${
        atMinimum
          ? "border-amber-200 bg-amber-50/30"
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
              atMinimum
                ? "bg-amber-100"
                : currentTier === 4
                ? "bg-teal-100"
                : "bg-emerald-50"
            }`}
          >
            <ServiceIcon
              iconName={service.icon}
              className={`w-5 h-5 ${
                atMinimum
                  ? "text-amber-600"
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
              {formatCurrency(Math.round(allocation), state.currencySymbol)}
            </p>
            <p className={`text-xs font-medium ${
              atMinimum ? "text-amber-600" : currentTier === 4 ? "text-teal-600" : "text-emerald-500"
            }`}>
              {atMinimum ? "AT MINIMUM" : statusText}
            </p>
          </div>
        </div>

        {/* Tier Progress Track */}
        <div className="relative mb-4">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-200 ${
                atMinimum
                  ? "bg-amber-400"
                  : currentTier === 4
                  ? "bg-teal-600"
                  : "bg-emerald-400"
              }`}
              style={{ width: `${percentage * 100}%` }}
            />
          </div>

          {/* Minimum marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-amber-500"
            style={{ left: `${minSliderValue}%` }}
            title="Minimum required"
          />

          {/* Tier markers - using Popover for touch support */}
          <div className="absolute inset-0 flex">
            {service.tiers.map((tier) => (
              <Popover key={tier.level}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 touch-manipulation"
                    style={{ left: `${tier.threshold * 100}%` }}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors ${
                        percentage >= tier.threshold
                          ? "bg-teal-600 border-teal-600"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {percentage >= tier.threshold ? (
                        <Unlock className="w-2.5 h-2.5 text-white" />
                      ) : (
                        <Lock className="w-2.5 h-2.5 text-gray-400" />
                      )}
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  className="w-64 p-3 bg-white border-gray-200 shadow-lg"
                  sideOffset={8}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        percentage >= tier.threshold
                          ? "bg-teal-100"
                          : "bg-gray-100"
                      }`}
                    >
                      {percentage >= tier.threshold ? (
                        <Unlock className="w-3 h-3 text-teal-600" />
                      ) : (
                        <Lock className="w-3 h-3 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">
                        Tier {tier.level}: {tier.name}
                      </p>
                      <p className="text-xs text-teal-600 font-medium mt-0.5">
                        {tier.perk}
                      </p>
                      <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                        {tier.benefit}
                      </p>
                      <p className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100">
                        Requires: {formatCurrency(Math.round(tier.threshold * service.maxCost), state.currencySymbol)}
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
          value={[sliderValue]}
          onValueChange={handleSliderChange}
          min={0}
          max={100}
          step={0.5}
          className="mb-4"
        />

        {/* Min/Max labels */}
        <div className="flex justify-between text-xs text-gray-400 mb-3">
          <span>Min: {formatCurrency(service.minCost, state.currencySymbol)}</span>
          <span>Max: {formatCurrency(service.maxCost, state.currencySymbol)}</span>
        </div>

        {/* Current tier / Next tier info */}
        <div className="flex items-center justify-between text-sm">
          {activeTier ? (
            <div>
              <span className="text-gray-500">Tier {activeTier.level}:</span>{" "}
              <span className="font-medium text-gray-700">{activeTier.perk}</span>
            </div>
          ) : (
            <div className="text-gray-400">No tier unlocked</div>
          )}

          {nextTier && (
            <div className="flex items-center gap-1.5 text-gray-400">
              <Lock className="w-3 h-3" />
              <span className="text-xs">Next: {nextTier.perk}</span>
            </div>
          )}
        </div>

        {/* Expand/Collapse Button for Sub-Services */}
        {hasSubServices && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <span>
              {isExpanded ? "Hide" : "Show"} breakdown ({service.subServices!.length} sub-services)
            </span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </button>
        )}

        {/* Sub-Services Accordion */}
        <AnimatePresence>
          {isExpanded && hasSubServices && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                {service.subServices!.map((subService) => {
                  const subAllocation = state.subAllocations[service.id]?.[subService.id] || 0;
                  const subPercentage = getSubAllocationPercentage(state, service.id, subService.id);
                  const subSliderValue = subPercentage * 100;
                  const minSliderValue = subService.minPercentage * 100;
                  const isAtMinimum = subPercentage <= subService.minPercentage + 0.001;

                  return (
                    <div key={subService.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">
                            {subService.name}
                          </span>
                          {isAtMinimum && (
                            <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                              MIN
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-gray-900 tabular-nums">
                            {formatCurrency(Math.round(subAllocation), state.currencySymbol)}
                          </span>
                          <span className="text-xs text-gray-400 ml-2">
                            ({Math.round(subPercentage * 100)}%)
                          </span>
                        </div>
                      </div>
                      
                      {/* Sub-service progress bar */}
                      <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        {/* Minimum marker */}
                        <div
                          className="absolute top-0 bottom-0 w-px bg-amber-400 z-10"
                          style={{ left: `${minSliderValue}%` }}
                        />
                        <motion.div
                          className={`h-full rounded-full ${
                            isAtMinimum
                              ? "bg-amber-300"
                              : currentTier === 4
                              ? "bg-teal-400"
                              : "bg-emerald-300"
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${subPercentage * 100}%` }}
                          transition={{ duration: 0.2 }}
                        />
                      </div>
                      
                      {/* Sub-service slider */}
                      <Slider
                        value={[subSliderValue]}
                        onValueChange={(values) => handleSubSliderChange(subService.id, values)}
                        min={0}
                        max={100}
                        step={1}
                        className="py-1"
                      />
                      
                      {/* Min label */}
                      <div className="text-[10px] text-gray-400">
                        <span>Min: {Math.round(minSliderValue)}%</span>
                      </div>
                    </div>
                  );
                })}

                {/* Sub-allocation total check */}
                <div className="pt-2 border-t border-dashed border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Total allocated to sub-services:</span>
                    <span className="font-medium tabular-nums">
                      {formatCurrency(
                        Math.round(
                          Object.values(state.subAllocations[service.id] || {}).reduce(
                            (sum, val) => sum + val,
                            0
                          )
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
