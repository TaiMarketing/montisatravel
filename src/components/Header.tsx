import { useState, useEffect, useRef } from 'react'
import { UserCircle, Settings, HelpCircle, LogOut } from 'lucide-react'
import type { AppUser } from '../types/user'
import './Header.css'

interface HeaderProps {
  currentPage: 'home' | 'tour-detail' | 'transfer' | 'reservations' | 'auth' | 'my-trips' | 'drivers'
  onNavigate: (page: 'home' | 'transfer' | 'reservations' | 'auth' | 'my-trips' | 'drivers') => void
  currentUser: AppUser | null
  onLogout: () => void
  isScrolled?: boolean
}

export default function Header({ currentPage, onNavigate, currentUser, onLogout, isScrolled = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  const handleLogout = () => {
    setIsMenuOpen(false)
    onLogout()
  }

  return (
    <div className={`header${isScrolled ? ' header-scrolled' : ''}`}>
      {currentUser && (
        <div className="user-menu-wrapper user-menu-top-left" ref={menuRef}>
          <button
            type="button"
            className="user-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menu de usuario"
          >
            <UserCircle size={24} />
          </button>

          {isMenuOpen && (
            <div className="user-dropdown user-dropdown-top-left">
              <div className="user-dropdown-header">
                <p className="user-dropdown-name">{currentUser.name}</p>
                <p className="user-dropdown-role">
                  {currentUser.role === 'driver' ? 'Chofer' : currentUser.role === 'admin' ? 'Admin' : 'Cliente'}
                </p>
              </div>

              <div className="user-dropdown-divider" />

              <button type="button" className="dropdown-item">
                <UserCircle size={18} />
                <span>Perfil</span>
              </button>

              <button type="button" className="dropdown-item">
                <Settings size={18} />
                <span>Ajustes</span>
              </button>

              <button type="button" className="dropdown-item">
                <HelpCircle size={18} />
                <span>Atención al cliente</span>
              </button>

              <div className="user-dropdown-divider" />

              <button type="button" className="dropdown-item logout" onClick={handleLogout}>
                <LogOut size={18} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      )}
      <div className="header-content">
        <div className="header-center-logo" aria-hidden="true">
          <img src="/img/logo-transparente.png" alt="Montisa Travel" className="logo" />
        </div>

        <nav className="header-nav" aria-label="Navegacion principal">
          <button
            type="button"
            className={`nav-button ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => onNavigate('home')}
          >
            Inicio
          </button>
          <button
            type="button"
            className={`nav-button ${currentPage === 'transfer' ? 'active' : ''}`}
            onClick={() => onNavigate('transfer')}
          >
            Transfer
          </button>
          {currentUser?.role === 'admin' && (
            <button
              type="button"
              className={`nav-button ${currentPage === 'reservations' ? 'active' : ''}`}
              onClick={() => onNavigate('reservations')}
            >
              Reservas
            </button>
          )}
          {currentUser && (
            <button
              type="button"
              className={`nav-button ${currentPage === 'my-trips' ? 'active' : ''}`}
              onClick={() => onNavigate('my-trips')}
            >
              Mis viajes
            </button>
          )}
          {currentUser?.role === 'admin' && (
            <button
              type="button"
              className={`nav-button ${currentPage === 'drivers' ? 'active' : ''}`}
              onClick={() => onNavigate('drivers')}
            >
              Choferes
            </button>
          )}
        </nav>

        <div className="session-box">
          {!currentUser && (
            <button
              type="button"
              className={`nav-button ${currentPage === 'auth' ? 'active' : ''}`}
              onClick={() => onNavigate('auth')}
            >
              Iniciar sesion
            </button>
          )}
        </div>
      </div>
    </div>
  )
}