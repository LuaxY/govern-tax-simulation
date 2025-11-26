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
	getPolicyTraits,
	getGovernanceStyle,
	isServiceAtMinimum,
	getSubAllocationPercentage,
} from "@/store/budgetStore";
import { formatCurrency } from "@/lib/utils";
import {
	RefreshCw,
	Trophy,
	MinusCircle,
	Share2,
	CheckCircle,
	ArrowLeft,
	ChevronDown,
	Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ServiceIcon } from "@/components/dashboard/ServiceIcon";
import { motion, AnimatePresence } from "framer-motion";

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
		new Set(),
	);

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
		(s) => getServiceTierLevel(state, s) === 4,
	);
	const minimumServices = SERVICES_DATA.filter((s) =>
		isServiceAtMinimum(state, s),
	);

	// Get all service stats for display (keep original order like dashboard)
	const serviceStats = SERVICES_DATA.map((service) => ({
		service,
		tier: getServiceTierLevel(state, service),
		allocation: state.allocations[service.id] || service.minCost,
		atMinimum: isServiceAtMinimum(state, service),
	}));

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
						Here's how your nation would look based on your government's
						priorities
					</p>
				</div>

				{/* Archetype Card */}
				{archetype && (
					<Card className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
						<div className="flex items-start gap-5">
							<motion.div
								className="w-16 h-16 rounded-xl bg-teal-50 flex items-center justify-center text-3xl shrink-0"
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								{archetype.emoji}
							</motion.div>
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 mb-1">
									<p className="text-xs text-teal-700 font-semibold uppercase tracking-wider">
										Your Government's Identity
									</p>
									{archetype.isCompound && (
										<span className="text-[10px] font-medium text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full flex items-center gap-1">
											<Sparkles className="w-3 h-3" />
											Hybrid
										</span>
									)}
									{governanceStyle && (
										<span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">
											{governanceStyle.emoji} {governanceStyle.name}
										</span>
									)}
								</div>
								<h2 className="text-xl font-semibold text-gray-900 mb-1">
									{archetype.name}
								</h2>
								<p className="text-sm text-gray-500 mb-3">
									{archetype.description}
								</p>

								{/* Policy Traits */}
								{policyTraits.length > 0 && (
									<motion.div
										className="flex flex-wrap gap-2"
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.3, delay: 0.2 }}
									>
										{policyTraits.map((trait, index) => (
											<motion.span
												key={trait.id}
												className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full"
												initial={{ opacity: 0, scale: 0.8 }}
												animate={{ opacity: 1, scale: 1 }}
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
				<div className="grid grid-cols-2 gap-4 mb-6">
					{/* Maxed Services */}
					<Card className="bg-white border border-gray-200 rounded-xl p-5">
						<div className="flex items-center gap-2 mb-3">
							<div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
								<Trophy className="w-4 h-4 text-teal-600" />
							</div>
							<div>
								<p className="font-medium text-gray-900 text-sm">
									Utopia Achieved
								</p>
								<p className="text-xs text-gray-400">Tier 4 Services</p>
							</div>
						</div>
						{maxedServices.length > 0 ? (
							<div className="space-y-1.5">
								{maxedServices.map((s) => (
									<div
										key={s.id}
										className="flex items-center gap-2 text-sm text-teal-700"
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

					{/* Minimum Services */}
					<Card className="bg-white border border-gray-200 rounded-xl p-5">
						<div className="flex items-center gap-2 mb-3">
							<div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
								<MinusCircle className="w-4 h-4 text-amber-600" />
							</div>
							<div>
								<p className="font-medium text-gray-900 text-sm">At Minimum</p>
								<p className="text-xs text-gray-400">Just viable</p>
							</div>
						</div>
						{minimumServices.length > 0 ? (
							<div className="space-y-1.5">
								{minimumServices.map((s) => (
									<div
										key={s.id}
										className="flex items-center gap-2 text-sm text-amber-600"
									>
										<ServiceIcon iconName={s.icon} className="w-4 h-4" />
										<span className="truncate">{s.name}</span>
									</div>
								))}
							</div>
						) : (
							<p className="text-sm text-teal-600 flex items-center gap-1.5">
								<CheckCircle className="w-3.5 h-3.5" />
								All above minimum
							</p>
						)}
					</Card>
				</div>

				{/* Full Breakdown */}
				<Card className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
					<h3 className="font-medium text-gray-900 mb-4">Budget Breakdown</h3>
					<div className="space-y-3">
						{serviceStats.map(({ service, tier, allocation, atMinimum }) => {
							const hasSubServices =
								service.subServices && service.subServices.length > 0;
							const isExpanded = expandedServices.has(service.id);

							return (
								<div key={service.id}>
									<div
										className={`flex items-center gap-3 ${hasSubServices ? "cursor-pointer" : ""}`}
										onClick={() => hasSubServices && toggleExpanded(service.id)}
									>
										<ServiceIcon
											iconName={service.icon}
											className={`w-5 h-5 shrink-0 ${
												atMinimum
													? "text-amber-500"
													: tier === 4
														? "text-teal-600"
														: "text-emerald-500"
											}`}
										/>
										<div className="flex-1 min-w-0">
											<div className="flex items-center justify-between gap-2 mb-1">
												<span className="text-sm font-medium text-gray-700 truncate">
													{service.name}
												</span>
												<div className="flex items-center gap-2 shrink-0">
													<span className="text-xs text-gray-400">
														Tier {tier}
													</span>
													{hasSubServices && (
														<motion.div
															animate={{ rotate: isExpanded ? 180 : 0 }}
															transition={{ duration: 0.2 }}
														>
															<ChevronDown className="w-4 h-4 text-gray-400" />
														</motion.div>
													)}
												</div>
											</div>
											<div className="flex items-center gap-2">
												<div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
													<div
														className={`h-full rounded-full ${
															atMinimum
																? "bg-amber-400"
																: tier === 4
																	? "bg-teal-600"
																	: "bg-emerald-400"
														}`}
														style={{
															width: `${Math.min(100, (allocation / service.maxCost) * 100)}%`,
														}}
													/>
												</div>
												<span className="text-xs text-gray-500 w-16 text-right tabular-nums">
													{formatCurrency(allocation, state.currencySymbol)}
												</span>
											</div>
										</div>
									</div>

									{/* Sub-services Breakdown */}
									<AnimatePresence>
										{isExpanded && hasSubServices && (
											<motion.div
												initial={{ height: 0, opacity: 0 }}
												animate={{ height: "auto", opacity: 1 }}
												exit={{ height: 0, opacity: 0 }}
												transition={{ duration: 0.3, ease: "easeInOut" }}
												className="overflow-hidden"
											>
												<div className="ml-8 mt-2 pl-3 border-l-2 border-gray-100 space-y-2">
													{service.subServices!.map((subService) => {
														const subAllocation =
															state.subAllocations[service.id]?.[
																subService.id
															] || 0;
														const subPercentage = getSubAllocationPercentage(
															state,
															service.id,
															subService.id,
														);
														const isSubAtMinimum =
															subPercentage <= subService.minPercentage + 0.001;

														return (
															<div
																key={subService.id}
																className="flex items-center gap-2"
															>
																<div className="flex-1 min-w-0">
																	<div className="flex items-center justify-between gap-2 mb-0.5">
																		<div className="flex items-center gap-1.5">
																			<span className="text-xs text-gray-600 truncate">
																				{subService.name}
																			</span>
																			{isSubAtMinimum && (
																				<span className="text-[9px] font-medium text-amber-600 bg-amber-50 px-1 py-0.5 rounded">
																					MIN
																				</span>
																			)}
																		</div>
																		<span className="text-xs text-gray-400 shrink-0">
																			{Math.round(subPercentage * 100)}%
																		</span>
																	</div>
																	<div className="flex items-center gap-2">
																		<div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
																			<motion.div
																				className={`h-full rounded-full ${
																					isSubAtMinimum
																						? "bg-amber-300"
																						: tier === 4
																							? "bg-teal-400"
																							: "bg-emerald-300"
																				}`}
																				initial={{ width: 0 }}
																				animate={{
																					width: `${subPercentage * 100}%`,
																				}}
																				transition={{
																					duration: 0.3,
																					delay: 0.1,
																				}}
																			/>
																		</div>
																		<span className="text-xs text-gray-400 w-14 text-right tabular-nums">
																			{formatCurrency(
																				subAllocation,
																				state.currencySymbol,
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
							const traitEmojis = policyTraits
								.slice(0, 3)
								.map((t) => t.emoji)
								.join("");
							const hybridText = archetype?.isCompound ? " (Hybrid)" : "";
							const traitsText = traitEmojis ? ` ${traitEmojis}` : "";
							const text = encodeURIComponent(
								`My government is ${archetype?.name}${hybridText}!${traitsText}\n\nI allocated a national budget on Govern. Try it yourself!`,
							);
							const url = encodeURIComponent(window.location.origin);
							window.open(
								`https://x.com/intent/tweet?text=${text}&url=${url}`,
								"_blank",
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
