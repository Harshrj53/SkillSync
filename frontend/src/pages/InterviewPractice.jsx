import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Spinner from '../components/Spinner'
import {
  Mic, Send, ChevronRight, ChevronLeft,
  CheckCircle2, AlertCircle, RotateCcw, Award,
  Clock, ListChecks,
} from 'lucide-react'

/* ── helpers ─────────────────────────────────────────────── */
const categoryColors = {
  JavaScript:     'bg-yellow-50 text-yellow-700 border-yellow-100',
  React:          'bg-blue-50 text-blue-700 border-blue-100',
  'Node.js':      'bg-green-50 text-green-700 border-green-100',
  Database:       'bg-purple-50 text-purple-700 border-purple-100',
  'System Design':'bg-indigo-50 text-indigo-700 border-indigo-100',
  CSS:            'bg-pink-50 text-pink-700 border-pink-100',
  General:        'bg-slate-100 text-slate-600 border-slate-200',
}

const ScoreBar = ({ score, max }) => {
  const pct = max > 0 ? (score / max) * 100 : 0
  const color = pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-400'
  return (
    <div className="progress-bar">
      <div className={`progress-fill ${color}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

/* ── Results View ────────────────────────────────────────── */
const ResultsView = ({ result, onRetry }) => {
  const pct = result.maxPossible > 0
    ? Math.round((result.totalScore / result.maxPossible) * 100)
    : 0

  const grade =
    pct >= 80 ? { label: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' } :
    pct >= 60 ? { label: 'Good',      color: 'text-blue-600',    bg: 'bg-blue-50 border-blue-200'       } :
    pct >= 40 ? { label: 'Average',   color: 'text-amber-600',   bg: 'bg-amber-50 border-amber-200'     } :
    { label: 'Needs Work',            color: 'text-red-500',     bg: 'bg-red-50 border-red-200'         }

  return (
    <div className="animate-slide-up">

      {/* Score hero */}
      <div className={`card border ${grade.bg} text-center mb-6`}>
        <Award className={`w-10 h-10 mx-auto mb-3 ${grade.color}`} />
        <p className={`text-4xl font-bold ${grade.color}`}>{pct}%</p>
        <p className={`font-semibold mt-1 ${grade.color}`}>{grade.label}</p>
        <p className="text-sm text-slate-500 mt-1">
          {result.totalScore} / {result.maxPossible} points across {result.breakdown.length} questions
        </p>
        <button onClick={onRetry} className="btn-primary mx-auto mt-4">
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
      </div>

      {/* Breakdown */}
      <h2 className="section-title mb-4">Question Breakdown</h2>
      <div className="space-y-4">
        {result.breakdown.map((item, i) => {
          const itemPct = item.maxScore > 0 ? (item.score / item.maxScore) * 100 : 0
          return (
            <div key={item.questionId} className="card border border-slate-100">
              <div className="flex items-start justify-between gap-3 mb-3">
                <p className="text-sm font-medium text-slate-800 leading-snug">
                  <span className="text-slate-400 mr-1.5">Q{i + 1}.</span>
                  {item.questionText}
                </p>
                <span
                  className={`flex-shrink-0 text-sm font-bold px-2.5 py-0.5 rounded-full ${
                    itemPct >= 70 ? 'bg-emerald-50 text-emerald-700' :
                    itemPct >= 40 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'
                  }`}
                >
                  {item.score}/{item.maxScore}
                </span>
              </div>

              <ScoreBar score={item.score} max={item.maxScore} />

              <div className="mt-3 space-y-2">
                <div>
                  <p className="text-xs text-slate-400 font-medium mb-1">Your answer</p>
                  <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-2.5 leading-relaxed">
                    {item.userAnswer || <span className="italic text-slate-400">No answer given</span>}
                  </p>
                </div>
                {item.matchedKeywords.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-400 font-medium mb-1">Keywords matched</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.matchedKeywords.map((kw) => (
                        <span key={kw} className="badge badge-success">{kw}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Main Component ──────────────────────────────────────── */
const InterviewPractice = () => {
  const { user } = useAuth()
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get('/interview/questions')
        setQuestions(res.data.data.questions || [])
      } catch {
        setError('Failed to load questions.')
      } finally {
        setLoading(false)
      }
    }
    fetchQuestions()
  }, [])

  const handleAnswer = (val) => {
    setAnswers((prev) => ({ ...prev, [questions[current].id]: val }))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    try {
      const submissions = questions.map((q) => ({
        questionId: q.id,
        answer: answers[q.id] || '',
      }))
      const res = await api.post('/interview/submit', { submissions })
      setResult(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRetry = () => {
    setResult(null)
    setAnswers({})
    setCurrent(0)
    setStarted(false)
  }

  const answeredCount = Object.values(answers).filter(Boolean).length
  const totalQ = questions.length

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
      <div className="mb-6">
        <h1 className="page-title">Mock Interview</h1>
        <p className="page-subtitle">Answer questions and get instant keyword-based scores.</p>
      </div>

      {error && (
        <div className="alert-error mb-5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Results */}
      {result ? (
        <ResultsView result={result} onRetry={handleRetry} />
      ) : !started ? (
        /* ── Start screen ── */
        <div className="max-w-lg mx-auto text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center mx-auto mb-5">
            <Mic className="w-7 h-7 text-primary-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Ready to practice?</h2>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            You'll be asked <strong>{totalQ} questions</strong> covering JavaScript, React, Node.js,
            databases, system design, and more. Take your time with each answer.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { icon: ListChecks, label: `${totalQ} Questions`, sub: 'Mixed topics' },
              { icon: Clock,       label: 'No Time Limit',      sub: 'Go at your pace' },
              { icon: Award,       label: 'Instant Score',      sub: 'Keyword matching' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="card border border-slate-100 text-center py-4">
                <Icon className="w-5 h-5 mx-auto mb-1.5 text-slate-500" />
                <p className="text-xs font-semibold text-slate-700">{label}</p>
                <p className="text-xs text-slate-400">{sub}</p>
              </div>
            ))}
          </div>

          <button onClick={() => setStarted(true)} className="btn-primary btn-lg mx-auto">
            <Mic className="w-4 h-4" />
            Start Interview
          </button>
        </div>
      ) : (
        /* ── Question flow ── */
        <div className="max-w-2xl mx-auto">

          {/* Progress header */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">
              Question {current + 1} of {totalQ}
            </span>
            <span className="text-sm text-slate-400">
              {answeredCount} answered
            </span>
          </div>
          <div className="progress-bar mb-6">
            <div
              className="progress-fill bg-primary-500"
              style={{ width: `${((current + 1) / totalQ) * 100}%` }}
            />
          </div>

          {/* Question card */}
          <div className="card border border-slate-200 mb-4 animate-fade-in" key={questions[current]?.id}>
            <div className="flex items-center gap-2 mb-4">
              <span className={`badge border ${categoryColors[questions[current]?.category] || categoryColors.General}`}>
                {questions[current]?.category}
              </span>
              <span className="text-xs text-slate-400">{questions[current]?.maxScore} pts</span>
            </div>

            <p className="text-base font-medium text-slate-800 leading-relaxed mb-5">
              {questions[current]?.text}
            </p>

            <label htmlFor="answer" className="label">Your Answer</label>
            <textarea
              id="answer"
              rows={5}
              value={answers[questions[current]?.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Type your answer here. Include key concepts and terminology you know..."
              className="textarea"
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setCurrent((v) => Math.max(0, v - 1))}
              disabled={current === 0}
              className="btn-secondary"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex gap-1.5 flex-wrap justify-center">
              {questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setCurrent(i)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                    i === current
                      ? 'bg-primary-600 text-white'
                      : answers[q.id]
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {current < totalQ - 1 ? (
              <button
                onClick={() => setCurrent((v) => Math.min(totalQ - 1, v + 1))}
                className="btn-secondary"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? <Spinner size="sm" /> : <Send className="w-4 h-4" />}
                {submitting ? 'Scoring…' : 'Submit'}
              </button>
            )}
          </div>

          {answeredCount > 0 && current === totalQ - 1 && !submitting && (
            <p className="text-center text-xs text-slate-400 mt-4">
              {totalQ - answeredCount > 0
                ? `${totalQ - answeredCount} question(s) unanswered — you can still submit.`
                : 'All questions answered! Ready to submit.'}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default InterviewPractice
