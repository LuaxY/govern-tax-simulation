import type { RefObject } from "react";
import type { PolicyTrait } from "@/data/services";
import { SERVICES_DATA } from "@/data/services";
import { formatCurrency } from "@/lib/utils";
import { getServiceTierLevel } from "@/store/budget-store";
import type { BudgetState } from "@/types";

type Archetype = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  isCompound: boolean;
  primaryId: string;
  secondaryId?: string;
};

type GovernanceStyle = {
  name: string;
  emoji: string;
};

type ShareCardProps = {
  archetype: Archetype | null;
  policyTraits: PolicyTrait[];
  governanceStyle: GovernanceStyle | null;
  state: BudgetState;
};

export const ShareCard = ({
  archetype,
  policyTraits,
  governanceStyle,
  state,
  ref,
}: ShareCardProps & { ref?: RefObject<HTMLDivElement | null> }) => {
  // Get top 4 services by allocation
  const topServices = [...SERVICES_DATA]
    .map((service) => ({
      service,
      allocation: state.allocations[service.id] || service.minCost,
      tier: getServiceTierLevel(state, service),
    }))
    .sort((a, b) => b.allocation - a.allocation)
    .slice(0, 4);

  const maxAllocation = topServices[0]?.allocation || 1;

  return (
    <div
      className="flex h-[400px] w-[600px] flex-col p-6"
      ref={ref}
      style={{
        background:
          "linear-gradient(135deg, #0f766e 0%, #134e4a 50%, #1e3a3a 100%)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Header */}
      <div className="mb-4 flex items-start gap-4">
        {/* Archetype Emoji */}
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-4xl"
          style={{ background: "rgba(255, 255, 255, 0.15)" }}
        >
          {archetype?.emoji || "⚖️"}
        </div>

        {/* Archetype Info */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span
              className="font-bold text-[10px] uppercase tracking-wider"
              style={{ color: "rgba(255, 255, 255, 0.6)" }}
            >
              Government Identity
            </span>
            {archetype?.isCompound && (
              <span
                className="rounded-full px-2 py-0.5 font-semibold text-[10px]"
                style={{
                  background: "rgba(168, 85, 247, 0.3)",
                  color: "#e9d5ff",
                }}
              >
                ✨ Hybrid
              </span>
            )}
            {governanceStyle && (
              <span
                className="rounded-full px-2 py-0.5 font-semibold text-[10px]"
                style={{
                  background: "rgba(59, 130, 246, 0.3)",
                  color: "#bfdbfe",
                }}
              >
                {governanceStyle.emoji} {governanceStyle.name}
              </span>
            )}
          </div>
          <h2 className="mb-1 font-bold text-2xl" style={{ color: "#ffffff" }}>
            {archetype?.name || "The Balanced"}
          </h2>
          <p
            className="text-sm leading-snug"
            style={{ color: "rgba(255, 255, 255, 0.7)" }}
          >
            {archetype?.description ||
              "You seek equilibrium across all sectors."}
          </p>
        </div>
      </div>

      {/* Policy Traits */}
      {policyTraits.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {policyTraits.slice(0, 4).map((trait) => (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium text-xs"
              key={trait.id}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                color: "rgba(255, 255, 255, 0.9)",
              }}
            >
              <span>{trait.emoji}</span>
              <span>{trait.name}</span>
            </span>
          ))}
        </div>
      )}

      {/* Budget Breakdown */}
      <div
        className="flex-1 rounded-xl p-4"
        style={{ background: "rgba(0, 0, 0, 0.2)" }}
      >
        <h3
          className="mb-3 font-semibold text-xs uppercase tracking-wider"
          style={{ color: "rgba(255, 255, 255, 0.5)" }}
        >
          Top Priorities
        </h3>
        <div className="space-y-2.5">
          {topServices.map(({ service, allocation, tier }) => (
            <div className="flex items-center gap-3" key={service.id}>
              <span
                className="w-24 truncate font-medium text-sm"
                style={{ color: "rgba(255, 255, 255, 0.9)" }}
              >
                {service.name.split(" ")[0]}
              </span>
              <div
                className="h-2 flex-1 overflow-hidden rounded-full"
                style={{ background: "rgba(255, 255, 255, 0.1)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(allocation / maxAllocation) * 100}%`,
                    background:
                      tier === 4
                        ? "linear-gradient(90deg, #2dd4bf, #14b8a6)"
                        : "linear-gradient(90deg, #5eead4, #2dd4bf)",
                  }}
                />
              </div>
              <span
                className="w-14 text-right font-medium text-xs tabular-nums"
                style={{ color: "rgba(255, 255, 255, 0.7)" }}
              >
                {formatCurrency(allocation, state.currencySymbol)}
              </span>
              <span
                className="w-10 text-right font-semibold text-[10px]"
                style={{
                  color: tier === 4 ? "#2dd4bf" : "rgba(255, 255, 255, 0.5)",
                }}
              >
                T{tier}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Branding */}
      <div
        className="mt-4 flex items-center justify-between pt-3"
        style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🏛️</span>
          <span
            className="font-semibold text-sm"
            style={{ color: "rgba(255, 255, 255, 0.9)" }}
          >
            Govern
          </span>
          <span
            className="text-xs"
            style={{ color: "rgba(255, 255, 255, 0.5)" }}
          >
            Budget Simulator
          </span>
        </div>
        <span className="text-xs" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
          Try it yourself →
        </span>
      </div>
    </div>
  );
};

ShareCard.displayName = "ShareCard";
