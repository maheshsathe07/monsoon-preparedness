import { useState, useRef, useEffect } from 'react'
import { Send, Zap } from 'lucide-react'
import { api } from '../lib/api'

export default function ChatInterface({ userProfile, language, onOpenAction }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      type: 'ai',
      text: `Your profile is ready for ${userProfile.location.label}. Risk score: ${userProfile.risk_score}/100. ${userProfile.recommendation_summary}`,
      actions: [
        { label: 'Show checklist', endpoint: '/checklist', icon: 'list' },
        { label: 'View map alerts', endpoint: '/alerts', icon: 'map' },
      ],
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const suggestedQuestions = [
    'What should I do about flooding?',
    'Prepare for high winds',
    'Essential emergency supplies',
    'Tips for families with elders',
  ]

  const openAction = (action) => {
    const target = action.endpoint || action.action || ''
    if (target.includes('checklist')) onOpenAction?.('checklist')
    if (target.includes('map') || target.includes('alert')) onOpenAction?.('map')
    if (target.includes('emergency-id') || target.includes('id-card')) onOpenAction?.('id')
  }

  const handleSend = async (messageOverride) => {
    const message = (messageOverride || input).trim()
    if (!message || loading) return

    const newUserMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      text: message,
    }
    setMessages(prev => [...prev, newUserMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await api.sendChat({
        user_id: userProfile.user_id,
        message,
        context: {
          user_profile: {
            family_size: userProfile.familySize,
            risks: userProfile.risks,
            risk_score: userProfile.risk_score,
            recommended_prep_level: userProfile.recommended_prep_level,
            language,
          },
          location: { lat: userProfile.location.lat, lng: userProfile.location.lng },
          prep_history: [],
        },
      })
      setMessages(prev => [...prev, {
        id: response.id,
        type: 'ai',
        text: response.text,
        actions: response.action_buttons || [],
        alerts: response.alerts || [],
      }])
    } catch (err) {
      setMessages(prev => [...prev, {
        id: `err_${Date.now()}`,
        type: 'ai',
        text: err.message || 'Backend is not reachable. Start FastAPI on port 8000 and try again.',
        actions: [],
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-bg-primary min-h-0">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 md:px-8">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-lg ${
                msg.type === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-bg-secondary border border-border-default text-text-primary'
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>

              {msg.alerts?.length > 0 && (
                <div className="mt-3 space-y-2">
                  {msg.alerts.map((alert, idx) => (
                    <div key={idx} className="rounded-lg border border-yellow-700 bg-yellow-950 px-3 py-2 text-xs text-yellow-100">
                      {alert.text}
                    </div>
                  ))}
                </div>
              )}

              {msg.actions?.length > 0 && msg.type === 'ai' && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {msg.actions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => openAction(action)}
                      className="inline-flex min-h-0 items-center gap-1 rounded-full bg-bg-tertiary px-3 py-2 text-xs font-medium text-primary transition hover:bg-border-default"
                    >
                      <Zap className="w-3 h-3" />
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-bg-secondary border border-border-default px-4 py-3 rounded-lg">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-text-muted rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-text-muted rounded-full animate-pulse delay-100" />
                <div className="w-2 h-2 bg-text-muted rounded-full animate-pulse delay-200" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && (
        <div className="px-4 py-4 md:px-8 border-t border-border-default">
          <p className="text-xs uppercase text-text-muted font-semibold mb-3">Quick Questions</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-left px-3 py-2 text-sm rounded-lg bg-bg-secondary hover:bg-bg-tertiary border border-border-default transition text-text-secondary hover:text-text-primary"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 py-4 md:px-8 border-t border-border-default">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && handleSend()}
            placeholder="Ask me anything about monsoon prep..."
            className="flex-1 px-4 py-3 rounded-lg bg-bg-secondary border border-border-default focus:border-primary outline-none transition text-sm"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            aria-label="Send message"
            className="p-3 bg-primary hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
