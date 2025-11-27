import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Table from "../../Components/UI/Table";
import Dropdown from "../../Components/UI/Dropdown";

export default function MerchantTable({
  merchants,
  onMerchantClick,
  onAddMerchant,
  onRemove,
  onRequestRemove,
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [risk, setRisk] = useState("all");

  const [sortField, setSortField] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Filtering
  const filtered = merchants.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === "all" || m.status === status;
    const matchRisk = risk === "all" || m.risk === risk;
    return matchSearch && matchStatus && matchRisk;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === "string") aVal = aVal.toLowerCase();
    if (typeof bVal === "string") bVal = bVal.toLowerCase();

    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ field }) => {
    if (field !== sortField) return <span className="text-slate-300">↕</span>;
    return sortDir === "asc" ? (
      <span className="text-blue-500">↑</span>
    ) : (
      <span className="text-blue-500">↓</span>
    );
  };

  const badge = (status) => {
    if (status === "active") return "bg-green-100 text-green-800";
    if (status === "paused") return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    setRisk("all");
  };

  // Columns
  const columns = [
    {
      header: (
        <button className="flex items-center gap-2" onClick={() => handleSort("name")}>
          Name <SortIcon field="name" />
        </button>
      ),
      accessor: "name",
    },
    {
      header: (
        <button className="flex items-center gap-2" onClick={() => handleSort("country")}>
          Country <SortIcon field="country" />
        </button>
      ),
      accessor: "country",
    },
    {
      header: "Status",
      render: (row) => (
        <span className={`inline-block px-2 py-1 rounded-full text-sm ${badge(row.status)}`}>
          {row.status}
        </span>
      ),
    },
    {
      header: (
        <button className="flex items-center gap-2" onClick={() => handleSort("monthlyVolume")}>
          Volume <SortIcon field="monthlyVolume" />
        </button>
      ),
      render: (row) => new Intl.NumberFormat().format(row.monthlyVolume ?? 0),
    },
    {
      header: "Chargeback %",
      accessor: "chargebackRatio",
      render: (row) => `${row.chargebackRatio ?? "-"}%`,
    },
    {
      header: "Risk",
      render: (row) => <span className="uppercase text-sm">{row.risk}</span>,
    },
    {
      header: "Actions",
      key: "actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/merchants/${row.id}`);
            }}
            className="inline-flex items-center p-2 rounded hover:bg-slate-100 text-blue-600"
            aria-label={`View ${row.name}`}
            title="View"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7S3.732 16.057 2.458 12z" />
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onRequestRemove?.(row);
            }}
            className="inline-flex items-center p-2 rounded hover:bg-slate-100 text-red-600"
            aria-label={`Remove ${row.name}`}
            title="Remove"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 overflow-x-hidden">

      {/* Search */}
      <div className="space-y-3">
        <div className="relative w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search merchants"
            className="w-full px-4 pr-10 py-2 border rounded-md"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              ×
            </button>
          )}
        </div>

        {/* Mobile Filters Button */}
        <button
          onClick={() => setShowMobileFilters((p) => !p)}
          className="md:hidden px-4 py-2 border rounded-md flex items-center justify-between bg-slate-50"
        >
          <span className="font-medium text-sm">Filters</span>

          <svg
            className={`w-5 h-5 transition-transform ${showMobileFilters ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Mobile Slide Panel */}
        <div
          className={`md:hidden transition-all overflow-hidden ${
            showMobileFilters ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white border rounded-lg p-4 space-y-4 shadow-sm">
            <Dropdown
              value={status}
              onChange={setStatus}
              options={[
                { value: "all", label: "All statuses" },
                { value: "active", label: "Active" },
                { value: "paused", label: "Paused" },
                { value: "blocked", label: "Blocked" },
              ]}
            />

            <Dropdown
              value={risk}
              onChange={setRisk}
              options={[
                { value: "all", label: "All risks" },
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
              ]}
            />

            <button onClick={resetFilters} className="text-sm text-slate-600">
              Clear filters
            </button>
          </div>
        </div>

        {/* Desktop Filters */}
        <div className="hidden md:flex gap-3">
          <div className="w-40">
            <Dropdown
              value={status}
              onChange={setStatus}
              options={[
                { value: "all", label: "All statuses" },
                { value: "active", label: "Active" },
                { value: "paused", label: "Paused" },
                { value: "blocked", label: "Blocked" },
              ]}
            />
          </div>

          <div className="w-40">
            <Dropdown
              value={risk}
              onChange={setRisk}
              options={[
                { value: "all", label: "All risks" },
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-600">
          Showing <b>{sorted.length}</b> of <b>{merchants.length}</b> merchants
        </p>

        <button
          onClick={onAddMerchant}
          className="hidden sm:inline-flex px-4 py-2 bg-blue-600 text-white rounded-lg gap-2 items-center"
        >
          <svg className="w-5 h-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Add Merchant
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <div className="min-w-max"> {/* IMPORTANT FIX */}
          <Table
            columns={columns}
            data={sorted}
            onRowClick={(m) => {
              if (onMerchantClick) return onMerchantClick(m);
              navigate(`/merchants/${m.id}`, {
                state: { merchant: m, background: location },
              });
            }}
            emptyMessage={
              <div className="p-12 text-center">
                <h3 className="text-lg font-semibold mb-2">No merchants found</h3>
                <p className="mb-4">Try adjusting your search or filters.</p>
                <button onClick={resetFilters} className="text-blue-600">
                  Clear all filters
                </button>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
