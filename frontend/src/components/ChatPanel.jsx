import { useState, useRef, useEffect } from 'react'

export default function ChatPanel({ messages, onSend, onClose, displayName }) {
  const [text, setText] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!text.trim()) return
    onSend(text)
    setText('')
  }

  return (
    <div className='side-panel slide-in-right'>
      {/* Header */}
      <div className='panel-header'>
        <span>💬 In-call messages</span>
        <button className='panel-close' onClick={onClose} title='Close chat'>✕</button>
      </div>

      {/* Messages */}
      <div className='chat-messages'>
        {messages.length === 0 ? (
          <div className='chat-empty'>
            <div className='chat-empty-icon'>💬</div>
            <p style={{ fontSize: 14 }}>No messages yet</p>
            <p style={{ fontSize: 12, textAlign: 'center' }}>
              Messages are visible to everyone in the call
            </p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isSelf = msg.self || msg.sender === displayName
            return (
              <div key={i} className={`chat-msg${isSelf ? ' self' : ''}`}>
                <div className='chat-msg-meta'>
                  {!isSelf && <strong style={{ color: 'var(--text-primary)' }}>{msg.sender} · </strong>}
                  {msg.time}
                </div>
                <div className='chat-msg-bubble'>{msg.text}</div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className='chat-input-row'>
        <input
          id='chat-input'
          className='input'
          placeholder='Send a message…'
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
          autoComplete='off'
        />
        <button
          id='chat-send-btn'
          className='chat-send-btn'
          onClick={handleSend}
          disabled={!text.trim()}
          title='Send message'
        >
          ➤
        </button>
      </div>
    </div>
  )
}
