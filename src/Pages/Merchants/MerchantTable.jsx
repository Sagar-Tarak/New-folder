import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function MerchantTable({ merchants, onMerchantClick, onAddMerchant }) {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [risk, setRisk] = useState('all')
  const [sortField, setSortField] = useState('name')
  const [sortDir, setSortDir] = useState('asc')

  // filter merchants (keeps it simple)
  const filtered = merchants.filter((m) => {
    const matchesQ = m.name.toLowerCase().includes(q.toLowerCase())
    const matchesStatus = status === 'all' || m.status === status
    const matchesRisk = risk === 'all' || m.risk === risk
    return matchesQ && matchesStatus && matchesRisk
  })

  // sort logic (basic)
  const sorted = [...filtered].sort((a, b) => {
    let aVal = a[sortField]
    let bVal = b[sortField]

    // handle string vs number
    if (typeof aVal === 'string') aVal = aVal.toLowerCase()
    if (typeof bVal === 'string') bVal = bVal.toLowerCase()

    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir((s) => (s === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  // small sort indicator component to keep JSX readable
  const SortIndicator = ({ field }) => {
    if (field !== sortField) return <span className="text-slate-300">↕</span>
    return sortDir === 'asc' ? <span className="text-blue-500">↑</span> : <span className="text-blue-500">↓</span>
  }

  const navigate = useNavigate()

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
            <div className="relative">
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by merchant name..."
                className="w-full px-4 py-2 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Risk</label>
            <select value={risk} onChange={(e) => setRisk(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
              <option value="all">All Risk Levels</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {(q || status !== 'all' || risk !== 'all') && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200">
            <span className="text-sm text-slate-600">Active filters:</span>
            {q && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                Search: {q}
                <button onClick={() => setQ('')} className="ml-1">×</button>
              </span>
            )}
            {status !== 'all' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                Status: {status}
                <button onClick={() => setStatus('all')} className="ml-1">×</button>
              </span>
            )}
            {risk !== 'all' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-orange-100 text-orange-800">
                Risk: {risk}
                <button onClick={() => setRisk('all')} className="ml-1">×</button>
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-600">
          Showing <span className="font-semibold text-slate-900">{sorted.length}</span> of <span className="font-semibold text-slate-900">{merchants.length}</span> merchants
        </p>

        <button onClick={onAddMerchant} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Merchant
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {sorted.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No merchants found</h3>
            <p className="text-slate-600 mb-4">Try adjusting your search or filters.</p>
            <button onClick={() => { setQ(''); setStatus('all'); setRisk('all') }} className="text-blue-600">Clear all filters</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th onClick={() => toggleSort('name')} className="text-left py-3 px-4 text-sm font-semibold cursor-pointer">
                    <div className="flex items-center gap-2">Name <SortIndicator field="name" /></div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Country</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                  <th onClick={() => toggleSort('monthlyVolume')} className="text-left py-3 px-4 text-sm font-semibold cursor-pointer">
                    <div className="flex items-center gap-2">Monthly Volume <SortIndicator field="monthlyVolume" /></div>
                  </th>
                  <th onClick={() => toggleSort('chargebackRatio')} className="text-left py-3 px-4 text-sm font-semibold cursor-pointer">
                    <div className="flex items-center gap-2">Chargeback Ratio <SortIndicator field="chargebackRatio" /></div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Risk</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                    onClick={() => {
                      if (onMerchantClick) return onMerchantClick(m)
                      navigate(`/merchants/${m.id}`, { state: { merchant: m } })
                    }}
                  >
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900">{m.name}</span>
                        {m.description && <span className="text-xs text-slate-500">{m.description}</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">{m.country}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        m.status === 'active' ? 'bg-green-100 text-green-800' : m.status === 'paused' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>{m.status}</span>
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-slate-900">${m.monthlyVolume.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-medium ${
                        m.chargebackRatio > 2 ? 'text-red-600' : m.chargebackRatio > 1 ? 'text-orange-600' : 'text-green-600'
                      }`}>{m.chargebackRatio}%</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        m.risk === 'low' ? 'bg-blue-100 text-blue-800' : m.risk === 'medium' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                      }`}>{m.risk}</span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (onMerchantClick) return onMerchantClick(m)
                          navigate(`/merchants/${m.id}`, { state: { merchant: m } })
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
