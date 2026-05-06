const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const MOCK = import.meta.env.VITE_MOCK_API !== 'false'

export const STEPS = [
  { key: 'orientation',    label: 'Correcting orientation',           duration: 900  },
  { key: 'grayscale',      label: 'Converting to grayscale',          duration: 600  },
  { key: 'lighting',       label: 'Normalizing uneven lighting',      duration: 1000 },
  { key: 'binarization',   label: 'Performing adaptive binarization', duration: 1300 },
  { key: 'morphological',  label: 'Performing morphological cleanup', duration: 700  },
  { key: 'segmentation',   label: 'Segmenting the lines',             duration: 1600 },
  { key: 'extraction',     label: 'Extracting the text',              duration: 2200 },
  { key: 'compiling',      label: 'Compiling the documents',          duration: 900  },
  { key: 'done',           label: 'Done',                             duration: 300  },
]

async function mockConvert(images, settings, onProgress) {
  const total = STEPS.reduce((s, st) => s + st.duration, 0)
  let elapsed = 0

  for (let i = 0; i < STEPS.length; i++) {
    onProgress({ stepIndex: i, percentage: Math.round((elapsed / total) * 100) })
    await new Promise(r => setTimeout(r, STEPS[i].duration))
    elapsed += STEPS[i].duration
  }
  onProgress({ stepIndex: STEPS.length - 1, percentage: 100 })

  const format = settings.outputFormat
  const mimeMap = { pdf: 'application/pdf', doc: 'application/msword', txt: 'text/plain' }
  const count = settings.docStructure === 'single-docs' ? images.length : 1

  const files = Array.from({ length: count }, (_, idx) => {
    const name = count > 1
      ? `document_${idx + 1}.${format}`
      : `handwriting_converted.${format}`
    const content = `ScriptSense converted document${count > 1 ? ` — page ${idx + 1}` : ''}.\n\n[Converted content from: ${images.map(f => f.name).join(', ')}]`
    const blob = new Blob([content], { type: mimeMap[format] || 'application/octet-stream' })
    return { name, blob, url: URL.createObjectURL(blob) }
  })

  return { files }
}

async function realConvert(images, settings, onProgress) {
  const form = new FormData()
  images.forEach(img => form.append('images', img))
  form.append('doc_structure', settings.docStructure)
  form.append('output_format', settings.outputFormat)

  const res = await fetch(`${API_BASE}/api/convert`, { method: 'POST', body: form })
  if (!res.ok) throw new Error('Server error — failed to start conversion')
  const { job_id } = await res.json()

  return new Promise((resolve, reject) => {
    const es = new EventSource(`${API_BASE}/api/convert/${job_id}/progress`)

    es.onmessage = (event) => {
      const data = JSON.parse(event.data)
      onProgress({ stepIndex: data.step_index, percentage: data.percentage })
      if (data.step === 'done') {
        es.close()
        resolve({ files: data.files })
      }
    }

    es.onerror = () => {
      es.close()
      reject(new Error('Connection to server lost'))
    }
  })
}

export async function convertImages(images, settings, onProgress) {
  return MOCK ? mockConvert(images, settings, onProgress) : realConvert(images, settings, onProgress)
}
