import { usersSeed } from '../data/usersSeed'
import type { AppUser, UserSession } from '../types/user'

const USERS_STORAGE_KEY = 'stm_users'
const SESSION_STORAGE_KEY = 'stm_session'

function readUsers(): AppUser[] {
  const raw = localStorage.getItem(USERS_STORAGE_KEY)

  if (!raw) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersSeed))
    return usersSeed
  }

  try {
    const parsed = JSON.parse(raw) as AppUser[]
    if (!Array.isArray(parsed)) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersSeed))
      return usersSeed
    }

    return parsed
  } catch {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersSeed))
    return usersSeed
  }
}

function saveUsers(users: AppUser[]) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

function readSession(): UserSession | null {
  const raw = localStorage.getItem(SESSION_STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as UserSession
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    return null
  }
}

function saveSession(session: UserSession | null) {
  if (!session) {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    return
  }

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
}

function withoutPassword(user: AppUser): AppUser {
  return user
}

export function getCurrentSession() {
  return readSession()
}

export function getCurrentUser() {
  const session = readSession()
  if (!session) return null

  const user = readUsers().find((currentUser) => currentUser.id === session.userId)
  return user ? withoutPassword(user) : null
}

export function loginUser(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase()
  const user = readUsers().find(
    (currentUser) =>
      currentUser.email.toLowerCase() === normalizedEmail &&
      currentUser.password === password,
  )

  if (!user) {
    throw new Error('Correo o contrasena incorrectos.')
  }

  saveSession({ userId: user.id, role: user.role })
  return withoutPassword(user)
}

export function createDriver(input: {
  name: string
  email: string
  phone: string
  password: string
  vehicle: string
  plate: string
}) {
  const users = readUsers()
  const normalizedEmail = input.email.trim().toLowerCase()

  const existingUser = users.find((user) => user.email.toLowerCase() === normalizedEmail)
  if (existingUser) {
    throw new Error('Ya existe un usuario registrado con este correo.')
  }

  const newDriver: AppUser = {
    id: `driver-${Date.now()}`,
    name: input.name.trim(),
    email: normalizedEmail,
    password: input.password,
    phone: input.phone.trim(),
    role: 'driver',
    isAvailable: true,
    vehicle: input.vehicle.trim(),
    plate: input.plate.trim(),
    currentTripId: null,
  }

  const updatedUsers = [newDriver, ...users]
  saveUsers(updatedUsers)
  return withoutPassword(newDriver)
}

export function registerClient(input: {
  name: string
  email: string
  phone: string
  password: string
}) {
  const users = readUsers()
  const normalizedEmail = input.email.trim().toLowerCase()

  const existingUser = users.find((user) => user.email.toLowerCase() === normalizedEmail)
  if (existingUser) {
    throw new Error('Ya existe una cuenta registrada con este correo.')
  }

  const newUser: AppUser = {
    id: `client-${Date.now()}`,
    name: input.name.trim(),
    email: normalizedEmail,
    password: input.password,
    phone: input.phone.trim(),
    role: 'client',
  }

  const updatedUsers = [newUser, ...users]
  saveUsers(updatedUsers)
  saveSession({ userId: newUser.id, role: newUser.role })
  return withoutPassword(newUser)
}

export function logoutUser() {
  saveSession(null)
}

export function getAvailableDrivers() {
  return readUsers().filter((user) => user.role === 'driver' && user.isAvailable)
}

export function getAllDrivers() {
  return readUsers().filter((user) => user.role === 'driver')
}

export function updateDriverAvailability(driverId: string, isAvailable: boolean) {
  const updatedUsers = readUsers().map((user) =>
    user.id === driverId
      ? {
          ...user,
          isAvailable,
          currentTripId: isAvailable ? null : user.currentTripId ?? null,
        }
      : user,
  )

  saveUsers(updatedUsers)
  return updatedUsers.find((user) => user.id === driverId) ?? null
}

export function assignTripToDriver(driverId: string, reservationId: string) {
  const updatedUsers = readUsers().map((user) =>
    user.id === driverId
      ? { ...user, currentTripId: reservationId, isAvailable: false }
      : user,
  )

  saveUsers(updatedUsers)
  return updatedUsers.find((user) => user.id === driverId) ?? null
}

export function clearDriverTrip(driverId: string) {
  const updatedUsers = readUsers().map((user) =>
    user.id === driverId
      ? { ...user, currentTripId: null, isAvailable: true }
      : user,
  )

  saveUsers(updatedUsers)
  return updatedUsers.find((user) => user.id === driverId) ?? null
}
