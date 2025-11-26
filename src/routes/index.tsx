import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { resetBudget } from "@/store/budgetStore";
import { APP_CONFIG } from "@/data/services";
import { Landmark, ArrowRight, Scale } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

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
		<div className="min-h-screen flex items-center justify-center px-4 py-12">
			<div className="max-w-md w-full">
				{/* Header */}
				<div className="text-center mb-10">
					<div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-teal-700 mb-5">
						<Landmark className="w-7 h-7 text-white" />
					</div>
					<h1 className="text-3xl font-semibold text-gray-900 mb-3 font-serif">
						Govern
					</h1>
					<p className="text-gray-500 leading-relaxed">
						Allocate your nation's budget and discover the trade-offs of
						governance.
					</p>
				</div>

				{/* Budget Card */}
				<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
					{/* Fixed budget display */}
					<div className="text-center mb-6">
						<p className="text-sm text-gray-500 mb-2">National Annual Budget</p>
						<p className="text-4xl font-bold text-teal-700 tabular-nums">
							{formatCurrency(
								APP_CONFIG.fixedBudget,
								APP_CONFIG.currencySymbol,
							)}
						</p>
					</div>

					{/* Info cards */}
					<div className="grid grid-cols-2 gap-3 mb-6">
						<div className="bg-gray-50 rounded-lg p-3">
							<div className="flex items-center gap-2 text-gray-600 mb-1">
								<Scale className="w-4 h-4" />
								<span className="text-xs font-medium">8 Services</span>
							</div>
							<p className="text-xs text-gray-500">
								Each with mandatory minimum funding
							</p>
						</div>
						<div className="bg-amber-50 rounded-lg p-3">
							<div className="flex items-center gap-2 text-amber-700 mb-1">
								<Landmark className="w-4 h-4" />
								<span className="text-xs font-medium">Trade-offs Required</span>
							</div>
							<p className="text-xs text-amber-600">
								Can't fund everything fully
							</p>
						</div>
					</div>

					{/* Info text */}
					<p className="text-xs text-gray-400 mb-5 text-center">
						All services start at minimum viable funding. You decide where to
						invest more.
					</p>

					{/* Start button */}
					<Button
						onClick={handleStart}
						className="w-full py-5 text-base font-medium bg-teal-700 hover:bg-teal-800 rounded-lg"
					>
						Begin Allocation
						<ArrowRight className="w-4 h-4 ml-2" />
					</Button>
				</div>

				{/* Footer hint */}
				<p className="text-center text-gray-400 text-sm mt-6">
					Every choice has consequences • Trade-offs are inevitable
				</p>
			</div>
		</div>
	);
}
