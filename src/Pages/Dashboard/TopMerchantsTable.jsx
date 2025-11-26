import React from "react";
import { getRiskBadgeClasses } from "../../utils/dashboardUtils";

function TopMerchantsTable({ merchants, loading }) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-slate-200 rounded"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Merchant</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Country</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Volume</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Risk</th>
          </tr>
        </thead>
        <tbody>
          {[...merchants]
            .sort((a, b) => b.monthlyVolume - a.monthlyVolume)
            .map((item) => (
              <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 text-sm font-medium">{item.name}</td>
                <td className="py-3 px-4 text-sm text-slate-600">{item.country}</td>
                <td className="py-3 px-4 text-sm font-semibold text-slate-900">${(item.monthlyVolume / 1000).toFixed(0)}K</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.status === "active"
                      ? "bg-green-100 text-green-800"
                      : item.status === "paused"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskBadgeClasses(item.risk)}`}>
                    {item.risk}
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default TopMerchantsTable;
