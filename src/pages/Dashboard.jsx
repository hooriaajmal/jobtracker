import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useJobs, STATUS_OPTIONS } from '../context/JobContext'

function StatusBadge({ status }) {
  const color = {
    Applied: 'bg-blue-100 text-blue-800',
    Interviewing: 'bg-amber-100 text-amber-800',
    Offer: 'bg-green-100 text-green-800',
    Rejected: 'bg-rose-100 text-rose-800',
  }[status] || 'bg-gray-100 text-gray-800'
  return <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>{status}</span>
}

export default function Dashboard() {
  const { applications, replaceAll } = useJobs()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const [sort, setSort] = useState('date_desc')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let items = applications.filter((a) => {
      const matchesQuery = !q || a.company.toLowerCase().includes(q) || a.title.toLowerCase().includes(q)
      const matchesStatus = status === 'All' || a.status === status
      return matchesQuery && matchesStatus
    })
    switch (sort) {
      case 'date_asc':
        items.sort((a, b) => new Date(a.date) - new Date(b.date))
        break
      case 'company_asc':
        items.sort((a, b) => a.company.localeCompare(b.company))
        break
      case 'company_desc':
        items.sort((a, b) => b.company.localeCompare(a.company))
        break
      case 'status_asc':
        items.sort((a, b) => a.status.localeCompare(b.status))
        break
      case 'status_desc':
        items.sort((a, b) => b.status.localeCompare(a.status))
        break
      default:
        items.sort((a, b) => new Date(b.date) - new Date(a.date))
    }
    return items
  }, [applications, query, status, sort])

  function handleExport() {
    const blob = new Blob([JSON.stringify(applications, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'jobtracker-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(ev) {
    const file = ev.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        if (Array.isArray(data)) {
          // Basic shape validation
          const cleaned = data
            .filter((d) => d && d.company && d.title && d.status && d.date)
            .map((d) => ({
              id: d.id || crypto.randomUUID(),
              company: String(d.company),
              title: String(d.title),
              status: STATUS_OPTIONS.includes(d.status) ? d.status : 'Applied',
              date: d.date,
              notes: d.notes ? String(d.notes) : '',
            }))
          replaceAll(cleaned)
        }
      } catch {}
    }
    reader.readAsText(file)
    ev.target.value = ''
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-end sm:justify-between">
        <div className="space-y-2 w-full sm:w-auto">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-600">Track and manage your job applications</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="px-3 py-2 text-sm rounded border hover:bg-gray-50">Export JSON</button>
          <label className="px-3 py-2 text-sm rounded border cursor-pointer hover:bg-gray-50">
            Import JSON
            <input type="file" accept="application/json" className="hidden" onChange={handleImport} />
          </label>
          <Link to="/add" className="px-3 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700">Add Job</Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <input aria-label="Search by company or title" placeholder="Search company or title" value={query} onChange={(e) => setQuery(e.target.value)} className="border rounded px-3 py-2 w-full" />
        <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded px-3 py-2 w-full">
          <option>All</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value)} className="border rounded px-3 py-2 w-full">
          <option value="date_desc">Newest</option>
          <option value="date_asc">Oldest</option>
          <option value="company_asc">Company A–Z</option>
          <option value="company_desc">Company Z–A</option>
          <option value="status_asc">Status A–Z</option>
          <option value="status_desc">Status Z–A</option>
        </select>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="text-left p-3">Company</th>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-t hover:bg-gray-50">
                <td className="p-3"><Link to={`/job/${a.id}`} className="hover:underline font-medium">{a.company}</Link></td>
                <td className="p-3">{a.title}</td>
                <td className="p-3"><StatusBadge status={a.status} /></td>
                <td className="p-3">{new Date(a.date).toLocaleDateString()}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">No results</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden grid gap-3">
        {filtered.map((a) => (
          <Link to={`/job/${a.id}`} key={a.id} className="border rounded p-3 bg-white">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium">{a.company}</div>
                <div className="text-sm text-gray-600">{a.title}</div>
              </div>
              <StatusBadge status={a.status} />
            </div>
            <div className="text-xs text-gray-500 mt-2">{new Date(a.date).toLocaleDateString()}</div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-gray-500">No results</div>
        )}
      </div>

      <Link to="/add" className="fixed md:hidden right-4 bottom-4 rounded-full w-14 h-14 bg-blue-600 text-white flex items-center justify-center shadow-lg text-2xl" aria-label="Add Job">+</Link>
    </div>
  )
}



