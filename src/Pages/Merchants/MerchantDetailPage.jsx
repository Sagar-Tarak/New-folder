import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import merchantsData from '../../data/merchants.json'

// Merchant detail page — simpler, clearer names and straightforward layout
export default function MerchantDetailPage() {
  const { id: merchantId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  // If we navigated here from the table, that route may include the merchant in state
  const navMerchant = location.state && location.state.merchant
  const [merchant, setMerchant] = useState(navMerchant || null)

  // Local form state for editable fields
  const [form, setForm] = useState({ status: '', risk: '' })
  const [isSaving, setIsSaving] = useState(false)
  const [confirmingActivation, setConfirmingActivation] = useState(false)

  useEffect(() => {
    if (!merchant) {
      const found = merchantsData.find((m) => m.id === merchantId)
      setMerchant(found || null)
    }
  }, [merchantId, merchant])

  useEffect(() => {
    if (merchant) setForm({ status: merchant.status, risk: merchant.risk })
  }, [merchant])

  if (!merchant) {
    return (
      <div className="p-6">
        <button onClick={() => navigate('/merchants')} className="text-blue-600 underline mb-4">Back to merchants</button>
        <div className="bg-white rounded-lg shadow-md p-6">Merchant not found</div>
      </div>
    )
  }

  // Update a single field in the form
  const updateField = (field, value) => {
    // guard: activating a high-risk merchant should confirm
    if (field === 'status' && value === 'active' && form.risk === 'high') {
      setConfirmingActivation(true)
      return
    }
    setForm((s) => ({ ...s, [field]: value }))
  }

  const confirmActivate = () => {
    setForm((s) => ({ ...s, status: 'active' }))
    setConfirmingActivation(false)
  }

  const save = () => {
    setIsSaving(true)
    // Demo-only: update local component state and navigate back
    setTimeout(() => {
      setMerchant((m) => ({ ...m, ...form }))
      setIsSaving(false)
      alert('Saved (local only)')
      navigate('/merchants')
    }, 400)
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{merchant.name}</h1>
          <p className="text-sm text-slate-600">Merchant details</p>
        </div>
        <div>
          <button onClick={() => navigate('/merchants')} className="px-3 py-1 border rounded">Back</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {merchant.chargebackRatio > 2 && form.status === 'active' && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
            <strong className="text-red-800">High chargeback warning</strong>
            <div className="text-sm text-red-700 mt-1">This merchant has a chargeback ratio of {merchant.chargebackRatio}% while active.</div>
          </div>
        )}

        {confirmingActivation && (
          <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold text-orange-800">Confirm activation</div>
                <div className="text-sm text-orange-700">This merchant is high risk — proceed to activate?</div>
              </div>

              <div className="flex gap-2">
                <button onClick={confirmActivate} className="px-3 py-1 bg-orange-600 text-white rounded">Yes</button>
                <button onClick={() => setConfirmingActivation(false)} className="px-3 py-1 border rounded">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Merchant ID" value={merchant.id} mono />
          <Field label="Country" value={merchant.country} />
          <Field label="Monthly Volume" value={`$${merchant.monthlyVolume.toLocaleString()}`} bold />

          <div>
            <label className="block text-sm text-slate-700 mb-1">Chargeback Ratio</label>
            <div className={`px-3 py-2 rounded bg-slate-50 text-sm font-semibold ${merchant.chargebackRatio > 2 ? 'text-red-600' : merchant.chargebackRatio > 1 ? 'text-orange-600' : 'text-green-600'}`}>
              {merchant.chargebackRatio}%
            </div>
          </div>

          {merchant.description && <Field label="Description" value={merchant.description} full />}
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium mb-3">Update</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <OptionGroup label="Status" value={form.status} onChange={(v) => updateField('status', v)} options={["active", "paused", "blocked"]} />
            <OptionGroup label="Risk" value={form.risk} onChange={(v) => updateField('risk', v)} options={["low", "medium", "high"]} />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={() => navigate('/merchants')} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={save} disabled={isSaving} className="px-4 py-2 bg-blue-600 text-white rounded">{isSaving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, mono, bold, full }) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <label className="block text-sm text-slate-700 mb-1">{label}</label>
      <div className={[
        'px-3 py-2 rounded bg-slate-50 text-sm text-slate-900',
        mono ? 'font-mono' : '',
        bold ? 'font-semibold' : '',
      ].join(' ')}>{value}</div>
    </div>
  )
}

function OptionGroup({ label, options, value, onChange }) {
  return (
    <div>
      <label className="block text-sm text-slate-700 mb-2">{label}</label>
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-slate-50">
            <input type="radio" name={label} value={opt} checked={value === opt} onChange={() => onChange(opt)} className="w-4 h-4" />
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

