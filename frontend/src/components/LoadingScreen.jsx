export default function LoadingScreen({ text = 'Loading…' }) {
  return (
    <div className='loading-screen'>
      <div style={{ marginBottom: 8 }}>
        <svg width='36' height='36' viewBox='0 0 28 28'>
          <rect width='12' height='12' rx='2' fill='#1a73e8'/>
          <rect x='16' width='12' height='12' rx='2' fill='#34a853'/>
          <rect y='16' width='12' height='12' rx='2' fill='#fbbc05'/>
          <rect x='16' y='16' width='12' height='12' rx='2' fill='#ea4335'/>
        </svg>
      </div>
      <div className='loading-spinner' />
      <p className='loading-text'>{text}</p>
    </div>
  )
}
