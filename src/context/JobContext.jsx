import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'

const STORAGE_KEY = 'jobtracker:applications'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

function saveToStorage(applications) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
  } catch {}
}

const JobContext = createContext(null)

function generateId() {
  return crypto.randomUUID()
}

const initialState = {
  applications: loadFromStorage(),
}

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const newItem = { ...action.payload, id: generateId() }
      const updated = [newItem, ...state.applications]
      return { applications: updated }
    }
    case 'update': {
      const { id, updates } = action.payload
      const updated = state.applications.map((a) => (a.id === id ? { ...a, ...updates } : a))
      return { applications: updated }
    }
    case 'remove': {
      const { id } = action.payload
      const updated = state.applications.filter((a) => a.id !== id)
      return { applications: updated }
    }
    case 'replace_all': {
      return { applications: action.payload }
    }
    default:
      return state
  }
}

export function JobProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    saveToStorage(state.applications)
  }, [state.applications])

  const api = useMemo(() => ({
    applications: state.applications,
    addApplication: (app) => dispatch({ type: 'add', payload: app }),
    updateApplication: (id, updates) => dispatch({ type: 'update', payload: { id, updates } }),
    removeApplication: (id) => dispatch({ type: 'remove', payload: { id } }),
    replaceAll: (apps) => dispatch({ type: 'replace_all', payload: apps }),
  }), [state.applications])

  return <JobContext.Provider value={api}>{children}</JobContext.Provider>
}

export function useJobs() {
  const ctx = useContext(JobContext)
  if (!ctx) throw new Error('useJobs must be used within JobProvider')
  return ctx
}

export const STATUS_OPTIONS = ['Applied', 'Interviewing', 'Offer', 'Rejected']


