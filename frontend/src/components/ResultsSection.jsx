import { Download, Eye, CheckCircle, RefreshCw, FileText } from 'lucide-react'

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFormatColor(name) {
  if (name.endsWith('.pdf')) return 'text-red-500'
  if (name.endsWith('.doc') || name.endsWith('.docx')) return 'text-brand-500'
  return 'text-green-500'
}

export default function ResultsSection({ files, onReset }) {
  function download(file) {
    const a = document.createElement('a')
    a.href = file.url
    a.download = file.name
    a.click()
  }

  function downloadAll() {
    files.forEach((f, i) => {
      setTimeout(() => download(f), i * 150)
    })
  }

  function preview(file) {
    window.open(file.url, '_blank')
  }

  return (
    <div className="animate-slide-up">
      {/* Success banner */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 mb-6">
        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-green-800 dark:text-green-200 font-medium text-sm">Conversion complete!</p>
          <p className="text-green-600 dark:text-green-400 text-xs mt-0.5">
            {files.length} file{files.length !== 1 ? 's' : ''} ready to download
          </p>
        </div>
        {files.length > 1 && (
          <button onClick={downloadAll} className="btn-secondary text-xs py-1.5 px-3 shrink-0">
            <Download className="w-3.5 h-3.5" />
            Download All
          </button>
        )}
      </div>

      {/* File cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {files.map((file, idx) => (
          <div key={idx} className="card p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-gray-800 flex items-center justify-center shrink-0">
              <FileText className={`w-5 h-5 ${getFormatColor(file.name)}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-brand-800 dark:text-white truncate">{file.name}</p>
              <p className="text-xs text-brand-400 dark:text-gray-500 mt-0.5">
                {formatBytes(file.blob.size)}
              </p>
              <div className="flex gap-2 mt-2.5">
                <button
                  onClick={() => preview(file)}
                  className="btn-ghost text-xs py-1 px-2.5 rounded-lg"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Preview
                </button>
                <button
                  onClick={() => download(file)}
                  className="btn-primary text-xs py-1 px-2.5 rounded-lg"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Convert another */}
      <div className="mt-6 text-center">
        <button onClick={onReset} className="btn-secondary">
          <RefreshCw className="w-4 h-4" />
          Convert Another
        </button>
      </div>
    </div>
  )
}
