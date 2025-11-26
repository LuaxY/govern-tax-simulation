import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setTaxInput, setCurrencySymbol } from "@/store/budgetStore";
import { Wallet, ArrowRight, DollarSign, Euro, PoundSterling } from "lucide-react";

export const Route = createFileRoute("/")({
  component: SetupPage,
});

const currencies = [
  { symbol: "$", icon: DollarSign, name: "USD" },
  { symbol: "€", icon: Euro, name: "EUR" },
  { symbol: "£", icon: PoundSterling, name: "GBP" },
];

function SetupPage() {
  const navigate = useNavigate();
  const [taxAmount, setTaxAmount] = useState<string>("");
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

  const handleSubmit = () => {
    const amount = parseFloat(taxAmount.replace(/,/g, ""));
    if (amount > 0) {
      setCurrencySymbol(selectedCurrency.symbol);
      setTaxInput(amount);
      navigate({ to: "/dashboard" });
    }
  };

  const formatNumber = (value: string) => {
    const num = value.replace(/[^\d]/g, "");
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const parsedAmount = parseFloat(taxAmount.replace(/,/g, "")) || 0;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-teal-700 mb-5">
            <Wallet className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-3 font-serif">
            The People's Ledger
          </h1>
          <p className="text-gray-500 leading-relaxed">
            Allocate your tax contribution to public services and see the impact of your choices.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Income Tax Paid Last Year
          </label>

          {/* Currency selector */}
          <div className="flex gap-2 mb-3">
            {currencies.map((currency) => (
              <button
                key={currency.symbol}
                onClick={() => setSelectedCurrency(currency)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                  selectedCurrency.symbol === currency.symbol
                    ? "bg-teal-50 border-teal-600 text-teal-700"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <currency.icon className="w-3.5 h-3.5" />
                {currency.name}
              </button>
            ))}
          </div>

          {/* Amount input */}
          <div className="relative mb-4">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-gray-400 font-medium">
              {selectedCurrency.symbol}
            </span>
            <Input
              type="text"
              value={taxAmount}
              onChange={(e) => setTaxAmount(formatNumber(e.target.value))}
              placeholder="15,000"
              className="pl-8 py-5 text-xl font-medium bg-white border-gray-200 rounded-lg focus:border-teal-500 focus:ring-teal-500/20"
            />
          </div>

          {/* Info text */}
          <p className="text-xs text-gray-400 mb-5">
            5% will be allocated to bureaucracy overhead automatically
          </p>

          {/* Submit button */}
          <Button
            onClick={handleSubmit}
            disabled={parsedAmount <= 0}
            className="w-full py-5 text-base font-medium bg-teal-700 hover:bg-teal-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Simulation
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Footer hint */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Your choices unlock societal perks • Zero real money involved
        </p>
      </div>
    </div>
  );
}
