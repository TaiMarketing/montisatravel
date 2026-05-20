import axios from 'axios'
import { assignTripToDriver, clearDriverTrip } from './authService'
import { reservationsSeed } from '../data/reservationsSeed'
import type { AppUser } from '../types/user'
import type { CreateReservationInput, Reservation, ReservationStatus } from '../types/reservation'

const STORAGE_KEY = 'stm_reservations'
const API_BASE_URL = import.meta.env.VITE_RESERVATIONS_API_URL

function readLocalReservations(): Reservation[] {
  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservationsSeed))
    return reservationsSeed
  }

  try {
    const parsed = JSON.parse(raw) as Reservation[]
    if (!Array.isArray(parsed)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reservationsSeed))
      return reservationsSeed
    }

    return parsed
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservationsSeed))
    return reservationsSeed
  }
}

function saveLocalReservations(reservations: Reservation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations))
}

function sortReservations(reservations: Reservation[]) {
  return [...reservations].sort((current, next) => next.createdAt.localeCompare(current.createdAt))
}

function generateReservationId() {
  return `R-${Math.floor(1000 + Math.random() * 9000)}`
}

export async function fetchReservations(): Promise<Reservation[]> {
  if (API_BASE_URL) {
    try {
      const { data } = await axios.get<Reservation[]>(`${API_BASE_URL}/reservations`)
      return sortReservations(data)
    } catch {
      return sortReservations(readLocalReservations())
    }
  }

  return sortReservations(readLocalReservations())
}

export async function updateReservationStatus(
  reservationId: string,
  status: ReservationStatus,
): Promise<Reservation[]> {
  if (API_BASE_URL) {
    try {
      await axios.patch(`${API_BASE_URL}/reservations/${reservationId}`, { status })
      return fetchReservations()
    } catch {
      const local = readLocalReservations().map((reservation) =>
        reservation.id === reservationId ? { ...reservation, status } : reservation,
      )

      const completedReservation = local.find((reservation) => reservation.id === reservationId)
      if (status === 'Completada' && completedReservation?.assignedDriverId) {
        clearDriverTrip(completedReservation.assignedDriverId)
      }

      saveLocalReservations(local)
      return sortReservations(local)
    }
  }

  const updated = readLocalReservations().map((reservation) =>
    reservation.id === reservationId ? { ...reservation, status } : reservation,
  )

  const completedReservation = updated.find((reservation) => reservation.id === reservationId)
  if (status === 'Completada' && completedReservation?.assignedDriverId) {
    clearDriverTrip(completedReservation.assignedDriverId)
  }

  saveLocalReservations(updated)
  return sortReservations(updated)
}

export async function createReservation(input: CreateReservationInput): Promise<Reservation> {
  const reservation: Reservation = {
    id: generateReservationId(),
    clientName: input.clientName.trim(),
    phone: input.phone.trim(),
    email: input.email.trim().toLowerCase(),
    pickup: input.pickup,
    destination: input.destination,
    date: input.date,
    time: input.time,
    passengers: input.passengers,
    luggage: input.luggage,
    notes: input.notes?.trim(),
    clientUserId: input.clientUserId,
    status: input.clientUserId ? 'Buscando chofer' : 'Pendiente de login',
    distanceKm: input.distanceKm,
    estimatedMinutes: input.estimatedMinutes,
    estimatedCost: input.estimatedCost,
    createdAt: new Date().toISOString(),
  }

  const updatedReservations = [reservation, ...readLocalReservations()]
  saveLocalReservations(updatedReservations)
  return reservation
}

export async function claimReservationsForClient(user: AppUser) {
  const updatedReservations = readLocalReservations().map((reservation) => {
    const isMatchingPendingReservation =
      reservation.email.toLowerCase() === user.email.toLowerCase() && !reservation.clientUserId

    if (!isMatchingPendingReservation) {
      return reservation
    }

    return {
      ...reservation,
      clientName: user.name,
      phone: user.phone,
      clientUserId: user.id,
      status: reservation.status === 'Pendiente de login' ? 'Buscando chofer' : reservation.status,
    }
  })

  saveLocalReservations(updatedReservations)
  return sortReservations(updatedReservations)
}

export async function fetchReservationsByClient(user: AppUser) {
  const reservations = await fetchReservations()
  return reservations.filter(
    (reservation) =>
      reservation.clientUserId === user.id || reservation.email.toLowerCase() === user.email.toLowerCase(),
  )
}

export async function fetchOpenReservationsForDrivers() {
  const reservations = await fetchReservations()
  return reservations.filter((reservation) => reservation.status === 'Buscando chofer')
}

export async function fetchDriverReservations(driverId: string) {
  const reservations = await fetchReservations()
  return reservations.filter((reservation) => reservation.assignedDriverId === driverId)
}

export async function assignDriverToReservation(reservationId: string, driver: AppUser) {
  const updatedReservations = readLocalReservations().map((reservation) =>
    reservation.id === reservationId
      ? {
          ...reservation,
          assignedDriverId: driver.id,
          assignedDriverName: driver.name,
          assignedVehicle: driver.vehicle,
          status: 'Chofer asignado' as ReservationStatus,
        }
      : reservation,
  )

  saveLocalReservations(updatedReservations)
  assignTripToDriver(driver.id, reservationId)
  return sortReservations(updatedReservations)
}
