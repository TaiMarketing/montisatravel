export type ReservationStatus =
  | 'Pendiente de login'
  | 'Buscando chofer'
  | 'Chofer asignado'
  | 'En camino'
  | 'Completada'

export interface Reservation {
  id: string
  clientName: string
  phone: string
  email: string
  pickup: string
  destination: string
  date: string
  time: string
  passengers: number
  luggage: number
  status: ReservationStatus
  clientUserId?: string
  assignedDriverId?: string
  assignedDriverName?: string
  assignedVehicle?: string
  distanceKm: number
  estimatedMinutes: number
  estimatedCost: number
  createdAt: string
  notes?: string
}

export interface CreateReservationInput {
  clientName: string
  phone: string
  email: string
  pickup: string
  destination: string
  date: string
  time: string
  passengers: number
  luggage: number
  notes?: string
  clientUserId?: string
  distanceKm: number
  estimatedMinutes: number
  estimatedCost: number
}
