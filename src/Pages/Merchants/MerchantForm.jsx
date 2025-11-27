import React, { useState } from "react";

export default function MerchantForm({ merchant, onClose, onSubmit }) {
  const isEdit = !!merchant;

  const [form, setForm] = useState({
    name: merchant?.name || "",
    country: merchant?.country || "",
    monthlyVolume: merchant?.monthlyVolume ?? "",
    chargebackRatio: merchant?.chargebackRatio ?? "",
    status: merchant?.status || "active",
    risk: merchant?.risk || "low",
    description: merchant?.description || "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // --------------------------------
  // Validation logic (unchanged)
  // --------------------------------
  const validateField = (name, value) => {
    if (name === "name") {
      if (!value.trim()) return "Name is required";
      if (value.trim().length < 3) return "Name must be at least 3 characters";
    }

    if (name === "country") {
      if (!value.trim()) return "Country is required";
    }

    if (name === "monthlyVolume") {
      const num = parseFloat(value);
      if (!value) return "Monthly volume is required";
      if (isNaN(num) || num <= 0) return "Monthly volume must be greater than 0";
    }

    if (name === "chargebackRatio") {
      const num = parseFloat(value);
      if (!value) return "Chargeback ratio is required";
      if (isNaN(num) || num < 0 || num > 100)
        return "Chargeback ratio must be between 0–100";
    }

    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(form).forEach((key) => {
      const err = validateField(key, form[key]);
      if (err) newErrors[key] = err;
    });

    setErrors(newErrors);
    setTouched(
      Object.keys(form).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...form,
      monthlyVolume: parseFloat(form.monthlyVolume),
      chargebackRatio: parseFloat(form.chargebackRatio),
      id: merchant?.id || `m_${Date.now()}`,
    };

    onSubmit(payload);
    onClose();
  };

  const isFormValid = () => {
    return (
      form.name.trim().length >= 3 &&
      form.country.trim().length > 0 &&
      parseFloat(form.monthlyVolume) > 0 &&
      !isNaN(parseFloat(form.chargebackRatio)) &&
      parseFloat(form.chargebackRatio) >= 0 &&
      parseFloat(form.chargebackRatio) <= 100
    );
  };

  // ------------------------------------
  // UI (condensed + responsive)
  // ------------------------------------
  return (
    <div className="p-4 sm:p-6 space-y-5">

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Merchant Name <span className="text-red-500">*</span>
          </label>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter merchant name"
            className={`w-full px-3 py-2 rounded-lg border text-sm ${
              errors.name && touched.name ? "border-red-500" : "border-slate-300"
            }`}
          />

          {errors.name && touched.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Country <span className="text-red-500">*</span>
          </label>

          <input
            name="country"
            value={form.country}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter country"
            className={`w-full px-3 py-2 rounded-lg border text-sm ${
              errors.country && touched.country
                ? "border-red-500"
                : "border-slate-300"
            }`}
          />

          {errors.country && touched.country && (
            <p className="mt-1 text-xs text-red-600">{errors.country}</p>
          )}
        </div>

        {/* Monthly Volume + Chargeback */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Monthly Volume ($) <span className="text-red-500">*</span>
            </label>

            <input
              type="number"
              name="monthlyVolume"
              value={form.monthlyVolume}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 rounded-lg border text-sm ${
                errors.monthlyVolume && touched.monthlyVolume
                  ? "border-red-500"
                  : "border-slate-300"
              }`}
            />

            {errors.monthlyVolume && touched.monthlyVolume && (
              <p className="mt-1 text-xs text-red-600">{errors.monthlyVolume}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Chargeback Ratio (%) <span className="text-red-500">*</span>
            </label>

            <input
              type="number"
              name="chargebackRatio"
              value={form.chargebackRatio}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 rounded-lg border text-sm ${
                errors.chargebackRatio && touched.chargebackRatio
                  ? "border-red-500"
                  : "border-slate-300"
              }`}
            />

            {errors.chargebackRatio && touched.chargebackRatio && (
              <p className="mt-1 text-xs text-red-600">
                {errors.chargebackRatio}
              </p>
            )}
          </div>
        </div>

        {/* Status + Risk */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Risk Level</label>
            <select
              name="risk"
              value={form.risk}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Optional description"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
          />
        </div>

        {/* Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
          <strong className="text-blue-700">Note:</strong> Fields with{" "}
          <span className="text-red-500">*</span> are required.
        </div>
      </form>

      {/* Bottom buttons — always visible */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
        <button
          onClick={onClose}
          className="px-5 py-2 bg-white border rounded-lg text-sm"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={!isFormValid()}
          className={`px-6 py-2 rounded-lg text-sm ${
            isFormValid()
              ? "bg-blue-600 text-white"
              : "bg-slate-300 text-slate-500 cursor-not-allowed"
          }`}
        >
          {isEdit ? "Update Merchant" : "Add Merchant"}
        </button>
      </div>
    </div>
  );
}
