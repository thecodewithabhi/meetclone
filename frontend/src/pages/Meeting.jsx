import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { LiveKitRoom } from '@livekit/components-react'
import api from '../services/api'
import MeetingRoom from '../components/MeetingRoom'
import LoadingScreen from '../components/LoadingScreen'

const LIVEKIT_URL = 'ws://localhost:7880'

export default function Meeting() {
  const { roomId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const state = location.state || {}
  const displayName = state.displayName || `Guest-${Math.floor(Math.random() * 9999)}`
  const initMic = state.micOn !== false
  const initCam = state.camOn !== false

  const [token, setToken] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchToken()
  }, [])

  const fetchToken = async () => {
    try {
      const res = await api.get('/livekit/token', {
        params: { room_name: roomId, user_name: displayName },
      })
      setToken(res.data.token)
    } catch (e) {
      setError('Failed to connect. Make sure the backend & LiveKit are running.')
    }
  }

  if (error) {
    return (
      <div className='loading-screen'>
        <div style={{ fontSize: 48 }}>⚠️</div>
        <div className='loading-text' style={{ color: 'var(--danger)', textAlign: 'center', maxWidth: 400 }}>
          {error}
        </div>
        <button className='btn btn-ghost' onClick={() => navigate('/')}>
          ← Go Home
        </button>
      </div>
    )
  }

  if (!token) return <LoadingScreen text='Connecting to meeting…' />

  return (
    <LiveKitRoom
      token={token}
      serverUrl={LIVEKIT_URL}
      connect={true}
      video={initCam}
      audio={initMic}
      onDisconnected={() => navigate('/')}
      style={{ height: '100vh', background: '#0d0e12' }}
    >
      <MeetingRoom
        roomId={roomId}
        displayName={displayName}
        initMic={initMic}
        initCam={initCam}
      />
    </LiveKitRoom>
  )
}
