import { useState } from 'react'
import MapComponent from '../components/MapComponent'
import LocationPanel from '../components/LocationPanel'
import RideEstimation from '../components/RideEstimation'
import { createReservation } from '../services/reservationsService'
import type { AppUser } from '../types/user'
import type { Reservation } from '../types/reservation'
import './Transfer.css'

interface Location {
  lat: number
  lng: number
  address: string
  name?: string
}

interface TransferProps {
  currentUser: AppUser | null
  onReservationCreated: (reservation: Reservation) => void
}

export default function Transfer({ currentUser, onReservationCreated }: TransferProps) {
  const [origin, setOrigin] = useState<Location | null>(null)
  const [destination, setDestination] = useState<Location | null>(null)
  const [showEstimation, setShowEstimation] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [estimation, setEstimation] = useState({
    distance: 0,
    time: 0,
    cost: 0
  })

  const handleMapClick = (lat: number, lng: number) => {
    if (!origin) {
      setOrigin({ lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` })
    } else if (!destination) {
      setDestination({ lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` })
    }
  }

  const handleRequestRide = (_origAddress: string, _destAddress: string) => {
    if (origin && destination) {
      const distance = calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng)
      const time = Math.ceil(distance / 30 * 60)
      const cost = Math.round((distance * 15 + 5) * 100) / 100

      setEstimation({ distance, time, cost })
      setShowEstimation(true)
    }
  }

  const handleReset = () => {
    setOrigin(null)
    setDestination(null)
    setShowEstimation(false)
    setBookingError('')
  }

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const earthRadiusKm = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return earthRadiusKm * c
  }

  const handleConfirmReservation = async (bookingDetails: {
    clientName: string
    phone: string
    email: string
    date: string
    time: string
    passengers: number
    luggage: number
    notes: string
  }) => {
    if (!origin || !destination) return

    try {
      setBookingError('')
      const reservation = await createReservation({
        clientName: bookingDetails.clientName,
        phone: bookingDetails.phone,
        email: bookingDetails.email,
        pickup: origin.name || origin.address,
        destination: destination.name || destination.address,
        date: bookingDetails.date,
        time: bookingDetails.time,
        passengers: bookingDetails.passengers,
        luggage: bookingDetails.luggage,
        notes: bookingDetails.notes,
        clientUserId: currentUser?.role === 'client' ? currentUser.id : undefined,
        distanceKm: estimation.distance,
        estimatedMinutes: estimation.time,
        estimatedCost: estimation.cost,
      })

      handleReset()
      onReservationCreated(reservation)
    } catch {
      setBookingError('No se pudo registrar la reserva. Intenta nuevamente.')
    }
  }

  return (
    <div className="transfer-container">
      <div className="transfer-content">
        <MapComponent
          origin={origin}
          destination={destination}
          onMapClick={handleMapClick}
        />

        {!showEstimation ? (
          <LocationPanel
            origin={origin}
            destination={destination}
            onOriginChange={setOrigin}
            onDestinationChange={setDestination}
            onRequestRide={handleRequestRide}
            onReset={handleReset}
          />
        ) : (
          <RideEstimation
            origin={origin}
            destination={destination}
            estimation={estimation}
            currentUser={currentUser}
            onClose={handleReset}
            onConfirm={handleConfirmReservation}
          />
        )}

        {bookingError && <p className="booking-error-banner">{bookingError}</p>}
      </div>
    </div>
  )
}
