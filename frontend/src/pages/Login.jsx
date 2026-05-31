import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(form.email, form.password)
    setLoading(false)
    if (result.success) navigate('/')
    else setError(result.error)
  }

  return (
    <div className='auth-page'>
      <div className='auth-card'>
        <div className='auth-logo'>
          <svg width='32' height='32' viewBox='0 0 28 28' fill='currentColor'>
            <rect width='12' height='12' rx='2' fill='#1a73e8'/>
            <rect x='16' width='12' height='12' rx='2' fill='#34a853'/>
            <rect y='16' width='12' height='12' rx='2' fill='#fbbc05'/>
            <rect x='16' y='16' width='12' height='12' rx='2' fill='#ea4335'/>
          </svg>
          <span>Meet<em>Clone</em></span>
        </div>

        <h1 className='auth-title'>Welcome back</h1>
        <p className='auth-subtitle'>Sign in to your account to continue</p>

        {error && <div className='auth-error'>⚠️ {error}</div>}

        <form className='auth-form' onSubmit={handleSubmit}>
          <div className='form-group'>
            <label className='form-label'>Email address</label>
            <input
              id='login-email'
              className='input'
              type='email'
              placeholder='you@example.com'
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className='form-group'>
            <label className='form-label'>Password</label>
            <input
              id='login-password'
              className='input'
              type='password'
              placeholder='••••••••'
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            id='login-submit'
            type='submit'
            className='btn btn-primary'
            style={{ marginTop: 8, padding: '13px' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className='auth-footer'>
          Don't have an account?{' '}
          <Link to='/register'>Create one</Link>
        </div>
        <div className='auth-footer' style={{ marginTop: 8 }}>
          <Link to='/'>← Back to home</Link>
        </div>
      </div>
    </div>
  )
}
