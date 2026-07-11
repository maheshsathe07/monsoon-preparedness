const { useState } = React;
const e = React.createElement;

// Welcome Screen with light theme
function WelcomeScreen({ onProfileCreate }) {
  const [step, setStep] = useState(0);
  const [location, setLocation] = useState('');
  const [familySize, setFamilySize] = useState(1);
  const [risks, setRisks] = useState({ flood: false, landslide: false, wind: false });

  const handleRiskToggle = (key) => {
    setRisks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNext = () => {
    if (step === 0 && location.trim()) setStep(1);
    else if (step === 1) setStep(2);
    else if (step === 2 && Object.values(risks).some(r => r)) {
      onProfileCreate({ location, familySize, risks });
    }
  };

  const riskOptions = [
    { key: 'flood', label: 'Flood Risk', icon: '💧' },
    { key: 'landslide', label: 'Landslide Risk', icon: '⛰️' },
    { key: 'wind', label: 'Strong Wind Risk', icon: '🌪️' }
  ];

  return e('div', { className: 'welcome-container' },
    e('div', { className: 'welcome-header animate-slideUp' },
      e('div', { style: {
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-sky) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.5rem',
        boxShadow: 'var(--shadow-lg)'
      }},
        e('svg', { style: { width: '36px', height: '36px', color: 'white', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', fill: 'none', viewBox: '0 0 24 24' },
          e('path', { d: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z' })
        )
      ),
      e('h1', {}, 'Monsoon Prep'),
      e('p', {}, 'Get prepared and stay safe during monsoon season with personalized alerts and checklists')
    ),

    e('div', { className: 'welcome-form animate-slideUp' },
      e('div', { className: 'step-indicator' },
        [0, 1, 2].map(i => e('div', { key: i, className: `step-dot ${i <= step ? 'active' : ''}` }))
      ),

      step === 0 && e('div', { className: 'animate-slideUp' },
        e('h2', { style: { marginBottom: '1.5rem' } }, "Where are you located?"),
        e('div', { className: 'form-group' },
          e('label', {}, 'City or Area'),
          e('input', {
            type: 'text',
            placeholder: 'E.g., Mumbai, Bangalore, Chennai',
            value: location,
            onChange: (evt) => setLocation(evt.target.value),
            autoFocus: true
          })
        ),
        e('p', { style: { fontSize: '0.9rem', color: 'var(--text-tertiary)', marginBottom: '1.5rem' } }, 'This helps us provide weather alerts and resources specific to your area')
      ),

      step === 1 && e('div', { className: 'animate-slideUp' },
        e('h2', { style: { marginBottom: '1.5rem' } }, 'Family Size'),
        e('div', { style: { background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(20, 184, 166, 0.05) 100%)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-light)' }},
          e('input', {
            type: 'range',
            min: '1',
            max: '15',
            value: familySize,
            onChange: (evt) => setFamilySize(Number(evt.target.value)),
            style: { width: '100%', height: '8px', borderRadius: '10px', appearance: 'none', background: 'linear-gradient(to right, var(--primary-blue), var(--primary-teal))', cursor: 'pointer' }
          }),
          e('div', { style: { marginTop: '1.5rem', textAlign: 'center' }},
            e('div', { style: { fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary-blue)' } }, familySize),
            e('p', { style: { color: 'var(--text-secondary)', marginTop: '0.5rem' } }, `${familySize === 1 ? 'person' : 'people'} in your family`)
          )
        ),
        e('p', { style: { fontSize: '0.9rem', color: 'var(--text-tertiary)', marginTop: '1rem' } }, "We'll customize emergency checklists for your household")
      ),

      step === 2 && e('div', { className: 'animate-slideUp' },
        e('h2', { style: { marginBottom: '1.5rem' } }, 'What risks apply to your area?'),
        e('div', { style: { display: 'flex', flexDirection: 'column', gap: '0.75rem' }},
          riskOptions.map(option =>
            e('button', {
              key: option.key,
              onClick: () => handleRiskToggle(option.key),
              style: {
                padding: '1rem',
                borderRadius: '10px',
                border: risks[option.key] ? '2px solid var(--primary-blue)' : '2px solid var(--border-color)',
                background: risks[option.key] ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)' : 'var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                color: 'var(--text-primary)',
                fontWeight: '600',
                fontSize: '1rem'
              },
              onMouseEnter: (evt) => { evt.target.style.boxShadow = 'var(--shadow-md)'; },
              onMouseLeave: (evt) => { evt.target.style.boxShadow = 'none'; }
            },
              e('span', { style: { fontSize: '1.5rem' } }, option.icon),
              e('span', { style: { flex: 1, textAlign: 'left' } }, option.label),
              e('div', {
                style: {
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: risks[option.key] ? 'none' : '2px solid var(--border-color)',
                  background: risks[option.key] ? 'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-sky) 100%)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }
              },
                risks[option.key] && e('svg', { style: { width: '14px', height: '14px', color: 'white', fill: 'currentColor', viewBox: '0 0 20 20' }},
                  e('path', { fillRule: 'evenodd', d: 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z', clipRule: 'evenodd' })
                )
              )
            )
          )
        ),
        e('p', { style: { fontSize: '0.9rem', color: 'var(--text-tertiary)', marginTop: '1rem' } }, 'Select all that apply to customize your alerts')
      ),

      // Navigation buttons
      e('div', { style: { marginTop: '2rem', display: 'flex', gap: '1rem' }},
        step > 0 && e('button', {
          onClick: () => setStep(step - 1),
          className: 'btn-secondary',
          style: { flex: 1 }
        }, 'Back'),
        e('button', {
          onClick: handleNext,
          disabled: (step === 0 && !location.trim()) || (step === 2 && !Object.values(risks).some(r => r)),
          className: 'btn-primary',
          style: {
            flex: 1,
            opacity: ((step === 0 && !location.trim()) || (step === 2 && !Object.values(risks).some(r => r))) ? 0.5 : 1,
            cursor: ((step === 0 && !location.trim()) || (step === 2 && !Object.values(risks).some(r => r))) ? 'not-allowed' : 'pointer'
          }
        }, step === 2 ? 'Get Started' : 'Next')
      )
    )
  );
}

// Sidebar
function Sidebar({ onActionClick, selectedLanguage, onLanguageChange }) {
  return e('div', { className: 'sidebar' },
    e('div', { className: 'sidebar-header' },
      e('h2', {}, '🌧️ Monsoon Prep')
    ),
    e('div', { className: 'sidebar-content' },
      e('button', {
        className: 'action-button',
        onClick: () => onActionClick('checklist'),
        style: {}
      },
        e('svg', { style: { width: '20px', height: '20px', fill: 'currentColor', viewBox: '0 0 20 20' }},
          e('path', { fillRule: 'evenodd', d: 'M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 3.062v6.372a3.066 3.066 0 01-3.062 3.062H9.931a3.064 3.064 0 01-3.062-3.062V6.517a3.066 3.066 0 012.812-3.062zM9 11a1 1 0 11-2 0 1 1 0 012 0zm5 0a1 1 0 11-2 0 1 1 0 012 0z', clipRule: 'evenodd' })
        ),
        'Emergency Checklist'
      ),
      e('button', {
        className: 'action-button',
        onClick: () => onActionClick('map'),
      },
        e('svg', { style: { width: '20px', height: '20px', fill: 'none', stroke: 'currentColor', strokeWidth: '2', viewBox: '0 0 24 24' }},
          e('path', { d: 'M9 20l-5.447-2.724A1 1 0 003 16.382V5.618a1 1 0 011.447-.894L9 7.382v12.618zM9 7.382L15 4m0 0l5.447-2.724A1 1 0 0121 3.618v10.764a1 1 0 01-1.447.894L15 13.618m0-6.236v12.618m0-12.618l6 3.764' })
        ),
        'Map & Alerts'
      ),
      e('button', {
        className: 'action-button',
        onClick: () => onActionClick('id'),
      },
        e('svg', { style: { width: '20px', height: '20px', fill: 'none', stroke: 'currentColor', strokeWidth: '2', viewBox: '0 0 24 24' }},
          e('path', { d: 'M10 6H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-5m-4 0V5a2 2 0 10-4 0v1m4 0a2 2 0 104 0' })
        ),
        'Emergency ID'
      )
    ),
    e('div', { className: 'sidebar-footer' },
      e('button', {
        className: `language-btn ${selectedLanguage === 'en' ? 'active' : ''}`,
        onClick: () => onLanguageChange('en')
      }, 'EN'),
      e('button', {
        className: `language-btn ${selectedLanguage === 'hi' ? 'active' : ''}`,
        onClick: () => onLanguageChange('hi')
      }, 'हिं'),
      e('button', {
        className: `language-btn ${selectedLanguage === 'ta' ? 'active' : ''}`,
        onClick: () => onLanguageChange('ta')
      }, 'தமிழ்')
    )
  );
}

// Weather Widget
function WeatherWidget() {
  return e('div', { className: 'weather-widget' },
    e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }},
      e('div', {},
        e('h3', { style: { margin: 0, fontSize: '1.25rem' } }, 'Current Weather'),
        e('p', { style: { margin: '0.25rem 0 0', opacity: 0.9 } }, 'Mumbai Area')
      ),
      e('span', { className: 'alert-status', style: { background: 'rgba(249, 115, 22, 0.3)', border: '1px solid rgba(249, 115, 22, 0.5)' } }, '🔴 High Alert')
    ),
    e('div', { className: 'weather-grid' },
      e('div', { className: 'weather-item' },
        e('div', { className: 'weather-item-label' }, 'Temp'),
        e('div', { className: 'weather-item-value' }, '28°C')
      ),
      e('div', { className: 'weather-item' },
        e('div', { className: 'weather-item-label' }, 'Humidity'),
        e('div', { className: 'weather-item-value' }, '85%')
      ),
      e('div', { className: 'weather-item' },
        e('div', { className: 'weather-item-label' }, 'Wind'),
        e('div', { className: 'weather-item-value' }, '45 km/h')
      ),
      e('div', { className: 'weather-item' },
        e('div', { className: 'weather-item-label' }, 'Rainfall'),
        e('div', { className: 'weather-item-value' }, '65mm')
      )
    )
  );
}

// Chat Interface
function ChatInterface() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I\'m your monsoon safety assistant. How can I help you prepare?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages(prev => [...prev, { id: Date.now(), text: input, sender: 'user' }]);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: 'That\'s a great question! Here are some tips for monsoon preparation...',
          sender: 'bot'
        }]);
      }, 500);
      setInput('');
    }
  };

  return e('div', { className: 'chat-container' },
    e(WeatherWidget),
    e('div', { className: 'messages-area' },
      messages.map(msg =>
        e('div', { key: msg.id, className: `message ${msg.sender}` },
          e('div', { className: 'message-bubble' }, msg.text)
        )
      )
    ),
    e('div', { className: 'input-area' },
      e('div', { className: 'input-wrapper' },
        e('input', {
          type: 'text',
          placeholder: 'Ask me about monsoon preparation...',
          value: input,
          onChange: (evt) => setInput(evt.target.value),
          onKeyPress: (evt) => evt.key === 'Enter' && handleSend()
        })
      ),
      e('button', {
        className: 'send-btn',
        onClick: handleSend
      }, '→')
    )
  );
}

