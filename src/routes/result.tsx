import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  ChevronDown,
  MinusCircle,
  RefreshCw,
  Share2,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ServiceIcon } from "@/components/dashboard/ServiceIcon";
import { ShareModal } from "@/components/share/ShareModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SERVICES_DATA } from "@/data/services";
import { formatCurrency } from "@/lib/utils";
import {
  budgetStore,
  getGovernanceStyle,
  getPolicyTraits,
  getPoliticalArchetype,
  getServiceTierLevel,
  getSubAllocationPercentage,
  isServiceAtMinimum,
  resetBudget,
} from "@/store/budget-store";

// Helper functions to replace nested ternaries
function getIconColorClass(atMinimum: boolean, tier: number): string {
  if (atMinimum) {
    return "text-amber-500";
  }
  if (tier === 4) {
    return "text-teal-600";
  }
  return "text-emerald-500";
}

function getProgressBarColorClass(atMinimum: boolean, tier: number): string {
  if (atMinimum) {
    return "bg-amber-400";
  }
  if (tier === 4) {
    return "bg-teal-600";
  }
  return "bg-emerald-400";
}

function getSubProgressBarColorClass(isAtMin: boolean, tier: number): string {
  if (isAtMin) {
    return "bg-amber-300";
  }
  if (tier === 4) {
    return "bg-teal-400";
  }
  return "bg-emerald-300";
}

export const Route = createFileRoute("/result")({
  component: ResultPage,
});

