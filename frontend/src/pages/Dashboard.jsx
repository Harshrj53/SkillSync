import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Spinner from '../components/Spinner'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadialBarChart, RadialBar, Legend,
} from 'recharts'
import {
  FileText, Mic, BarChart2, TrendingUp, Award,
  ArrowRight, BookOpen, Target, Zap,
} from 'lucide-react'

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="card flex items-center gap-4">
    <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm font-medium text-slate-600">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  </div>
)

const QuickLink = ({ to, icon: Icon, label, desc, color }) => (
  <Link
    to={to}
    className="card-hover flex items-center gap-4 group cursor-pointer"
  >
    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-slate-800 text-sm">{label}</p>
      <p className="text-xs text-slate-500 truncate">{desc}</p>
    </div>
    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
  </Link>
)

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [skills, setSkills] = useState([])
  const [sessions, setSessions] = useState([])
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const fetchAll = async () => {
      try {
        const [resumeRes, interviewRes, skillRes] = await Promise.all([
          api.get(`/resume/${user.id}`),
          api.get(`/interview/results/${user.id}`),
          api.get(`/skills/${user.id}`),
        ])
        setResumes(resumeRes.data.data.resumes || [])
        setSessions(interviewRes.data.data.sessions || [])
        setStats(interviewRes.data.data.stats || {})
        setSkills(skillRes.data.data.skills || [])
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [user])

  // Build chart data from last 6 interview sessions
  const chartData = [...sessions]
    .slice(0, 6)
    .reverse()
    .map((s, i) => ({
      name: `#${i + 1}`,
      score: s.total_questions > 0
        ? Math.round((s.score / s.total_questions) * 10)
        : 0,
      max: 10,
    }))

  // Radial chart for top 5 skills
  const radialData = skills.slice(0, 5).map((s) => ({
    name: s.skill_name,
    value: s.progress,
    fill: ['#6366f1', '#8b5cf6', '#d946ef', '#f59e0b', '#22c55e'][skills.indexOf(s) % 5],
  }))

  const avgPct = stats?.avg_percentage ?? 0
  const gradeColor =
    avgPct >= 80 ? 'text-success-600' :
    avgPct >= 50 ? 'text-warning-600' :
    'text-danger-500'

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="page-container animate-fade-in">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-5 h-5 text-primary-600" />
          <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">Dashboard</span>
        </div>
        <h1 className="page-title text-3xl">
          Hello, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="page-subtitle">Track your interview prep progress at a glance.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={FileText}
          label="Resumes Created"
          value={resumes.length}
          sub="Total saved resumes"
          color="bg-primary-600"
        />
        <StatCard
          icon={Mic}
          label="Mock Interviews"
          value={sessions.length}
          sub="Completed sessions"
          color="bg-violet-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg. Score"
          value={`${avgPct}%`}
          sub="Across all sessions"
          color="bg-amber-500"
        />
        <StatCard
          icon={BookOpen}
          label="Skills Tracked"
          value={skills.length}
          sub="Actively monitored"
          color="bg-emerald-500"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Score trend */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="section-title">Interview Score Trend</h2>
              <p className="text-xs text-slate-400 mt-0.5">Last {chartData.length} sessions (score / 10)</p>
            </div>
            {stats?.total_sessions > 0 && (
              <span className={`text-xl font-bold ${gradeColor}`}>{avgPct}%</span>
            )}
          </div>
          {chartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400">
              <Mic className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-sm">No interview sessions yet</p>
              <Link to="/interview" className="btn-primary btn-sm mt-3">Start Practicing</Link>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#scoreGrad)"
                  dot={{ fill: '#6366f1', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Skill radial */}
        <div className="card">
          <h2 className="section-title mb-4">Top Skills</h2>
          {radialData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400">
              <BarChart2 className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-sm">No skills added yet</p>
              <Link to="/skills" className="btn-primary btn-sm mt-3">Add Skills</Link>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart
                cx="50%" cy="50%"
                innerRadius="20%" outerRadius="90%"
                data={radialData}
              >
                <RadialBar minAngle={15} dataKey="value" background cornerRadius={6} />
                <Legend
                  iconSize={8}
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11 }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Quick links */}
        <div className="card">
          <h2 className="section-title mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <QuickLink to="/resume"    icon={FileText}  label="Build a Resume"    desc="Create or edit your resume"      color="bg-primary-500" />
            <QuickLink to="/interview" icon={Mic}       label="Mock Interview"    desc="Practice with real questions"    color="bg-violet-500"  />
            <QuickLink to="/skills"    icon={BarChart2} label="Track Skills"      desc="Update your skill progress"      color="bg-emerald-500" />
          </div>
        </div>

        {/* Recent sessions */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Recent Interview Sessions</h2>
            <Link to="/interview" className="text-xs text-primary-600 font-medium hover:text-primary-700">View all →</Link>
          </div>
          {sessions.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No sessions yet. Start your first mock interview!</p>
          ) : (
            <div className="space-y-3">
              {sessions.slice(0, 4).map((s) => {
                const pct = s.total_questions > 0
                  ? Math.round((s.score / s.total_questions) * 10 * 10)
                  : 0
                return (
                  <div key={s.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center">
                      <Award className={`w-5 h-5 ${pct >= 70 ? 'text-success-500' : pct >= 40 ? 'text-warning-500' : 'text-danger-500'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700">
                        {s.total_questions} Questions
                      </p>
                      <div className="progress-bar mt-1.5 w-full">
                        <div
                          className={`progress-fill ${pct >= 70 ? 'bg-success-500' : pct >= 40 ? 'bg-warning-500' : 'bg-danger-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${pct >= 70 ? 'text-success-600' : pct >= 40 ? 'text-warning-600' : 'text-danger-500'}`}>
                        {s.score}/{s.total_questions * 10}
                      </span>
                      <p className="text-xs text-slate-400">
                        {new Date(s.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
