import { useState } from 'react'
import { Cloud, LogIn, UserPlus } from 'lucide-react'
import { api, storeAuth } from '../lib/api'

export default function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isSignup = mode === 'signup'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!email.trim() && !phone.trim()) {
      setError('Enter an email or phone number.')
      return
    }

    setLoading(true)
    try {
      const payload = {
        email: email.trim() || null,
        phone: phone.trim() || null,
        password,
      }
      const auth = isSignup ? await api.signup(payload) : await api.login(payload)
      storeAuth(auth)
      onAuthenticated(auth)
    } catch (err) {
      setError(err.message || 'Authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-tertiary flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md animate-slideUp">
        <div className="mb-6 text-center">
          <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sky-500 shadow-sm">
            <Cloud className="h-7 w-7 text-white" />
          </div>
          <h1 className="mb-1 text-2xl font-bold text-text-primary">Monsoon Prep</h1>
          <p className="text-sm text-text-secondary">Sign in to save your plans, alerts, and emergency IDs.</p>
        </div>

        <div className="mb-5 grid grid-cols-2 rounded-lg border border-border-default bg-bg-secondary p-1">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`min-h-0 rounded-md px-3 py-2 text-sm ${!isSignup ? 'bg-primary text-white' : 'text-text-secondary hover:bg-bg-tertiary'}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`min-h-0 rounded-md px-3 py-2 text-sm ${isSignup ? 'bg-primary text-white' : 'text-text-secondary hover:bg-bg-tertiary'}`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-border-light bg-bg-secondary p-5 shadow-sm">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-text-muted">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-border-default bg-white px-4 py-3 text-sm outline-none transition focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-text-muted">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+91 98765 43210"
              className="w-full rounded-lg border border-border-default bg-white px-4 py-3 text-sm outline-none transition focus:border-primary"
            />
            <p className="mt-1 text-xs text-text-muted">Use email or phone. Email is easiest for demo login.</p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-text-muted">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
              placeholder="At least 8 characters"
              className="w-full rounded-lg border border-border-default bg-white px-4 py-3 text-sm outline-none transition focus:border-primary"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-medium text-white transition hover:bg-blue-600 disabled:opacity-60"
          >
            {isSignup ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
            {loading ? 'Please wait...' : isSignup ? 'Create account' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}