import { useState } from 'react'
import { Clock, Trash2, Search, SlidersHorizontal, Inbox } from 'lucide-react'
import { Link } from 'react-router-dom'
import HistoryCard from '../components/HistoryCard'
import ConversionDetailsModal from '../components/ConversionDetailsModal'
import { useHistory } from '../hooks/useHistory'

const FORMAT_OPTS = ['all', 'pdf', 'doc', 'txt']
const STRUCTURE_OPTS = [
  { value: 'all',         label: 'All structures' },
  { value: 'multi-page',  label: 'Multi-page doc' },
  { value: 'single-docs', label: 'Separate docs' },
]

export default function HistoryPage() {
  const { entries, loading, remove, clearAll } = useHistory()
  const [formatFilter, setFormatFilter]       = useState('all')
  const [structureFilter, setStructureFilter] = useState('all')
  const [search, setSearch]                   = useState('')
  const [confirmClear, setConfirmClear]       = useState(false)
  const [selectedEntry, setSelectedEntry]     = useState(null)

  const filtered = entries.filter(e => {
    if (formatFilter !== 'all' && e.outputFormat !== formatFilter) return false
    if (structureFilter !== 'all' && e.docStructure !== structureFilter) return false
    if (search) {
      const q = search.toLowerCase()
      const names = (e.imageNames || []).join(' ').toLowerCase()
      const files = (e.outputFiles || []).map(f => f.name).join(' ').toLowerCase()
      if (!names.includes(q) && !files.includes(q)) return false
    }
    return true
  })

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-5 h-5 text-brand-500" />
              <h1 className="text-2xl font-bold text-brand-900 dark:text-white">Conversion History</h1>
            </div>
            <p className="text-brand-500 dark:text-gray-400 text-sm">
              {entries.length} conversion{entries.length !== 1 ? 's' : ''} saved in this browser
            </p>
          </div>

          {entries.length > 0 && (
            confirmClear ? (
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm text-brand-500 dark:text-gray-400">Delete all?</span>
                <button
                  onClick={() => { clearAll(); setConfirmClear(false) }}
                  className="btn-primary bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 text-xs py-1.5 px-3"
                >
                  Yes, delete
                </button>
                <button onClick={() => setConfirmClear(false)} className="btn-secondary text-xs py-1.5 px-3">
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="btn-secondary text-red-500 dark:text-red-400 border-red-100 dark:border-red-900
                           hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )
          )}
        </div>

        {/* Filters */}
        {entries.length > 0 && (
          <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
              <input
                type="text"
                placeholder="Search by filename…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl
                           bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                           text-brand-800 dark:text-gray-100 placeholder:text-brand-300 dark:placeholder:text-gray-600
                           focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>

            <div className="flex gap-2 items-center">
              <SlidersHorizontal className="w-4 h-4 text-brand-400 shrink-0" />
              <select
                value={formatFilter}
                onChange={e => setFormatFilter(e.target.value)}
                className="text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                           text-brand-700 dark:text-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                {FORMAT_OPTS.map(f => (
                  <option key={f} value={f}>{f === 'all' ? 'All formats' : f.toUpperCase()}</option>
                ))}
              </select>
              <select
                value={structureFilter}
                onChange={e => setStructureFilter(e.target.value)}
                className="text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                           text-brand-700 dark:text-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                {STRUCTURE_OPTS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-brand-300 border-t-brand-600 rounded-full animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-24">
            <Inbox className="w-14 h-14 text-brand-200 dark:text-gray-700 mx-auto mb-4" />
            <h2 className="text-brand-700 dark:text-gray-300 font-semibold text-lg mb-2">No conversions yet</h2>
            <p className="text-brand-400 dark:text-gray-500 text-sm mb-6">
              Your conversion history will appear here once you start converting documents.
            </p>
            <Link to="/app" className="btn-primary">Start Converting</Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-10 h-10 text-brand-200 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-brand-500 dark:text-gray-400 text-sm">No entries match your filters.</p>
            <button
              onClick={() => { setFormatFilter('all'); setStructureFilter('all'); setSearch('') }}
              className="btn-ghost mt-3 text-sm"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(entry => (
              <HistoryCard
                key={entry.id}
                entry={entry}
                onDelete={() => remove(entry.id)}
                onClick={() => setSelectedEntry(entry)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details modal */}
      {selectedEntry && (
        <ConversionDetailsModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      )}
    </div>
  )
}
