import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Modal from "../../Components/UI/Modal";
import useMerchantStore from "../../store/useMerchantStore";

export default function MerchantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { merchants, updateMerchant } = useMerchantStore();

  const merchantFromNav = location.state?.merchant;
  const [merchant, setMerchant] = useState(merchantFromNav || null);

  const [form, setForm] = useState({ status: "", risk: "" });
  const [saving, setSaving] = useState(false);
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load merchant if direct navigation
  useEffect(() => {
    if (!merchant) {
      const found = merchants.find((m) => m.id === id);
      setMerchant(found || null);
    }
  }, [merchant, id, merchants]);

  // Sync form
  useEffect(() => {
    if (merchant) {
      setForm({
        status: merchant.status,
        risk: merchant.risk,
      });
    }
  }, [merchant]);

  if (!merchant) {
    return (
      <div className="p-6 container mx-auto max-w-3xl">
        <button
          onClick={() => navigate("/merchants", { replace: true })}
          className="text-blue-600 underline mb-4"
        >
          Back to merchants
        </button>
        <div className="bg-white rounded-lg shadow-md p-6">Merchant not found</div>
      </div>
    );
  }

  // field change logic
  const updateField = (field, value) => {
    if (field === "status" && value === "active" && form.risk === "high") {
      setNeedsConfirm(true);
      return;
    }
    setForm((p) => ({ ...p, [field]: value }));
  };

  const confirmActivation = () => {
    setForm((p) => ({ ...p, status: "active" }));
    setNeedsConfirm(false);
  };

  // Save merchant
  const save = () => {
    setSaving(true);

    setTimeout(() => {
      updateMerchant(id, form);
      setMerchant((m) => ({ ...m, ...form }));
      setSaving(false);
      setShowSuccess(true);
    }, 400);
  };

  const chargebackColor = (ratio) => {
    if (ratio > 2) return "text-red-600";
    if (ratio > 1) return "text-orange-600";
    return "text-green-600";
  };

  return (
    <>
      <Modal
        open={true}
        title={merchant.name}
        onClose={() => navigate("/merchants", { replace: true })}
      >
      <div className="space-y-5 text-sm">

        {/* Description */}
        <p className="text-slate-700 leading-relaxed">
          {merchant.description || "No description provided."}
        </p>

        {/* Chargeback */}
        <div className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
          <span className="text-slate-600">Chargeback</span>
          <span className={`font-semibold ${chargebackColor(merchant.chargebackRatio)}`}>
            {merchant.chargebackRatio}%
          </span>
        </div>

        {/* Confirm box */}
        {needsConfirm && (
          <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
            <p className="text-sm font-medium text-orange-800">
              This merchant is high-risk. Confirm activation?
            </p>

            <div className="mt-3 flex gap-3">
              <button
                onClick={confirmActivation}
                className="px-3 py-1.5 bg-orange-600 text-white rounded-md text-xs"
              >
                Confirm
              </button>

              <button
                onClick={() => setNeedsConfirm(false)}
                className="px-3 py-1.5 text-xs rounded-md border"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Status */}
        <div>
          <p className="text-slate-600 mb-2 font-medium">Status</p>

          <div className="grid grid-cols-3 gap-2 text-xs">
            {["active", "paused", "blocked"].map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-1.5 p-2 border rounded-md cursor-pointer bg-slate-50"
              >
                <input
                  type="radio"
                  checked={form.status === opt}
                  onChange={() => updateField("status", opt)}
                />
                <span className="capitalize">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Risk */}
        <div>
          <p className="text-slate-600 mb-2 font-medium">Risk Level</p>

          <div className="grid grid-cols-3 gap-2 text-xs">
            {["low", "medium", "high"].map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-1.5 p-2 border rounded-md cursor-pointer bg-slate-50"
              >
                <input
                  type="radio"
                  checked={form.risk === opt}
                  onChange={() => updateField("risk", opt)}
                />
                <span className="capitalize">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={() => navigate("/merchants", { replace: true })}
            className="px-4 py-2 text-sm bg-white border rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={save}
            disabled={saving}
            className="px-5 py-2 text-sm bg-blue-600 text-white rounded-md disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </Modal>

      <Modal
        open={showSuccess}
        title={"Success"}
        onClose={() => {
          setShowSuccess(false);
          navigate("/merchants", { replace: true });
        }}
      >
        <div className="p-4">
          <p className="text-slate-700">Saved successfully.</p>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setShowSuccess(false);
                navigate("/merchants", { replace: true });
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
            >
              OK
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
