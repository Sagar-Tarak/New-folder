import React, { useState } from 'react'

export default function MerchantForm({ merchant, onClose, onSubmit }) {
  const isEdit = !!merchant

  const [form, setForm] = useState({
    name: merchant?.name || '',
    country: merchant?.country || '',
    monthlyVolume: merchant?.monthlyVolume ?? '',
    chargebackRatio: merchant?.chargebackRatio ?? '',
    status: merchant?.status || 'active',
    risk: merchant?.risk || 'low',
    description: merchant?.description || '',
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const validateField = (key, value) => {
    switch (key) {
      case 'name':
        if (!value || value.trim().length === 0) return 'Name is required'
        if (value.trim().length < 3) return 'Name must be at least 3 characters'
        return ''
      case 'country':
        if (!value || value.trim().length === 0) return 'Country is required'
        return ''
      case 'monthlyVolume':
        if (value === '' || value === null) return 'Monthly volume is required'
        if (isNaN(value) || parseFloat(value) <= 0) return 'Monthly volume must be > 0'
        return ''
      case 'chargebackRatio':
        if (value === '' || value === null) return 'Chargeback ratio is required'
        if (isNaN(value) || parseFloat(value) < 0 || parseFloat(value) > 100) return 'Chargeback ratio must be 0-100'
        return ''
      default:
        return ''
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))

    if (touched[name]) {
      const err = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: err }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((t) => ({ ...t, [name]: true }))
    const err = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: err }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // touch everything
    const allTouched = Object.keys(form).reduce((acc, k) => { acc[k] = true; return acc }, {})
    setTouched(allTouched)

    // validate all
    const newErr = {}
    Object.keys(form).forEach((k) => {
      const err = validateField(k, form[k])
      if (err) newErr[k] = err
    })
    setErrors(newErr)

    if (Object.keys(newErr).length === 0) {
      const payload = {
        ...form,
        monthlyVolume: parseFloat(form.monthlyVolume),
        chargebackRatio: parseFloat(form.chargebackRatio),
        id: merchant?.id || `m_${Date.now()}`,
      }
      onSubmit(payload)
      onClose()
    }
  }

  const isFormValid = () => {
    return (
      form.name.trim().length >= 3 &&
      form.country.trim().length > 0 &&
      +form.monthlyVolume > 0 &&
      +form.chargebackRatio >= 0 &&
      +form.chargebackRatio <= 100
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{isEdit ? 'Edit Merchant' : 'Add New Merchant'}</h2>
            <p className="text-sm text-slate-600 mt-1">{isEdit ? 'Update merchant info' : 'Enter merchant details'}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Merchant Name <span className="text-red-500">*</span></label>
            <input name="name" value={form.name} onChange={handleChange} onBlur={handleBlur}
              className={`w-full px-4 py-2 border rounded-lg ${errors.name && touched.name ? 'border-red-500' : 'border-slate-300'}`} placeholder="Enter merchant name" />
            {errors.name && touched.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Country <span className="text-red-500">*</span></label>
            <input name="country" value={form.country} onChange={handleChange} onBlur={handleBlur}
              className={`w-full px-4 py-2 border rounded-lg ${errors.country && touched.country ? 'border-red-500' : 'border-slate-300'}`} placeholder="Enter country" />
            {errors.country && touched.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Volume ($) <span className="text-red-500">*</span></label>
              <input type="number" name="monthlyVolume" value={form.monthlyVolume} onChange={handleChange} onBlur={handleBlur}
                min="0" step="0.01" className={`w-full px-4 py-2 border rounded-lg ${errors.monthlyVolume && touched.monthlyVolume ? 'border-red-500' : 'border-slate-300'}`} />
              {errors.monthlyVolume && touched.monthlyVolume && <p className="mt-1 text-sm text-red-600">{errors.monthlyVolume}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Chargeback Ratio (%) <span className="text-red-500">*</span></label>
              <input type="number" name="chargebackRatio" value={form.chargebackRatio} onChange={handleChange} onBlur={handleBlur}
                min="0" max="100" step="0.1" className={`w-full px-4 py-2 border rounded-lg ${errors.chargebackRatio && touched.chargebackRatio ? 'border-red-500' : 'border-slate-300'}`} />
              {errors.chargebackRatio && touched.chargebackRatio && <p className="mt-1 text-sm text-red-600">{errors.chargebackRatio}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Risk Level</label>
              <select name="risk" value={form.risk} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows="3" className="w-full px-4 py-2 border rounded-lg" placeholder="Optional description" />
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-blue-700"><span className="font-semibold">Note:</span> Fields with <span className="text-red-500">*</span> are required.</p>
          </div>
        </form>

        <div className="sticky bottom-0 bg-slate-50 border-t px-6 py-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 bg-white border rounded-lg">Cancel</button>
          <button onClick={handleSubmit} disabled={!isFormValid()} className={`px-6 py-2 rounded-lg ${isFormValid() ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}>
            {isEdit ? 'Update Merchant' : 'Add Merchant'}
          </button>
        </div>
      </div>
    </div>
  )
}
