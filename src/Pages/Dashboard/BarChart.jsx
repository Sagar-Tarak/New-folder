import React from "react";
import PropTypes from "prop-types";
import { BarChart as MuiBarChart } from "@mui/x-charts/BarChart";

export default function BarChart({ data, loading }) {
  // Convert object → chart-friendly arrays
  const entries = Object.entries(data || {});
  const labels = entries.map(([key]) => key);
  const values = entries.map(([, val]) => Number(val) || 0);

  // Show skeleton while loading
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-5 w-1/3 bg-slate-200 rounded mb-6"></div>

        <div className="space-y-4">
          {[1, 2, 3].map((id) => (
            <div key={id} className="h-12 bg-slate-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  // No meaningful data
  if (!entries.length) {
    return (
      <p className="text-sm text-slate-500">
        No data available.
      </p>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <MuiBarChart
        xAxis={[{ scaleType: "band", data: labels }]}
        series={[
          {
            data: values,
            color: "#2563eb", // tailwind blue-600
          },
        ]}
        height={250}
        margin={{ top: 20, bottom: 40, left: 10, right: 10 }}
      />
    </div>
  );
}

BarChart.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool,
};
