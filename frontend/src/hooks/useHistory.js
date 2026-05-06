import { useState, useEffect, useCallback } from 'react'
import { getAllConversions, deleteConversion, clearAllConversions } from '../services/db'

export function useHistory() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAllConversions()
      setEntries(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const remove = useCallback(async (id) => {
    await deleteConversion(id)
    setEntries(prev => prev.filter(e => e.id !== id))
  }, [])

  const clearAll = useCallback(async () => {
    await clearAllConversions()
    setEntries([])
  }, [])

  return { entries, loading, remove, clearAll, refresh: load }
}
