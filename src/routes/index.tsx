import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Landmark, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/data/services";
import { formatCurrency } from "@/lib/utils";
import { resetBudget } from "@/store/budget-store";

export const Route = createFileRoute("/")({
  component: SetupPage,
});

function SetupPage() {
  const navigate = useNavigate();

  const handleStart = () => {
    // Reset budget to initial state (all services at minimum)
    resetBudget();
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-teal-700">
            <Landmark className="h-7 w-7 text-white" />
          </div>
          <h1 className="mb-3 font-semibold font-serif text-3xl text-gray-900">
            Govern
          </h1>
          <p className="text-gray-500 leading-relaxed">
            Allocate your nation's budget and discover the trade-offs of
            governance.
          </p>
        </div>

        {/* Budget Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {/* Fixed budget display */}
          <div className="mb-6 text-center">
            <p className="mb-2 text-gray-500 text-sm">National Annual Budget</p>
            <p className="font-bold text-4xl text-teal-700 tabular-nums">
              {formatCurrency(
                APP_CONFIG.fixedBudget,
                APP_CONFIG.currencySymbol
              )}
            </p>
          </div>

          {/* Info cards */}
          <div className="mb-6 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="mb-1 flex items-center gap-2 text-gray-600">
                <Scale className="h-4 w-4" />
                <span className="font-medium text-xs">8 Services</span>
              </div>
              <p className="text-gray-500 text-xs">
                Each with mandatory minimum funding
              </p>
            </div>
            <div className="rounded-lg bg-amber-50 p-3">
              <div className="mb-1 flex items-center gap-2 text-amber-700">
                <Landmark className="h-4 w-4" />
                <span className="font-medium text-xs">Trade-offs Required</span>
              </div>
              <p className="text-amber-600 text-xs">
                Can't fund everything fully
              </p>
            </div>
          </div>

          {/* Info text */}
          <p className="mb-5 text-center text-gray-400 text-xs">
            All services start at minimum viable funding. You decide where to
            invest more.
          </p>

          {/* Start button */}
          <Button
            className="w-full rounded-lg bg-teal-700 py-5 font-medium text-base hover:bg-teal-800"
            onClick={handleStart}
          >
            Begin Allocation
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Footer hint */}
        <p className="mt-6 text-center text-gray-400 text-sm">
          Every choice has consequences • Trade-offs are inevitable
        </p>
      </div>
    </div>
  );
}
