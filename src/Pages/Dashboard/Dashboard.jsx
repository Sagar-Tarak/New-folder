import React, { useState, useEffect } from "react";
import merchantsData from "../../data/merchants.json";

function Dashboard() {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load merchants (fake delay)
  useEffect(() => {
    setTimeout(() => {
      setMerchants(merchantsData);
      setLoading(false);
    }, 500);
  }, []);

  // Summary values (total, active, etc.)

  const totalVolume = merchants.reduce(
    (sum, item) => sum + item.monthlyVolume,
    0
  );

  const activeMerchants = merchants.filter(
    (item) => item.status === "active"
  ).length;

  const avgChargeback =
    merchants.length > 0
      ? (
          merchants.reduce((sum, item) => sum + item.chargebackRatio, 0) /
          merchants.length
        ).toFixed(2)
      : 0;

  const avgSuccessRate = (100 - avgChargeback).toFixed(2);

  // Count merchants by any key (risk, status)
  const countByKey = (key) => {
    const result = {};
    merchants.forEach((item) => {
      result[item[key]] = (result[item[key]] || 0) + 1;
    });
    return result;
  };

  const riskCounts = countByKey("risk");
  const statusCounts = countByKey("status");

  // Stat Card 
  function StatCard({ title, value, subtitle, icon, color = "blue" }) {
    const bgColors = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
      orange: "from-orange-500 to-orange-600",
    };

    // Skeleton UI 
    if (loading) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-slate-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-slate-200 rounded w-1/3"></div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-l-transparent hover:border-l-blue-500">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-600 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>

          <div className={`bg-linear-to-br ${bgColors[color]} p-3 rounded-lg text-white`}>
            {icon}
          </div>
        </div>
      </div>
    );
  }

  // Bar Chart 
  function BarChart({ title, data }) {
    const maxValue = Math.max(...Object.values(data));

    if (loading) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div className="h-5 bg-slate-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">{title}</h3>

        <div className="space-y-4">
          {Object.entries(data).map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium capitalize">{key}</span>
                <span className="text-sm font-semibold">{value}</span>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-linear-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                  style={{ width: `${(value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  
  // Main Dashboard UI (unchanged visually)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">
          Overview of merchant operations and key metrics
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Volume"
          value={`$${(totalVolume / 1000).toFixed(0)}K`}
          subtitle={`${merchants.length} merchants`}
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <StatCard
          title="Active Merchants"
          value={activeMerchants}
          subtitle={`${((activeMerchants / merchants.length) * 100).toFixed(0)}% of total`}
          color="green"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor">
              <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857..." />
            </svg>
          }
        />

        <StatCard
          title="Avg Success Rate"
          value={`${avgSuccessRate}%`}
          subtitle={`${avgChargeback}% chargeback ratio`}
          color="purple"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor">
              <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5..." />
            </svg>
          }
        />

        <StatCard
          title="High Risk Count"
          value={riskCounts.high || 0}
          subtitle="Needs attention"
          color="orange"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor">
              <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856..." />
            </svg>
          }
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart title="Risk Level Distribution" data={riskCounts} />
        <BarChart title="Merchant Status Distribution" data={statusCounts} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Top Merchants by Volume
        </h3>

        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-slate-200 rounded"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                    Merchant
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                    Country
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                    Volume
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                    Risk
                  </th>
                </tr>
              </thead>

              <tbody>
                {[...merchants]
                  .sort((a, b) => b.monthlyVolume - a.monthlyVolume)
                  .map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-3 px-4 text-sm font-medium">
                        {item.name}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {item.country}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-slate-900">
                        ${(item.monthlyVolume / 1000).toFixed(0)}K
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.status === "active"
                              ? "bg-green-100 text-green-800"
                              : item.status === "paused"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.risk === "low"
                              ? "bg-blue-100 text-blue-800"
                              : item.risk === "medium"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.risk}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
