import { CheckSquare, LogOut, Map, Menu, Smartphone } from 'lucide-react'
import { useState } from 'react'

export default function Sidebar({ onSelectAction, language, onLanguageChange, t, unreadAlerts, onLogout }) {
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    { id: 'checklist', label: t.checklist, icon: CheckSquare, color: 'text-green-400' },
    { id: 'map', label: t.map, icon: Map, color: 'text-red-400', badge: unreadAlerts },
    { id: 'id', label: t.id, icon: Smartphone, color: 'text-blue-400' },
  ]

  const handleAction = (action) => {
    onSelectAction(action)
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-primary text-white rounded-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-bg-secondary border-r border-border-default transform md:transform-none transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } z-40 flex flex-col pt-20 md:pt-0`}
      >
        {/* Header */}
        <div className="p-6 border-b border-border-default">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="font-bold text-text-primary">Monsoon Prep</h1>
              <p className="text-xs text-text-muted">Stay Safe</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
          <p className="text-xs uppercase text-text-muted font-semibold px-2 mb-4">Quick Actions</p>
          
          {actions.map(({ id, label, icon: Icon, color, badge }) => (
            <button
              key={id}
              onClick={() => handleAction(id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-bg-tertiary hover:bg-border-default transition group"
            >
              <Icon className={`w-5 h-5 ${color}`} />
              <span className="flex-1 text-left font-medium group-hover:text-primary transition">
                {label}
              </span>
              {badge > 0 && (
                <span className="px-2 py-1 text-xs font-bold bg-danger text-white rounded-full">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Language Toggle */}
        <div className="px-4 py-6 border-t border-border-default">
          <p className="text-xs uppercase text-text-muted font-semibold mb-3">Language</p>
          <div className="flex gap-2">
            {['en', 'hi', 'ta'].map((lang) => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
                  language === lang
                    ? 'bg-primary text-white'
                    : 'bg-bg-tertiary text-text-secondary hover:bg-border-default'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-border-default">
          <button
            type="button"
            onClick={onLogout}
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg bg-bg-tertiary px-3 py-2 text-sm text-text-secondary hover:bg-border-default hover:text-text-primary"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
          <p className="text-xs text-text-muted">Version 1.0</p>
          <p className="text-xs text-text-muted mt-2">Backend integrated</p>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
