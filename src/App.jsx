import './App.css'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { JobProvider } from './context/JobContext'
import Dashboard from './pages/Dashboard'
import AddEditJob from './pages/AddEditJob'
import JobDetails from './pages/JobDetails'

function Navbar() {
  return (
    <nav className="border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold">JobTracker</Link>
        <div className="flex gap-4">
          <Link to="/" className="text-sm font-medium hover:underline">Dashboard</Link>
          <Link to="/add" className="text-sm font-medium hover:underline">Add Job</Link>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <JobProvider>
        <div className="min-h-full bg-gray-50 text-gray-900">
          <Navbar />
          <main className="max-w-6xl mx-auto p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<AddEditJob mode="add" />} />
              <Route path="/edit/:id" element={<AddEditJob mode="edit" />} />
              <Route path="/job/:id" element={<JobDetails />} />
            </Routes>
          </main>
        </div>
      </JobProvider>
    </BrowserRouter>
  )
}

export default App
