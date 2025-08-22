import { Link, useNavigate, useParams } from 'react-router-dom'
import { useJobs } from '../context/JobContext'

function StatusBadge({ status }) {
  const color = {
    Applied: 'bg-blue-100 text-blue-800',
    Interviewing: 'bg-amber-100 text-amber-800',
    Offer: 'bg-green-100 text-green-800',
    Rejected: 'bg-rose-100 text-rose-800',
  }[status] || 'bg-gray-100 text-gray-800'
  return <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>{status}</span>
}

export default function JobDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { applications, removeApplication } = useJobs()
  const job = applications.find((a) => a.id === id)

  if (!job) {
    return (
      <div className="space-y-3">
        <p>Job not found.</p>
        <Link to="/" className="text-blue-600 hover:underline">Back to Dashboard</Link>
      </div>
    )
  }

  function onDelete() {
    if (confirm('Delete this job? This cannot be undone.')) {
      removeApplication(job.id)
      navigate('/')
    }
  }

  return (
    <div className="space-y-4">
      <button onClick={() => navigate(-1)} className="text-sm text-blue-600 hover:underline">← Back</button>
      <div className="border rounded p-4 bg-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{job.company}</h1>
            <p className="text-gray-700">{job.title}</p>
          </div>
          <StatusBadge status={job.status} />
        </div>
        <div className="text-sm text-gray-600 mt-2">Applied on {new Date(job.date).toLocaleDateString()}</div>
        {job.notes && (
          <div className="mt-4 whitespace-pre-wrap">{job.notes}</div>
        )}
      </div>
      <div className="flex gap-3">
        <Link to={`/edit/${job.id}`} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Edit</Link>
        <button onClick={onDelete} className="px-4 py-2 rounded border hover:bg-gray-50">Delete</button>
      </div>
    </div>
  )
}



