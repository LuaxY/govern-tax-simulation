import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/dashboard/ServiceCard";
import { APP_CONFIG, SERVICES_DATA } from "@/data/services";
import {
  budgetStore,
  getRemainingFunds,
  getTotalBudget,
  finalizeBudget,
  setAllocationsWithSubAllocations,
} from "@/store/budgetStore";
import { CheckCircle, ArrowRight, Equal, Shuffle, RotateCcw } from "lucide-react";
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
    SERVICES_DATA.forEach((service) => {
      newAllocations[service.id] = service.minCost;
    });

    // Calculate remaining budget after minimums
    const discretionary = totalBudget - totalMinRequired;

    // Distribute remaining evenly across services (up to their max)
    const perService = discretionary / SERVICES_DATA.length;
    
    SERVICES_DATA.forEach((service) => {
      const currentAllocation = newAllocations[service.id];
      const maxAddable = service.maxCost - currentAllocation;
      const toAdd = Math.min(perService, maxAddable);
      newAllocations[service.id] = currentAllocation + toAdd;
    });

    setAllocationsWithSubAllocations(newAllocations);
  };

  const handleRandomize = () => {
    // Start with all services at minimum
    const newAllocations: Record<string, number> = {};
    SERVICES_DATA.forEach((service) => {
      newAllocations[service.id] = service.minCost;
    });

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
    SERVICES_DATA.forEach((s) => {
      resetAllocations[s.id] = s.minCost;
    });
    setAllocationsWithSubAllocations(resetAllocations);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen pb-24">
        {/* Header */}
        <div className="sticky top-[73px] z-20 bg-[#fafafa] border-b border-gray-100 py-4 px-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-xl font-semibold text-gray-900">
                Allocate the National Budget
              </h1>
              <p className="text-sm text-gray-500 mt-0.5 hidden sm:block">
                Use the sliders to fund each government service
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
                    onClick={handleResetToMinimum}
                    className="border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg px-2.5 py-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset all to minimum</TooltipContent>
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
              <span className="text-amber-600 font-medium">Tip:</span> Allocate the entire budget to finalize your government's priorities
            </p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
