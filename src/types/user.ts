export type UserRole = 'client' | 'driver' | 'admin'

export interface AppUser {
  id: string
  name: string
  email: string
  password: string
  phone: string
  role: UserRole
  isAvailable?: boolean
  vehicle?: string
  plate?: string
  currentTripId?: string | null
}

export interface UserSession {
  userId: string
  role: UserRole
}
