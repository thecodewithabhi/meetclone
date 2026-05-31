import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Lobby() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const [displayName, setDisplayName] = useState(user?.name || '')
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)
  const [camError, setCamError] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    startPreview()
    return () => stopStream()
  }, [])

  const startPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
    } catch {
      setCamError(true)
    }
  }

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
  }

  const toggleMic = () => {
    streamRef.current?.getAudioTracks().forEach((t) => { t.enabled = !micOn })
    setMicOn(!micOn)
  }

  const toggleCam = () => {
    streamRef.current?.getVideoTracks().forEach((t) => { t.enabled = !camOn })
    setCamOn(!camOn)
  }

  const handleJoin = () => {
    if (!displayName.trim()) return
    stopStream()
    navigate(`/meeting/${roomId}`, {
      state: {
        displayName: displayName.trim(),
        micOn,
        camOn,
      },
    })
  }

  const copyCode = () => {
    navigator.clipboard.writeText(roomId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.origin + `/lobby/${roomId}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const avatarLetter = displayName ? displayName[0].toUpperCase() : '?'

  return (
    <div className='lobby-page'>
      {/* Video Preview */}
      <div className='lobby-preview fade-in'>
        <div className='lobby-video-wrap'>
          {!camError && camOn ? (
            <video ref={videoRef} autoPlay muted playsInline />
          ) : (
            <div className='lobby-no-cam'>
              <div
                style={{
                  width: 96, height: 96, borderRadius: '50%',
                  background: '#1a73e8', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: 40, fontWeight: 700, color: '#fff',
                }}
              >
                {avatarLetter}
              </div>
              <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                {camError ? 'Camera not available' : 'Camera is off'}
              </span>
            </div>
          )}

          {/* Controls overlay */}
          <div className='lobby-controls-overlay'>
            <button
              id='lobby-mic-btn'
              className={`ctrl-btn ${!micOn ? 'muted' : ''}`}
              onClick={toggleMic}
              title={micOn ? 'Mute mic' : 'Unmute mic'}
            >
              {micOn ? '🎤' : '🔇'}
            </button>
            <button
              id='lobby-cam-btn'
              className={`ctrl-btn ${!camOn ? 'muted' : ''}`}
              onClick={toggleCam}
              title={camOn ? 'Turn off camera' : 'Turn on camera'}
            >
              {camOn ? '📷' : '🚫'}
            </button>
          </div>
        </div>
      </div>

      {/* Info & Join */}
      <div className='lobby-info fade-up'>
        <h1>Ready to join?</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 15 }}>
          Others will see you as you look right now
        </p>

        <div
          className='code-badge'
          onClick={copyCode}
          title='Click to copy code'
        >
          <span>🔗</span>
          <span>Meeting code: <strong>{roomId}</strong></span>
          <span style={{ fontSize: 12 }}>{copied ? '✅' : '📋'}</span>
        </div>

        <div className='lobby-form'>
          <div className='form-group'>
            <label className='form-label'>Your name</label>
            <input
              id='display-name-input'
              className='input input-lg'
              placeholder='Enter your name'
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              autoFocus
            />
          </div>
        </div>

        <button
          id='lobby-join-btn'
          className='btn btn-primary lobby-join-btn'
          onClick={handleJoin}
          disabled={!displayName.trim()}
        >
          🚀 Join meeting
        </button>

        <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className='btn btn-ghost btn-sm' onClick={copyLink}>
            🔗 Copy invite link
          </button>
          <button
            className='btn btn-ghost btn-sm'
            onClick={() => navigate('/')}
          >
            ← Back to home
          </button>
        </div>

        {/* Status indicators */}
        <div style={{
          display: 'flex', gap: 16, marginTop: 20,
          padding: '12px 16px', background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)', border: '1px solid var(--border)',
        }}>
          <span style={{ fontSize: 13, color: micOn ? 'var(--success)' : 'var(--danger)' }}>
            {micOn ? '🎤 Mic on' : '🔇 Mic muted'}
          </span>
          <span style={{ fontSize: 13, color: camOn ? 'var(--success)' : 'var(--danger)' }}>
            {camOn ? '📷 Camera on' : '🚫 Camera off'}
          </span>
        </div>
      </div>
    </div>
  )
}
