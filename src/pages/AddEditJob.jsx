import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { STATUS_OPTIONS, useJobs } from '../context/JobContext'

export default function AddEditJob({ mode }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const { applications, addApplication, updateApplication } = useJobs()
  const editing = mode === 'edit'
  const existing = useMemo(() => applications.find((a) => a.id === id), [applications, id])

  const [company, setCompany] = useState('')
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('Applied')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editing) {
      if (!existing) return
      setCompany(existing.company)
      setTitle(existing.title)
      setStatus(existing.status)
      setDate(existing.date?.slice(0, 10))
      setNotes(existing.notes || '')
    }
  }, [editing, existing])

  function validate() {
    const e = {}
    if (!company.trim()) e.company = 'Company is required'
    if (!title.trim()) e.title = 'Job title is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function onSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return
    const payload = { company: company.trim(), title: title.trim(), status, date, notes }
    if (editing && existing) {
      updateApplication(existing.id, payload)
    } else {
      addApplication(payload)
    }
    navigate('/')
  }

  function onCancel() {
    navigate('/')
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-4">{editing ? 'Edit Job' : 'Add Job'}</h1>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="company">Company Name</label>
          <input id="company" value={company} onChange={(e) => setCompany(e.target.value)} className="border rounded px-3 py-2 w-full" required aria-invalid={!!errors.company} aria-describedby={errors.company ? 'company-error' : undefined} />
          {errors.company && <p id="company-error" className="text-sm text-rose-600 mt-1">{errors.company}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="title">Job Title</label>
          <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="border rounded px-3 py-2 w-full" required aria-invalid={!!errors.title} aria-describedby={errors.title ? 'title-error' : undefined} />
          {errors.title && <p id="title-error" className="text-sm text-rose-600 mt-1">{errors.title}</p>}
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="status">Status</label>
            <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded px-3 py-2 w-full">
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="date">Application Date</label>
            <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border rounded px-3 py-2 w-full" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="notes">Notes</label>
          <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="border rounded px-3 py-2 w-full min-h-28" />
        </div>
        <div className="flex gap-3">
          <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Save</button>
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded border hover:bg-gray-50">Cancel</button>
        </div>
      </form>
    </div>
  )
}



