import { useRef, useState, useCallback } from 'react'
import { UploadCloud, Camera, Plus, X, Image } from 'lucide-react'
import CameraModal from './CameraModal'

const ACCEPTED = 'image/jpeg,image/png,image/webp,image/heic,image/heif'

export default function ImageUploader({ images, onChange }) {
  const inputRef = useRef(null)
  const addInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)
  const [showCamera, setShowCamera] = useState(false)

  const addFiles = useCallback((files) => {
    const valid = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (!valid.length) return
    const newEntries = valid.map(f => ({ file: f, preview: URL.createObjectURL(f) }))
    onChange(prev => [...prev, ...newEntries])
  }, [onChange])

  const remove = useCallback((idx) => {
    onChange(prev => {
      URL.revokeObjectURL(prev[idx].preview)
      return prev.filter((_, i) => i !== idx)
    })
  }, [onChange])

  function onDragEnter(e) {
    e.preventDefault()
    dragCounter.current += 1
    setIsDragging(true)
  }
  function onDragLeave(e) {
    e.preventDefault()
    dragCounter.current -= 1
    if (dragCounter.current === 0) setIsDragging(false)
  }
  function onDragOver(e) { e.preventDefault() }
  function onDrop(e) {
    e.preventDefault()
    dragCounter.current = 0
    setIsDragging(false)
    addFiles(e.dataTransfer.files)
  }

  if (images.length === 0) {
    return (
      <>
        <div
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
          className={`relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-12 text-center transition-colors cursor-pointer
            ${isDragging
              ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30'
              : 'border-brand-200 dark:border-gray-700 bg-brand-50/50 dark:bg-gray-900/50 hover:border-brand-400 dark:hover:border-gray-600'
            }`}
          onClick={() => inputRef.current?.click()}
        >
          <div className="w-16 h-16 rounded-2xl bg-brand-100 dark:bg-gray-800 flex items-center justify-center">
            <UploadCloud className="w-8 h-8 text-brand-500 dark:text-brand-400" />
          </div>
          <div>
            <p className="text-brand-800 dark:text-gray-200 font-semibold text-lg">
              {isDragging ? 'Drop images here' : 'Drag & drop images here'}
            </p>
            <p className="text-brand-400 dark:text-gray-500 text-sm mt-1">
              Supports JPG, PNG, WEBP, HEIC — multiple files at once
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={e => { e.stopPropagation(); inputRef.current?.click() }}
              className="btn-secondary"
            >
              <Image className="w-4 h-4" />
              Browse Files
            </button>
            <button
              type="button"
              onClick={e => { e.stopPropagation(); setShowCamera(true) }}
              className="btn-secondary"
            >
              <Camera className="w-4 h-4" />
              Camera
            </button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            multiple
            className="hidden"
            onChange={e => addFiles(e.target.files)}
          />
        </div>

        {showCamera && (
          <CameraModal
            onCapture={file => addFiles([file])}
            onClose={() => setShowCamera(false)}
          />
        )}
      </>
    )
  }

  return (
    <>
      <div
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`relative rounded-2xl border-2 transition-colors p-4 ${
          isDragging
            ? 'border-brand-500 bg-brand-50 dark:bg-gray-800/50'
            : 'border-brand-100 dark:border-gray-800 bg-white dark:bg-gray-900'
        }`}
      >
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden bg-brand-50 dark:bg-gray-800">
              <img src={img.preview} alt={img.file.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
              <button
                type="button"
                onClick={() => remove(idx)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 dark:bg-gray-900/90
                           flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity
                           hover:bg-red-50 text-brand-600 hover:text-red-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="absolute bottom-0 inset-x-0 px-1.5 pb-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs truncate drop-shadow">{img.file.name}</p>
              </div>
            </div>
          ))}

          {/* Add more tile */}
          <div className="aspect-square">
            <button
              type="button"
              onClick={() => addInputRef.current?.click()}
              className="w-full h-full rounded-xl border-2 border-dashed border-brand-200 dark:border-gray-700
                         flex flex-col items-center justify-center gap-1 text-brand-400 dark:text-gray-500
                         hover:border-brand-400 hover:text-brand-500 dark:hover:border-gray-600 dark:hover:text-gray-400
                         transition-colors"
            >
              <Plus className="w-6 h-6" />
              <span className="text-xs font-medium">Add more</span>
            </button>
            <input
              ref={addInputRef}
              type="file"
              accept={ACCEPTED}
              multiple
              className="hidden"
              onChange={e => addFiles(e.target.files)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-brand-100 dark:border-gray-800">
          <p className="text-sm text-brand-500 dark:text-gray-400">
            {images.length} image{images.length !== 1 ? 's' : ''} selected
          </p>
          <button
            type="button"
            onClick={() => setShowCamera(true)}
            className="btn-ghost text-xs py-1.5 px-3"
          >
            <Camera className="w-3.5 h-3.5" />
            Camera
          </button>
        </div>
      </div>

      {showCamera && (
        <CameraModal
          onCapture={file => addFiles([file])}
          onClose={() => setShowCamera(false)}
        />
      )}
    </>
  )
}
