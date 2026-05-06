import { openDB } from 'idb'

const DB_NAME = 'scriptsense'
const DB_VERSION = 1
const STORE = 'conversions'

let _db = null

function getDB() {
  if (!_db) {
    _db = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true })
        store.createIndex('timestamp', 'timestamp')
        store.createIndex('outputFormat', 'outputFormat')
        store.createIndex('docStructure', 'docStructure')
      },
    })
  }
  return _db
}

export async function saveConversion(data) {
  const db = await getDB()
  const id = await db.add(STORE, { ...data, timestamp: Date.now() })
  return id
}

export async function getAllConversions() {
  const db = await getDB()
  const all = await db.getAll(STORE)
  return all.sort((a, b) => b.timestamp - a.timestamp)
}

export async function deleteConversion(id) {
  const db = await getDB()
  return db.delete(STORE, id)
}

export async function clearAllConversions() {
  const db = await getDB()
  return db.clear(STORE)
}
