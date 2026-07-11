import { useEffect, useMemo, useState } from 'react'
import { X, Pin, PinOff, RefreshCcw } from 'lucide-react'
import { api } from '../lib/api'

export default function ChecklistModal({ onClose, userProfile, t }) {
  const [checklist, setChecklist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function loadChecklist() {
      try {
        const data = await api.getChecklist(userProfile.user_id)
        if (!cancelled) setChecklist(data)
      } catch (err) {
        if (!cancelled) setError(err.message || 'Could not load checklist')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadChecklist()
    return () => {
      cancelled = true
    }
  }, [userProfile.user_id])

  const flatItems = useMemo(() => checklist?.sections?.flatMap(section =>
    section.items.map(item => ({ ...item, section: section.section }))
  ) || [], [checklist])

  const completed = flatItems.filter(item => item.done).length
  const criticalItems = flatItems.filter(item => item.critical)
  const regularItems = flatItems.filter(item => !item.critical)

  const handleToggle = async (item) => {
    const nextDone = !item.done
    setChecklist(prev => ({
      ...prev,
      sections: prev.sections.map(section => ({
        ...section,
        items: section.items.map(current => current.id === item.id ? { ...current, done: nextDone } : current),
      })),
    }))
    try {
      const updated = await api.patchChecklist(userProfile.user_id, item.id, { done: nextDone })
      setChecklist(updated)
    } catch (err) {
      setError(err.message || 'Could not update item')
    }
  }

  const totalCost = flatItems.reduce((acc, item) => {
    const match = item.cost_est?.match(/(\d+)/)
    return match ? acc + Number(match[1]) : acc
  }, 0)

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end md:items-center justify-center animate-fadeIn">
      <div className="bg-bg-secondary w-full md:w-[440px] max-h-screen md:max-h-[640px] rounded-t-2xl md:rounded-2xl border border-border-default flex flex-col">
        <div className="px-6 py-4 border-b border-border-default flex items-center justify-between sticky top-0 bg-bg-secondary rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold">{t.monsoonChecklist}</h2>
            <p className="text-xs text-text-muted">{completed}/{flatItems.length || 0} {t.completed}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-lg transition" aria-label="Close checklist">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-3 border-b border-border-default">
          <div className="flex justify-between text-xs text-text-muted mb-2">
            <span>{t.progress}</span>
            <span>{checklist?.completion_pct || 0}%</span>
          </div>
          <div className="w-full h-2 bg-border-default rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-blue-600 transition-all duration-300"
              style={{ width: `${checklist?.completion_pct || 0}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <RefreshCcw className="w-4 h-4 animate-spin" />
              {t.loadingChecklist}
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && criticalItems.length > 0 && (
            <div className="mb-4">
              <p className="text-xs uppercase text-text-muted font-semibold mb-2">{t.criticalItems}</p>
              <div className="space-y-2">
                {criticalItems.map(item => (
                  <ChecklistItem key={item.id} item={item} onToggle={handleToggle} />
                ))}
              </div>
            </div>
          )}

          {!loading && regularItems.length > 0 && (
            <div>
              <p className="text-xs uppercase text-text-muted font-semibold mb-2">{t.otherItems}</p>
              <div className="space-y-2">
                {regularItems.map(item => (
                  <ChecklistItem key={item.id} item={item} onToggle={handleToggle} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border-default bg-bg-primary">
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">{t.estimatedCost}</span>
            <span className="text-lg font-bold text-primary">Rs {totalCost.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ChecklistItem({ item, onToggle }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-bg-tertiary hover:bg-border-default transition">
      <input
        type="checkbox"
        checked={item.done}
        onChange={() => onToggle(item)}
        className="w-5 h-5 mt-1 cursor-pointer accent-primary"
        aria-label={`Mark ${item.title} complete`}
      />
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${item.done ? 'line-through text-text-muted' : 'text-text-primary'}`}>
          {item.title}
        </p>
        <p className="text-xs text-text-muted">{item.cost_est} - {item.time_est}</p>
      </div>
      <div className="p-1.5 flex-shrink-0" title={item.critical ? 'Critical item' : 'Standard item'}>
        {item.critical ? (
          <Pin className="w-4 h-4 text-primary fill-primary" />
        ) : (
          <PinOff className="w-4 h-4 text-text-muted" />
        )}
      </div>
    </div>
  )
}