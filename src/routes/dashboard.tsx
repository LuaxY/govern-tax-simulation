import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/dashboard/ServiceCard";
import { SERVICES_DATA } from "@/data/services";
import {
  budgetStore,
  getRemainingFunds,
  getSpendableBudget,
  finalizeBudget,
} from "@/store/budgetStore";
import { CheckCircle, ArrowRight, Equal, Shuffle, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const state = useStore(budgetStore);
  const remaining = getRemainingFunds(state);
  const spendable = getSpendableBudget(state);

  // Redirect to home if no tax input
  useEffect(() => {
    if (state.totalTaxInput <= 0) {
      navigate({ to: "/" });
    }
  }, [state.totalTaxInput, navigate]);

  const canFinalize = remaining >= -0.01 && remaining <= state.totalTaxInput * 0.05;

  const handleFinalize = () => {
    finalizeBudget();
    navigate({ to: "/result" });
  };

  const handleDistributeEvenly = () => {
    const perService = spendable / SERVICES_DATA.length;
    const newAllocations: Record<string, number> = {};
    SERVICES_DATA.forEach((service) => {
      // Cap at the service's max cost
      const maxForService = spendable * service.maxCost;
      newAllocations[service.id] = Math.min(perService, maxForService);
    });
    budgetStore.setState((s) => ({
      ...s,
      allocations: newAllocations,
    }));
  };

  const handleRandomize = () => {
    // Generate random weights
    const weights = SERVICES_DATA.map(() => Math.random());
    const totalWeight = weights.reduce((a, b) => a + b, 0);

    const newAllocations: Record<string, number> = {};
    let allocated = 0;

    SERVICES_DATA.forEach((service, i) => {
      const proportion = weights[i] / totalWeight;
      const amount = spendable * proportion;
      // Cap at the service's max cost
      const maxForService = spendable * service.maxCost;
      const finalAmount = Math.min(amount, maxForService);
      newAllocations[service.id] = finalAmount;
      allocated += finalAmount;
    });

    // If we have leftover due to caps, redistribute
    const leftover = spendable - allocated;
    if (leftover > 0) {
      // Find services that aren't maxed and add to them
      const notMaxed = SERVICES_DATA.filter(
        (s) => newAllocations[s.id] < spendable * s.maxCost
      );
      if (notMaxed.length > 0) {
        const perService = leftover / notMaxed.length;
        notMaxed.forEach((s) => {
          const maxForService = spendable * s.maxCost;
          newAllocations[s.id] = Math.min(
            newAllocations[s.id] + perService,
            maxForService
          );
        });
      }
    }

    budgetStore.setState((s) => ({
      ...s,
      allocations: newAllocations,
    }));
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen pb-24">
        {/* Header */}
        <div className="sticky top-[73px] z-20 bg-[#fafafa] border-b border-gray-100 py-4 px-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-xl font-semibold text-gray-900">
                Allocate Your Budget
              </h1>
              <p className="text-sm text-gray-500 mt-0.5 hidden sm:block">
                Use the sliders to fund each service
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {/* Distribute Evenly Button */}
              <Button
                variant="outline"
                onClick={handleDistributeEvenly}
                className="border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg px-3 py-2 font-medium text-sm"
              >
                <Equal className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">Distribute</span>
              </Button>

              {/* Randomize Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={handleRandomize}
                    className="border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg px-2.5 py-2"
                  >
                    <Shuffle className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Randomize allocation</TooltipContent>
              </Tooltip>

              {/* Reset Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const resetAllocations: Record<string, number> = {};
                      SERVICES_DATA.forEach((s) => {
                        resetAllocations[s.id] = 0;
                      });
                      budgetStore.setState((s) => ({
                        ...s,
                        allocations: resetAllocations,
                      }));
                    }}
                    className="border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg px-2.5 py-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset all to zero</TooltipContent>
              </Tooltip>

              {/* Finalize Button */}
              <Button
                onClick={handleFinalize}
                disabled={!canFinalize}
                className="bg-teal-700 hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg px-4 py-2 font-medium"
              >
                <CheckCircle className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">Finalize</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Service Cards - Vertical Stack */}
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="space-y-4">
            {SERVICES_DATA.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>

        {/* Bottom Hint */}
        {!canFinalize && remaining > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-lg px-5 py-3 shadow-lg">
            <p className="text-sm text-gray-600">
              <span className="text-amber-600 font-medium">Tip:</span> Allocate all your funds to finalize your budget
            </p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
