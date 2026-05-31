import { useState } from 'react'

export default function InviteModal({ roomId, onClose }) {
  const meetingLink = `${window.location.origin}/lobby/${roomId}`
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  const copyLink = () => {
    navigator.clipboard.writeText(meetingLink)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(roomId)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  return (
    <div className='modal-overlay' onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className='modal-box fade-in'>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <h2 className='modal-title'>🔗 Share meeting</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', color: 'var(--text-secondary)',
              cursor: 'pointer', fontSize: 22, lineHeight: 1, padding: '0 4px',
            }}
          >
            ✕
          </button>
        </div>
        <p className='modal-subtitle'>
          Share the link or code with people you want in this meeting
        </p>

        {/* Meeting Link */}
        <div style={{ marginBottom: 8 }}>
          <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
            Meeting link
          </label>
        </div>
        <div className='copy-field'>
          <input
            className='input'
            readOnly
            value={meetingLink}
            onFocus={(e) => e.target.select()}
            id='meeting-link-input'
          />
          <button
            id='copy-link-btn'
            className={`btn ${copiedLink ? 'btn-outline' : 'btn-primary'} btn-sm`}
            onClick={copyLink}
          >
            {copiedLink ? '✅ Copied!' : '📋 Copy'}
          </button>
        </div>

        {/* Meeting Code */}
        <div style={{ marginBottom: 8 }}>
          <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
            Meeting code
          </label>
        </div>
        <div className='copy-field'>
          <input
            className='input'
            readOnly
            value={roomId}
            style={{ fontFamily: 'monospace', fontSize: 15, letterSpacing: 2 }}
            onFocus={(e) => e.target.select()}
            id='meeting-code-input'
          />
          <button
            id='copy-code-btn'
            className={`btn ${copiedCode ? 'btn-outline' : 'btn-ghost'} btn-sm`}
            onClick={copyCode}
          >
            {copiedCode ? '✅ Copied!' : '📋 Copy'}
          </button>
        </div>

        {/* Info */}
        <div style={{
          background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)', padding: '12px 16px',
          fontSize: 13, color: 'var(--text-secondary)',
          display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 8,
        }}>
          <span>ℹ️</span>
          <span>Only share with people you trust. Anyone with this link can join the meeting.</span>
        </div>

        <div className='modal-close-row'>
          <button id='close-invite-modal' className='btn btn-ghost' onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
