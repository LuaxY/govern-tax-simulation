import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SERVICES_DATA } from "@/data/services";
import {
  budgetStore,
  resetBudget,
  getServiceTierLevel,
  getPoliticalArchetype,
  getSpendableBudget,
  isServiceCollapsed,
} from "@/store/budgetStore";
import {
  RefreshCw,
  Trophy,
  AlertTriangle,
  Share2,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { ServiceIcon } from "@/components/dashboard/ServiceIcon";

export const Route = createFileRoute("/result")({
  component: ResultPage,
});

function ResultPage() {
  const navigate = useNavigate();
  const state = useStore(budgetStore);
  const archetype = getPoliticalArchetype(state);
  const spendable = getSpendableBudget(state);
  const isEditingRef = useRef(false);

  // Redirect if not finalized (unless we're intentionally editing)
  useEffect(() => {
    if (!state.isFinalized && !isEditingRef.current) {
      navigate({ to: "/" });
    }
  }, [state.isFinalized, navigate]);

  const handleRestart = () => {
    resetBudget();
    navigate({ to: "/" });
  };

  // Get maxed services (Tier 4) and collapsed services
  const maxedServices = SERVICES_DATA.filter(
    (s) => getServiceTierLevel(state, s) === 4
  );
  const collapsedServices = SERVICES_DATA.filter((s) =>
    isServiceCollapsed(state, s)
  );

  // Get all service stats for display
  const serviceStats = SERVICES_DATA.map((service) => ({
    service,
    tier: getServiceTierLevel(state, service),
    allocation: state.allocations[service.id] || 0,
    percentage: spendable > 0 ? ((state.allocations[service.id] || 0) / spendable) * 100 : 0,
    collapsed: isServiceCollapsed(state, service),
  })).sort((a, b) => b.allocation - a.allocation);

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-100 mb-4">
            <CheckCircle className="w-6 h-6 text-teal-700" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2 font-serif">
            Budget Finalized
          </h1>
          <p className="text-gray-500">
            Here's how your society would look based on your choices
          </p>
        </div>

        {/* Archetype Card */}
        {archetype && (
          <Card className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-xl bg-teal-50 flex items-center justify-center text-3xl shrink-0">
                {archetype.emoji}
              </div>
              <div>
                <p className="text-xs text-teal-700 font-semibold uppercase tracking-wider mb-1">
                  Your Political Archetype
                </p>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {archetype.name}
                </h2>
                <p className="text-sm text-gray-500">{archetype.description}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Maxed Services */}
          <Card className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Utopia Achieved</p>
                <p className="text-xs text-gray-400">Tier 4 Services</p>
              </div>
            </div>
            {maxedServices.length > 0 ? (
              <div className="space-y-1.5">
                {maxedServices.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-2 text-sm text-amber-700"
                  >
                    <ServiceIcon iconName={s.icon} className="w-4 h-4" />
                    <span className="truncate">{s.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">None</p>
            )}
          </Card>

          {/* Collapsed Services */}
          <Card className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Collapsed</p>
                <p className="text-xs text-gray-400">Below threshold</p>
              </div>
            </div>
            {collapsedServices.length > 0 ? (
              <div className="space-y-1.5">
                {collapsedServices.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-2 text-sm text-red-600"
                  >
                    <ServiceIcon iconName={s.icon} className="w-4 h-4" />
                    <span className="truncate">{s.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-teal-600 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                All operational
              </p>
            )}
          </Card>
        </div>

        {/* Full Breakdown */}
        <Card className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h3 className="font-medium text-gray-900 mb-4">Budget Breakdown</h3>
          <div className="space-y-3">
            {serviceStats.map(({ service, tier, allocation, collapsed }) => (
              <div
                key={service.id}
                className="flex items-center gap-3"
              >
                <ServiceIcon
                  iconName={service.icon}
                  className={`w-5 h-5 shrink-0 ${
                    collapsed
                      ? "text-red-500"
                      : tier === 4
                      ? "text-amber-500"
                      : "text-gray-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {service.name}
                    </span>
                    <span className="text-xs text-gray-400 shrink-0">
                      Tier {tier}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          collapsed
                            ? "bg-red-500"
                            : tier === 4
                            ? "bg-amber-500"
                            : "bg-teal-600"
                        }`}
                        style={{ width: `${Math.min(100, (allocation / (spendable * service.maxCost)) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-16 text-right tabular-nums">
                      {state.currencySymbol}{allocation.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            onClick={() => {
              isEditingRef.current = true;
              budgetStore.setState((s) => ({ ...s, isFinalized: false }));
              navigate({ to: "/dashboard" });
            }}
            className="border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg py-5 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={handleRestart}
            className="border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg py-5 font-medium"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Restart
          </Button>
          <Button
            onClick={() => {
              const text = encodeURIComponent(
                `I'm ${archetype?.name}! I allocated my taxes on The People's Ledger. Try it yourself!`
              );
              const url = encodeURIComponent(window.location.origin);
              window.open(
                `https://x.com/intent/tweet?text=${text}&url=${url}`,
                "_blank"
              );
            }}
            className="bg-teal-700 hover:bg-teal-800 rounded-lg py-5 font-medium"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
