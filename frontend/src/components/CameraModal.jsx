import { useEffect, useRef, useState } from 'react'
import { Camera, X } from 'lucide-react'

export default function CameraModal({ onCapture, onClose }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [error, setError] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        streamRef.current = stream
        videoRef.current.srcObject = stream
        setReady(true)
      })
      .catch(() => setError('Camera access denied. Please allow camera permission and try again.'))

    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [])

  function capture() {
    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    canvas.toBlob(blob => {
      const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' })
      onCapture(file)
      streamRef.current?.getTracks().forEach(t => t.stop())
      onClose()
    }, 'image/jpeg', 0.92)
  }

  function handleClose() {
    streamRef.current?.getTracks().forEach(t => t.stop())
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="card w-full max-w-lg animate-fade-in">
        <div className="flex items-center justify-between p-4 border-b border-brand-100 dark:border-gray-800">
          <div className="flex items-center gap-2 text-brand-800 dark:text-white font-semibold">
            <Camera className="w-4 h-4" />
            Take Photo
          </div>
          <button onClick={handleClose} className="btn-ghost p-1.5 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4">
          {error ? (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl p-4 text-sm text-center">
              {error}
            </div>
          ) : (
            <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {!ready && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3 p-4 pt-0 justify-end">
          <button onClick={handleClose} className="btn-secondary">Cancel</button>
          <button onClick={capture} className="btn-primary" disabled={!ready || !!error}>
            <Camera className="w-4 h-4" />
            Capture
          </button>
        </div>
      </div>
    </div>
  )
}
