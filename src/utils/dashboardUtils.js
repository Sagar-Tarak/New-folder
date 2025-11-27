// Count how many times a key value appears in an array
export function countByKey(key, items) {
  return items.reduce((result, item) => {
    const value = item[key];
    result[value] = (result[value] || 0) + 1;
    return result;
  }, {});
}

// Get color classes based on risk level
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

// Calculate dashboard statistics
export function computeStats(items) {
  // Total monthly volume
  const totalVolume = items.reduce(
    (total, item) => total + (item.monthlyVolume || 0),
    0
  );

  // Count active merchants
  const activeMerchants = items.filter((m) => m.status === "active").length;

  // Average success rate
  const avgSuccessRate = items.length
    ? (
        items.reduce((sum, m) => sum + (m.successRate || 0), 0) /
        items.length
      ).toFixed(1)
    : 0;

  // Average chargeback ratio
  const avgChargeback = items.length
    ? (
        items.reduce(
          (sum, m) => sum + (m.chargebackRatio || m.chargebackRate || 0),
          0
        ) / items.length
      ).toFixed(1)
    : 0;

  // Count by risk and status
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
