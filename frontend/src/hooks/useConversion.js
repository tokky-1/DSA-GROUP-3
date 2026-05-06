import { useState, useCallback } from 'react'
import { convertImages, STEPS } from '../services/api'
import { saveConversion } from '../services/db'

export function useConversion() {
  const [status, setStatus] = useState('idle')  // idle | processing | done | error
  const [stepIndex, setStepIndex] = useState(-1)
  const [percentage, setPercentage] = useState(0)
  const [outputFiles, setOutputFiles] = useState([])
  const [error, setError] = useState(null)

  const convert = useCallback(async (images, settings) => {
    setStatus('processing')
    setStepIndex(0)
    setPercentage(0)
    setOutputFiles([])
    setError(null)

    try {
      const result = await convertImages(images, settings, ({ stepIndex: si, percentage: pct }) => {
        setStepIndex(si)
        setPercentage(pct)
      })

      setStepIndex(STEPS.length - 1)
      setPercentage(100)
      setOutputFiles(result.files)
      setStatus('done')

      await saveConversion({
        imageNames: images.map(f => f.name),
        imageCount: images.length,
        outputFormat: settings.outputFormat,
        docStructure: settings.docStructure,
        outputFiles: result.files.map(f => ({ name: f.name, blob: f.blob })),
      })
    } catch (err) {
      setError(err.message || 'Conversion failed')
      setStatus('error')
    }
  }, [])

  const reset = useCallback(() => {
    setStatus('idle')
    setStepIndex(-1)
    setPercentage(0)
    setOutputFiles([])
    setError(null)
  }, [])

  return { status, stepIndex, percentage, outputFiles, error, steps: STEPS, convert, reset }
}
