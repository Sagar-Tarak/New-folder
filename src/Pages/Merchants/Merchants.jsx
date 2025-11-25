import React, { useState, useEffect } from 'react'
import merchantsData from '../../data/merchants.json'
import MerchantTable from './MerchantTable'
import MerchantForm from './MerchantForm'

export default function Merchants() {
  const [list, setList] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // small fake-load so UI shows loading state like real apps
    const t = setTimeout(() => {
      setList(merchantsData)
      setLoading(false)
    }, 500)

    return () => clearTimeout(t)
  }, [])

  const handleUpdate = (updatedMerchant) => {
    // simple replace by id
    setList((prev) => prev.map((m) => (m.id === updatedMerchant.id ? updatedMerchant : m)))
  }

  const handleAdd = (newMerchant) => {
    // append new merchant
    setList((prev) => [...prev, newMerchant])
    setShowAdd(false)
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

      <MerchantTable merchants={list} onAddMerchant={() => setShowAdd(true)} />

      {showAdd && <MerchantForm onClose={() => setShowAdd(false)} onSubmit={handleAdd} />}
    </div>
  )
}
