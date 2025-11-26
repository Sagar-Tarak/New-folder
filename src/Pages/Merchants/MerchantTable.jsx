import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Table from '../../Components/UI/Table'

export default function MerchantTable({ merchants, onMerchantClick, onAddMerchant, onRemove, onRequestRemove }) {
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

  const getStatusClass = (status) => {
    if (status === 'active') return 'bg-green-100 text-green-800'
    if (status === 'paused') return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const navigate = useNavigate()
  const location = useLocation()

  const columns = [
    {
      key: 'name',
      header: (
        <button
          type="button"
          onClick={() => toggleSort('name')}
          className="cursor-pointer flex items-center gap-2 bg-transparent border-0 p-0"
          aria-label="Sort by name"
        >
          Name <SortIndicator field="name" />
        </button>
      ),
      accessor: 'name',
    },
    { key: 'country', header: 'Country', accessor: 'country' },
    {
      key: 'status',
      header: 'Status',
      render: (m) => {
        let statusClass = 'bg-red-100 text-red-800'
        if (m.status === 'active') {
          statusClass = 'bg-green-100 text-green-800'
        } else if (m.status === 'paused') {
          statusClass = 'bg-yellow-100 text-yellow-800'
        }
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>{m.status}</span>
        )
      },
    },
    {
      key: 'monthlyVolume',
      header: (
        <button type="button" onClick={() => toggleSort('monthlyVolume')} className="cursor-pointer flex items-center gap-2 bg-transparent border-0 p-0" aria-label="Sort by monthly volume">
          Monthly Volume <SortIndicator field="monthlyVolume" />
        </button>
      ),
      render: (m) => <span className="text-sm font-semibold text-slate-900">${m.monthlyVolume.toLocaleString()}</span>,
    },
    {
      key: 'chargebackRatio',
      header: (
        <button type="button" onClick={() => toggleSort('chargebackRatio')} className="cursor-pointer flex items-center gap-2 bg-transparent border-0 p-0" aria-label="Sort by chargeback ratio">
          Chargeback Ratio <SortIndicator field="chargebackRatio" />
        </button>
      ),
      render: (m) => {
        let chargebackClass = 'text-green-600'
        if (m.chargebackRatio > 2) {
          chargebackClass = 'text-red-600'
        } else if (m.chargebackRatio > 1) {
          chargebackClass = 'text-orange-600'
        }
        return (
          <span className={`text-sm font-medium ${chargebackClass}`}>{m.chargebackRatio}%</span>
        )
      },
    },
    {
      key: 'risk',
      header: 'Risk',
      render: (m) => {
        let riskClass = 'bg-red-100 text-red-800'
        if (m.risk === 'low') {
          riskClass = 'bg-blue-100 text-blue-800'
        } else if (m.risk === 'medium') {
          riskClass = 'bg-orange-100 text-orange-800'
        }
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${riskClass}`}>{m.risk}</span>
        )
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (m) => (
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (onMerchantClick) return onMerchantClick(m)
              navigate(`/merchants/${m.id}`, { state: { merchant: m, background: location } })
            }}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            View Details
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              if (typeof onRequestRemove === 'function') {
                onRequestRemove(m)
                return
              }
              if (typeof onRemove === 'function') {
                const ok = globalThis.confirm(`Remove merchant "${m.name}"? This will delete it from local storage.`)
                if (ok) onRemove(m.id)
              }
            }}
            className="text-red-600 hover:text-red-800 font-medium text-sm"
            aria-label={`Remove ${m.name}`}
          >
            Remove
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex items-center gap-3 w-full md:w-2/3">
            <div className="relative w-full max-w-2xl">
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search merchants"
                className="w-full pl-10 pr-10 py-2 rounded-md border border-slate-200 bg-white text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {q && (
                <button onClick={() => setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">×</button>
              )}
            </div>

            <div className="hidden md:flex items-center gap-2">
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="text-sm px-2 py-2 rounded-md border border-slate-200 bg-white">
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="blocked">Blocked</option>
              </select>

              <select value={risk} onChange={(e) => setRisk(e.target.value)} className="text-sm px-2 py-2 rounded-md border border-slate-200 bg-white">
                <option value="all">All risk levels</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <button onClick={() => { setQ(''); setStatus('all'); setRisk('all') }} className="text-sm text-slate-600 hover:text-slate-800 ml-2">Clear</button>
            </div>
          </div>

          <div className="flex items-center gap-2 md:ml-auto">
            <button onClick={() => { setQ(''); setStatus('all'); setRisk('all') }} className="text-sm text-slate-600 hover:text-slate-800">Clear</button>
          </div>
        </div>

        <div className="mt-3 md:hidden flex gap-2">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="flex-1 text-sm px-2 py-2 rounded-md border border-slate-200 bg-white">
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="blocked">Blocked</option>
          </select>
          <select value={risk} onChange={(e) => setRisk(e.target.value)} className="flex-1 text-sm px-2 py-2 rounded-md border border-slate-200 bg-white">
            <option value="all">All risk levels</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button onClick={() => { setQ(''); setStatus('all'); setRisk('all') }} className="text-sm text-slate-600 hover:text-slate-800">Clear</button>
        </div>

        {(q || status !== 'all' || risk !== 'all') && (
          <div className="flex flex-wrap gap-3 mt-3 text-sm text-slate-600">
            {q && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Search:</span>
                <span>{q}</span>
                <button onClick={() => setQ('')} className="ml-1 text-slate-400 hover:text-slate-700">×</button>
              </div>
            )}
            {status !== 'all' && (
              <div className="flex items-center gap-2 capitalize">
                <span className="font-medium">Status:</span>
                <span>{status}</span>
                <button onClick={() => setStatus('all')} className="ml-1 text-slate-400 hover:text-slate-700">×</button>
              </div>
            )}
            {risk !== 'all' && (
              <div className="flex items-center gap-2 capitalize">
                <span className="font-medium">Risk:</span>
                <span>{risk}</span>
                <button onClick={() => setRisk('all')} className="ml-1 text-slate-400 hover:text-slate-700">×</button>
              </div>
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
        <Table
          columns={columns}
          data={sorted}
          onRowClick={(m) => {
            if (onMerchantClick) return onMerchantClick(m)
            navigate(`/merchants/${m.id}`, { state: { merchant: m, background: location } })
          }}
          emptyMessage={(
            <div className="p-12 text-center">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No merchants found</h3>
              <p className="text-slate-600 mb-4">Try adjusting your search or filters.</p>
              <button onClick={() => { setQ(''); setStatus('all'); setRisk('all') }} className="text-blue-600">Clear all filters</button>
            </div>
          )}
        />
      </div>
    </div>
  )
}
