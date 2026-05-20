import { useEffect, useState } from 'react'
import { loginUser, registerClient } from '../services/authService'
import type { AppUser } from '../types/user'
import './Auth.css'

interface AuthProps {
  prefilledEmail?: string
  notice?: string
  onAuthenticated: (user: AppUser) => void
}

export default function Auth({ prefilledEmail = '', notice = '', onAuthenticated }: AuthProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState(prefilledEmail)
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setEmail(prefilledEmail)
  }, [prefilledEmail])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    try {
      if (mode === 'register') {
        const user = registerClient({ name, phone, email, password })
        onAuthenticated(user)
        return
      }

      const user = loginUser(email, password)
      onAuthenticated(user)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo iniciar sesion.')
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-heading">
          <p className="eyebrow">Cuenta Montisa</p>
          <h2>{mode === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}</h2>
          <p>
            {mode === 'login'
              ? 'Ingresa con tu correo y contrasena. El sistema te llevara a tu area automaticamente.'
              : 'Solo los clientes pueden crear su propia cuenta desde aqui.'}
          </p>
        </div>

        {notice && <div className="auth-notice">{notice}</div>}

        <div className="mode-toggle">
          <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
            Iniciar sesion
          </button>
          <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>
            Crear cuenta
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <label>
                Nombre completo
                <input value={name} onChange={(event) => setName(event.target.value)} required />
              </label>
              <label>
                Telefono
                <input value={phone} onChange={(event) => setPhone(event.target.value)} required />
              </label>
            </>
          )}

          <label>
            Correo electronico
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>

          <label>
            Contrasena
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>

          {errorMessage && <p className="auth-error">{errorMessage}</p>}

          <button type="submit" className="auth-submit">
            {mode === 'register' ? 'Crear cuenta y entrar' : 'Entrar'}
          </button>
        </form>

        <div className="demo-credentials">
          <h3>Cuentas demo</h3>
          <p><strong>Cliente:</strong> laura.fernandez@gmail.com / cliente123</p>
          <p><strong>Chofer:</strong> miguel.rosario@montisa.com / chofer123</p>
          <p><strong>Admin:</strong> admin@montisa.com / admin2026</p>
        </div>
      </div>
    </section>
  )
}
