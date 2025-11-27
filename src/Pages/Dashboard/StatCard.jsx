import React from "react";

function StatCard({ title, value, subtitle, icon, color = "blue", loading }) {
  // Simple color presets
  const bgShades = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
  };

  const accentShades = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-slate-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-slate-200 rounded w-1/3"></div>
      </div>
    );
  }

  return (
    <section
      aria-label={`${title} stat`}
      className="
        relative bg-white rounded-lg shadow-md hover:shadow-xl 
        transition-all duration-300 p-4 sm:p-6 
        flex items-center gap-4 sm:gap-5 
        transform hover:-translate-y-0.5
      "
    >
      {/* Left Accent Bar */}
      <div
        className={`w-1 h-12 rounded-full ${accentShades[color]}`}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm text-slate-600 mb-1 truncate">
          {title}
        </p>

        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <h3 className="text-xl sm:text-3xl font-bold text-slate-900 truncate">
            {value}
          </h3>

          {/* Icon */}
          <div
            className={`
              flex-shrink-0 
              bg-linear-to-br ${bgShades[color]} 
              p-2 sm:p-3 rounded-lg text-white flex items-center justify-center
            `}
          >
            {icon}
          </div>
        </div>

        {subtitle && (
          <p className="text-[11px] sm:text-xs text-slate-500 mt-1 truncate">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

export default StatCard;
