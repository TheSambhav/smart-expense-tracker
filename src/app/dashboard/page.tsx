import { getSummary, getMonthlyData, getCategoriesData, getTransactionsList } from "@/actions/transactions";
import { KPICards } from "./components/KPICards";
import { SpendingLineChart } from "./components/SpendingLineChart";
import { CategoryPieChart } from "./components/CategoryPieChart";
import { CategoryBarChart } from "./components/CategoryBarChart";
import { TransactionTable } from "./components/TransactionTable";
import { ImportButton } from "./components/ImportButton";

export const dynamic = "force-dynamic"; // Ensure fresh data on load

export default async function DashboardPage() {
  // Fetch all data in parallel using Server Actions
  const [summary, monthly, categories, transactionsList] = await Promise.all([
    getSummary({}),
    getMonthlyData({}),
    getCategoriesData({}),
    getTransactionsList(1, 20)
  ]);

  return (
    <div className="flex-1 flex flex-col bg-gray-950">
      <div className="p-4 md:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <h2 className="text-xl font-semibold text-white">Overview</h2>
          <ImportButton />
        </div>

        {/* KPI Cards */}
        <KPICards data={summary} />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SpendingLineChart data={monthly} />
          </div>
          <CategoryPieChart data={categories} />
        </div>

        {/* Bar Chart */}
        <CategoryBarChart data={categories} />

        {/* Transaction Table */}
        <TransactionTable initialData={transactionsList} />
      </div>
    </div>
  );
}
