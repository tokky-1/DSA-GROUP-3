// When the Vite proxy is active (dev), API_BASE is '' and all /api/* calls are
// forwarded to the backend automatically. Set VITE_API_BASE_URL only if you
// need to point at a remote server without the proxy.
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

// Set VITE_MOCK_API=false in .env to use the real backend.
const MOCK = import.meta.env.VITE_MOCK_API !== 'false'

// Steps match the backend pipeline exactly so the progress overlay stays in sync.
export const STEPS = [
  { key: 'uploading',  label: 'Saving uploaded images',     duration: 400  },
  { key: 'processing', label: 'Pre-processing images',      duration: 1400 },
  { key: 'lines',      label: 'Detecting text lines',       duration: 1500 },
  { key: 'ocr',        label: 'Reading handwriting',        duration: 3000 },
  { key: 'nlp',        label: 'Polishing text',             duration: 1000 },
  { key: 'creating',   label: 'Creating output file',       duration: 600  },
  { key: 'done',       label: 'Done',                       duration: 200  },
]

// Fast lookup: step key → index in STEPS
const STEP_INDEX = Object.fromEntries(STEPS.map((s, i) => [s.key, i]))

// ── Mock ──────────────────────────────────────────────────────────────────────

async function mockConvert(images, settings, onProgress) {
  const total = STEPS.reduce((s, st) => s + st.duration, 0)
  let elapsed = 0

  for (let i = 0; i < STEPS.length; i++) {
    onProgress({ stepIndex: i, percentage: Math.round((elapsed / total) * 100) })
    await new Promise(r => setTimeout(r, STEPS[i].duration))
    elapsed += STEPS[i].duration
  }
  onProgress({ stepIndex: STEPS.length - 1, percentage: 100 })

  const { outputFormat: format, docStructure } = settings
  const mimeMap = { pdf: 'application/pdf', doc: 'application/msword', txt: 'text/plain' }
  const count = docStructure === 'single' ? images.length : 1

  const files = Array.from({ length: count }, (_, idx) => {
    const name = docStructure === 'single'
      ? `document_${String(idx + 1).padStart(3, '0')}.${format}`
      : `output.${format}`
    const content = `ScriptSense converted document${count > 1 ? ` — page ${idx + 1}` : ''}.\n\n` +
      `[Converted content from: ${images.map(f => f.name).join(', ')}]`
    const blob = new Blob([content], { type: mimeMap[format] || 'application/octet-stream' })
    return { name, blob, url: URL.createObjectURL(blob) }
  })

  return { files }
}

// ── Real backend ──────────────────────────────────────────────────────────────

async function realConvert(images, settings, onProgress) {
  // 1. POST the job — backend validates and starts the pipeline immediately
  const form = new FormData()
  images.forEach(img => form.append('images', img))
  form.append('doc_structure', settings.docStructure)   // 'multi' | 'single'
  form.append('output_format', settings.outputFormat)   // 'pdf' | 'doc' | 'txt'

  const postRes = await fetch(`${API_BASE}/api/convert`, { method: 'POST', body: form })
  if (!postRes.ok) {
    const err = await postRes.json().catch(() => ({}))
    throw new Error(err.detail || `Server error (${postRes.status})`)
  }
  const { job_id } = await postRes.json()

  // 2. Open SSE stream and drive the progress overlay
  return new Promise((resolve, reject) => {
    const es = new EventSource(`${API_BASE}/api/convert/${job_id}/progress`)

    es.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data)
        const si = STEP_INDEX[data.step] ?? (STEPS.length - 1)
        onProgress({ stepIndex: si, percentage: data.percentage })

        if (data.status === 'done') {
          es.close()
          // Fetch each result file so we have a local Blob for preview / IndexedDB
          const files = await Promise.all(
            (data.files ?? []).map(async (f) => {
              const res = await fetch(API_BASE + f.url)
              const blob = await res.blob()
              return { name: f.filename, blob, url: URL.createObjectURL(blob) }
            })
          )
          resolve({ files })
        } else if (data.status === 'error') {
          es.close()
          reject(new Error(data.message || 'Conversion failed'))
        }
      } catch (parseErr) {
        es.close()
        reject(parseErr)
      }
    }

    es.onerror = () => {
      es.close()
      reject(new Error('Lost connection to server — please try again'))
    }
  })
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function convertImages(images, settings, onProgress) {
  return MOCK ? mockConvert(images, settings, onProgress) : realConvert(images, settings, onProgress)
}
