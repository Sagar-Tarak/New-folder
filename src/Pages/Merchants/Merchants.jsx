import React, { useState, useEffect } from 'react'
import MerchantTable from './MerchantTable'
import MerchantForm from './MerchantForm'
import Modal from '../../Components/UI/Modal'
import useMerchantStore from '../../store/useMerchantStore'

export default function Merchants() {
  const { merchants, loading, initializeMerchants, addMerchant, removeMerchant, setLoading } = useMerchantStore()
  const [showAdd, setShowAdd] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [toDelete, setToDelete] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    // small fake-load so UI shows loading state like real apps
    setLoading(true)
    const t = setTimeout(() => {
      initializeMerchants()
    }, 500)

    return () => clearTimeout(t)
  }, [])

  const handleAdd = (newMerchant) => {
    addMerchant(newMerchant)
    setShowAdd(false)
    setSuccessMessage(`${newMerchant.name} was added successfully.`)
    setShowSuccess(true)
  }

  const handleRemove = (id) => {
    removeMerchant(id)
  }

  const handleRequestRemove = (merchant) => {
    setToDelete(merchant)
    setShowDelete(true)
  }

  const handleConfirmDelete = () => {
    if (!toDelete) return
    handleRemove(toDelete.id)
    setShowDelete(false)
    setSuccessMessage(`${toDelete.name} was removed.`)
    setShowSuccess(true)
    setToDelete(null)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-8 animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 animate-pulse space-y-4">
          <div className="h-10 bg-slate-200 rounded"></div>
          <div className="h-10 bg-slate-200 rounded"></div>
          <div className="h-10 bg-slate-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Merchants</h1>
        <p className="text-slate-600">View and manage merchant accounts</p>
      </div>

      <MerchantTable merchants={merchants} onAddMerchant={() => setShowAdd(true)} onRemove={handleRemove} onRequestRemove={handleRequestRemove} />

      <Modal open={showAdd} title={showAdd && 'Add Merchant'} onClose={() => setShowAdd(false)}>
        <MerchantForm onClose={() => setShowAdd(false)} onSubmit={handleAdd} />
      </Modal>

      <Modal open={showSuccess} title="Merchant Added" onClose={() => setShowSuccess(false)}>
        <div className="space-y-4">
          <p className="text-slate-700">{successMessage}</p>
          <div className="flex justify-end">
            <button onClick={() => setShowSuccess(false)} className="px-4 py-2 bg-blue-600 text-white rounded">Close</button>
          </div>
        </div>
      </Modal>

      <Modal open={showDelete} title="Confirm Removal" onClose={() => setShowDelete(false)}>
        <div className="space-y-4">
          <p className="text-slate-700">Are you sure you want to remove <strong>{toDelete?.name}</strong>? This will delete it from local storage.</p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowDelete(false)} className="px-4 py-2 bg-slate-100 rounded">Cancel</button>
            <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
