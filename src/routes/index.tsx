import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Landmark, Scale } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/data/services";
import { formatCurrency } from "@/lib/utils";
import { resetBudget } from "@/store/budget-store";

export const Route = createFileRoute("/")({
  component: SetupPage,
});

function SetupPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
            {t("home.title")}
          </h1>
          <p className="text-gray-500 leading-relaxed">{t("home.subtitle")}</p>
        </div>

        {/* Budget Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {/* Fixed budget display */}
          <div className="mb-6 text-center">
            <p className="mb-2 text-gray-500 text-sm">
              {t("home.budgetLabel")}
            </p>
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
                <span className="font-medium text-xs">
                  {t("home.services")}
                </span>
              </div>
              <p className="text-gray-500 text-xs">{t("home.servicesDesc")}</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-3">
              <div className="mb-1 flex items-center gap-2 text-amber-700">
                <Landmark className="h-4 w-4" />
                <span className="font-medium text-xs">
                  {t("home.tradeoffs")}
                </span>
              </div>
              <p className="text-amber-600 text-xs">
                {t("home.tradeoffsDesc")}
              </p>
            </div>
          </div>

          {/* Info text */}
          <p className="mb-5 text-center text-gray-400 text-xs">
            {t("home.infoText")}
          </p>

          {/* Start button */}
          <Button
            className="w-full rounded-lg bg-teal-700 py-5 font-medium text-base hover:bg-teal-800"
            onClick={handleStart}
          >
            {t("home.startButton")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Footer hint */}
        <p className="mt-6 text-center text-gray-400 text-sm">
          {t("home.footer")}
        </p>
      </div>
    </div>
  );
}
