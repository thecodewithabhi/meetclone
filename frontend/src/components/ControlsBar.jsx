export default function ControlsBar({
  isMicOn,
  isCamOn,
  isScreenOn,
  isRaisingHand,
  unreadCount,
  chatOpen,
  participantsOpen,
  participantCount,
  onToggleMic,
  onToggleCam,
  onToggleScreen,
  onToggleChat,
  onToggleParticipants,
  onRaiseHand,
  onInvite,
  onLeave,
}) {
  return (
    <div className='controls-bar'>
      {/* ── Left: Media Controls ── */}
      <div className='controls-section'>
        <div className='ctrl-wrap'>
          <button
            id='ctrl-mic'
            className={`ctrl-btn${!isMicOn ? ' muted' : ''}`}
            onClick={onToggleMic}
            title={isMicOn ? 'Mute microphone' : 'Unmute microphone'}
          >
            {isMicOn ? '🎤' : '🔇'}
          </button>
          <span className='ctrl-label'>{isMicOn ? 'Mute' : 'Unmute'}</span>
        </div>

        <div className='ctrl-wrap'>
          <button
            id='ctrl-cam'
            className={`ctrl-btn${!isCamOn ? ' muted' : ''}`}
            onClick={onToggleCam}
            title={isCamOn ? 'Turn off camera' : 'Turn on camera'}
          >
            {isCamOn ? '📷' : '🚫'}
          </button>
          <span className='ctrl-label'>{isCamOn ? 'Stop video' : 'Start video'}</span>
        </div>

        <div className='ctrl-wrap'>
          <button
            id='ctrl-screen'
            className={`ctrl-btn${isScreenOn ? ' active' : ''}`}
            onClick={onToggleScreen}
            title={isScreenOn ? 'Stop screen share' : 'Share your screen'}
          >
            🖥️
          </button>
          <span className='ctrl-label'>{isScreenOn ? 'Stop share' : 'Share screen'}</span>
        </div>
      </div>

      <div className='controls-divider' />

      {/* ── Center: Extras ── */}
      <div className='controls-section'>
        <div className='ctrl-wrap' style={{ position: 'relative' }}>
          <button
            id='ctrl-chat'
            className={`ctrl-btn${chatOpen ? ' active' : ''}`}
            onClick={onToggleChat}
            title='In-call messages'
          >
            💬
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: 0, right: 0,
                background: 'var(--danger)', color: '#fff',
                width: 18, height: 18, borderRadius: '50%',
                fontSize: 11, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #0d0e12',
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <span className='ctrl-label'>Chat</span>
        </div>

        <div className='ctrl-wrap'>
          <button
            id='ctrl-participants'
            className={`ctrl-btn${participantsOpen ? ' active' : ''}`}
            onClick={onToggleParticipants}
            title='Show participants'
          >
            👥
            {participantCount > 0 && (
              <span style={{
                position: 'absolute', top: 0, right: 0,
                background: 'var(--bg-hover)', color: 'var(--text-secondary)',
                width: 18, height: 18, borderRadius: '50%',
                fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #0d0e12',
              }}>
                {participantCount}
              </span>
            )}
          </button>
          <span className='ctrl-label'>People</span>
        </div>

        <div className='ctrl-wrap'>
          <button
            id='ctrl-hand'
            className={`ctrl-btn${isRaisingHand ? ' active' : ''}`}
            onClick={onRaiseHand}
            title={isRaisingHand ? 'Lower hand' : 'Raise hand'}
          >
            ✋
          </button>
          <span className='ctrl-label'>{isRaisingHand ? 'Lower hand' : 'Raise hand'}</span>
        </div>

        <div className='ctrl-wrap'>
          <button
            id='ctrl-invite'
            className='ctrl-btn'
            onClick={onInvite}
            title='Invite people'
          >
            🔗
          </button>
          <span className='ctrl-label'>Invite</span>
        </div>
      </div>

      <div className='controls-divider' />

      {/* ── Right: Leave ── */}
      <div className='controls-section'>
        <div className='ctrl-wrap'>
          <button
            id='ctrl-leave'
            className='ctrl-btn danger-btn'
            onClick={onLeave}
            title='Leave meeting'
          >
            📞
          </button>
          <span className='ctrl-label' style={{ color: 'var(--danger)' }}>Leave</span>
        </div>
      </div>
    </div>
  )
}
