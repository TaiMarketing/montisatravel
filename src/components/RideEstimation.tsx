import { useEffect, useState } from 'react'
import { Clock, MapPin, DollarSign, ChevronLeft } from 'lucide-react'
import type { AppUser } from '../types/user'
import './RideEstimation.css'

interface Location {
  lat: number
  lng: number
  address: string
  name?: string
}

interface Estimation {
  distance: number
  time: number
  cost: number
}

interface RideEstimationProps {
  origin: Location | null
  destination: Location | null
  estimation: Estimation
  currentUser: AppUser | null
  onClose: () => void
  onConfirm: (bookingDetails: {
    clientName: string
    phone: string
    email: string
    date: string
    time: string
    passengers: number
    luggage: number
    notes: string
  }) => void
}

export default function RideEstimation({
  origin,
  destination,
  estimation,
  currentUser,
  onClose,
  onConfirm
}: RideEstimationProps) {
  const [clientName, setClientName] = useState(currentUser?.name ?? '')
  const [phone, setPhone] = useState(currentUser?.phone ?? '')
  const [email, setEmail] = useState(currentUser?.email ?? '')
  const [passengers, setPassengers] = useState(1)
  const [luggage, setLuggage] = useState(1)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    setClientName(currentUser?.name ?? '')
    setPhone(currentUser?.phone ?? '')
    setEmail(currentUser?.email ?? '')
  }, [currentUser])

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${Math.round(minutes)} min`
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${Math.round(mins)}m`
  }

  return (
    <div className="ride-estimation">
      <button className="close-btn" onClick={onClose}>
        <ChevronLeft size={24} />
      </button>

      <div className="estimation-content">
        <h2 className="estimation-title">Estimacion del Viaje</h2>

        {/* Route Info */}
        <div className="route-info">
          <div className="location-item origin-item">
            <div className="location-marker origin-marker"></div>
            <div className="location-details">
              <span className="location-label">Desde</span>
              <p className="location-address">{origin?.name || origin?.address}</p>
            </div>
          </div>

          <div className="route-line"></div>

          <div className="location-item destination-item">
            <div className="location-marker destination-marker"></div>
            <div className="location-details">
              <span className="location-label">Hacia</span>
              <p className="location-address">{destination?.name || destination?.address}</p>
            </div>
          </div>
        </div>

        {/* Estimation Cards */}
        <div className="estimation-cards">
          <div className="estimation-card distance">
            <div className="card-icon">
              <MapPin size={24} />
            </div>
            <div className="card-content">
              <span className="card-label">Distancia</span>
              <p className="card-value">{estimation.distance.toFixed(2)} km</p>
            </div>
          </div>

          <div className="estimation-card time">
            <div className="card-icon">
              <Clock size={24} />
            </div>
            <div className="card-content">
              <span className="card-label">Tiempo Est.</span>
              <p className="card-value">{formatTime(estimation.time)}</p>
            </div>
          </div>

          <div className="estimation-card cost">
            <div className="card-icon">
              <DollarSign size={24} />
            </div>
            <div className="card-content">
              <span className="card-label">Costo Est.</span>
              <p className="card-value">${estimation.cost.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="estimation-note">
          <p>* Los precios son estimados y pueden variar segun el trafico y disponibilidad.</p>
        </div>

        <div className="booking-form">
          <h3>Datos para reservar</h3>
          <div className="booking-grid">
            <label>
              Nombre completo
              <input value={clientName} onChange={(event) => setClientName(event.target.value)} required />
            </label>
            <label>
              Telefono
              <input value={phone} onChange={(event) => setPhone(event.target.value)} required />
            </label>
            <label>
              Correo electronico
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <label>
              Pasajeros
              <input
                type="number"
                min="1"
                max="12"
                value={passengers}
                onChange={(event) => setPassengers(Number(event.target.value))}
                required
              />
            </label>
            <label>
              Maletas
              <input
                type="number"
                min="0"
                max="20"
                value={luggage}
                onChange={(event) => setLuggage(Number(event.target.value))}
                required
              />
            </label>
            <label className="booking-notes-field">
              Notas adicionales
              <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} />
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="estimation-actions">
          <button
            className="confirm-btn"
            onClick={() =>
              onConfirm({
                clientName,
                phone,
                email,
                date: new Date().toISOString().slice(0, 10),
                time: 'Inmediata',
                passengers,
                luggage,
                notes,
              })
            }
            disabled={!clientName || !phone || !email}
          >
            Confirmar Viaje
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Volver
          </button>
        </div>
      </div>
    </div>
  )
}
