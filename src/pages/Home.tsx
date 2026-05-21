import { useState, useMemo, type FormEvent } from 'react'
import { Search, MapPin, Clock, Star, Car, ChevronDown } from 'lucide-react'
import './Home.css'
import { toursSeed } from '../data/toursSeed'

interface HomeProps {
  onNavigateTransfer: () => void
  onOpenTour: (tourId: string) => void
}

const LOCATIONS = ['Todos', 'Punta Cana', 'Puerto Plata'] as const
type LocationFilter = typeof LOCATIONS[number]

function StarRating({ value }: { value: number }) {
  const full = Math.floor(value)
  const half = value - full >= 0.5
  return (
    <span className="star-row" aria-label={`${value} estrellas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={13}
          fill={i < full ? '#ff8a00' : i === full && half ? 'url(#half)' : 'none'}
          color={i < full || (i === full && half) ? '#ff8a00' : '#ccc'}
        />
      ))}
    </span>
  )
}

export default function Home({ onNavigateTransfer, onOpenTour }: HomeProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeLocation, setActiveLocation] = useState<LocationFilter>('Todos')

  const filteredTours = useMemo(() => {
    return toursSeed.filter((tour) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        !q ||
        tour.title.toLowerCase().includes(q) ||
        tour.location.toLowerCase().includes(q) ||
        (tour.highlights ?? []).some((h) => h.toLowerCase().includes(q))
      const matchesLocation = activeLocation === 'Todos' || tour.location === activeLocation
      return matchesSearch && matchesLocation
    })
  }, [searchQuery, activeLocation])

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault()
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
  }

  const quickFilter = (loc: LocationFilter) => {
    setActiveLocation(loc)
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="tours-page">

      {/* ── HERO ── */}
      <section className="tours-hero">
        <div className="tours-overlay" />
        <div className="tours-hero-content">
          <p className="tours-kicker">
            <MapPin size={13} strokeWidth={2.5} className="kicker-icon" />
            República Dominicana
          </p>

          <h1>
            Descubre experiencias
            <br />
            <span className="hero-highlight">inolvidables</span>
          </h1>

          <p className="hero-sub">
            Tours, aventuras y cultura local en Punta Cana y Puerto Plata.
            <br />
            Vive la isla con quienes la conocen de verdad.
          </p>

          {/* Search bar */}
          <form className="hero-search-bar" onSubmit={handleSearchSubmit}>
            <div className="hero-search-input-wrap">
              <Search size={20} className="search-icon" strokeWidth={2} />
              <input
                type="text"
                placeholder="Cosas que hacer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="hero-search-input"
                aria-label="Buscar tours"
              />
            </div>
            <button type="submit" className="hero-search-btn">
              Explorar
            </button>
          </form>

          {/* Quick location chips */}
          <div className="hero-chips">
            <span className="hero-chip-label">Popular:</span>
            <button type="button" className="hero-chip" onClick={() => quickFilter('Punta Cana')}>
              🏖️ Punta Cana
            </button>
            <button type="button" className="hero-chip" onClick={() => quickFilter('Puerto Plata')}>
              ⛰️ Puerto Plata
            </button>
            <button type="button" className="hero-chip" onClick={onNavigateTransfer}>
              🚐 Transfer
            </button>
          </div>
        </div>

        {/* Scroll arrow */}
        <a href="#catalogo" className="hero-scroll-arrow" aria-label="Ver tours">
          <ChevronDown size={28} strokeWidth={2} />
        </a>
      </section>

      {/* ── CATALOG ── */}
      <section id="catalogo" className="tours-catalog-section">
        <div className="catalog-header">
          <div>
            <h2 className="catalog-title">
              {activeLocation === 'Todos' ? 'Nuestros tours' : `Tours en ${activeLocation}`}
              <span className="catalog-count">{filteredTours.length} disponibles</span>
            </h2>
            <p className="catalog-sub">Actividades y excursiones con guías locales certificados</p>
          </div>

          <div className="location-filters">
            {LOCATIONS.map((loc) => (
              <button
                key={loc}
                type="button"
                className={`location-filter-btn${activeLocation === loc ? ' active' : ''}`}
                onClick={() => setActiveLocation(loc)}
              >
                {loc === 'Todos' ? '🌍 Todos' : loc === 'Punta Cana' ? '🏖️ Punta Cana' : '⛰️ Puerto Plata'}
              </button>
            ))}
          </div>
        </div>

        <div className="tours-catalog">
          {filteredTours.length === 0 ? (
            <div className="no-results">
              <p>No encontramos tours para &ldquo;{searchQuery}&rdquo;.</p>
              <button
                type="button"
                className="no-results-reset"
                onClick={() => { setSearchQuery(''); setActiveLocation('Todos') }}
              >
                Ver todos los tours
              </button>
            </div>
          ) : (
            filteredTours.map((tour) => (
              <article className="tour-card" key={tour.id}>
                <button type="button" className="tour-card-link" onClick={() => onOpenTour(tour.id)}>
                  <div className="tour-img-wrap">
                    <img className="tour-cover" src={tour.image} alt={tour.title} loading="lazy" />
                    <span className="tour-location-badge">
                      <MapPin size={11} strokeWidth={2.5} />
                      {tour.location}
                    </span>
                  </div>
                  <div className="tour-card-body">
                    <h2>{tour.title}</h2>

                    {tour.rating !== undefined && (
                      <div className="tour-rating">
                        <StarRating value={tour.rating} />
                        <span className="rating-value">{tour.rating.toFixed(1)}</span>
                        {tour.reviewCount !== undefined && (
                          <span className="rating-count">({tour.reviewCount} reseñas)</span>
                        )}
                      </div>
                    )}

                    {tour.highlights && tour.highlights.length > 0 && (
                      <ul className="tour-highlights">
                        {tour.highlights.slice(0, 3).map((h) => (
                          <li key={h}>✓ {h}</li>
                        ))}
                      </ul>
                    )}

                    <div className="tour-meta">
                      <span className="tour-duration">
                        <Clock size={13} strokeWidth={2} />
                        {tour.duration}
                      </span>
                      <span className="tour-price">Desde {tour.price}</span>
                    </div>
                  </div>
                </button>
              </article>
            ))
          )}
        </div>
      </section>

      {/* ── TRANSFER BANNER ── */}
      <section className="transfer-cta-banner">
        <div className="transfer-cta-inner">
          <div className="transfer-cta-text">
            <h3>¿Necesitas transfer?</h3>
            <p>Recogida en aeropuerto, hotel o punto de encuentro. Disponible las 24 horas.</p>
          </div>
          <button type="button" className="transfer-cta-btn" onClick={onNavigateTransfer}>
            <Car size={18} strokeWidth={2} />
            Reservar transfer
          </button>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="why-us-section">
        <p className="why-us-kicker">Nuestro compromiso</p>
        <h2 className="why-us-title">¿Por qué Montisa Travel?</h2>
        <div className="why-us-grid">
          <div className="why-card">
            <div className="why-icon">🏆</div>
            <h3>Guías locales</h3>
            <p>Expertos de la región que conocen cada rincón y te llevan donde los turistas no llegan.</p>
          </div>
          <div className="why-card">
            <div className="why-icon">✅</div>
            <h3>Todo incluido</h3>
            <p>Transporte, entradas y snacks incluidos. Solo trae tu energía y ganas de explorar.</p>
          </div>
          <div className="why-card">
            <div className="why-icon">🚐</div>
            <h3>Transfer personalizado</h3>
            <p>Llegamos hasta tu hotel o aeropuerto. Combina tu tour con transfer al mejor precio.</p>
          </div>
          <div className="why-card">
            <div className="why-icon">🌐</div>
            <h3>Atención multilingüe</h3>
            <p>Servicio en español, inglés y francés. Siempre listos para ayudarte antes y durante tu viaje.</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="tours-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <img src="/img/logo-transparente.png" alt="Montisa Travel" className="footer-logo" />
            <p>Tours y Transfer en República Dominicana</p>
          </div>
          <div className="footer-links">
            <p className="footer-section-title">Destinos</p>
            <p>Punta Cana</p>
            <p>Puerto Plata</p>
          </div>
          <div className="footer-contact">
            <p className="footer-section-title">Contacto</p>
            <p>📍 Puerto Plata, Rep. Dom.</p>
            <p>📞 +1 (809) 000-0000</p>
            <p>✉️ info@montisatravel.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Montisa Travel &mdash; Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
