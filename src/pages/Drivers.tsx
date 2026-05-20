import { useEffect, useState } from 'react'
import { fetchDriverReservations, updateReservationStatus } from '../services/reservationsService'
import { updateDriverAvailability } from '../services/authService'
import type { Reservation } from '../types/reservation'
import type { AppUser } from '../types/user'
import './Drivers.css'

interface DriversProps {
  user: AppUser | null
  onNavigateAuth: () => void
  onUserUpdated: (user: AppUser) => void
}

function getActionLabel(status: Reservation['status']) {
  if (status === 'Chofer asignado') return 'Marcar en camino'
  if (status === 'En camino') return 'Completar viaje'
  return null
}

function getNextStatus(status: Reservation['status']) {
  if (status === 'Chofer asignado') return 'En camino'
  if (status === 'En camino') return 'Completada'
  return null
}

export default function Drivers({ user, onNavigateAuth, onUserUpdated }: DriversProps) {
  const [myTrips, setMyTrips] = useState<Reservation[]>([])

  const loadDriverData = async (currentUser: AppUser) => {
    const assignedTrips = await fetchDriverReservations(currentUser.id)
    setMyTrips(assignedTrips.filter((trip) => trip.status !== 'Completada'))
  }

  useEffect(() => {
    if (!user || user.role !== 'driver') return
    void loadDriverData(user)
  }, [user])

  if (!user || user.role !== 'driver') {
    return (
      <section className="drivers-page empty-page">
        <div className="empty-card">
          <h2>Portal de choferes</h2>
          <p>Accede con una cuenta de chofer para recibir reservas y gestionar viajes.</p>
          <button type="button" onClick={onNavigateAuth}>Entrar como chofer</button>
        </div>
      </section>
    )
  }

  const activeTrip = myTrips[0]

  return (
    <section className="drivers-page">
      <header className="drivers-header">
        <div>
          <p className="eyebrow">Chofer</p>
          <h2>{user.name}</h2>
          <p>{user.vehicle} · {user.plate}</p>
        </div>
        <label className="availability-switch">
          <span>{user.isAvailable ? 'Disponible' : 'Fuera de linea'}</span>
          <input
            type="checkbox"
            checked={Boolean(user.isAvailable)}
            onChange={(event) => {
              const updatedUser = updateDriverAvailability(user.id, event.target.checked)
              if (updatedUser) {
                onUserUpdated(updatedUser)
                void loadDriverData(updatedUser)
              }
            }}
          />
        </label>
      </header>

      {activeTrip && (
        <section className="driver-section">
          <div className="section-heading">
            <h3>Viaje activo</h3>
          </div>
          <article className="driver-trip-card highlighted">
            <div className="trip-heading-row">
              <strong>{activeTrip.clientName}</strong>
              <span className={`trip-status status-${activeTrip.status.toLowerCase().replace(/\s+/g, '-')}`}>{activeTrip.status}</span>
            </div>
            <p><strong>Recogida:</strong> {activeTrip.pickup}</p>
            <p><strong>Destino:</strong> {activeTrip.destination}</p>
            <p><strong>Contacto:</strong> {activeTrip.phone}</p>
            <p><strong>Costo:</strong> US${activeTrip.estimatedCost.toFixed(2)}</p>
            {getActionLabel(activeTrip.status) && (
              <button
                type="button"
                className="driver-action-btn"
                onClick={async () => {
                  const nextStatus = getNextStatus(activeTrip.status)
                  if (!nextStatus) return
                  await updateReservationStatus(activeTrip.id, nextStatus)
                  if (nextStatus === 'Completada') {
                    const updatedUser = updateDriverAvailability(user.id, true)
                    if (updatedUser) {
                      onUserUpdated(updatedUser)
                      void loadDriverData(updatedUser)
                    }
                  } else {
                    void loadDriverData(user)
                  }
                }}
              >
                {getActionLabel(activeTrip.status)}
              </button>
            )}
          </article>
        </section>
      )}

      {!activeTrip && (
        <div className="empty-card small">
          <p>No tienes viajes asignados en este momento. El administrador te asignará reservas.</p>
        </div>
      )}
    </section>
  )
}
