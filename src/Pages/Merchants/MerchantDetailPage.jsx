import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Modal from '../../Components/UI/Modal'
import PropTypes from 'prop-types'
import useMerchantStore from '../../store/useMerchantStore'

// Merchant detail page
export default function MerchantDetailPage() {
  const { id: merchantId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  
  const { merchants, updateMerchant } = useMerchantStore()

  // If we navigated here from the table, that route may include the merchant in state
  const navMerchant = location.state?.merchant
  const [merchant, setMerchant] = useState(navMerchant || null)

  // Local form state for editable fields
  const [form, setForm] = useState({ status: '', risk: '' })
  const [isSaving, setIsSaving] = useState(false)
  const [confirmingActivation, setConfirmingActivation] = useState(false)

  useEffect(() => {
    if (!merchant) {
      const found = merchants.find((m) => m.id === merchantId)
      setMerchant(found || null)
    }
  }, [merchantId, merchant, merchants])

  useEffect(() => {
    if (merchant) setForm({ status: merchant.status, risk: merchant.risk })
  }, [merchant])

  if (!merchant) {
    return (
      <div className="p-6 container mx-auto max-w-3xl">
        <button onClick={() => navigate('/merchants', { replace: true })} className="text-blue-600 underline mb-4">Back to merchants</button>
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
    setTimeout(() => {
      // Update the merchant in the Zustand store
      updateMerchant(merchantId, form)
      setMerchant((m) => ({ ...m, ...form }))
      setIsSaving(false)
      alert('Saved successfully')
      navigate('/merchants', { replace: true })
    }, 400)
  }

  const getChargebackColor = (ratio) => {
    if (ratio > 2) return 'text-red-600'
    if (ratio > 1) return 'text-orange-600'
    return 'text-green-600'
  }

  // prevent background scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  return (
    <Modal open={true} title={merchant.name} onClose={() => navigate('/merchants', { replace: true })}>
      <div className="text-sm text-slate-700 mb-3">{merchant.description || 'No description provided.'}</div>

      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-slate-600">Chargeback</div>
        <div className={`text-sm font-semibold ${getChargebackColor(merchant.chargebackRatio)}`}>{merchant.chargebackRatio}%</div>
      </div>

      {confirmingActivation && (
        <div className="mb-3 p-3 bg-orange-50 rounded">
          <div className="text-sm font-medium text-orange-800">Confirm activation — high risk merchant</div>
          <div className="mt-2 flex gap-2">
            <button onClick={confirmActivate} className="px-3 py-1 bg-orange-600 text-white rounded">Yes</button>
            <button onClick={() => setConfirmingActivation(false)} className="px-3 py-1 border rounded">Cancel</button>
          </div>
        </div>
      )}

      <div className="mb-3">
        <div className="text-sm text-slate-600 mb-2">Status</div>
        <div className="flex gap-2">
          {['active','paused','blocked'].map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-sm">
              <input type="radio" name="status" value={opt} checked={form.status === opt} onChange={() => updateField('status', opt)} />
              <span className="capitalize">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-slate-600 mb-2">Risk</div>
        <div className="flex gap-2">
          {['low','medium','high'].map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-sm">
              <input type="radio" name="risk" value={opt} checked={form.risk === opt} onChange={() => updateField('risk', opt)} />
              <span className="capitalize">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button onClick={() => navigate('/merchants', { replace: true })} className="px-3 py-1 border rounded text-sm">Cancel</button>
        <button onClick={save} disabled={isSaving} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">{isSaving ? 'Saving...' : 'Save'}</button>
      </div>
    </Modal>
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
      ].join(' ')}>{String(value)}</div>
    </div>
  )
}

Field.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  mono: PropTypes.bool,
  bold: PropTypes.bool,
  full: PropTypes.bool,
}

function OptionGroup({ label, options, value, onChange }) {
  return (
    <div>
      <label className="block text-sm text-slate-700 mb-2">{label}</label>
      <div className="flex gap-3">
        {options.map((opt) => {
          const active = value === opt
          return (
            <label key={opt} className={`cursor-pointer select-none`}>
              <input type="radio" name={label} value={opt} checked={active} onChange={() => onChange(opt)} className="sr-only" />
              <div className={`px-3 py-2 rounded-md text-sm font-medium ${active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}>{opt}</div>
            </label>
          )
        })}
      </div>
    </div>
  )
}

OptionGroup.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

