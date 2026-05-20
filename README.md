# Montisa Travel - Transfers & Ride Sharing

A modern, premium web application for ride-sharing and transfer services in Punta Cana, Dominican Republic.

## Features

- **Interactive Map**: Real-time map visualization using Leaflet/OpenStreetMap
- **Location Selection**: 
  - Search from a list of popular hotels and hotspots in Punta Cana
  - Click directly on the map to select locations
  - Support for custom location entry
- **Ride Estimation**: 
  - Distance calculation
  - Time estimation
  - Cost estimation
- **Reservations Dashboard**:
  - List of all incoming reservations with customer info
  - Search and filters by text, status and date
  - Operational actions to move reservations through workflow statuses
  - Persistent storage with API support (and local fallback)
- **Client Authentication**:
  - Login and client account creation after booking
  - Automatic linking of guest reservations to the logged-in client
  - Dedicated "Mis viajes" area with live trip state
- **Driver Portal**:
  - Driver login with availability toggle
  - Queue of reservations waiting for assignment
  - Actions to accept, start and complete rides
- **Responsive Design**: Premium, elegant UI that works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: CSS with CSS variables for theming
- **Maps**: Leaflet + OpenStreetMap
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Header.tsx      # App header with logo and navigation
│   ├── MapComponent.tsx # Interactive map
│   ├── LocationPanel.tsx # Location selection interface
│   └── RideEstimation.tsx # Trip estimation + booking form
├── data/
│   └── reservationsSeed.ts # Seed data for reservations fallback
│   └── usersSeed.ts    # Seed data for clients and drivers
├── pages/               # Page components
│   └── Home.tsx        # Main home page
│   └── Auth.tsx        # Login and client signup page
│   └── MyTrips.tsx     # Client trip history and active trips
│   └── Drivers.tsx     # Driver portal and assignment board
│   └── Reservations.tsx # Reservations admin page
├── services/
│   └── authService.ts  # Session, login and driver availability persistence
│   └── reservationsService.ts # API + local persistence service
├── types/
│   └── reservation.ts  # Reservation domain types
│   └── user.ts         # User and session types
├── App.tsx             # Root app component
├── main.tsx            # React entry point
└── index.css           # Global styles
```

## Reservations Data Source

The reservations module supports two data modes:

1. API mode (recommended for production): set `VITE_RESERVATIONS_API_URL`.
2. Local fallback mode (default): uses browser localStorage with seed records.

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Expected API endpoints:

- `GET /reservations`
- `PATCH /reservations/:id` with `{ status: "Pendiente de login" | "Buscando chofer" | "Chofer asignado" | "En camino" | "Completada" }`

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

1. **Select Origin**: Click on a hotel/location from the list or click on the map
2. **Select Destination**: Choose your destination from the available options
3. **View Estimation**: Click "Ver Estimación" to see time, distance, and cost estimates
4. **Book**: Complete the booking form and confirm the ride request
5. **Login**: Sign in or create a client account to view the trip in "Mis viajes"
6. **Driver Matching**: Drivers marked as available can accept the ride from the driver portal

## Demo Accounts

- Client: `laura.fernandez@gmail.com` / `cliente123`
- Driver: `miguel.rosario@montisa.com` / `chofer123`

## Data

Currently, the app includes mock data for popular hotels and landmarks in Punta Cana:

- Barceló Bávaro Palace
- Meliá Caribe Tropical
- Hard Rock Hotel Punta Cana
- Palladium Hotel Group
- Grand Palladium
- Paradisus Palma Real
- Punta Cana Resort & Club
- Aeropuerto Internacional Punta Cana

## Color Scheme

- **Primary Blue**: #003366
- **Secondary Teal**: #00a86b
- **Accent Yellow**: #ffc107
- **Success Green**: #4caf50
- **Error Red**: #f44336

## Future Enhancements

- User authentication and account management
- Real-time driver tracking
- Payment integration
- Ride history
- Ratings and reviews
- Real API integration for actual ride booking
- Weather information
- Multi-language support

## License

© 2026 STM - Servicios Turísticos Montisa. All rights reserved.
