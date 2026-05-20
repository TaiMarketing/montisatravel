import { useEffect, useState } from 'react'
import { fetchReservationsByClient } from '../services/reservationsService'
import { getAvailableDrivers } from '../services/authService'
import type { Reservation } from '../types/reservation'
import type { AppUser } from '../types/user'
import './MyTrips.css'

interface MyTripsProps {
  user: AppUser | null
  onNavigateHome: () => void
  onNavigateAuth: () => void
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('es-DO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function MyTrips({ user, onNavigateHome, onNavigateAuth }: MyTripsProps) {
  const [trips, setTrips] = useState<Reservation[]>([])
  const [availableDriversCount, setAvailableDriversCount] = useState(0)

  useEffect(() => {
    if (!user) return

    const loadTrips = async () => {
      const reservations = await fetchReservationsByClient(user)
      setTrips(reservations)
      setAvailableDriversCount(getAvailableDrivers().length)
    }

    void loadTrips()
  }, [user])

  if (!user) {
    return (
      <section className="my-trips-page empty-page">
        <div className="empty-card">
          <h2>Inicia sesion para ver tus viajes</h2>
          <p>Tus reservas aparecen en esta seccion una vez entras con tu cuenta de cliente.</p>
          <button type="button" onClick={onNavigateAuth}>Ir a iniciar sesion</button>
        </div>
      </section>
    )
  }

  return (
    <section className="my-trips-page">
      <header className="my-trips-header">
        <div>
          <p className="eyebrow">Mis viajes</p>
          <h2>{user.name}, aqui esta el estado de tus reservas</h2>
          <p>Cuando un viaje entra en busqueda, los choferes disponibles pueden aceptarlo desde su portal.</p>
        </div>
        <button type="button" className="new-trip-btn" onClick={onNavigateHome}>Pedir otro viaje</button>
      </header>

      {trips.length === 0 ? (
        <div className="empty-card">
          <h3>Aun no tienes viajes asociados a tu cuenta</h3>
          <p>Haz una reserva y luego vuelve aqui para seguir su progreso.</p>
        </div>
      ) : (
        <div className="trips-grid">
          {trips.map((trip) => (
            <article className="trip-card" key={trip.id}>
              <div className="trip-top-row">
                <span className="trip-id">{trip.id}</span>
                <span className={`trip-status status-${trip.status.toLowerCase().replace(/\s+/g, '-')}`}>{trip.status}</span>
              </div>

              <h3>{trip.pickup}</h3>
              <p className="trip-destination">Hacia {trip.destination}</p>

              <div className="trip-meta">
                <p><strong>Fecha:</strong> {formatDate(trip.date)}</p>
                <p><strong>Hora:</strong> {trip.time}</p>
                <p><strong>Pasajeros:</strong> {trip.passengers}</p>
                <p><strong>Costo estimado:</strong> US${trip.estimatedCost.toFixed(2)}</p>
              </div>

              {trip.status === 'Buscando chofer' && (
                <p className="trip-highlight">Buscando entre {availableDriversCount} choferes disponibles.</p>
              )}

              {trip.assignedDriverName && (
                <div className="driver-assigned-box">
                  <p><strong>Chofer:</strong> {trip.assignedDriverName}</p>
                  {trip.assignedVehicle && <p><strong>Vehiculo:</strong> {trip.assignedVehicle}</p>}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
