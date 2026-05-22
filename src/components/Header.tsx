import { useState, useEffect, useRef } from 'react'
import { UserCircle, Settings, HelpCircle, LogOut } from 'lucide-react'
import type { AppUser } from '../types/user'
import './Header.css'

interface HeaderProps {
  currentPage: 'home' | 'tour-detail' | 'transfer' | 'reservations' | 'auth' | 'my-trips' | 'drivers'
  onNavigate: (page: 'home' | 'transfer' | 'reservations' | 'auth' | 'my-trips' | 'drivers') => void
  currentUser: AppUser | null
  onLogout: () => void
}

export default function Header({ currentPage, onNavigate, currentUser, onLogout }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mainEl = document.querySelector('.app-main') as HTMLElement | null
    if (!mainEl) return
    const handleScroll = () => setIsScrolled(mainEl.scrollTop > 80)
    mainEl.addEventListener('scroll', handleScroll, { passive: true })
    return () => mainEl.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])

  const handleLogout = () => {
    setIsMenuOpen(false)
    onLogout()
  }

  const handleCloseMenu = () => {
    setIsMenuOpen(false)
  }

  const handleNavigate = (page: 'home' | 'transfer' | 'reservations' | 'auth' | 'my-trips' | 'drivers') => {
    setIsMenuOpen(false)
    onNavigate(page)
  }

  const isOnHero = currentPage === 'home' && !isScrolled
  const headerClass = [
    'header',
    isOnHero ? 'on-hero' : '',
    isScrolled ? 'scrolled' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={headerClass}>
      <div className="header-content">
        <div className="header-center-logo" aria-hidden="true">
          <img src="/img/logo-transparente.png" alt="Montisa Travel" className="logo" />
        </div>

        <div className="user-menu-wrapper user-menu-top-right" ref={menuRef}>
          <button
            type="button"
            className="user-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menu de perfil"
          >
            <UserCircle size={20} />
            <span>{currentUser ? 'Perfil' : 'Menu'}</span>
          </button>

          {isMenuOpen && (
            <div className="user-dropdown user-dropdown-top-right">
              {currentUser && (
                <div className="user-dropdown-header">
                  <p className="user-dropdown-name">{currentUser.name}</p>
                  <p className="user-dropdown-role">
                    {currentUser.role === 'driver' ? 'Chofer' : currentUser.role === 'admin' ? 'Admin' : 'Cliente'}
                  </p>
                </div>
              )}

              <div className="user-dropdown-divider" />

              <button type="button" className={`dropdown-item ${currentPage === 'home' ? 'active' : ''}`} onClick={() => handleNavigate('home')}>
                <span>Inicio</span>
              </button>

              <button type="button" className={`dropdown-item ${currentPage === 'transfer' ? 'active' : ''}`} onClick={() => handleNavigate('transfer')}>
                <span>Transfer</span>
              </button>

              {currentUser?.role === 'admin' && (
                <button type="button" className={`dropdown-item ${currentPage === 'reservations' ? 'active' : ''}`} onClick={() => handleNavigate('reservations')}>
                  <span>Reservas</span>
                </button>
              )}

              {currentUser && (
                <button type="button" className={`dropdown-item ${currentPage === 'my-trips' ? 'active' : ''}`} onClick={() => handleNavigate('my-trips')}>
                  <span>Mis viajes</span>
                </button>
              )}

              {currentUser?.role === 'admin' && (
                <button type="button" className={`dropdown-item ${currentPage === 'drivers' ? 'active' : ''}`} onClick={() => handleNavigate('drivers')}>
                  <span>Choferes</span>
                </button>
              )}

              {!currentUser && (
                <button type="button" className={`dropdown-item ${currentPage === 'auth' ? 'active' : ''}`} onClick={() => handleNavigate('auth')}>
                  <span>Iniciar sesion</span>
                </button>
              )}

              <div className="user-dropdown-divider" />

              <button type="button" className="dropdown-item" onClick={handleCloseMenu}>
                <Settings size={18} />
                <span>Ajustes</span>
              </button>

              <button type="button" className="dropdown-item" onClick={handleCloseMenu}>
                <HelpCircle size={18} />
                <span>Atencion al cliente</span>
              </button>

              {currentUser && (
                <button type="button" className="dropdown-item logout" onClick={handleLogout}>
                  <LogOut size={18} />
                  <span>Cerrar sesion</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}