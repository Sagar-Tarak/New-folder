 const Dropdown = ({ value, onChange, options }) => (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-white
          text-sm font-medium text-slate-700 shadow-sm
          appearance-none bg-none
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {/* Custom arrow */}
      <svg
        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );

export default Dropdown;