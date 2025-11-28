import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { Toaster } from "sonner";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { WalletBar } from "@/components/layout/WalletBar";
import { budgetStore } from "@/store/budget-store";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const totalTaxInput = useStore(budgetStore, (s) => s.totalTaxInput);
  const showWallet = totalTaxInput > 0;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Language Switcher - fixed at top right (always on desktop, only when no wallet on mobile) */}
      <div
        className={`fixed top-4 right-4 z-50 ${showWallet ? "hidden sm:block" : ""}`}
      >
        <LanguageSwitcher />
      </div>

      {/* Wallet Bar - sticky at top when active */}
      {showWallet && <WalletBar />}

      {/* Main content */}
      <main>
        <Outlet />
      </main>

      {/* Toast notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#ffffff",
            border: "1px solid #e5e5e5",
            color: "#171717",
          },
        }}
      />
    </div>
  );
}
