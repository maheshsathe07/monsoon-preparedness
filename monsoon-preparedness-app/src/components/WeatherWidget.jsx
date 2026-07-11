import { useEffect, useState } from 'react'
import { Cloud, AlertTriangle, Droplets } from 'lucide-react'
import { api } from '../lib/api'

export default function WeatherWidget({ location }) {
  const [weatherData, setWeatherData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function loadWeather() {
      try {
        const data = await api.getWeather(location)
        if (!cancelled) {
          setWeatherData(data)
          setError('')
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Weather unavailable')
      }
    }
    loadWeather()
    return () => {
      cancelled = true
    }
  }, [location])

  const level = weatherData?.monsoon_alert_level || 'GREEN'
  const rainfall = weatherData?.max_rainfall_mm ?? 0

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'RED': return 'bg-red-50 border-red-200 text-red-700'
      case 'YELLOW': return 'bg-amber-50 border-amber-200 text-amber-700'
      case 'GREEN': return 'bg-emerald-50 border-emerald-200 text-emerald-700'
      default: return 'bg-bg-tertiary border-border-default text-text-secondary'
    }
  }

  return (
    <div className="px-3 py-3 md:px-5 border-b border-border-light bg-bg-secondary shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase text-text-muted font-semibold mb-1 truncate">{location.label}</p>
          <div className="flex items-center gap-3">
            <div>
              <p className="text-2xl font-bold text-text-primary">{rainfall.toFixed(0)} mm</p>
              <p className="text-xs text-text-secondary">Max 7-day rain</p>
            </div>
            <Cloud className="w-9 h-9 text-sky-500 flex-shrink-0" />
          </div>
        </div>

        <div className={`px-3 py-2 rounded-lg border ${getRiskColor(level)} text-center flex-shrink-0`}>
          <p className="text-xs font-bold">{level} Risk</p>
        </div>
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="mt-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(weatherData?.daily_rainfall_mm || [0, 0, 0, 0, 0, 0, 0]).map((dailyRain, idx) => (
            <div
              key={idx}
              className={`flex-shrink-0 px-2 py-2 rounded-lg border w-20 text-center ${getRiskColor(dailyRain > 60 ? 'RED' : dailyRain >= 20 ? 'YELLOW' : 'GREEN')}`}
            >
              <Droplets className="w-3 h-3 mx-auto mb-1" />
              <p className="text-[11px] font-semibold">Day {idx + 1}</p>
              <p className="text-xs">{Number(dailyRain).toFixed(1)} mm</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}