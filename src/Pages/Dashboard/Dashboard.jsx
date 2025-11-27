import React, { useState, useEffect } from "react";
import BarChart from "./BarChart";
import TopMerchantsTable from "./TopMerchantsTable";
import { PieChart } from "@mui/x-charts/PieChart";
import { computeStats } from "../../utils/dashboardUtils";
import useMerchantStore from "../../store/useMerchantStore";

export default function Dashboard() {
  const { merchants, initializeMerchants } = useMerchantStore();

  const [isLoading, setIsLoading] = useState(true);

  // Load merchants initially
  useEffect(() => {
    initializeMerchants();

    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [initializeMerchants]);

  // Stats
  const {
    totalVolume,
    activeMerchants,
    avgSuccessRate,
    avgChargeback,
    riskCounts,
    statusCounts,
  } = computeStats(merchants);


  // Navigate (simple)
  const goToMerchantsPage = () => {
    globalThis.history.pushState({}, "", "/merchants");
    globalThis.location.reload();
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-linear-to-b from-slate-50 to-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Overview of merchants and key metrics
          </p>
        </div>

        {/* Buttons Mobile Responsive */}
        <div className="flex flex-wrap gap-3 text-sm">
          <button
            onClick={goToMerchantsPage}
            className="px-3 py-2 bg-blue-600 text-white rounded-md"
          >
            Go to Merchants
          </button>
        </div>
      </div>

      {/* Primary Metrics Section */}
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left: Main Volume Section */}
        <div className="flex-1">
          <p className="text-sm text-slate-500">Total Volume</p>

          <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              ${(totalVolume / 1000).toFixed(0)}K
            </span>

            <span className="text-sm text-slate-600">
              from {merchants.length} merchants
            </span>
          </div>

          <p className="text-sm text-slate-500 mt-2">
            Active:{" "}
            <span className="font-semibold text-slate-900">
              {activeMerchants}
            </span>{" "}
            • High risk:{" "}
            <span className="font-semibold text-orange-600">
              {riskCounts.high || 0}
            </span>
          </p>
        </div>

        {/* Right: Metrics Cards */}
        <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full md:w-auto">
          <div className="bg-slate-50 border rounded-lg px-4 py-2 w-full sm:w-auto text-center">
            <div className="text-sm text-slate-500">Success Rate</div>
            <div className="text-lg font-semibold">{avgSuccessRate}%</div>
          </div>

          <div className="bg-slate-50 border rounded-lg px-4 py-2 w-full sm:w-auto text-center">
            <div className="text-sm text-slate-500">Chargeback</div>
            <div className="text-lg font-semibold">{avgChargeback}%</div>
          </div>

          <div className="bg-slate-50 border rounded-lg px-4 py-2 w-full sm:w-auto text-center">
            <div className="text-sm text-slate-500">High Risk</div>
            <div className="text-lg font-semibold text-orange-600">
              {riskCounts.high || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Merchants Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 overflow-x-auto">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Top Merchants by Volume
            </h3>

            <TopMerchantsTable merchants={merchants} loading={isLoading} />
          </div>
        </div>

        {/* Right Column (Charts) */}
        <div className="space-y-6">
          {/* Risk Level Pie Chart */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Risk Level Distribution
            </h3>

            {isLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-slate-200 rounded"></div>
                ))}
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <PieChart
                  series={[
                    {
                      data: Object.entries(riskCounts).map(
                        ([label, value], index) => ({
                          id: index,
                          value,
                          label,
                        })
                      ),
                      highlightScope: {
                        faded: "global",
                        highlighted: "item",
                      },
                    },
                  ]}
                  height={200}
                />
              </div>
            )}
          </div>

          {/* Status Chart */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Merchant Status Distribution
            </h3>

            <BarChart data={statusCounts} loading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
