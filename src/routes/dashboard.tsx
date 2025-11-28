import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import {
  ArrowRight,
  CheckCircle,
  Equal,
  RotateCcw,
  Shuffle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { ServiceCard } from "@/components/dashboard/ServiceCard";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SERVICES_DATA } from "@/data/services";
import {
  budgetStore,
  finalizeBudget,
  getRemainingFunds,
  getTotalBudget,
  setAllocationsWithSubAllocations,
} from "@/store/budget-store";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const state = useStore(budgetStore);
  const remaining = getRemainingFunds(state);
  const totalBudget = getTotalBudget();

  // Calculate total minimum required
  const totalMinRequired = SERVICES_DATA.reduce((sum, s) => sum + s.minCost, 0);

  // Can finalize when budget is fully allocated (within small tolerance)
  const canFinalize = remaining >= -0.01 && remaining <= totalBudget * 0.05;

  const handleFinalize = () => {
    finalizeBudget();
    navigate({ to: "/result" });
  };

  const handleDistributeEvenly = () => {
    // Start with all services at minimum
    const newAllocations: Record<string, number> = {};
    for (const service of SERVICES_DATA) {
      newAllocations[service.id] = service.minCost;
    }

    // Calculate remaining budget after minimums
    const discretionary = totalBudget - totalMinRequired;

    // Distribute remaining evenly across services (up to their max)
    const perService = discretionary / SERVICES_DATA.length;

    for (const service of SERVICES_DATA) {
      const currentAllocation = newAllocations[service.id];
      const maxAddable = service.maxCost - currentAllocation;
      const toAdd = Math.min(perService, maxAddable);
      newAllocations[service.id] = currentAllocation + toAdd;
    }

    setAllocationsWithSubAllocations(newAllocations);
  };

  const handleRandomize = () => {
    // Start with all services at minimum
    const newAllocations: Record<string, number> = {};
    for (const service of SERVICES_DATA) {
      newAllocations[service.id] = service.minCost;
    }

    // Calculate remaining budget after minimums
    const discretionary = totalBudget - totalMinRequired;

    // Generate random weights for distribution
    const weights = SERVICES_DATA.map(() => Math.random());
    const totalWeight = weights.reduce((a, b) => a + b, 0);

    // Distribute discretionary budget based on weights
    SERVICES_DATA.forEach((service, i) => {
      const proportion = weights[i] / totalWeight;
      const amount = discretionary * proportion;
      const currentAllocation = newAllocations[service.id];
      const maxAddable = service.maxCost - currentAllocation;
      const toAdd = Math.min(amount, maxAddable);
      newAllocations[service.id] = currentAllocation + toAdd;
    });

    setAllocationsWithSubAllocations(newAllocations);
  };

  const handleResetToMinimum = () => {
    const resetAllocations: Record<string, number> = {};
    for (const s of SERVICES_DATA) {
      resetAllocations[s.id] = s.minCost;
    }
    setAllocationsWithSubAllocations(resetAllocations);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen pb-24">
        {/* Header */}
        <div className="sticky top-[73px] z-20 border-gray-100 border-b bg-[#fafafa] px-4 py-4">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="font-semibold text-gray-900 text-xl">
                {t("dashboard.title")}
              </h1>
              <p className="mt-0.5 hidden text-gray-500 text-sm sm:block">
                {t("dashboard.subtitle")}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {/* Distribute Evenly Button */}
              <Button
                className="rounded-lg border-gray-200 px-3 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50"
                onClick={handleDistributeEvenly}
                variant="outline"
              >
                <Equal className="mr-1.5 h-4 w-4" />
                <span className="hidden sm:inline">
                  {t("dashboard.distribute")}
                </span>
              </Button>

              {/* Randomize Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="rounded-lg border-gray-200 px-2.5 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={handleRandomize}
                    variant="outline"
                  >
                    <Shuffle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("dashboard.randomize")}</TooltipContent>
              </Tooltip>

              {/* Reset Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="rounded-lg border-gray-200 px-2.5 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={handleResetToMinimum}
                    variant="outline"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("dashboard.reset")}</TooltipContent>
              </Tooltip>

              {/* Finalize Button */}
              <Button
                className="rounded-lg bg-teal-700 px-4 py-2 font-medium hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!canFinalize}
                onClick={handleFinalize}
              >
                <CheckCircle className="mr-1.5 h-4 w-4" />
                <span className="hidden sm:inline">
                  {t("dashboard.finalize")}
                </span>
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Service Cards - Vertical Stack */}
        <div className="mx-auto max-w-2xl px-4 py-6">
          <div className="space-y-4">
            {SERVICES_DATA.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>

        {/* Bottom Hint */}
        {!canFinalize && remaining > 0 && (
          <div className="-translate-x-1/2 fixed bottom-6 left-1/2 rounded-lg border border-gray-200 bg-white px-5 py-3 shadow-lg">
            <p className="text-gray-600 text-sm">
              <span className="font-medium text-amber-600">
                {t("dashboard.tip")}
              </span>{" "}
              {t("dashboard.tipMessage")}
            </p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
