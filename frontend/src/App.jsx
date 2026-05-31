import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Lobby from './pages/Lobby'
import Meeting from './pages/Meeting'
import './index.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/lobby/:roomId' element={<Lobby />} />
          <Route path='/meeting/:roomId' element={<Meeting />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App