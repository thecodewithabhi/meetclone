import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../contexts/AuthContext'

const AVATAR_COLORS = ['#1a73e8', '#34a853', '#ea4335', '#fbbc05', '#9334e6']

function getColor(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [roomInput, setRoomInput] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setShowDropdown(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleNewMeeting = () => {
    const id = Math.random().toString(36).substring(2, 6) + '-' +
               Math.random().toString(36).substring(2, 6) + '-' +
               Math.random().toString(36).substring(2, 6)
    navigate(`/lobby/${id}`)
    setShowDropdown(false)
  }

  const handleJoin = () => {
    const id = roomInput.trim()
    if (!id) return
    navigate(`/lobby/${id}`)
  }

  const mockParticipants = [
    { name: 'Rahul Shukla', color: '#1a73e8' },
    { name: 'Abhishek Shakya', color: '#34a853' },
    { name: 'Amit', color: '#ea4335' },
    { name: 'Sara', color: '#9334e6' },
  ]

  return (
    <div className='home-page'>
      <Navbar />

      <div className='home-hero'>
        {/* Left Section */}
        <div className='home-hero-left fade-up'>
          <h1>
            Video calls &amp; meetings<br />
            for <em>everyone</em>
          </h1>
          <p>
            Connect, collaborate, and celebrate from anywhere with
            MeetClone — secure, high-quality video conferencing with screen
            sharing and real-time chat.
          </p>

          {/* New Meeting Dropdown */}
          <div className='home-actions'>
            <div className='dropdown-wrap' ref={dropdownRef}>
              <button
                id='new-meeting-btn'
                className='btn btn-primary btn-lg'
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span>📹</span>
                New meeting
                <span style={{ fontSize: 12 }}>▾</span>
              </button>
              {showDropdown && (
                <div className='new-meeting-dropdown'>
                  <button onClick={handleNewMeeting}>
                    <span className='icon'>⚡</span>
                    <span>
                      <div style={{ fontWeight: 600 }}>Start an instant meeting</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        Jump right in
                      </div>
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className='home-divider'><span>or join a meeting</span></div>

          {/* Join Row */}
          <div className='home-join-row'>
            <input
              id='room-code-input'
              className='input input-lg'
              placeholder='Enter a code or link'
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            />
            <button
              id='join-btn'
              className='btn btn-outline btn-lg'
              onClick={handleJoin}
              disabled={!roomInput.trim()}
            >
              Join
            </button>
          </div>

          {/* Features */}
          <div className='home-features' style={{ marginTop: 32 }}>
            <div className='home-feature'>
              <span>🔒</span>
              <span>Encrypted</span>
            </div>
            <div className='home-feature'>
              <span>🖥️</span>
              <span>Screen share</span>
            </div>
            <div className='home-feature'>
              <span>💬</span>
              <span>Live chat</span>
            </div>
            <div className='home-feature'>
              <span>🆓</span>
              <span>Free forever</span>
            </div>
          </div>
        </div>

        {/* Right Visual */}
        <div className='home-visual fade-in'>
          <div className='home-video-grid'>
            {/* Large main tile */}
            <div className='home-video-tile large'>
              <div className='tile-avatar'>
                <div className='home-avatar-ring' style={{ background: '#1a73e8' }}>
                  R
                </div>
              </div>
              <div className='home-tile-name'>Rahul Shukla</div>
              {/* Speaking indicator */}
              <div style={{
                position: 'absolute', top: 8, right: 8,
                background: 'var(--success)',
                width: 10, height: 10, borderRadius: '50%',
                boxShadow: '0 0 0 3px rgba(52,168,83,0.3)'
              }} />
            </div>

            {/* Small tiles */}
            {mockParticipants.slice(1).map((p) => (
              <div key={p.name} className='home-video-tile'>
                <div className='tile-avatar'>
                  <div className='home-avatar-ring' style={{ background: p.color }}>
                    {p.name[0]}
                  </div>
                </div>
                <div className='home-tile-name'>{p.name}</div>
              </div>
            ))}
          </div>

          {/* Floating badge */}
          <div style={{
            position: 'absolute', bottom: -18, left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-full)',
            padding: '8px 20px',
            display: 'flex', alignItems: 'center', gap: 10,
            fontSize: 13, whiteSpace: 'nowrap',
            boxShadow: 'var(--shadow-md)'
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--success)', display: 'inline-block'
            }} />
            <span style={{ color: 'var(--text-secondary)' }}>4 participants in this call</span>
          </div>
        </div>
      </div>
    </div>
  )
}