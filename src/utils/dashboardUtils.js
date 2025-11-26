export function countByKey(key, items) {
  return items.reduce((acc, item) => {
    acc[item[key]] = (acc[item[key]] || 0) + 1;
    return acc;
  }, {});
}

export function getRiskBadgeClasses(risk) {
  switch (risk) {
    case "low":
      return "bg-green-100 text-green-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "high":
      return "bg-red-100 text-red-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
}

export function computeStats(items) {
  const totalVolume = items.reduce((sum, m) => sum + (m.monthlyVolume || 0), 0);
  const activeMerchants = items.filter((m) => m.status === "active").length;
  const avgSuccessRate = items.length
    ? (items.reduce((sum, m) => sum + (m.successRate || 0), 0) / items.length).toFixed(1)
    : 0;
  const avgChargeback = items.length
    ? (items.reduce((sum, m) => sum + (m.chargebackRatio || m.chargebackRate || 0), 0) / items.length).toFixed(1)
    : 0;

  const riskCounts = countByKey("risk", items);
  const statusCounts = countByKey("status", items);

  return {
    totalVolume,
    activeMerchants,
    avgSuccessRate,
    avgChargeback,
    riskCounts,
    statusCounts,
  };
}
