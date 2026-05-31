const AVATAR_COLORS = ['#1a73e8','#34a853','#9334e6','#ea4335','#fbbc05','#0097a7','#e91e63','#ff5722']

function getAvatarColor(name = '') {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}

export default function ParticipantsPanel({ participants, localIdentity, displayName, onClose }) {
  const total = participants.length

  return (
    <div className='side-panel slide-in-right'>
      {/* Header */}
      <div className='panel-header'>
        <span>👥 People</span>
        <button className='panel-close' onClick={onClose} title='Close'>✕</button>
      </div>

      <div className='participants-count'>
        {total} participant{total !== 1 ? 's' : ''} in this call
      </div>

      {/* List */}
      <div className='participants-list'>
        {participants.map((p) => {
          const isLocal = p.identity === localIdentity
          const name = isLocal ? displayName : (p.name || p.identity || 'Guest')
          const letter = name[0]?.toUpperCase() || 'G'
          const color = getAvatarColor(name)
          const micOn = p.isMicrophoneEnabled
          const camOn = p.isCameraEnabled

          return (
            <div key={p.identity} className='participant-item'>
              <div className='participant-item-avatar' style={{ background: color }}>
                {letter}
              </div>
              <div className='participant-item-info'>
                <div className='participant-item-name'>
                  {name}
                  {isLocal && (
                    <span style={{
                      marginLeft: 6, fontSize: 11,
                      color: 'var(--text-muted)',
                      fontWeight: 400,
                    }}>
                      (You)
                    </span>
                  )}
                </div>
                <div className='participant-item-role'>
                  {isLocal ? 'Host · You' : 'Participant'}
                </div>
              </div>
              <div className='participant-item-icons'>
                <span
                  title={micOn ? 'Microphone on' : 'Microphone muted'}
                  className={!micOn ? 'muted-icon' : ''}
                >
                  {micOn ? '🎤' : '🔇'}
                </span>
                <span
                  title={camOn ? 'Camera on' : 'Camera off'}
                  style={{ color: camOn ? 'var(--text-muted)' : 'var(--danger)' }}
                >
                  {camOn ? '📷' : '🚫'}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Invite */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
        <button
          className='btn btn-ghost'
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={() => {
            navigator.clipboard.writeText(window.location.href)
          }}
        >
          🔗 Copy invite link
        </button>
      </div>
    </div>
  )
}
