import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className='navbar'>
      <Link to='/' className='navbar-logo'>
        <svg width='28' height='28' viewBox='0 0 28 28' fill='currentColor'>
          <rect width='12' height='12' rx='2' fill='#1a73e8'/>
          <rect x='16' width='12' height='12' rx='2' fill='#34a853'/>
          <rect y='16' width='12' height='12' rx='2' fill='#fbbc05'/>
          <rect x='16' y='16' width='12' height='12' rx='2' fill='#ea4335'/>
        </svg>
        <span>Meet<em>Clone</em></span>
      </Link>

      <div className='navbar-actions'>
        {user ? (
          <>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              👋 {user.name}
            </span>
            <button className='btn btn-ghost btn-sm' onClick={logout}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to='/login' className='btn btn-ghost btn-sm'>Sign in</Link>
            <Link to='/register' className='btn btn-primary btn-sm'>Get started</Link>
          </>
        )}
      </div>
    </nav>
  )
}
