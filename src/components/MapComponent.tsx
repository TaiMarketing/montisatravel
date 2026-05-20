import { useMemo } from 'react'
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api'
import './MapComponent.css'

interface Location {
  lat: number
  lng: number
  address: string
  name?: string
}

interface MapComponentProps {
  origin: Location | null
  destination: Location | null
  onMapClick: (lat: number, lng: number) => void
}

export default function MapComponent({ origin, destination, onMapClick }: MapComponentProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const center = useMemo(() => ({ lat: 18.7357, lng: -68.4087 }), [])

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'montisa-google-maps-script',
    googleMapsApiKey: apiKey || ''
  })

  if (!apiKey) {
    return (
      <div className="map-component-wrapper">
        <div className="map-status">Falta VITE_GOOGLE_MAPS_API_KEY en el archivo .env</div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="map-component-wrapper">
        <div className="map-status">No se pudo cargar Google Maps. Verifica restricciones del API key para localhost:5173.</div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="map-component-wrapper">
        <div className="map-status">Cargando mapa...</div>
      </div>
    )
  }

  return (
    <div className="map-component-wrapper">
      <GoogleMap
        mapContainerClassName="map-container"
        center={center}
        zoom={13}
        options={{
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false
        }}
        onClick={(e) => {
          const lat = e.latLng?.lat()
          const lng = e.latLng?.lng()
          if (typeof lat === 'number' && typeof lng === 'number') {
            onMapClick(lat, lng)
          }
        }}
      >
        {origin && (
          <MarkerF
            position={{ lat: origin.lat, lng: origin.lng }}
            title={origin.name || `Origen: ${origin.address}`}
            label="O"
          />
        )}
        {destination && (
          <MarkerF
            position={{ lat: destination.lat, lng: destination.lng }}
            title={destination.name || `Destino: ${destination.address}`}
            label="D"
          />
        )}
      </GoogleMap>
    </div>
  )
}
