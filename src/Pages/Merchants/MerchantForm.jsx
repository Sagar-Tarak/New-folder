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
        if (Number.isNaN(Number.parseFloat(value)) || Number.parseFloat(value) <= 0) return 'Monthly volume must be > 0'
        return ''
      case 'chargebackRatio':
        if (value === '' || value === null) return 'Chargeback ratio is required'
        if (Number.isNaN(Number.parseFloat(value)) || Number.parseFloat(value) < 0 || Number.parseFloat(value) > 100) return 'Chargeback ratio must be 0-100'
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
        monthlyVolume: Number.parseFloat(form.monthlyVolume),
        chargebackRatio: Number.parseFloat(form.chargebackRatio),
        id: merchant?.id || `m_${Date.now()}`,
      }
      onSubmit(payload)
      onClose()
    }
  }

  const isFormValid = () => {
    const nameOk = form.name && form.name.trim().length >= 3
    const countryOk = form.country && form.country.trim().length > 0
    const mv = Number.parseFloat(form.monthlyVolume)
    const mvOk = !Number.isNaN(mv) && Number.isFinite(mv) && mv > 0
    const cbRaw = form.chargebackRatio
    const cb = Number.parseFloat(cbRaw)
    const cbOk = cbRaw !== '' && !Number.isNaN(cb) && Number.isFinite(cb) && cb >= 0 && cb <= 100

    return nameOk && countryOk && mvOk && cbOk
  }

  return (
    <div className="p-6 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Merchant Name <span className="text-red-500">*</span></label>
          <input id="name" name="name" value={form.name} onChange={handleChange} onBlur={handleBlur}
            className={`w-full px-4 py-2 border rounded-lg ${errors.name && touched.name ? 'border-red-500' : 'border-slate-300'}`} placeholder="Enter merchant name" />
          {errors.name && touched.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-slate-700 mb-2">Country <span className="text-red-500">*</span></label>
          <input id="country" name="country" value={form.country} onChange={handleChange} onBlur={handleBlur}
            className={`w-full px-4 py-2 border rounded-lg ${errors.country && touched.country ? 'border-red-500' : 'border-slate-300'}`} placeholder="Enter country" />
          {errors.country && touched.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="monthlyVolume" className="block text-sm font-medium text-slate-700 mb-2">Monthly Volume ($) <span className="text-red-500">*</span></label>
            <input id="monthlyVolume" type="number" name="monthlyVolume" value={form.monthlyVolume} onChange={handleChange} onBlur={handleBlur}
              min="0" step="0.01" className={`w-full px-4 py-2 border rounded-lg ${errors.monthlyVolume && touched.monthlyVolume ? 'border-red-500' : 'border-slate-300'}`} />
            {errors.monthlyVolume && touched.monthlyVolume && <p className="mt-1 text-sm text-red-600">{errors.monthlyVolume}</p>}
          </div>

          <div>
            <label htmlFor="chargebackRatio" className="block text-sm font-medium text-slate-700 mb-2">Chargeback Ratio (%) <span className="text-red-500">*</span></label>
            <input id="chargebackRatio" type="number" name="chargebackRatio" value={form.chargebackRatio} onChange={handleChange} onBlur={handleBlur}
              min="0" max="100" step="0.1" className={`w-full px-4 py-2 border rounded-lg ${errors.chargebackRatio && touched.chargebackRatio ? 'border-red-500' : 'border-slate-300'}`} />
            {errors.chargebackRatio && touched.chargebackRatio && <p className="mt-1 text-sm text-red-600">{errors.chargebackRatio}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-2">Status</label>
            <select id="status" name="status" value={form.status} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          <div>
            <label htmlFor="risk" className="block text-sm font-medium text-slate-700 mb-2">Risk Level</label>
            <select id="risk" name="risk" value={form.risk} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">Description</label>
          <textarea id="description" name="description" value={form.description} onChange={handleChange} rows="3" className="w-full px-4 py-2 border rounded-lg" placeholder="Optional description" />
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-blue-700"><span className="font-semibold">Note:</span> Fields with <span className="text-red-500">*</span> are required.</p>
        </div>
      </form>

      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="px-6 py-2 bg-white border rounded-lg">Cancel</button>
        <button onClick={handleSubmit} disabled={!isFormValid()} className={`px-6 py-2 rounded-lg ${isFormValid() ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}>
          {isEdit ? 'Update Merchant' : 'Add Merchant'}
        </button>
      </div>
    </div>
  )
}
