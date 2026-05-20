import { useEffect, useMemo, useState } from 'react'
import { fetchReservations, updateReservationStatus, assignDriverToReservation } from '../services/reservationsService'
import { getAllDrivers, createDriver } from '../services/authService'
import type { Reservation, ReservationStatus } from '../types/reservation'
import type { AppUser } from '../types/user'
import './Reservations.css'

const statusOptions: Array<ReservationStatus | 'Todas'> = [
  'Todas',
  'Pendiente de login',
  'Buscando chofer',
  'Chofer asignado',
  'En camino',
  'Completada',
]

function getNextStatus(status: ReservationStatus): ReservationStatus | null {
  if (status === 'Pendiente de login') return 'Buscando chofer'
  if (status === 'Chofer asignado') return 'En camino'
  if (status === 'En camino') return 'Completada'
  return null
}

function toStatusClassName(status: ReservationStatus) {
  return status.toLowerCase().replace(/\s+/g, '-')
}

function formatIsoDate(isoDate: string) {
  const date = new Date(`${isoDate}T00:00:00`)
  return date.toLocaleDateString('es-DO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default function Reservations() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [drivers, setDrivers] = useState<AppUser[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'Todas'>('Todas')
  const [dateFilter, setDateFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedDriver, setSelectedDriver] = useState<Record<string, string>>({})

  // Create driver form
  const [showCreateDriver, setShowCreateDriver] = useState(false)
  const [driverName, setDriverName] = useState('')
  const [driverEmail, setDriverEmail] = useState('')
  const [driverPhone, setDriverPhone] = useState('')
  const [driverPassword, setDriverPassword] = useState('')
  const [driverVehicle, setDriverVehicle] = useState('')
  const [driverPlate, setDriverPlate] = useState('')
  const [driverError, setDriverError] = useState('')
  const [driverSuccess, setDriverSuccess] = useState('')

  useEffect(() => {
    const loadReservations = async () => {
      try {
        setLoading(true)
        setErrorMessage('')
        const data = await fetchReservations()
        setReservations(data)
        setDrivers(getAllDrivers())
      } catch {
        setErrorMessage('No se pudieron cargar las reservas.')
      } finally {
        setLoading(false)
      }
    }

    void loadReservations()
  }, [])

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const matchesStatus = statusFilter === 'Todas' || reservation.status === statusFilter
      const matchesDate = !dateFilter || reservation.date === dateFilter
      const search = searchTerm.trim().toLowerCase()
      const matchesSearch =
        !search ||
        reservation.id.toLowerCase().includes(search) ||
        reservation.clientName.toLowerCase().includes(search) ||
        reservation.email.toLowerCase().includes(search) ||
        reservation.phone.toLowerCase().includes(search) ||
        reservation.pickup.toLowerCase().includes(search) ||
        reservation.destination.toLowerCase().includes(search)

      return matchesStatus && matchesDate && matchesSearch
    })
  }, [reservations, searchTerm, statusFilter, dateFilter])

  const reservationStats = useMemo(() => {
    return {
      total: reservations.length,
      nuevas: reservations.filter((reservation) => reservation.status === 'Pendiente de login').length,
      activas: reservations.filter(
        (reservation) =>
          reservation.status === 'Buscando chofer' ||
          reservation.status === 'Chofer asignado' ||
          reservation.status === 'En camino',
      ).length,
      completadas: reservations.filter((reservation) => reservation.status === 'Completada').length,
    }
  }, [reservations])

  const handleAdvanceStatus = async (reservation: Reservation) => {
    const nextStatus = getNextStatus(reservation.status)
    if (!nextStatus) return

    try {
      setUpdatingId(reservation.id)
      setErrorMessage('')
      const updatedReservations = await updateReservationStatus(reservation.id, nextStatus)
      setReservations(updatedReservations)
    } catch {
      setErrorMessage('No se pudo actualizar el estado de la reserva.')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleAssignDriver = async (reservation: Reservation) => {
    const driverId = selectedDriver[reservation.id]
    if (!driverId) return

    const driver = drivers.find((d) => d.id === driverId)
    if (!driver) return

    try {
      setUpdatingId(reservation.id)
      setErrorMessage('')
      const updatedReservations = await assignDriverToReservation(reservation.id, driver)
      setReservations(updatedReservations)
      setSelectedDriver((prev) => { const next = { ...prev }; delete next[reservation.id]; return next })
    } catch {
      setErrorMessage('No se pudo asignar el chofer.')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleCreateDriver = () => {
    setDriverError('')
    setDriverSuccess('')
    try {
      createDriver({
        name: driverName,
        email: driverEmail,
        phone: driverPhone,
        password: driverPassword,
        vehicle: driverVehicle,
        plate: driverPlate,
      })
      setDrivers(getAllDrivers())
      setDriverSuccess(`Chofer "${driverName}" creado correctamente.`)
      setDriverName(''); setDriverEmail(''); setDriverPhone('')
      setDriverPassword(''); setDriverVehicle(''); setDriverPlate('')
    } catch (err) {
      setDriverError(err instanceof Error ? err.message : 'No se pudo crear el chofer.')
    }
  }

  return (
    <section className="reservations-page">
      <header className="reservations-header">
        <div>
          <h2>Reservas de clientes</h2>
          <p>Vista administrativa con todas las solicitudes recibidas.</p>
        </div>
        <button type="button" className="create-driver-toggle" onClick={() => { setShowCreateDriver(!showCreateDriver); setDriverError(''); setDriverSuccess('') }}>
          {showCreateDriver ? 'Cerrar' : '+ Agregar chofer'}
        </button>
      </header>

      {showCreateDriver && (
        <section className="create-driver-form">
          <h3>Nuevo chofer</h3>
          <div className="create-driver-grid">
            <label>Nombre<input value={driverName} onChange={(e) => setDriverName(e.target.value)} required /></label>
            <label>Email<input type="email" value={driverEmail} onChange={(e) => setDriverEmail(e.target.value)} required /></label>
            <label>Telefono<input value={driverPhone} onChange={(e) => setDriverPhone(e.target.value)} required /></label>
            <label>Contrasena<input type="password" value={driverPassword} onChange={(e) => setDriverPassword(e.target.value)} required /></label>
            <label>Vehiculo<input value={driverVehicle} onChange={(e) => setDriverVehicle(e.target.value)} placeholder="Toyota Hiace" required /></label>
            <label>Placa<input value={driverPlate} onChange={(e) => setDriverPlate(e.target.value)} placeholder="A123456" required /></label>
          </div>
          {driverError && <p className="reservation-error">{driverError}</p>}
          {driverSuccess && <p className="driver-success">{driverSuccess}</p>}
          <button type="button" className="create-driver-submit" onClick={handleCreateDriver}
            disabled={!driverName || !driverEmail || !driverPhone || !driverPassword || !driverVehicle || !driverPlate}>
            Crear chofer
          </button>
        </section>
      )}

      <section className="reservations-stats" aria-label="Resumen de reservas">
        <article className="stat-card">
          <p>Total</p>
          <strong>{reservationStats.total}</strong>
        </article>
        <article className="stat-card">
          <p>Nuevas</p>
          <strong>{reservationStats.nuevas}</strong>
        </article>
        <article className="stat-card">
          <p>Activas</p>
          <strong>{reservationStats.activas}</strong>
        </article>
        <article className="stat-card">
          <p>Completadas</p>
          <strong>{reservationStats.completadas}</strong>
        </article>
      </section>

      <section className="reservations-filters" aria-label="Filtros de reservas">
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Buscar por cliente, ID, telefono, email o ruta"
          aria-label="Buscar reservas"
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as ReservationStatus | 'Todas')}
          aria-label="Filtrar por estado"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(event) => setDateFilter(event.target.value)}
          aria-label="Filtrar por fecha"
        />

        <button
          type="button"
          className="clear-filters"
          onClick={() => {
            setSearchTerm('')
            setStatusFilter('Todas')
            setDateFilter('')
          }}
        >
          Limpiar
        </button>
      </section>

      {errorMessage && <p className="reservation-error">{errorMessage}</p>}

      {loading ? (
        <p className="reservation-empty">Cargando reservas...</p>
      ) : filteredReservations.length === 0 ? (
        <p className="reservation-empty">No hay resultados con los filtros seleccionados.</p>
      ) : (
      <div className="reservations-grid">
        {filteredReservations.map((reservation) => {
          return (
          <article className="reservation-card" key={reservation.id}>
            <div className="reservation-top-row">
              <span className="reservation-id">{reservation.id}</span>
              <span className={`reservation-status status-${toStatusClassName(reservation.status)}`}>
                {reservation.status}
              </span>
            </div>

            <h3>{reservation.clientName}</h3>

            <div className="reservation-info">
              <p><strong>Telefono:</strong> {reservation.phone}</p>
              <p><strong>Email:</strong> {reservation.email}</p>
              <p><strong>Recogida:</strong> {reservation.pickup}</p>
              <p><strong>Destino:</strong> {reservation.destination}</p>
              <p><strong>Fecha:</strong> {formatIsoDate(reservation.date)}</p>
              <p><strong>Hora:</strong> {reservation.time}</p>
              <p><strong>Pasajeros:</strong> {reservation.passengers}</p>
              <p><strong>Maletas:</strong> {reservation.luggage}</p>
              <p><strong>Costo:</strong> US${reservation.estimatedCost.toFixed(2)}</p>
            </div>

            {reservation.notes && (
              <p className="reservation-notes">
                <strong>Nota:</strong> {reservation.notes}
              </p>
            )}

            {reservation.assignedDriverName && (
              <p className="reservation-notes">
                <strong>Chofer:</strong> {reservation.assignedDriverName}
                {reservation.assignedVehicle ? ` · ${reservation.assignedVehicle}` : ''}
              </p>
            )}

            <div className="reservation-actions">
              {reservation.status === 'Buscando chofer' ? (
                <div className="assign-driver-row">
                  <select
                    value={selectedDriver[reservation.id] ?? ''}
                    onChange={(event) => setSelectedDriver((prev) => ({ ...prev, [reservation.id]: event.target.value }))}
                  >
                    <option value="">Selecciona un chofer...</option>
                    {drivers.filter((d) => d.isAvailable).map((d) => (
                      <option key={d.id} value={d.id}>{d.name} · {d.vehicle}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="advance-status"
                    disabled={!selectedDriver[reservation.id] || updatingId === reservation.id}
                    onClick={() => void handleAssignDriver(reservation)}
                  >
                    {updatingId === reservation.id ? 'Asignando...' : 'Asignar'}
                  </button>
                </div>
              ) : getNextStatus(reservation.status) ? (
                <button
                  type="button"
                  className="advance-status"
                  disabled={updatingId === reservation.id}
                  onClick={() => void handleAdvanceStatus(reservation)}
                >
                  {updatingId === reservation.id ? 'Actualizando...' : `Mover a ${getNextStatus(reservation.status)}`}
                </button>
              ) : (
                <span className="done-label">Reserva finalizada</span>
              )}
            </div>
          </article>
          )
        })}
      </div>
      )}
    </section>
  )
}
