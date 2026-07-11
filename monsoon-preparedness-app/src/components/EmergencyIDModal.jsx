import { useMemo, useState } from 'react'
import { X, Copy, Download, Save } from 'lucide-react'
import { api } from '../lib/api'

export default function EmergencyIDModal({ onClose, userProfile }) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('edit')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [createdId, setCreatedId] = useState(null)
  const [form, setForm] = useState({
    full_name: '',
    dob: '',
    blood_group: '',
    allergies: '',
    meds: '',
    contact_name: '',
    contact_phone: '',
    insurance_details: '',
  })

  const publicLink = useMemo(() => {
    if (!createdId?.public_url) return ''
    return `${window.location.origin}${createdId.public_url}`
  }, [createdId])

  const qrCodeUrl = publicLink
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(publicLink)}`
    : ''

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!form.full_name.trim() || !form.contact_name.trim() || !form.contact_phone.trim()) {
      setError('Name and one emergency contact are required.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const response = await api.createEmergencyId({
        user_id: userProfile.user_id,
        full_name: form.full_name,
        dob: form.dob || null,
        blood_group: form.blood_group || null,
        allergies: form.allergies.split(',').map(item => item.trim()).filter(Boolean),
        meds: form.meds.split(',').map(item => item.trim()).filter(Boolean),
        emergency_contacts: [
          {
            name: form.contact_name,
            phone: form.contact_phone,
            relation: 'Emergency contact',
          },
        ],
        insurance_details: form.insurance_details || null,
      })
      setCreatedId(response)
      setActiveTab('view')
    } catch (err) {
      setError(err.message || 'Could not create emergency ID')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = async () => {
    if (!publicLink) return
    await navigator.clipboard.writeText(publicLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end md:items-center justify-center animate-fadeIn">
      <div className="bg-bg-secondary w-full md:w-[440px] max-h-screen md:max-h-[640px] rounded-t-2xl md:rounded-2xl border border-border-default flex flex-col">
        <div className="px-6 py-4 border-b border-border-default flex items-center justify-between sticky top-0 bg-bg-secondary rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold">Emergency ID Card</h2>
            <p className="text-xs text-text-muted">Medical information and contacts</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-lg transition" aria-label="Close emergency ID">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-border-default px-6">
          <TabButton label="View Card" active={activeTab === 'view'} onClick={() => setActiveTab('view')} disabled={!createdId} />
          <TabButton label="Share" active={activeTab === 'share'} onClick={() => setActiveTab('share')} disabled={!createdId} />
          <TabButton label="Edit" active={activeTab === 'edit'} onClick={() => setActiveTab('edit')} />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {activeTab === 'view' && createdId && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-600 to-primary p-6 rounded-xl text-white shadow-lg">
                <div className="text-sm font-semibold mb-4 opacity-80">EMERGENCY ID</div>
                <div className="text-2xl font-bold mb-1">{form.full_name}</div>
                <div className="flex gap-6 mb-6 text-sm">
                  <div>
                    <span className="opacity-75">DOB:</span> {form.dob || 'Not provided'}
                  </div>
                  <div>
                    <span className="opacity-75">Blood:</span> {form.blood_group || 'Not provided'}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div><span className="opacity-75">Allergies:</span> {form.allergies || 'None listed'}</div>
                  <div><span className="opacity-75">Medicines:</span> {form.meds || 'None listed'}</div>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <p className="text-xs text-text-muted mb-3">Scan for full details</p>
                <div className="bg-white p-4 rounded-lg">
                  <img src={qrCodeUrl} alt="Emergency ID QR" className="w-32 h-32" />
                </div>
              </div>

              <div className="p-3 bg-bg-tertiary rounded-lg">
                <p className="text-sm font-medium">{form.contact_name}</p>
                <p className="text-xs text-text-muted">{form.contact_phone}</p>
              </div>
            </div>
          )}

          {activeTab === 'share' && createdId && (
            <div className="space-y-4">
              <p className="text-sm text-text-secondary">Share your emergency ID with family or rescuers.</p>
              <div>
                <label className="text-xs uppercase text-text-muted font-semibold mb-2 block">Share Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={publicLink}
                    className="flex-1 px-3 py-2 bg-bg-tertiary border border-border-default rounded-lg text-xs"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="p-2 bg-primary hover:bg-blue-600 text-white rounded-lg transition"
                    aria-label="Copy emergency ID link"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                {copied && <p className="text-xs text-success mt-1">Copied</p>}
              </div>
              <div className="rounded-lg border border-border-default bg-bg-tertiary p-3 text-xs text-text-muted">
                Backend PDF path: {createdId.pdf_path}
              </div>
            </div>
          )}

          {activeTab === 'edit' && (
            <div className="space-y-3">
              <Field label="Full Name" value={form.full_name} onChange={value => updateField('full_name', value)} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="DOB" type="date" value={form.dob} onChange={value => updateField('dob', value)} />
                <Field label="Blood Group" value={form.blood_group} onChange={value => updateField('blood_group', value)} />
              </div>
              <Field label="Allergies" value={form.allergies} onChange={value => updateField('allergies', value)} placeholder="Comma separated" />
              <Field label="Medicines" value={form.meds} onChange={value => updateField('meds', value)} placeholder="Comma separated" />
              <Field label="Emergency Contact Name" value={form.contact_name} onChange={value => updateField('contact_name', value)} />
              <Field label="Emergency Contact Phone" value={form.contact_phone} onChange={value => updateField('contact_phone', value)} />
              <Field label="Insurance Details" value={form.insurance_details} onChange={value => updateField('insurance_details', value)} placeholder="Provider, policy number, helpline" />
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border-default flex gap-2">
          {activeTab === 'edit' ? (
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary hover:bg-blue-600 disabled:opacity-60 text-white font-medium rounded-lg transition"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save ID'}
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('share')}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-bg-tertiary hover:bg-border-default text-text-primary font-medium rounded-lg transition"
            >
              <Download className="w-4 h-4" />
              Share / Export
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function TabButton({ label, active, onClick, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-3 text-sm font-medium border-b-2 transition disabled:opacity-40 ${
        active
          ? 'border-primary text-primary'
          : 'border-transparent text-text-muted hover:text-text-secondary'
      }`}
    >
      {label}
    </button>
  )
}

function Field({ label, value, onChange, type = 'text', placeholder = '' }) {
  return (
    <div>
      <label className="text-xs font-semibold text-text-muted mb-1 block">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-white border border-border-default rounded-lg text-sm outline-none focus:border-primary"
      />
    </div>
  )
}
