import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useParticipants,
  useLocalParticipant,
  useTracks,
  useRoomContext,
  VideoTrack,
} from '@livekit/components-react'
import { Track } from 'livekit-client'
import ControlsBar from './ControlsBar'
import ChatPanel from './ChatPanel'
import ParticipantsPanel from './ParticipantsPanel'
import InviteModal from './InviteModal'
import ParticipantTile from './ParticipantTile'

const AVATAR_COLORS = ['#1a73e8','#34a853','#9334e6','#ea4335','#fbbc05','#0097a7','#e91e63','#ff5722']

function getAvatarColor(name = '') {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}

function useTimer() {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
}

export default function MeetingRoom({ roomId, displayName, initMic, initCam }) {
  const navigate = useNavigate()
  const room = useRoomContext()
  const { localParticipant, isMicrophoneEnabled, isCameraEnabled } = useLocalParticipant()
  const participants = useParticipants()
  const timer = useTimer()

  // All camera tracks (local + remote)
  const cameraTracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: true }],
    { onlySubscribed: false }
  )

  // Screen share tracks
  const screenTracks = useTracks(
    [{ source: Track.Source.ScreenShare, withPlaceholder: false }],
    { onlySubscribed: false }
  )

  const isScreenSharing = screenTracks.length > 0
  const activeScreenTrack = screenTracks[0] || null

  // UI state
  const [isMicOn, setIsMicOn] = useState(initMic)
  const [isCamOn, setIsCamOn] = useState(initCam)
  const [isScreenOn, setIsScreenOn] = useState(false)
  const [panel, setPanel] = useState(null) // 'chat' | 'participants' | null
  const [showInvite, setShowInvite] = useState(false)
  const [messages, setMessages] = useState([])
  const [unread, setUnread] = useState(0)
  const [isRaisingHand, setIsRaisingHand] = useState(false)

  // Data channel for chat
  useEffect(() => {
    if (!room) return
    const handleData = (payload) => {
      try {
        const data = JSON.parse(new TextDecoder().decode(payload))
        if (data.type === 'chat') {
          setMessages((prev) => [...prev, data])
          if (panel !== 'chat') setUnread((u) => u + 1)
        }
      } catch (_) {}
    }
    room.on('dataReceived', handleData)
    return () => room.off('dataReceived', handleData)
  }, [room, panel])

  const toggleMic = useCallback(async () => {
    await localParticipant?.setMicrophoneEnabled(!isMicrophoneEnabled)
    setIsMicOn(!isMicrophoneEnabled)
  }, [localParticipant, isMicrophoneEnabled])

  const toggleCam = useCallback(async () => {
    await localParticipant?.setCameraEnabled(!isCameraEnabled)
    setIsCamOn(!isCameraEnabled)
  }, [localParticipant, isCameraEnabled])

  const toggleScreenShare = useCallback(async () => {
    try {
      await localParticipant?.setScreenShareEnabled(!isScreenOn)
      setIsScreenOn(!isScreenOn)
    } catch (_) {}
  }, [localParticipant, isScreenOn])

  const togglePanel = (name) => {
    if (name === 'chat') setUnread(0)
    setPanel((p) => (p === name ? null : name))
  }

  const leaveMeeting = useCallback(() => {
    room?.disconnect()
    navigate('/')
  }, [room, navigate])

  const sendMessage = useCallback((text) => {
    if (!text.trim() || !room) return
    const msg = {
      type: 'chat',
      sender: displayName,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      self: true,
    }
    setMessages((prev) => [...prev, msg])
    const encoded = new TextEncoder().encode(JSON.stringify({ ...msg, self: false }))
    room.localParticipant?.publishData(encoded, { reliable: true })
  }, [room, displayName])

  // Build participant list for tiles
  const allParticipants = [room?.localParticipant, ...participants].filter(Boolean)

  // Grid class
  const count = cameraTracks.length
  const gridClass =
    count === 1 ? 'count-1' :
    count === 2 ? 'count-2' :
    count === 3 ? 'count-3' :
    count === 4 ? 'count-4' :
    count <= 6 ? 'count-5' : 'count-many'

  return (
    <div className='meeting-page'>
      {/* ── Top Bar ── */}
      <div className='meeting-topbar'>
        <div className='meeting-topbar-left'>
          <div className='meeting-logo'>
            <svg width='22' height='22' viewBox='0 0 28 28'>
              <rect width='12' height='12' rx='2' fill='#1a73e8'/>
              <rect x='16' width='12' height='12' rx='2' fill='#34a853'/>
              <rect y='16' width='12' height='12' rx='2' fill='#fbbc05'/>
              <rect x='16' y='16' width='12' height='12' rx='2' fill='#ea4335'/>
            </svg>
            MeetClone
          </div>

          <button
            className='meeting-code-badge'
            onClick={() => setShowInvite(true)}
            title='Click to share'
          >
            <span>🔗</span>
            <strong>{roomId}</strong>
            <span>📋</span>
          </button>
        </div>

        <div className='meeting-timer'>{timer}</div>

        <div className='meeting-topbar-right'>
          {isScreenSharing && (
            <span className='badge badge-primary' style={{ fontSize: 12 }}>
              📺 Screen sharing
            </span>
          )}
          <button
            className='ctrl-btn'
            style={{ width: 36, height: 36, fontSize: 16 }}
            onClick={() => setShowInvite(true)}
            title='Invite people'
          >
            👥
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className={`meeting-body${isScreenSharing ? ' screenshare-active' : ''}`}>

        {/* Screen Share Main View */}
        {isScreenSharing && activeScreenTrack ? (
          <>
            <div className='screenshare-main'>
              <VideoTrack trackRef={activeScreenTrack} />
            </div>
            <div className='screenshare-sidebar'>
              {cameraTracks.map((trackRef) => {
                const p = trackRef.participant
                if (!p) return null
                const isLocal = p.identity === room?.localParticipant?.identity
                return (
                  <ParticipantTile
                    key={p.identity}
                    trackRef={trackRef}
                    participant={p}
                    isLocal={isLocal}
                    displayName={isLocal ? displayName : p.name || p.identity}
                    avatarColor={getAvatarColor(p.name || p.identity)}
                    compact
                  />
                )
              })}
            </div>
          </>
        ) : (
          /* Normal Grid View */
          <div className={`participants-grid ${gridClass}`}>
            {cameraTracks.map((trackRef) => {
              const p = trackRef.participant
              if (!p) return null
              const isLocal = p.identity === room?.localParticipant?.identity
              return (
                <ParticipantTile
                  key={p.identity}
                  trackRef={trackRef}
                  participant={p}
                  isLocal={isLocal}
                  displayName={isLocal ? displayName : p.name || p.identity}
                  avatarColor={getAvatarColor(p.name || p.identity)}
                />
              )
            })}
          </div>
        )}

        {/* Side Panel */}
        {panel === 'chat' && (
          <ChatPanel
            messages={messages}
            onSend={sendMessage}
            onClose={() => togglePanel('chat')}
            displayName={displayName}
          />
        )}
        {panel === 'participants' && (
          <ParticipantsPanel
            participants={allParticipants}
            localIdentity={room?.localParticipant?.identity}
            displayName={displayName}
            onClose={() => togglePanel('participants')}
          />
        )}
      </div>

      {/* ── Controls Bar ── */}
      <ControlsBar
        isMicOn={isMicrophoneEnabled}
        isCamOn={isCameraEnabled}
        isScreenOn={isScreenOn}
        isRaisingHand={isRaisingHand}
        unreadCount={unread}
        chatOpen={panel === 'chat'}
        participantsOpen={panel === 'participants'}
        participantCount={allParticipants.length}
        onToggleMic={toggleMic}
        onToggleCam={toggleCam}
        onToggleScreen={toggleScreenShare}
        onToggleChat={() => togglePanel('chat')}
        onToggleParticipants={() => togglePanel('participants')}
        onRaiseHand={() => setIsRaisingHand((r) => !r)}
        onInvite={() => setShowInvite(true)}
        onLeave={leaveMeeting}
      />

      {/* ── Invite Modal ── */}
      {showInvite && (
        <InviteModal roomId={roomId} onClose={() => setShowInvite(false)} />
      )}
    </div>
  )
}
