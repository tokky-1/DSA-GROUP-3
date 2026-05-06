import { X, FileText, Download, Eye, Calendar, ImageIcon } from 'lucide-react'

const FORMAT_LABELS = { pdf: 'PDF', doc: 'DOC', txt: 'TXT' }
const STRUCTURE_LABELS = { 'multi-page': 'Multi-page document', 'single-docs': 'Separate documents' }

function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 5000)
}

function previewBlob(blob, name) {
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
}

export default function ConversionDetailsModal({ entry, onClose }) {
  const { imageCount, imageNames, outputFormat, docStructure, outputFiles, timestamp } = entry

  const dateStr = new Date(timestamp).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={handleBackdrop}
    >
      <div className="card w-full max-w-lg flex flex-col max-h-[85vh] animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-brand-100 dark:border-gray-800 shrink-0">
          <h2 className="font-semibold text-brand-900 dark:text-white">Conversion Details</h2>
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-brand-500 dark:text-gray-400">
            <Calendar className="w-4 h-4 shrink-0" />
            {dateStr}
          </div>

          {/* Settings badges */}
          <div className="flex gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full
                             bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
              <FileText className="w-3.5 h-3.5" />
              {FORMAT_LABELS[outputFormat] || outputFormat}
            </span>
            <span className="inline-flex text-xs font-medium px-3 py-1.5 rounded-full
                             bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              {STRUCTURE_LABELS[docStructure] || docStructure}
            </span>
          </div>

          {/* Source images */}
          <div>
            <h3 className="text-sm font-semibold text-brand-800 dark:text-gray-200 mb-2">
              Source Images ({imageCount})
            </h3>
            <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto">
              {imageNames?.map((name, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg
                             bg-brand-50 dark:bg-gray-800"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-brand-400 dark:text-gray-500 shrink-0" />
                  <span className="text-sm text-brand-700 dark:text-gray-300 truncate">{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Output files */}
          {outputFiles?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-brand-800 dark:text-gray-200 mb-2">
                Output Files ({outputFiles.length})
              </h3>
              <div className="flex flex-col gap-2">
                {outputFiles.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl
                               bg-brand-50 dark:bg-gray-800"
                  >
                    <FileText className="w-5 h-5 text-brand-500 dark:text-brand-400 shrink-0" />
                    <span className="flex-1 text-sm text-brand-700 dark:text-gray-200 truncate min-w-0">
                      {f.name}
                    </span>
                    {f.blob && (
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => previewBlob(f.blob, f.name)}
                          className="p-1.5 rounded-lg hover:bg-brand-100 dark:hover:bg-gray-700
                                     text-brand-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => downloadBlob(f.blob, f.name)}
                          className="p-1.5 rounded-lg hover:bg-brand-100 dark:hover:bg-gray-700
                                     text-brand-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-brand-100 dark:border-gray-800 shrink-0">
          <button onClick={onClose} className="btn-secondary w-full justify-center">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
