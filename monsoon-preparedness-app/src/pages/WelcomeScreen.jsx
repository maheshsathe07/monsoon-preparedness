import { useState } from 'react'
import { Cloud, Droplets, Wind } from 'lucide-react'
import { api, resolveLocation } from '../lib/api'

export default function WelcomeScreen({ auth, onProfileCreate, onLogout }) {
  const [step, setStep] = useState(0)
  const [location, setLocation] = useState('')
  const [familySize, setFamilySize] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [risks, setRisks] = useState({
    flood: false,
    landslide: false,
    wind: false,
  })

  const riskOptions = [
    { key: 'flood', label: 'Flood Risk', icon: Droplets, color: 'text-blue-400' },
    { key: 'landslide', label: 'Landslide Risk', icon: Cloud, color: 'text-orange-400' },
    { key: 'wind', label: 'Strong Wind Risk', icon: Wind, color: 'text-cyan-400' },
  ]

  const handleRiskToggle = (key) => {
    setRisks(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleNext = async () => {
    setError('')
    if (step === 0 && location.trim()) {
      setStep(1)
    } else if (step === 1) {
      setStep(2)
    } else if (step === 2 && Object.values(risks).some(r => r)) {
      const resolvedLocation = resolveLocation(location)
      const selectedRisks = Object.entries(risks)
        .filter(([, enabled]) => enabled)
        .map(([key]) => key)
      setLoading(true)
      try {
        const profile = await api.createProfile({
          user_id: auth.user_id,
          family_size: familySize,
          age_distribution: [],
          disabilities: [],
          location: { lat: resolvedLocation.lat, lng: resolvedLocation.lng },
          risks: selectedRisks,
          pets: [],
          prep_history: [],
        })
        onProfileCreate({
          ...profile,
          familySize,
          risks: selectedRisks,
          location: resolvedLocation,
        })
      } catch (err) {
        setError(err.message || 'Could not create profile. Is the backend running?')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary flex flex-col items-center justify-center px-6 py-8">
      {/* Header */}
      <div className="mb-12 text-center animate-slideUp">
        <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-600">
          <Cloud className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Monsoon Prep</h1>
        <p className="text-text-secondary text-sm">Stay safe during monsoon season</p>
        <button
          type="button"
          onClick={onLogout}
          className="mt-4 min-h-0 rounded-lg border border-border-default bg-bg-secondary px-3 py-2 text-xs text-text-secondary hover:bg-bg-tertiary"
        >
          Logout
        </button>
      </div>

      {/* Steps */}
      <div className="w-full max-w-md">
        {step === 0 && (
          <div className="animate-slideUp space-y-4">
            <h2 className="text-xl font-semibold mb-6">What's your location?</h2>
            <input
              type="text"
              placeholder="Enter city or area name"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-bg-secondary border border-border-light focus:border-primary outline-none transition"
              autoFocus
            />
            <p className="text-text-muted text-xs">This helps us provide location-specific alerts and resources</p>
          </div>
        )}

        {step === 1 && (
          <div className="animate-slideUp space-y-4">
            <h2 className="text-xl font-semibold mb-6">Family size</h2>
            <div className="bg-bg-secondary rounded-lg p-4 border border-border-light">
              <input
                type="range"
                min="1"
                max="15"
                value={familySize}
                onChange={(e) => setFamilySize(Number(e.target.value))}
                className="w-full h-2 bg-border-default rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="mt-4 text-center">
                <span className="text-3xl font-bold text-primary">{familySize}</span>
                <p className="text-text-secondary text-sm mt-2">people in your family</p>
              </div>
            </div>
            <p className="text-text-muted text-xs">We'll customize checklists for your family size</p>
          </div>
        )}

        {step === 2 && (
          <div className="animate-slideUp space-y-4">
            <h2 className="text-xl font-semibold mb-6">What risks apply to you?</h2>
            <div className="space-y-3">
              {riskOptions.map(({ key, label, icon: Icon, color }) => (
                <button
                  key={key}
                  onClick={() => handleRiskToggle(key)}
                  className={`w-full p-4 rounded-lg border-2 transition flex items-center gap-3 ${
                    risks[key]
                      ? 'bg-bg-tertiary border-primary'
                      : 'bg-bg-secondary border-border-light'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${risks[key] ? 'text-primary' : color}`} />
                  <span className="flex-1 text-left font-medium">{label}</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    risks[key] ? 'bg-primary border-primary' : 'border-border-default'
                  }`}>
                    {risks[key] && <div className="w-2 h-2 bg-bg-primary rounded-full" />}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-text-muted text-xs">Select all that apply to your area</p>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-lg border border-red-700 bg-red-950 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-10 flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 px-4 py-3 rounded-lg bg-bg-secondary border border-border-default text-text-primary font-medium hover:bg-bg-tertiary transition"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={
              loading ||
              (step === 0 && !location.trim()) ||
              (step === 2 && !Object.values(risks).some(r => r))
            }
            className="flex-1 px-4 py-3 rounded-lg bg-primary text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition"
          >
            {loading ? 'Creating...' : step === 2 ? 'Continue' : 'Next'}
          </button>
        </div>

        {/* Progress */}
        <div className="mt-6 flex gap-2 justify-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition ${i <= step ? 'bg-primary w-8' : 'bg-border-default w-4'}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
