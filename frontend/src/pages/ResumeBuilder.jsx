import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Spinner from '../components/Spinner'
import {
  Plus, Pencil, Trash2, Sparkles, ChevronDown,
  ChevronUp, AlertCircle, CheckCircle2, FileText, X,
} from 'lucide-react'

const emptyForm = {
  title: '',
  summary: '',
  education: '',
  experience: '',
  skills: '',
}

const FeedbackPanel = ({ feedback, fallback, message, onClose }) => {
  if (fallback) {
    return (
      <div className="alert-info flex items-start gap-3 mt-4">
        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium text-sm">AI Feedback Unavailable</p>
          <p className="text-xs mt-0.5 text-primary-600">{message}</p>
        </div>
        <button onClick={onClose} className="ml-auto text-primary-400 hover:text-primary-600">
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }
  if (!feedback) return null

  const scoreColor =
    feedback.overallScore >= 7 ? 'text-emerald-600 bg-emerald-50' :
    feedback.overallScore >= 4 ? 'text-amber-600 bg-amber-50' :
    'text-red-600 bg-red-50'

  return (
    <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden animate-slide-up">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary-600" />
          <span className="text-sm font-semibold text-slate-700">AI Resume Feedback</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-bold px-2.5 py-0.5 rounded-full ${scoreColor}`}>
            {feedback.overallScore}/10
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-4 space-y-4 bg-white">
        <p className="text-sm text-slate-600 leading-relaxed">{feedback.summary}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {feedback.strengths?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">Strengths</p>
              <ul className="space-y-1.5">
                {feedback.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {feedback.improvements?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">Improvements</p>
              <ul className="space-y-1.5">
                {feedback.improvements.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {feedback.missingKeywords?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Missing Keywords</p>
            <div className="flex flex-wrap gap-1.5">
              {feedback.missingKeywords.map((kw, i) => (
                <span key={i} className="badge badge-primary">{kw}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const ResumeCard = ({ resume, onEdit, onDelete, onFeedback }) => {
  const [expanded, setExpanded] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [fbLoading, setFbLoading] = useState(false)
  const [fbError, setFbError] = useState('')

  const handleFeedback = async () => {
    setFbLoading(true)
    setFbError('')
    setFeedback(null)
    try {
      const res = await api.post(`/resume/${resume.id}/feedback`)
      setFeedback(res.data.data)
      setExpanded(true)
    } catch {
      setFbError('Failed to get AI feedback. Try again.')
    } finally {
      setFbLoading(false)
    }
  }

  return (
    <div className="card border border-slate-200 hover:border-slate-300 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-primary-600" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-800 truncate">{resume.title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Created {new Date(resume.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={handleFeedback}
            disabled={fbLoading}
            className="btn btn-sm border border-primary-200 text-primary-600 hover:bg-primary-50 gap-1.5 disabled:opacity-60"
          >
            {fbLoading ? <Spinner size="sm" /> : <Sparkles className="w-3.5 h-3.5" />}
            AI Feedback
          </button>
          <button onClick={() => onEdit(resume)} className="btn-ghost btn-sm p-2">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(resume.id)} className="btn-ghost btn-sm p-2 text-slate-400 hover:text-red-500">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setExpanded(v => !v)} className="btn-ghost btn-sm p-2">
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {fbError && (
        <div className="alert-error text-xs mt-3">{fbError}</div>
      )}

      {feedback && (
        <FeedbackPanel
          {...feedback}
          onClose={() => setFeedback(null)}
        />
      )}

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 animate-fade-in">
          {[
            { label: 'Summary',    val: resume.summary },
            { label: 'Education',  val: resume.education },
            { label: 'Experience', val: resume.experience },
            { label: 'Skills',     val: resume.skills },
          ].map(({ label, val }) =>
            val ? (
              <div key={label}>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{label}</p>
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{val}</p>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  )
}

const ResumeBuilder = () => {
  const { user } = useAuth()
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchResumes = async () => {
    try {
      const res = await api.get(`/resume/${user.id}`)
      setResumes(res.data.data.resumes || [])
    } catch {
      setError('Failed to load resumes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchResumes()
  }, [user])

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleOpenNew = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
    setError('')
    setSuccess('')
  }

  const handleEdit = (resume) => {
    setForm({
      title: resume.title || '',
      summary: resume.summary || '',
      education: resume.education || '',
      experience: resume.experience || '',
      skills: resume.skills || '',
    })
    setEditingId(resume.id)
    setShowForm(true)
    setError('')
    setSuccess('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resume? This cannot be undone.')) return
    try {
      await api.delete(`/resume/${id}`)
      setResumes((prev) => prev.filter((r) => r.id !== id))
      setSuccess('Resume deleted.')
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Failed to delete resume.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Resume title is required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      if (editingId) {
        const res = await api.put(`/resume/${editingId}`, form)
        setResumes((prev) =>
          prev.map((r) => (r.id === editingId ? res.data.data.resume : r))
        )
        setSuccess('Resume updated successfully.')
      } else {
        const res = await api.post('/resume', form)
        setResumes((prev) => [res.data.data.resume, ...prev])
        setSuccess('Resume created successfully.')
      }
      setShowForm(false)
      setEditingId(null)
      setForm(emptyForm)
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save resume.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-container animate-fade-in">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="page-title">Resume Builder</h1>
          <p className="page-subtitle">Create and manage your resumes with AI-powered feedback.</p>
        </div>
        <button onClick={handleOpenNew} className="btn-primary flex-shrink-0">
          <Plus className="w-4 h-4" />
          New Resume
        </button>
      </div>

      {/* Alerts */}
      {success && (
        <div className="alert-success mb-5 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          {success}
        </div>
      )}
      {error && !showForm && (
        <div className="alert-error mb-5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="card border border-primary-100 mb-6 animate-slide-up">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">
              {editingId ? 'Edit Resume' : 'Create New Resume'}
            </h2>
            <button onClick={() => { setShowForm(false); setEditingId(null) }} className="btn-ghost btn-sm p-2">
              <X className="w-4 h-4" />
            </button>
          </div>

          {error && (
            <div className="alert-error mb-4 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="label">Resume Title <span className="text-red-400">*</span></label>
              <input
                id="title" name="title" type="text"
                value={form.title} onChange={handleChange}
                placeholder="e.g. Software Engineer – Full Stack"
                className="input"
              />
            </div>

            <div>
              <label htmlFor="summary" className="label">Professional Summary</label>
              <textarea
                id="summary" name="summary" rows={3}
                value={form.summary} onChange={handleChange}
                placeholder="Brief overview of your experience and goals..."
                className="textarea"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="education" className="label">Education</label>
                <textarea
                  id="education" name="education" rows={4}
                  value={form.education} onChange={handleChange}
                  placeholder="B.Tech Computer Science, XYZ University, 2024"
                  className="textarea"
                />
              </div>
              <div>
                <label htmlFor="experience" className="label">Work Experience</label>
                <textarea
                  id="experience" name="experience" rows={4}
                  value={form.experience} onChange={handleChange}
                  placeholder="Software Intern at ABC Corp (Jun–Aug 2023)..."
                  className="textarea"
                />
              </div>
            </div>

            <div>
              <label htmlFor="skills" className="label">Skills</label>
              <textarea
                id="skills" name="skills" rows={2}
                value={form.skills} onChange={handleChange}
                placeholder="JavaScript, React, Node.js, PostgreSQL, Git..."
                className="textarea"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? <Spinner size="sm" /> : null}
                {saving ? 'Saving…' : editingId ? 'Update Resume' : 'Create Resume'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingId(null) }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Resume list */}
      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : resumes.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <FileText className="w-12 h-12 mb-3 opacity-30" />
          <p className="font-medium text-slate-600 mb-1">No resumes yet</p>
          <p className="text-sm mb-4">Create your first resume to get started.</p>
          <button onClick={handleOpenNew} className="btn-primary">
            <Plus className="w-4 h-4" /> Create Resume
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {resumes.map((r) => (
            <ResumeCard
              key={r.id}
              resume={r}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ResumeBuilder
