import React from "react";
import { getRiskBadgeClasses } from "../../utils/dashboardUtils";

function TopMerchantsTable({ merchants, loading }) {
  // Loading skeleton
  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-slate-200 rounded"></div>
        ))}
      </div>
    );
  }

  // Sort merchants by volume DESC
  const sortedMerchants = [...merchants].sort(
    (a, b) => b.monthlyVolume - a.monthlyVolume
  );

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            {["Merchant", "Country", "Volume", "Status", "Risk"].map(
              (header) => (
                <th
                  key={header}
                  className="text-left py-2.5 px-4 font-semibold text-slate-700 whitespace-nowrap"
                >
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody>
          {sortedMerchants.map((merchant) => {
            const statusColor =
              merchant.status === "active"
                ? "bg-green-100 text-green-800"
                : merchant.status === "paused"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800";

            return (
              <tr
                key={merchant.id}
                className="border-b border-slate-100 hover:bg-slate-50 transition"
              >
                <td className="py-2.5 px-4 font-medium text-slate-900 whitespace-nowrap">
                  {merchant.name}
                </td>

                <td className="py-2.5 px-4 text-slate-600 whitespace-nowrap">
                  {merchant.country}
                </td>

                <td className="py-2.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                  ${(merchant.monthlyVolume / 1000).toFixed(0)}K
                </td>

                <td className="py-2.5 px-4 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}
                  >
                    {merchant.status}
                  </span>
                </td>

                <td className="py-2.5 px-4 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskBadgeClasses(
                      merchant.risk
                    )}`}
                  >
                    {merchant.risk}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TopMerchantsTable;
