import React, { useState, useEffect } from "react";
import BarChart from "./BarChart";
import TopMerchantsTable from "./TopMerchantsTable";
import { PieChart } from '@mui/x-charts/PieChart';
import { computeStats } from "../../utils/dashboardUtils";
import useMerchantStore from "../../store/useMerchantStore";

function Dashboard() {
  const { merchants, initializeMerchants } = useMerchantStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize merchants from Zustand store
    initializeMerchants();
    const t = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(t);
  }, [initializeMerchants]);

  const {
    totalVolume,
    activeMerchants,
    avgSuccessRate,
    avgChargeback,
    riskCounts,
    statusCounts,
  } = computeStats(merchants);

  return (
    <div className="p-6 space-y-6 bg-linear-to-b from-slate-50 to-white min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-600 mt-1">Overview of merchants and key metrics</p>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-sm text-slate-600">Last updated: {new Date().toLocaleDateString()}</p>
          <button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 600) }} className="px-3 py-2 bg-white border rounded-md text-sm">Refresh</button>
          <button onClick={() => { globalThis.history.pushState({}, '', '/merchants'); globalThis.location.reload(); }} className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm">Go to Merchants</button>
        </div>
      </div>

      {/* Hero / Primary metric */}
      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p className="text-sm text-slate-500">Total Volume</p>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-slate-900">${(totalVolume / 1000).toFixed(0)}K</span>
            <span className="text-sm text-slate-600">from {merchants.length} merchants</span>
          </div>
          <p className="text-sm text-slate-500 mt-2">Active: <span className="font-semibold text-slate-900">{activeMerchants}</span> • High risk: <span className="font-semibold text-orange-600">{riskCounts.high || 0}</span></p>
        </div>

        <div className="flex gap-3">
          <div className="bg-slate-50 border rounded-lg px-4 py-2 text-center">
            <div className="text-sm text-slate-500">Success Rate</div>
            <div className="text-lg font-semibold">{avgSuccessRate}%</div>
          </div>
          <div className="bg-slate-50 border rounded-lg px-4 py-2 text-center">
            <div className="text-sm text-slate-500">Chargeback</div>
            <div className="text-lg font-semibold">{avgChargeback}%</div>
          </div>
          <div className="bg-slate-50 border rounded-lg px-4 py-2 text-center">
            <div className="text-sm text-slate-500">High Risk</div>
            <div className="text-lg font-semibold text-orange-600">{riskCounts.high || 0}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Top Merchants by Volume</h3>
            <TopMerchantsTable merchants={merchants} loading={loading} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Risk Level Distribution</h3>
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-slate-200 rounded"></div>
                ))}
              </div>
            ) : (
              <PieChart
                series={[
                  {
                    data: Object.entries(riskCounts).map(([key, value], index) => ({
                      id: index,
                      value: value,
                      label: key,
                    })),
                    highlightScope: { faded: 'global', highlighted: 'item' },
                  },
                ]}
                height={200}
              />
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Merchant Status Distribution</h3>
            <BarChart data={statusCounts} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
