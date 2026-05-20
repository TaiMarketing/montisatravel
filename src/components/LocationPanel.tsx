import { useState } from 'react'
import { Crosshair, MapPin, Search, X } from 'lucide-react'
import './LocationPanel.css'

interface Location {
  lat: number
  lng: number
  address: string
  name?: string
}

interface LocationPanelProps {
  origin: Location | null
  destination: Location | null
  onOriginChange: (location: Location | null) => void
  onDestinationChange: (location: Location | null) => void
  onRequestRide: (origin: string, destination: string) => void
  onReset: () => void
}

// Mock hotel data for Punta Cana
const HOTELS_PUNTA_CANA = [
  { name: 'Barceló Bávaro Palace', lat: 18.7417, lng: -68.3867 },
  { name: 'Meliá Caribe Tropical', lat: 18.7487, lng: -68.3937 },
  { name: 'Hard Rock Hotel Punta Cana', lat: 18.7367, lng: -68.4067 },
  { name: 'Palladium Hotel Group', lat: 18.7457, lng: -68.3867 },
  { name: 'Grand Palladium', lat: 18.7527, lng: -68.3927 },
  { name: 'Paradisus Palma Real', lat: 18.7327, lng: -68.4107 },
  { name: 'Punta Cana Resort & Club', lat: 18.7237, lng: -68.4187 },
  { name: 'Aeropuerto Internacional Punta Cana', lat: 18.7337, lng: -68.3767 }
]

export default function LocationPanel({
  origin,
  destination,
  onOriginChange,
  onDestinationChange,
  onRequestRide,
  onReset
}: LocationPanelProps) {
  const [showOriginDropdown, setShowOriginDropdown] = useState(false)
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false)
  const [originSearch, setOriginSearch] = useState('')
  const [destinationSearch, setDestinationSearch] = useState('')
  const [isLocating, setIsLocating] = useState(false)
  const [locationError, setLocationError] = useState('')

  const filteredHotels = (search: string) => {
    return HOTELS_PUNTA_CANA.filter(hotel =>
      hotel.name.toLowerCase().includes(search.toLowerCase())
    )
  }

  const handleSelectOrigin = (hotel: typeof HOTELS_PUNTA_CANA[0]) => {
    onOriginChange({
      lat: hotel.lat,
      lng: hotel.lng,
      address: hotel.name,
      name: hotel.name
    })
    setOriginSearch(hotel.name)
    setShowOriginDropdown(false)
  }

  const handleSelectDestination = (hotel: typeof HOTELS_PUNTA_CANA[0]) => {
    onDestinationChange({
      lat: hotel.lat,
      lng: hotel.lng,
      address: hotel.name,
      name: hotel.name
    })
    setDestinationSearch(hotel.name)
    setShowDestinationDropdown(false)
  }

  const handleSwapLocations = () => {
    if (origin && destination) {
      onOriginChange(destination)
      onDestinationChange(origin)
      setOriginSearch(destination.name || '')
      setDestinationSearch(origin.name || '')
    }
  }

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Tu navegador no soporta geolocalizacion.')
      return
    }

    setIsLocating(true)
    setLocationError('')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        onOriginChange({
          lat: latitude,
          lng: longitude,
          address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          name: 'Mi ubicacion actual'
        })
        setOriginSearch('Mi ubicacion actual')
        setShowOriginDropdown(false)
        setIsLocating(false)
      },
      () => {
        setLocationError('No pudimos obtener tu ubicacion. Revisa permisos del navegador.')
        setIsLocating(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  const isReadyToRequest = origin && destination

  return (
    <div className="location-panel">
      <div className="panel-content">
        <div className="location-inputs">
          {/* Origin Input */}
          <div className="input-group">
            <label className="input-label">
              <MapPin size={18} className="input-icon" />
              Desde
            </label>
            <button
              type="button"
              className="current-location-btn"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
            >
              <Crosshair size={16} />
              {isLocating ? 'Obteniendo ubicacion...' : 'Usar mi ubicacion actual'}
            </button>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Selecciona tu ubicación..."
                value={originSearch}
                onChange={(e) => {
                  setOriginSearch(e.target.value)
                  setShowOriginDropdown(true)
                }}
                onFocus={() => setShowOriginDropdown(true)}
                className="location-input"
              />
              {origin && (
                <button
                  className="clear-btn"
                  onClick={() => {
                    onOriginChange(null)
                    setOriginSearch('')
                  }}
                  title="Limpiar"
                >
                  <X size={16} />
                </button>
              )}
              {showOriginDropdown && (
                <div className="dropdown-menu">
                  {filteredHotels(originSearch).map((hotel, idx) => (
                    <div
                      key={idx}
                      className="dropdown-item"
                      onClick={() => handleSelectOrigin(hotel)}
                    >
                      <MapPin size={16} />
                      <div>
                        <div className="hotel-name">{hotel.name}</div>
                        <div className="hotel-coords">
                          {hotel.lat.toFixed(4)}, {hotel.lng.toFixed(4)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {locationError && <p className="location-error">{locationError}</p>}
          </div>

          {/* Destination Input */}
          <div className="input-group">
            <label className="input-label">
              <Search size={18} className="input-icon" />
              Hacia
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="¿Dónde vas?"
                value={destinationSearch}
                onChange={(e) => {
                  setDestinationSearch(e.target.value)
                  setShowDestinationDropdown(true)
                }}
                onFocus={() => setShowDestinationDropdown(true)}
                className="location-input"
              />
              {destination && (
                <button
                  className="clear-btn"
                  onClick={() => {
                    onDestinationChange(null)
                    setDestinationSearch('')
                  }}
                  title="Limpiar"
                >
                  <X size={16} />
                </button>
              )}
              {showDestinationDropdown && (
                <div className="dropdown-menu">
                  {filteredHotels(destinationSearch).map((hotel, idx) => (
                    <div
                      key={idx}
                      className="dropdown-item"
                      onClick={() => handleSelectDestination(hotel)}
                    >
                      <MapPin size={16} />
                      <div>
                        <div className="hotel-name">{hotel.name}</div>
                        <div className="hotel-coords">
                          {hotel.lat.toFixed(4)}, {hotel.lng.toFixed(4)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="panel-actions">
          {isReadyToRequest && (
            <button
              className="swap-btn"
              onClick={handleSwapLocations}
              title="Intercambiar ubicaciones"
            >
              ⇅
            </button>
          )}

          <button
            className="request-btn"
            onClick={() => {
              if (isReadyToRequest) {
                onRequestRide(
                  origin!.address,
                  destination!.address
                )
              }
            }}
            disabled={!isReadyToRequest}
          >
            {isReadyToRequest ? 'Ver Estimación' : 'Completa ambas ubicaciones'}
          </button>

          {isReadyToRequest && (
            <button
              className="reset-btn"
              onClick={onReset}
            >
              Limpiar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
