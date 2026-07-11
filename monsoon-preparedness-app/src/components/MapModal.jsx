import { useEffect, useState } from 'react'
import { X, AlertCircle, Plus, RefreshCcw } from 'lucide-react'
import { api } from '../lib/api'

export default function MapModal({ onClose, userProfile }) {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [newAlert, setNewAlert] = useState({ type: 'flood', title: '', description: '' })

  const location = userProfile.location

  useEffect(() => {
    let cancelled = false
    async function loadAlerts() {
      try {
        const data = await api.listAlerts(location, 10)
        if (!cancelled) setAlerts(data.alerts || [])
      } catch (err) {
        if (!cancelled) setError(err.message || 'Could not load alerts')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadAlerts()
    return () => {
      cancelled = true
    }
  }, [location])

  const alertColors = {
    flood: { bg: 'bg-red-950', text: 'text-red-300', border: 'border-red-700', label: 'Flood' },
    blocked_road: { bg: 'bg-yellow-950', text: 'text-yellow-300', border: 'border-yellow-700', label: 'Road Blocked' },
    shelter: { bg: 'bg-green-950', text: 'text-green-300', border: 'border-green-700', label: 'Shelter' },
    other: { bg: 'bg-bg-tertiary', text: 'text-text-secondary', border: 'border-border-default', label: 'Update' },
  }

  const handleAddAlert = async () => {
    if (!newAlert.title.trim() || !newAlert.description.trim()) return
    try {
      const created = await api.createAlert({
        user_id: userProfile.user_id,
        alert_type: newAlert.type,
        title: newAlert.title,
        description: newAlert.description,
        location: { lat: location.lat, lng: location.lng },
      })
      setAlerts(prev => [created, ...prev])
      setNewAlert({ type: 'flood', title: '', description: '' })
      setShowForm(false)
      setError('')
    } catch (err) {
      setError(err.message || 'Could not submit alert')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end md:items-center justify-center animate-fadeIn">
      <div className="bg-bg-secondary w-full md:w-[440px] max-h-screen md:max-h-[640px] rounded-t-2xl md:rounded-2xl border border-border-default flex flex-col">
        <div className="px-6 py-4 border-b border-border-default flex items-center justify-between sticky top-0 bg-bg-secondary rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold">Community Map</h2>
            <p className="text-xs text-text-muted">{location.label} - {alerts.length} active alerts</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-lg transition" aria-label="Close map">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mx-6 my-4 border border-border-default bg-bg-tertiary h-36 rounded-lg flex items-center justify-center">
          <div className="text-center px-6">
            <AlertCircle className="w-8 h-8 text-text-muted mx-auto mb-2 opacity-60" />
            <p className="text-xs text-text-muted">Nearby alerts from backend</p>
            <p className="text-xs text-text-muted">{location.lat.toFixed(3)}, {location.lng.toFixed(3)}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <RefreshCcw className="w-4 h-4 animate-spin" />
              Loading nearby alerts...
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-700 bg-red-950 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}

          {!loading && alerts.length === 0 && (
            <div className="rounded-lg border border-border-default bg-bg-tertiary px-4 py-6 text-center text-sm text-text-secondary">
              No community alerts nearby yet.
            </div>
          )}

          {alerts.map(alert => {
            const colors = alertColors[alert.type] || alertColors.other
            return (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-2 ${colors.bg} ${colors.border}`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <p className={`font-semibold text-sm ${colors.text}`}>{alert.title}</p>
                    <p className="text-xs text-text-muted mt-1">{alert.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${colors.text}`}>
                    {colors.label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-text-muted">{alert.distance_km ?? 0} km away</p>
                  <p className="text-xs text-text-muted">{Math.round((alert.confidence || 0.7) * 100)}% confidence</p>
                </div>
              </div>
            )
          })}
        </div>

        {showForm && (
          <div className="px-6 py-4 border-t border-border-default bg-bg-tertiary">
            <p className="text-sm font-semibold mb-3">Report an Issue</p>
            <div className="space-y-3 mb-4">
              <select
                value={newAlert.type}
                onChange={(e) => setNewAlert(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-border-default text-sm outline-none focus:border-primary"
              >
                <option value="flood">Flood</option>
                <option value="blocked_road">Road Blocked</option>
                <option value="shelter">Shelter Open</option>
                <option value="other">Other</option>
              </select>
              <input
                type="text"
                placeholder="Brief title"
                value={newAlert.title}
                onChange={(e) => setNewAlert(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-border-default text-sm outline-none focus:border-primary"
              />
              <textarea
                placeholder="Description"
                value={newAlert.description}
                onChange={(e) => setNewAlert(prev => ({ ...prev, description: e.target.value }))}
                rows="2"
                className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-border-default text-sm outline-none focus:border-primary resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2 rounded-lg bg-bg-secondary border border-border-default text-sm font-medium hover:bg-border-default transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAlert}
                  className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-blue-600 transition"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="px-6 py-4 border-t border-border-default">
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-blue-600 text-white font-medium rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            {showForm ? 'Cancel' : 'Report Alert'}
          </button>
        </div>
      </div>
    </div>
  )
}
