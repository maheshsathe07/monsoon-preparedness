import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatInterface from '../components/ChatInterface'
import ChecklistModal from '../components/ChecklistModal'
import MapModal from '../components/MapModal'
import EmergencyIDModal from '../components/EmergencyIDModal'
import WeatherWidget from '../components/WeatherWidget'
import { translations } from '../lib/i18n'

export default function MainApp({ userProfile = {}, onLogout = () => {} }) {
  const [activeModal, setActiveModal] = useState(null)
  const [language, setLanguage] = useState('en')
  const [unreadAlerts, setUnreadAlerts] = useState(0)

  const t = translations[language] || translations.en

  const handleOpenModal = (modal) => {
    setActiveModal(modal)
    if (modal === 'map') {
      setUnreadAlerts(0)
    }
  }

  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar
        onSelectAction={handleOpenModal}
        language={language}
        onLanguageChange={setLanguage}
        t={t}
        unreadAlerts={unreadAlerts}
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <WeatherWidget location={userProfile.location} t={t} />
        <ChatInterface userProfile={userProfile} language={language} t={t} onOpenAction={handleOpenModal} />
      </div>

      {activeModal === 'checklist' && (
        <ChecklistModal onClose={() => setActiveModal(null)} userProfile={userProfile} t={t} />
      )}

      {activeModal === 'map' && (
        <MapModal onClose={() => setActiveModal(null)} userProfile={userProfile} t={t} />
      )}

      {activeModal === 'id' && (
        <EmergencyIDModal onClose={() => setActiveModal(null)} userProfile={userProfile} t={t} />
      )}
    </div>
  )
}
