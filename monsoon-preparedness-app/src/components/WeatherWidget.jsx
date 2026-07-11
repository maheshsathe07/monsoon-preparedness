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
      case 'RED': return 'bg-red-950 border-red-700 text-red-300'
      case 'YELLOW': return 'bg-yellow-950 border-yellow-700 text-yellow-300'
      case 'GREEN': return 'bg-green-950 border-green-700 text-green-300'
      default: return 'bg-bg-tertiary border-border-default text-text-secondary'
    }
  }

  return (
    <div className="px-4 py-4 md:px-8 border-b border-border-default bg-bg-secondary">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="min-w-0">
          <p className="text-xs uppercase text-text-muted font-semibold mb-1 truncate">{location.label}</p>
          <div className="flex items-center gap-3">
            <div>
              <p className="text-3xl font-bold">{rainfall.toFixed(0)} mm</p>
              <p className="text-sm text-text-secondary">Highest 7-day rainfall</p>
            </div>
            <Cloud className="w-12 h-12 text-blue-400 flex-shrink-0" />
          </div>
        </div>

        <div className={`px-4 py-2 rounded-lg border-2 ${getRiskColor(level)} text-center flex-shrink-0`}>
          <p className="text-xs font-bold">{level} Risk</p>
          <p className="text-xs mt-1">Monsoon Alert</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-yellow-700 bg-yellow-950 px-3 py-2 text-xs text-yellow-100">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-bg-tertiary rounded-lg">
          <p className="text-xs text-text-muted mb-1">Rain forecast</p>
          <p className="text-lg font-bold">{rainfall.toFixed(1)} mm</p>
        </div>
        <div className="p-3 bg-bg-tertiary rounded-lg">
          <p className="text-xs text-text-muted mb-1">Backend source</p>
          <p className="text-lg font-bold">Open-Meteo</p>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase text-text-muted font-semibold mb-3">7-Day Forecast</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(weatherData?.daily_rainfall_mm || [0, 0, 0, 0, 0, 0, 0]).map((dailyRain, idx) => (
            <div
              key={idx}
              className={`flex-shrink-0 p-3 rounded-lg border-2 w-24 text-center ${getRiskColor(dailyRain > 60 ? 'RED' : dailyRain >= 20 ? 'YELLOW' : 'GREEN')}`}
            >
              <Droplets className="w-4 h-4 mx-auto mb-2" />
              <p className="text-xs font-semibold mb-2">Day {idx + 1}</p>
              <p className="text-xs">{Number(dailyRain).toFixed(1)} mm</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