function ResultPage() {
  const navigate = useNavigate();
  const state = useStore(budgetStore);
  const archetype = getPoliticalArchetype(state);
  const policyTraits = getPolicyTraits(state);
  const governanceStyle = getGovernanceStyle(state);
  const isEditingRef = useRef(false);
  const [expandedServices, setExpandedServices] = useState<Set<string>>(
    new Set()
  );
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Redirect if not finalized (unless we're intentionally editing)
  useEffect(() => {
    if (!(state.isFinalized || isEditingRef.current)) {
      navigate({ to: "/" });
    }
  }, [state.isFinalized, navigate]);

  const handleRestart = () => {
    resetBudget();
    navigate({ to: "/" });
  };

  const toggleExpanded = (serviceId: string) => {
    setExpandedServices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
      }
      return newSet;
    });
  };

  // Get maxed services (Tier 4) and minimum services
  const maxedServices = SERVICES_DATA.filter(
    (s) => getServiceTierLevel(state, s) === 4
  );
  const minimumServices = SERVICES_DATA.filter((s) =>
    isServiceAtMinimum(state, s)
  );

  // Get all service stats for display (keep original order like dashboard)
  const serviceStats = SERVICES_DATA.map((service) => ({
    service,
    tier: getServiceTierLevel(state, service),
    allocation: state.allocations[service.id] || service.minCost,
    atMinimum: isServiceAtMinimum(state, service),
  }));

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100">
            <CheckCircle className="h-6 w-6 text-teal-700" />
          </div>
          <h1 className="mb-2 font-semibold font-serif text-2xl text-gray-900">
            Budget Finalized
          </h1>
          <p className="text-gray-500">
            Here's how your nation would look based on your government's
            priorities
          </p>
        </div>

        {/* Archetype Card */}
        {archetype && (
          <Card className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-start gap-5">
              <motion.div
                animate={{ scale: 1, opacity: 1 }}
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-3xl"
                initial={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {archetype.emoji}
              </motion.div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <p className="font-semibold text-teal-700 text-xs uppercase tracking-wider">
                    Your Government's Identity
                  </p>
                  {archetype.isCompound && (
                    <span className="flex items-center gap-1 rounded-full bg-purple-50 px-1.5 py-0.5 font-medium text-[10px] text-purple-600">
                      <Sparkles className="h-3 w-3" />
                      Hybrid
                    </span>
                  )}
                  {governanceStyle && (
                    <span className="rounded-full bg-blue-50 px-1.5 py-0.5 font-medium text-[10px] text-blue-600">
                      {governanceStyle.emoji} {governanceStyle.name}
                    </span>
                  )}
                </div>
                <h2 className="mb-1 font-semibold text-gray-900 text-xl">
                  {archetype.name}
                </h2>
                <p className="mb-3 text-gray-500 text-sm">
                  {archetype.description}
                </p>

                {/* Policy Traits */}
                {policyTraits.length > 0 && (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    {policyTraits.map((trait, index) => (
                      <motion.span
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 font-medium text-gray-600 text-xs"
                        initial={{ opacity: 0, scale: 0.8 }}
                        key={trait.id}
                        transition={{ duration: 0.2, delay: 0.3 + index * 0.1 }}
                      >
                        <span>{trait.emoji}</span>
                        <span>{trait.name}</span>
                      </motion.span>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Stats Row */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          {/* Maxed Services */}
          <Card className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100">
                <Trophy className="h-4 w-4 text-teal-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  Utopia Achieved
                </p>
                <p className="text-gray-400 text-xs">Tier 4 Services</p>
              </div>
            </div>
            {maxedServices.length > 0 ? (
              <div className="space-y-1.5">
                {maxedServices.map((s) => (
                  <div
                    className="flex items-center gap-2 text-sm text-teal-700"
                    key={s.id}
                  >
                    <ServiceIcon className="h-4 w-4" iconName={s.icon} />
                    <span className="truncate">{s.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">None</p>
            )}
          </Card>

          {/* Minimum Services */}
          <Card className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                <MinusCircle className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">At Minimum</p>
                <p className="text-gray-400 text-xs">Just viable</p>
              </div>
            </div>
            {minimumServices.length > 0 ? (
              <div className="space-y-1.5">
                {minimumServices.map((s) => (
                  <div
                    className="flex items-center gap-2 text-amber-600 text-sm"
                    key={s.id}
                  >
                    <ServiceIcon className="h-4 w-4" iconName={s.icon} />
                    <span className="truncate">{s.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="flex items-center gap-1.5 text-sm text-teal-600">
                <CheckCircle className="h-3.5 w-3.5" />
                All above minimum
              </p>
            )}
          </Card>
        </div>

        {/* Full Breakdown */}
        <Card className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="mb-4 font-medium text-gray-900">Budget Breakdown</h3>
          <div className="space-y-3">
            {serviceStats.map(({ service, tier, allocation, atMinimum }) => {
              const hasSubServices =
                service.subServices && service.subServices.length > 0;
              const isExpanded = expandedServices.has(service.id);

              const handleRowClick = () => {
                if (hasSubServices) {
                  toggleExpanded(service.id);
                }
              };

              const rowContent = (
                <>
                  <ServiceIcon
                    className={`h-5 w-5 shrink-0 ${getIconColorClass(atMinimum, tier)}`}
                    iconName={service.icon}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="truncate font-medium text-gray-700 text-sm">
                        {service.name}
                      </span>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-gray-400 text-xs">
                          Tier {tier}
                        </span>
                        {hasSubServices && (
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full ${getProgressBarColorClass(atMinimum, tier)}`}
                          style={{
                            width: `${Math.min(100, (allocation / service.maxCost) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="w-16 text-right text-gray-500 text-xs tabular-nums">
                        {formatCurrency(allocation, state.currencySymbol)}
                      </span>
                    </div>
                  </div>
                </>
              );

              return (
                <div key={service.id}>
                  {hasSubServices ? (
                    <button
                      aria-expanded={isExpanded}
                      className="flex w-full cursor-pointer items-center gap-3 text-left"
                      onClick={handleRowClick}
                      type="button"
                    >
                      {rowContent}
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">{rowContent}</div>
                  )}

                  {/* Sub-services Breakdown */}
                  <AnimatePresence>
                    {isExpanded && hasSubServices && (
                      <motion.div
                        animate={{ height: "auto", opacity: 1 }}
                        className="overflow-hidden"
                        exit={{ height: 0, opacity: 0 }}
                        initial={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="mt-2 ml-8 space-y-2 border-gray-100 border-l-2 pl-3">
                          {service.subServices?.map((subService) => {
                            const subAllocation =
                              state.subAllocations[service.id]?.[
                                subService.id
                              ] || 0;
                            const subPercentage = getSubAllocationPercentage(
                              state,
                              service.id,
                              subService.id
                            );
                            const isSubAtMinimum =
                              subPercentage <= subService.minPercentage + 0.001;

                            return (
                              <div
                                className="flex items-center gap-2"
                                key={subService.id}
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="mb-0.5 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5">
                                      <span className="truncate text-gray-600 text-xs">
                                        {subService.name}
                                      </span>
                                      {isSubAtMinimum && (
                                        <span className="rounded bg-amber-50 px-1 py-0.5 font-medium text-[9px] text-amber-600">
                                          MIN
                                        </span>
                                      )}
                                    </div>
                                    <span className="shrink-0 text-gray-400 text-xs">
                                      {Math.round(subPercentage * 100)}%
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-100">
                                      <motion.div
                                        animate={{
                                          width: `${subPercentage * 100}%`,
                                        }}
                                        className={`h-full rounded-full ${getSubProgressBarColorClass(isSubAtMinimum, tier)}`}
                                        initial={{ width: 0 }}
                                        transition={{
                                          duration: 0.3,
                                          delay: 0.1,
                                        }}
                                      />
                                    </div>
                                    <span className="w-14 text-right text-gray-400 text-xs tabular-nums">
                                      {formatCurrency(
                                        subAllocation,
                                        state.currencySymbol
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <Button
            className="rounded-lg border-gray-200 py-5 font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => {
              isEditingRef.current = true;
              budgetStore.setState((s) => ({ ...s, isFinalized: false }));
              navigate({ to: "/dashboard" });
            }}
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            className="rounded-lg border-gray-200 py-5 font-medium text-gray-700 hover:bg-gray-50"
            onClick={handleRestart}
            variant="outline"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Restart
          </Button>
          <Button
            className="rounded-lg bg-teal-700 py-5 font-medium hover:bg-teal-800"
            onClick={() => setShareModalOpen(true)}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        archetype={archetype}
        governanceStyle={governanceStyle}
        onOpenChange={setShareModalOpen}
        open={shareModalOpen}
        policyTraits={policyTraits}
        state={state}
      />
    </div>
  );
}
