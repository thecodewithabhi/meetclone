import { useIsSpeaking, VideoTrack } from '@livekit/components-react'
import { Track } from 'livekit-client'

export default function ParticipantTile({
  trackRef,
  participant,
  isLocal,
  displayName,
  avatarColor,
  compact = false,
}) {
  const isSpeaking = useIsSpeaking(participant)
  const isCamEnabled = participant?.isCameraEnabled ?? false
  const isMicEnabled = participant?.isMicrophoneEnabled ?? false
  const isPlaceholder = !trackRef?.publication

  const letter = (displayName || 'G')[0].toUpperCase()

  return (
    <div
      className={`participant-tile${isSpeaking ? ' speaking' : ''}${isLocal ? ' local-tile' : ''}${!isCamEnabled ? ' cam-off' : ''}`}
    >
      {/* Video */}
      {!isPlaceholder && isCamEnabled && trackRef?.publication && (
        <VideoTrack
          trackRef={trackRef}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: isLocal ? 'scaleX(-1)' : 'none',
          }}
        />
      )}

      {/* Avatar fallback when cam off or no video */}
      {(!isCamEnabled || isPlaceholder) && (
        <div className='tile-avatar'>
          <div
            className='tile-avatar-inner'
            style={{
              background: avatarColor,
              width: compact ? 44 : 72,
              height: compact ? 44 : 72,
              fontSize: compact ? 18 : 30,
            }}
          >
            {letter}
          </div>
        </div>
      )}

      {/* Bottom info bar */}
      <div className='tile-info'>
        <div className='tile-name'>
          {displayName}
          {isLocal ? ' (You)' : ''}
        </div>
        <div className={`tile-mic-icon${!isMicEnabled ? ' muted' : ''}`}>
          {isMicEnabled ? '🎤' : '🔇'}
        </div>
      </div>

      {/* Speaking indicator ring is done via CSS animation on .speaking */}
    </div>
  )
}
