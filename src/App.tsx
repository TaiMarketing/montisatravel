import { useState } from 'react'
import { getCurrentUser, logoutUser } from './services/authService'
import { claimReservationsForClient } from './services/reservationsService'
import Home from './pages/Home'
import Transfer from './pages/Transfer'
import TourDetails from './pages/TourDetails'
import Reservations from './pages/Reservations'
import Auth from './pages/Auth'
import MyTrips from './pages/MyTrips'
import Drivers from './pages/Drivers'
import Header from './components/Header'
import { toursSeed } from './data/toursSeed'
import type { Reservation } from './types/reservation'
import type { AppUser } from './types/user'
import './App.css'

type Page = 'home' | 'tour-detail' | 'transfer' | 'reservations' | 'auth' | 'my-trips' | 'drivers'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => getCurrentUser())
  const [authPrefilledEmail, setAuthPrefilledEmail] = useState('')
  const [authNotice, setAuthNotice] = useState('')

  const handleNavigate = (page: Page) => {
    if (page === 'reservations' && currentUser?.role !== 'admin') {
      return
    }

    if (page === 'my-trips' && (!currentUser || currentUser.role !== 'client')) {
      setAuthNotice('Inicia sesion como cliente para ver tus reservas y el estado de tus viajes.')
      setCurrentPage('auth')
      return
    }

    if (page === 'drivers' && (!currentUser || currentUser.role !== 'driver')) {
      setAuthNotice('Entra con tu cuenta de chofer para gestionar tus viajes asignados.')
      setCurrentPage('auth')
      return
    }

    setAuthNotice('')
    setCurrentPage(page)
  }

  const handleOpenTour = (tourId: string) => {
    setSelectedTourId(tourId)
    setCurrentPage('tour-detail')
  }

  const handleReservationCreated = (reservation: Reservation) => {
    if (currentUser?.role === 'client') {
      setCurrentPage('my-trips')
      setAuthNotice('')
      return
    }

    setAuthPrefilledEmail(reservation.email)
    setAuthNotice('Tu reserva fue registrada. Ahora inicia sesion o crea tu cuenta para verla en Mis viajes y activar la busqueda de chofer.')
    setCurrentPage('auth')
  }

  const handleAuthenticated = async (user: AppUser) => {
    setCurrentUser(user)

    if (user.role === 'admin') {
      setAuthNotice('')
      setCurrentPage('reservations')
      return
    }

    if (user.role === 'client') {
      await claimReservationsForClient(user)
      setAuthNotice('')
      setCurrentPage('my-trips')
      return
    }

    setAuthNotice('')
    setCurrentPage('drivers')
  }

  const handleLogout = () => {
    logoutUser()
    setCurrentUser(null)
    setAuthNotice('')
    setCurrentPage(currentPage === 'reservations' ? 'home' : 'home')
  }

  const renderPage = () => {
    if (currentPage === 'tour-detail') {
      const selectedTour = toursSeed.find((tour) => tour.id === selectedTourId)

      if (!selectedTour) {
        return <Home onNavigateTransfer={() => handleNavigate('transfer')} onOpenTour={handleOpenTour} />
      }

      return (
        <TourDetails
          tour={selectedTour}
          onBack={() => handleNavigate('home')}
          onNavigateTransfer={() => handleNavigate('transfer')}
          onOpenTour={handleOpenTour}
        />
      )
    }

    if (currentPage === 'transfer') {
      return <Transfer currentUser={currentUser?.role === 'client' ? currentUser : null} onReservationCreated={handleReservationCreated} />
    }

    if (currentPage === 'reservations') {
      return <Reservations />
    }

    if (currentPage === 'auth') {
      return (
        <Auth
          prefilledEmail={authPrefilledEmail}
          notice={authNotice}
          onAuthenticated={(user) => {
            void handleAuthenticated(user)
          }}
        />
      )
    }

    if (currentPage === 'my-trips') {
      return (
        <MyTrips
          user={currentUser?.role === 'client' ? currentUser : null}
          onNavigateHome={() => handleNavigate('home')}
          onNavigateAuth={() => handleNavigate('auth')}
        />
      )
    }

    if (currentPage === 'drivers') {
      return (
        <Drivers
          user={currentUser?.role === 'driver' ? currentUser : null}
          onNavigateAuth={() => handleNavigate('auth')}
          onUserUpdated={setCurrentUser}
        />
      )
    }

    return <Home onNavigateTransfer={() => handleNavigate('transfer')} onOpenTour={handleOpenTour} />
  }

  return (
    <div className="app-container">
      <Header currentPage={currentPage} onNavigate={handleNavigate} currentUser={currentUser} onLogout={handleLogout} />
      <main className={`app-main${currentPage !== 'home' ? ' app-main--padded' : ''}`}>
        {renderPage()}
      </main>
    </div>
  )
}

export default App