// Modal Components
function ChecklistModal({ onClose }) {
  const [items, setItems] = useState([
    { id: 1, text: 'Stock up on drinking water (1 liter per person per day)', completed: false },
    { id: 2, text: 'Keep emergency medicines and first aid kit ready', completed: false },
    { id: 3, text: 'Prepare emergency cash and important documents', completed: false },
    { id: 4, text: 'Test backup power sources (torch, power bank)', completed: false },
    { id: 5, text: 'Check roof drains and gutters for blockages', completed: false }
  ]);

  const toggleComplete = (id) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  return e('div', { className: 'modal-overlay', onClick: onClose },
    e('div', { className: 'modal', onClick: (evt) => evt.stopPropagation() },
      e('div', { className: 'modal-header' },
        e('h2', {}, 'Emergency Checklist'),
        e('button', { className: 'close-btn', onClick: onClose }, '✕')
      ),
      e('div', { className: 'modal-content' },
        e('div', { style: { display: 'flex', flexDirection: 'column', gap: '0.5rem' }},
          items.map(item =>
            e('label', {
              key: item.id,
              className: `checklist-item ${item.completed ? 'completed' : ''}`,
              style: { cursor: 'pointer' }
            },
              e('input', {
                type: 'checkbox',
                checked: item.completed,
                onChange: () => toggleComplete(item.id)
              }),
              e('span', {}, item.text)
            )
          )
        )
      ),
      e('div', { className: 'modal-footer' },
        e('button', { className: 'btn-secondary', onClick: onClose }, 'Close'),
        e('button', { className: 'btn-primary', onClick: () => { alert('Checklist saved!'); onClose(); } }, 'Save Progress')
      )
    )
  );
}

