import { FileText, Files, FileIcon } from 'lucide-react'

const DOC_STRUCTURES = [
  {
    value: 'multi-page',
    label: 'Multiple Pages',
    sub: 'All images combined into a single document',
  },
  {
    value: 'single-docs',
    label: 'Separate Documents',
    sub: 'Each image becomes its own document',
  },
]

const OUTPUT_FORMATS = [
  { value: 'doc',  label: 'DOC',  icon: FileText,  desc: 'Microsoft Word' },
  { value: 'pdf',  label: 'PDF',  icon: FileIcon,  desc: 'Portable Document' },
  { value: 'txt',  label: 'TXT',  icon: Files,     desc: 'Plain Text' },
]

export default function SettingsPanel({ settings, onChange }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Document structure */}
      <div>
        <h3 className="text-sm font-semibold text-brand-800 dark:text-gray-200 mb-3">
          Document Structure
        </h3>
        <div className="flex flex-col gap-2">
          {DOC_STRUCTURES.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ ...settings, docStructure: opt.value })}
              className={`flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-colors ${
                settings.docStructure === opt.value
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40'
                  : 'border-brand-100 dark:border-gray-700 hover:border-brand-300 dark:hover:border-gray-600'
              }`}
            >
              <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                settings.docStructure === opt.value
                  ? 'border-brand-500'
                  : 'border-brand-300 dark:border-gray-600'
              }`}>
                {settings.docStructure === opt.value && (
                  <div className="w-2 h-2 rounded-full bg-brand-500" />
                )}
              </div>
              <div>
                <p className={`text-sm font-medium ${
                  settings.docStructure === opt.value
                    ? 'text-brand-700 dark:text-brand-300'
                    : 'text-brand-600 dark:text-gray-300'
                }`}>{opt.label}</p>
                <p className="text-xs text-brand-400 dark:text-gray-500 mt-0.5">{opt.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Output format */}
      <div>
        <h3 className="text-sm font-semibold text-brand-800 dark:text-gray-200 mb-3">
          Output Format
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {OUTPUT_FORMATS.map(fmt => {
            const Icon = fmt.icon
            const active = settings.outputFormat === fmt.value
            return (
              <button
                key={fmt.value}
                type="button"
                onClick={() => onChange({ ...settings, outputFormat: fmt.value })}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-colors ${
                  active
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400'
                    : 'border-brand-100 dark:border-gray-700 text-brand-400 dark:text-gray-500 hover:border-brand-300 dark:hover:border-gray-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className={`text-sm font-bold ${active ? 'text-brand-600 dark:text-brand-400' : ''}`}>
                  {fmt.label}
                </span>
                <span className="text-xs text-brand-400 dark:text-gray-500">{fmt.desc}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
