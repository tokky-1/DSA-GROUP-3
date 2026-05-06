import { Trash2, FileText, Images } from 'lucide-react'

const FORMAT_LABELS = { pdf: 'PDF', doc: 'DOC', txt: 'TXT' }
const STRUCTURE_LABELS = { 'multi-page': 'Multi-page', 'single-docs': 'Separate docs' }

function timeAgo(ts) {
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d ago`
  return new Date(ts).toLocaleDateString()
}

export default function HistoryCard({ entry, onDelete, onClick }) {
  const { imageCount, imageNames, outputFormat, docStructure, outputFiles, timestamp } = entry

  return (
    <div
      onClick={onClick}
      className="card p-0 flex flex-col animate-fade-in overflow-hidden cursor-pointer group
                 hover:shadow-md hover:border-brand-300 dark:hover:border-gray-700 transition-all"
    >
      {/* Header */}
      <div className="p-4 flex items-start gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-brand-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
          <Images className="w-4 h-4 text-brand-500 dark:text-brand-400" />
        </div>

        <div className="min-w-0 flex-1 overflow-hidden">
          <p className="text-sm font-medium text-brand-800 dark:text-white truncate">
            {imageCount} image{imageCount !== 1 ? 's' : ''}
          </p>
          <p
            className="text-xs text-brand-400 dark:text-gray-500 truncate"
            title={imageNames?.join(', ')}
          >
            {imageNames?.[0]}
            {imageNames?.length > 1 ? ` +${imageNames.length - 1} more` : ''}
          </p>
        </div>

        <button
          onClick={e => { e.stopPropagation(); onDelete() }}
          className="p-1.5 rounded-lg text-brand-200 dark:text-gray-700
                     hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20
                     transition-colors shrink-0"
          aria-label="Delete entry"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Badges */}
      <div className="px-4 pb-3 flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full
                         bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
          <FileText className="w-3 h-3" />
          {FORMAT_LABELS[outputFormat] || outputFormat}
        </span>
        <span className="inline-flex text-xs font-medium px-2 py-1 rounded-full
                         bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
          {STRUCTURE_LABELS[docStructure] || docStructure}
        </span>
        <span className="ml-auto text-xs text-brand-400 dark:text-gray-600 shrink-0">
          {timeAgo(timestamp)}
        </span>
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-brand-50 dark:border-gray-800 flex items-center justify-between">
        <span className="text-xs text-brand-400 dark:text-gray-500">
          {outputFiles?.length || 0} output file{outputFiles?.length !== 1 ? 's' : ''}
        </span>
        <span className="text-xs font-medium text-brand-500 dark:text-brand-400
                         group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">
          View details →
        </span>
      </div>
    </div>
  )
}
