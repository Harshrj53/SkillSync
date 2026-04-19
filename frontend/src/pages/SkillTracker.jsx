import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Spinner from '../components/Spinner'
import {
  Plus, Pencil, Trash2, Save, X,
  AlertCircle, CheckCircle2, BarChart2, Target,
} from 'lucide-react'

const SKILL_SUGGESTIONS = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
  'Express.js', 'Python', 'Django', 'PostgreSQL', 'MongoDB',
  'GraphQL', 'REST APIs', 'Docker', 'Git', 'AWS', 'System Design',
  'Data Structures', 'Algorithms', 'CSS', 'Tailwind CSS',
]

const progressColor = (p) =>
  p >= 80 ? 'bg-emerald-500' :
  p >= 50 ? 'bg-blue-500' :
  p >= 25 ? 'bg-amber-500' : 'bg-red-400'

const progressLabel = (p) =>
  p >= 80 ? 'Expert' :
  p >= 60 ? 'Advanced' :
  p >= 40 ? 'Intermediate' :
  p >= 20 ? 'Beginner' : 'Just started'

const SkillCard = ({ skill, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({ skillName: skill.skill_name, progress: skill.progress })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await onUpdate(skill.id, draft)
    setSaving(false)
    setEditing(false)
  }

  const handleCancel = () => {
    setDraft({ skillName: skill.skill_name, progress: skill.progress })
    setEditing(false)
  }

  return (
    <div className="card border border-slate-100 hover:border-slate-200 transition-all duration-200 group">
      {editing ? (
        /* ── Edit mode ── */
        <div className="space-y-3">
          <div>
            <label className="label text-xs">Skill Name</label>
            <input
              type="text"
              value={draft.skillName}
              onChange={(e) => setDraft((p) => ({ ...p, skillName: e.target.value }))}
              className="input"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="label text-xs mb-0">Progress</label>
              <span className="text-sm font-semibold text-slate-700">{draft.progress}%</span>
            </div>
            <input
              type="range"
              min={0} max={100} step={5}
              value={draft.progress}
              onChange={(e) => setDraft((p) => ({ ...p, progress: Number(e.target.value) }))}
              className="w-full h-2 rounded-full appearance-none bg-slate-200 accent-primary-600 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>0%</span><span>50%</span><span>100%</span>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={handleSave} disabled={saving} className="btn-primary btn-sm">
              {saving ? <Spinner size="sm" /> : <Save className="w-3.5 h-3.5" />}
              Save
            </button>
            <button onClick={handleCancel} className="btn-secondary btn-sm">
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* ── View mode ── */
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${progressColor(skill.progress)}`} />
              <span className="font-semibold text-slate-800 truncate">{skill.skill_name}</span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button
                onClick={() => setEditing(true)}
                className="btn-ghost btn-sm p-1.5"
              >
                <Pencil className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700" />
              </button>
              <button
                onClick={() => onDelete(skill.id)}
                className="btn-ghost btn-sm p-1.5"
              >
                <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-500" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 progress-bar">
              <div
                className={`progress-fill ${progressColor(skill.progress)}`}
                style={{ width: `${skill.progress}%` }}
              />
            </div>
            <span className="text-sm font-bold text-slate-700 w-9 text-right">
              {skill.progress}%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5">{progressLabel(skill.progress)}</p>
        </div>
      )}
    </div>
  )
}

const SkillTracker = () => {
  const { user } = useAuth()
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ skillName: '', progress: 0 })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [filter, setFilter] = useState('all')

  const fetchSkills = async () => {
    try {
      const res = await api.get(`/skills/${user.id}`)
      setSkills(res.data.data.skills || [])
    } catch {
      setError('Failed to load skills.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (user) fetchSkills() }, [user])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.skillName.trim()) {
      setError('Skill name is required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const res = await api.post('/skills', {
        skillName: form.skillName.trim(),
        progress: form.progress,
      })
      setSkills((prev) => [...prev, res.data.data.skill].sort((a, b) =>
        a.skill_name.localeCompare(b.skill_name)
      ))
      setForm({ skillName: '', progress: 0 })
      setShowForm(false)
      setSuccess('Skill added!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add skill.')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (id, data) => {
    try {
      const res = await api.put(`/skills/${id}`, {
        skillName: data.skillName,
        progress: data.progress,
      })
      setSkills((prev) =>
        prev.map((s) => (s.id === id ? res.data.data.skill : s))
          .sort((a, b) => a.skill_name.localeCompare(b.skill_name))
      )
      setSuccess('Skill updated!')
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Failed to update skill.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this skill?')) return
    try {
      await api.delete(`/skills/${id}`)
      setSkills((prev) => prev.filter((s) => s.id !== id))
      setSuccess('Skill removed.')
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Failed to delete skill.')
    }
  }

  const filteredSkills = skills.filter((s) => {
    if (filter === 'expert')       return s.progress >= 80
    if (filter === 'advanced')     return s.progress >= 60 && s.progress < 80
    if (filter === 'intermediate') return s.progress >= 40 && s.progress < 60
    if (filter === 'beginner')     return s.progress < 40
    return true
  })

  const avgProgress = skills.length > 0
    ? Math.round(skills.reduce((acc, s) => acc + s.progress, 0) / skills.length)
    : 0

  return (
    <div className="page-container animate-fade-in">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="page-title">Skill Tracker</h1>
          <p className="page-subtitle">Monitor your proficiency across all technologies.</p>
        </div>
        <button onClick={() => { setShowForm(v => !v); setError('') }} className="btn-primary flex-shrink-0">
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </div>

      {/* Feedback */}
      {success && (
        <div className="alert-success mb-4 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          {success}
        </div>
      )}
      {error && !showForm && (
        <div className="alert-error mb-4">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Summary strip */}
      {skills.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Skills',  value: skills.length,                               icon: BarChart2 },
            { label: 'Avg Progress',  value: `${avgProgress}%`,                           icon: Target    },
            { label: 'Expert (≥80%)', value: skills.filter(s => s.progress >= 80).length, icon: CheckCircle2 },
            { label: 'In Progress',   value: skills.filter(s => s.progress < 80).length,  icon: BarChart2 },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="card border border-slate-100 text-center py-4">
              <p className="text-xl font-bold text-slate-800">{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div className="card border border-primary-100 mb-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Add New Skill</h2>
            <button onClick={() => setShowForm(false)} className="btn-ghost btn-sm p-2">
              <X className="w-4 h-4" />
            </button>
          </div>

          {error && (
            <div className="alert-error mb-4 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label htmlFor="skillName" className="label">Skill Name</label>
              <input
                id="skillName"
                type="text"
                value={form.skillName}
                onChange={(e) => { setForm(p => ({ ...p, skillName: e.target.value })); setError('') }}
                placeholder="e.g. React, PostgreSQL, Docker…"
                className="input"
                list="skill-suggestions"
                autoComplete="off"
              />
              <datalist id="skill-suggestions">
                {SKILL_SUGGESTIONS.map(s => <option key={s} value={s} />)}
              </datalist>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="label mb-0">Initial Progress</label>
                <span className="text-sm font-semibold text-slate-700">{form.progress}%</span>
              </div>
              <input
                type="range"
                min={0} max={100} step={5}
                value={form.progress}
                onChange={(e) => setForm(p => ({ ...p, progress: Number(e.target.value) }))}
                className="w-full h-2 rounded-full appearance-none bg-slate-200 accent-primary-600 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Beginner</span><span>Intermediate</span><span>Expert</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? <Spinner size="sm" /> : <Plus className="w-4 h-4" />}
                {saving ? 'Adding…' : 'Add Skill'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter tabs */}
      {skills.length > 0 && (
        <div className="flex gap-2 mb-5 flex-wrap">
          {['all', 'expert', 'advanced', 'intermediate', 'beginner'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn-sm px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                filter === f
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {f === 'all' ? `All (${skills.length})` : f}
            </button>
          ))}
        </div>
      )}

      {/* Skills grid */}
      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : skills.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <BarChart2 className="w-12 h-12 mb-3 opacity-30" />
          <p className="font-medium text-slate-600 mb-1">No skills tracked yet</p>
          <p className="text-sm mb-4">Add your first skill to start tracking your progress.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus className="w-4 h-4" /> Add Skill
          </button>
        </div>
      ) : filteredSkills.length === 0 ? (
        <p className="text-center text-slate-400 py-12 text-sm">
          No skills in this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default SkillTracker
