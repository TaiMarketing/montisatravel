import type { AppUser } from '../types/user'

export const usersSeed: AppUser[] = [
  {
    id: 'client-001',
    name: 'Laura Fernandez',
    email: 'laura.fernandez@gmail.com',
    password: 'cliente123',
    phone: '+1 (829) 555-1983',
    role: 'client',
  },
  {
    id: 'client-002',
    name: 'Carlos Mejia',
    email: 'cmejia@outlook.com',
    password: 'cliente123',
    phone: '+1 (809) 555-3020',
    role: 'client',
  },
  {
    id: 'driver-001',
    name: 'Miguel Rosario',
    email: 'miguel.rosario@montisa.com',
    password: 'chofer123',
    phone: '+1 (829) 555-4001',
    role: 'driver',
    isAvailable: true,
    vehicle: 'Toyota Hiace',
    plate: 'A123456',
    currentTripId: null,
  },
  {
    id: 'admin-001',
    name: 'Admin Montisa',
    email: 'admin@montisa.com',
    password: 'admin2026',
    phone: '+1 (809) 000-0001',
    role: 'admin',
  },
  {
    id: 'driver-002',
    name: 'Daniela Cruz',
    email: 'daniela.cruz@montisa.com',
    password: 'chofer123',
    phone: '+1 (829) 555-4002',
    role: 'driver',
    isAvailable: true,
    vehicle: 'Chevrolet Suburban',
    plate: 'B654321',
    currentTripId: null,
  }
]
