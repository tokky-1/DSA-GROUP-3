import { useState } from 'react'
import { Wand2, AlertCircle } from 'lucide-react'
import ImageUploader from '../components/ImageUploader'
import SettingsPanel from '../components/SettingsPanel'
import ProgressOverlay from '../components/ProgressOverlay'
import ResultsSection from '../components/ResultsSection'
import { useConversion } from '../hooks/useConversion'

const DEFAULT_SETTINGS = {
  docStructure: 'multi-page',
  outputFormat: 'doc',
}

export default function AppPage() {
  const [images, setImages] = useState([])
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const { status, stepIndex, percentage, outputFiles, error, steps, convert, reset } = useConversion()

  async function handleConvert() {
    if (!images.length) return
    await convert(images.map(i => i.file), settings)
  }

  function handleReset() {
    images.forEach(img => URL.revokeObjectURL(img.preview))
    setImages([])
    setSettings(DEFAULT_SETTINGS)
    reset()
  }

  if (status === 'done') {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <ResultsSection files={outputFiles} onReset={handleReset} />
        </div>
      </div>
    )
  }

  return (
    <>
      {status === 'processing' && (
        <ProgressOverlay steps={steps} stepIndex={stepIndex} percentage={percentage} />
      )}

      <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 py-10">
          {/* Page header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-brand-900 dark:text-white">
              Convert Handwriting
            </h1>
            <p className="text-brand-500 dark:text-gray-400 mt-2">
              Upload images, configure your output, and let AI do the rest.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
            {/* Left — Image uploader */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-brand-700 dark:text-gray-300 uppercase tracking-wide">
                  Images
                </h2>
                {images.length > 0 && (
                  <button
                    onClick={() => {
                      images.forEach(img => URL.revokeObjectURL(img.preview))
                      setImages([])
                    }}
                    className="text-xs text-brand-400 hover:text-red-500 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <ImageUploader images={images} onChange={setImages} />
            </div>

            {/* Right — Settings + Convert */}
            <div className="card p-5 space-y-6 lg:sticky lg:top-24">
              <div>
                <h2 className="text-sm font-semibold text-brand-700 dark:text-gray-300 uppercase tracking-wide mb-4">
                  Settings
                </h2>
                <SettingsPanel settings={settings} onChange={setSettings} />
              </div>

              <div className="border-t border-brand-100 dark:border-gray-800 pt-5">
                {error && status === 'error' && (
                  <div className="flex items-start gap-2 mb-4 text-sm text-red-500 dark:text-red-400
                                  bg-red-50 dark:bg-red-900/20 rounded-xl p-3">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  onClick={handleConvert}
                  disabled={images.length === 0 || status === 'processing'}
                  className="btn-primary w-full py-3 text-base justify-center"
                >
                  <Wand2 className="w-5 h-5" />
                  {images.length === 0
                    ? 'Add images to convert'
                    : `Convert ${images.length} image${images.length !== 1 ? 's' : ''}`}
                </button>

                {images.length === 0 && (
                  <p className="text-xs text-brand-400 dark:text-gray-500 text-center mt-3">
                    Add at least one image to get started
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
