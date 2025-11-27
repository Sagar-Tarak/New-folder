import React, { useState, useEffect } from "react";
import MerchantTable from "./MerchantTable";
import MerchantForm from "./MerchantForm";
import Modal from "../../Components/UI/Modal";
import useMerchantStore from "../../store/useMerchantStore";

export default function Merchants() {
  const {
    merchants,
    loading,
    initializeMerchants,
    addMerchant,
    removeMerchant,
    setLoading,
  } = useMerchantStore();

  // UI state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [merchantToDelete, setMerchantToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // When page mounts → load merchants
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => initializeMerchants(), 500);
    return () => clearTimeout(timer);
  }, []);

  // Add merchant handler
  const handleAddMerchant = (merchant) => {
    addMerchant(merchant);
    setIsAddOpen(false);
    setSuccessMessage(`${merchant.name} was added successfully.`);
    setIsSuccessOpen(true);
  };

  // Ask to remove merchant
  const askToDelete = (merchant) => {
    setMerchantToDelete(merchant);
    setIsDeleteOpen(true);
  };

  // Confirm removal
  const confirmDelete = () => {
    if (!merchantToDelete) return;
    removeMerchant(merchantToDelete.id);
    setIsDeleteOpen(false);
    setSuccessMessage(`${merchantToDelete.name} was removed.`);
    setIsSuccessOpen(true);
    setMerchantToDelete(null);
  };

  // Loading Skeleton
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mt-5 animate-pulse space-y-2">
          <div className="h-8 w-40 bg-slate-200 rounded"></div>
          <div className="h-4 w-56 bg-slate-200 rounded"></div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-slate-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 overflow-x-hidden">

      {/* Page Title */}
      <div className="mt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Merchants</h1>
          <p className="text-slate-600 text-sm">View and manage merchant accounts</p>
        </div>

        {/* Add Merchant Button (mobile + desktop) */}
        <button
          onClick={() => setIsAddOpen(true)}
          className="sm:hidden px-4 py-2 bg-blue-600 text-white rounded-lg text-sm mt-2"
        >
          Add Merchant
        </button>
      </div>

      {/* Main Table */}
      <MerchantTable
        merchants={merchants}
        onAddMerchant={() => setIsAddOpen(true)}
        onRemove={removeMerchant}
        onRequestRemove={askToDelete}
      />

      {/* Add Merchant Modal */}
      <Modal open={isAddOpen} title="Add Merchant" onClose={() => setIsAddOpen(false)}>
        <MerchantForm
          onClose={() => setIsAddOpen(false)}
          onSubmit={handleAddMerchant}
        />
      </Modal>

      {/* Success Modal */}
      <Modal open={isSuccessOpen} title="Success" onClose={() => setIsSuccessOpen(false)}>
        <div className="space-y-4">
          <p className="text-slate-700">{successMessage}</p>
          <div className="flex justify-end">
            <button
              onClick={() => setIsSuccessOpen(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={isDeleteOpen} title="Confirm Removal" onClose={() => setIsDeleteOpen(false)}>
        <div className="space-y-4">
          <p className="text-slate-700">
            Are you sure you want to remove{" "}
            <strong>{merchantToDelete?.name}</strong>?  
            This action removes it from local storage.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="px-4 py-2 bg-slate-100 rounded"
            >
              Cancel
            </button>

            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
