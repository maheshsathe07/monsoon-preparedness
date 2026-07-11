const DEFAULT_API_BASE_URL = 'https://monsoon-preparedness-backend-production.up.railway.app'

function normalizeApiBaseUrl(url) {
  return (url || DEFAULT_API_BASE_URL)
    .replace(/\/api\/v1\/.*$/, '')
    .replace(/\/api\/v1$/, '')
    .replace(/\/$/, '')
}

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL)
const API_PREFIX = `${API_BASE_URL}/api/v1`
const AUTH_STORAGE_KEY = 'monsoon_auth'
const AUTH_STORAGE_VERSION = 1

export function getStoredAuth() {
  try {
    const auth = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || 'null')
    if (!auth || auth.version !== AUTH_STORAGE_VERSION || !auth.access_token || !auth.user_id) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      return null
    }
    return auth
  } catch {
    return null
  }
}

export function storeAuth(auth) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ ...auth, version: AUTH_STORAGE_VERSION }))
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export const DEFAULT_LOCATION = {
  label: 'Mumbai, Maharashtra',
  lat: 19.076,
  lng: 72.8777,
}

const cityCoordinates = [
  ['mumbai', 19.076, 72.8777],
  ['thane', 19.2183, 72.9781],
  ['pune', 18.5204, 73.8567],
  ['delhi', 28.6139, 77.209],
  ['bengaluru', 12.9716, 77.5946],
  ['bangalore', 12.9716, 77.5946],
  ['chennai', 13.0827, 80.2707],
  ['kolkata', 22.5726, 88.3639],
  ['hyderabad', 17.385, 78.4867],
  ['ahmedabad', 23.0225, 72.5714],
  ['kochi', 9.9312, 76.2673],
  ['goa', 15.2993, 74.124],
  ['guwahati', 26.1445, 91.7362],
  ['dehradun', 30.3165, 78.0322],
]

export function resolveLocation(input) {
  const value = input.trim().toLowerCase()
  const match = cityCoordinates.find(([name]) => value.includes(name))
  if (!match) {
    return { ...DEFAULT_LOCATION, label: input.trim() || DEFAULT_LOCATION.label }
  }
  return { label: input.trim(), lat: match[1], lng: match[2] }
}

async function request(path, options = {}) {
  const token = getStoredAuth()?.access_token
  const response = await fetch(`${API_PREFIX}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  })

  const isJson = response.headers.get('content-type')?.includes('application/json')
  const body = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    const detail = typeof body === 'object' ? body.detail : body
    throw new Error(detail || `Request failed with status ${response.status}`)
  }

  return body
}

export const api = {
  signup(payload) {
    return request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  login(payload) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  createProfile(payload) {
    return request('/profile', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  sendChat(payload) {
    return request('/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  getChecklist(userId) {
    return request(`/checklist/${encodeURIComponent(userId)}`)
  },
  patchChecklist(userId, itemId, payload) {
    return request(`/checklist/${encodeURIComponent(userId)}/${encodeURIComponent(itemId)}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  },
  getWeather(location) {
    return request(`/weather/${location.lat}/${location.lng}`)
  },
  listAlerts(location, radius = 5) {
    return request(`/alerts?lat=${location.lat}&lng=${location.lng}&radius=${radius}`)
  },
  createAlert(payload) {
    return request('/alerts', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  createEmergencyId(payload) {
    return request('/emergency-id', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}