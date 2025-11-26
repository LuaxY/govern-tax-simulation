import { forwardRef } from "react";
import { SERVICES_DATA } from "@/data/services";
import { getServiceTierLevel } from "@/store/budgetStore";
import { formatCurrency } from "@/lib/utils";
import type { BudgetState } from "@/types";
import type { PolicyTrait } from "@/data/services";

interface Archetype {
	id: string;
	name: string;
	description: string;
	emoji: string;
	isCompound: boolean;
	primaryId: string;
	secondaryId?: string;
}

interface GovernanceStyle {
	name: string;
	emoji: string;
}

interface ShareCardProps {
	archetype: Archetype | null;
	policyTraits: PolicyTrait[];
	governanceStyle: GovernanceStyle | null;
	state: BudgetState;
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
	({ archetype, policyTraits, governanceStyle, state }, ref) => {
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
				ref={ref}
				className="w-[600px] h-[400px] p-6 flex flex-col"
				style={{
					background: "linear-gradient(135deg, #0f766e 0%, #134e4a 50%, #1e3a3a 100%)",
					fontFamily: "system-ui, -apple-system, sans-serif",
				}}
			>
				{/* Header */}
				<div className="flex items-start gap-4 mb-4">
					{/* Archetype Emoji */}
					<div
						className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shrink-0"
						style={{ background: "rgba(255, 255, 255, 0.15)" }}
					>
						{archetype?.emoji || "⚖️"}
					</div>

					{/* Archetype Info */}
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 mb-1 flex-wrap">
							<span
								className="text-[10px] font-bold uppercase tracking-wider"
								style={{ color: "rgba(255, 255, 255, 0.6)" }}
							>
								Government Identity
							</span>
							{archetype?.isCompound && (
								<span
									className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
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
									className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
									style={{
										background: "rgba(59, 130, 246, 0.3)",
										color: "#bfdbfe",
									}}
								>
									{governanceStyle.emoji} {governanceStyle.name}
								</span>
							)}
						</div>
						<h2
							className="text-2xl font-bold mb-1"
							style={{ color: "#ffffff" }}
						>
							{archetype?.name || "The Balanced"}
						</h2>
						<p
							className="text-sm leading-snug"
							style={{ color: "rgba(255, 255, 255, 0.7)" }}
						>
							{archetype?.description || "You seek equilibrium across all sectors."}
						</p>
					</div>
				</div>

				{/* Policy Traits */}
				{policyTraits.length > 0 && (
					<div className="flex flex-wrap gap-2 mb-4">
						{policyTraits.slice(0, 4).map((trait) => (
							<span
								key={trait.id}
								className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
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
						className="text-xs font-semibold uppercase tracking-wider mb-3"
						style={{ color: "rgba(255, 255, 255, 0.5)" }}
					>
						Top Priorities
					</h3>
					<div className="space-y-2.5">
						{topServices.map(({ service, allocation, tier }) => (
							<div key={service.id} className="flex items-center gap-3">
								<span
									className="w-24 text-sm font-medium truncate"
									style={{ color: "rgba(255, 255, 255, 0.9)" }}
								>
									{service.name.split(" ")[0]}
								</span>
								<div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255, 255, 255, 0.1)" }}>
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
									className="w-14 text-xs font-medium text-right tabular-nums"
									style={{ color: "rgba(255, 255, 255, 0.7)" }}
								>
									{formatCurrency(allocation, state.currencySymbol)}
								</span>
								<span
									className="w-10 text-[10px] font-semibold text-right"
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
				<div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
					<div className="flex items-center gap-2">
						<span className="text-lg">🏛️</span>
						<span
							className="text-sm font-semibold"
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
					<span
						className="text-xs"
						style={{ color: "rgba(255, 255, 255, 0.4)" }}
					>
						Try it yourself →
					</span>
				</div>
			</div>
		);
	}
);

ShareCard.displayName = "ShareCard";