function MapModal({ onClose }) {
  return e('div', { className: 'modal-overlay', onClick: onClose },
    e('div', { className: 'modal', onClick: (evt) => evt.stopPropagation() },
      e('div', { className: 'modal-header' },
        e('h2', {}, 'Safety Map & Alerts'),
        e('button', { className: 'close-btn', onClick: onClose }, '✕')
      ),
      e('div', { className: 'modal-content' },
        e('div', { className: 'map-container' },
          e('div', { style: { textAlign: 'center' }},
            e('svg', { style: { width: '60px', height: '60px', opacity: 0.4 }, fill: 'currentColor', viewBox: '0 0 24 24' },
              e('path', { d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z' })
            ),
            e('p', { style: { color: 'var(--text-tertiary)', marginTop: '1rem' } }, 'Map view coming soon')
          )
        ),
        e('div', { style: { marginTop: '1.5rem' }},
          e('h3', { style: { fontSize: '1rem', marginBottom: '1rem' } }, 'Active Alerts'),
          e('div', { className: 'alert-item high' },
            e('h4', {}, 'Heavy Rainfall'),
            e('p', {}, 'Expect heavy rains in the next 6 hours')
          ),
          e('div', { className: 'alert-item medium' },
            e('h4', {}, 'Wind Advisory'),
            e('p', {}, 'Wind speeds up to 50 km/h expected')
          )
        )
      ),
      e('div', { className: 'modal-footer' },
        e('button', { className: 'btn-primary', onClick: onClose }, 'Got it')
      )
    )
  );
}

function EmergencyIDModal({ onClose }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [emergency, setEmergency] = useState('');

  return e('div', { className: 'modal-overlay', onClick: onClose },
    e('div', { className: 'modal', onClick: (evt) => evt.stopPropagation() },
      e('div', { className: 'modal-header' },
        e('h2', {}, 'Emergency ID Card'),
        e('button', { className: 'close-btn', onClick: onClose }, '✕')
      ),
      e('div', { className: 'modal-content' },
        e('form', { className: 'emergency-id-form', onSubmit: (evt) => evt.preventDefault() },
          e('div', { className: 'form-group' },
            e('label', {}, 'Full Name'),
            e('input', { type: 'text', placeholder: 'Your name', value: name, onChange: (evt) => setName(evt.target.value) })
          ),
          e('div', { className: 'form-group' },
            e('label', {}, 'Contact Number'),
            e('input', { type: 'tel', placeholder: 'Phone number', value: phone, onChange: (evt) => setPhone(evt.target.value) })
          ),
          e('div', { className: 'form-group' },
            e('label', {}, 'Emergency Contact'),
            e('input', { type: 'tel', placeholder: 'Alternative number', value: emergency, onChange: (evt) => setEmergency(evt.target.value) })
          ),
          name && e('div', { className: 'id-preview' },
            e('h3', {}, 'Emergency ID'),
            e('div', { style: { textAlign: 'left', fontSize: '0.95rem', marginTop: '1rem', lineHeight: '1.8' }},
              e('div', {}, 'Name: ', e('strong', {}, name)),
              e('div', {}, 'Phone: ', e('strong', {}, phone)),
              e('div', {}, 'Emergency: ', e('strong', {}, emergency))
            )
          )
        )
      ),
      e('div', { className: 'modal-footer' },
        e('button', { className: 'btn-secondary', onClick: onClose }, 'Close'),
        e('button', { className: 'btn-primary', onClick: () => { alert('ID Card saved!'); onClose(); } }, 'Save Card')
      )
    )
  );
}

// Main App
function MainApp({ profile, onBack }) {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [activeModal, setActiveModal] = useState(null);

  const handleActionClick = (action) => {
    setActiveModal(action);
  };

  return e('div', { className: 'main-app' },
    e(Sidebar, {
      onActionClick: handleActionClick,
      selectedLanguage,
      onLanguageChange: setSelectedLanguage
    }),
    e('div', { className: 'main-app-content' },
      e(ChatInterface)
    ),
    activeModal === 'checklist' && e(ChecklistModal, { onClose: () => setActiveModal(null) }),
    activeModal === 'map' && e(MapModal, { onClose: () => setActiveModal(null) }),
    activeModal === 'id' && e(EmergencyIDModal, { onClose: () => setActiveModal(null) })
  );
}

// Root App
function App() {
  const [profile, setProfile] = useState(null);

  return profile
    ? e(MainApp, { profile, onBack: () => setProfile(null) })
    : e(WelcomeScreen, { onProfileCreate: setProfile });
}

// Render app
ReactDOM.render(e(App), document.getElementById('root'));
