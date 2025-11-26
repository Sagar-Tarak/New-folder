import React from "react";
import PropTypes from 'prop-types';
import { BarChart as MuiBarChart } from '@mui/x-charts/BarChart';

function BarChart({ title, data, loading }) {
  const entries = Object.entries(data || {});
  const labels = entries.map(([key]) => key);
  const values = entries.map(([, v]) => Number(v) || 0);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-5 bg-slate-200 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-slate-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (values.length === 0) {
    return <div className="text-sm text-slate-500">No data available.</div>;
  }

  return (
    <div>
      <MuiBarChart
        xAxis={[{ scaleType: 'band', data: labels }]}
        series={[{ data: values, color: '#2563eb' }]}
        height={250}
      />
    </div>
  );
}

BarChart.propTypes = {
  title: PropTypes.string,
  data: PropTypes.object,
  loading: PropTypes.bool
};

export default BarChart;
