import { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import './Home.css'
import { toursSeed } from '../data/toursSeed'

interface HomeProps {
  onNavigateTransfer: () => void
  onOpenTour: (tourId: string) => void
}

const CATEGORY_LABELS: Record<string, string> = {
  excursion: 'Excursion',
  aventura: 'Aventura',
  cultura: 'Cultura',
  naturaleza: 'Naturaleza',
}

const PLACEHOLDERS = [
  'Cosas que hacer en Punta Cana...',
  'Tours de aventura y naturaleza...',
  'Excursiones en grupo...',
  'Traslados al aeropuerto...',
  'Isla Saona, Charcos, Safari...',
]

const HERO_IMAGES = [
  '/img/montisa-travel-index-background.jpg',
  '/img/fotos-tours/34.png',
  '/img/fotos-tours/36.png',
  '/img/fotos-tours/39.png',
]

export default function Home({ onNavigateTransfer, onOpenTour }: HomeProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const [activeHeroImageIdx, setActiveHeroImageIdx] = useState(0)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length)
    }, 3200)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroImageIdx((idx) => (idx + 1) % HERO_IMAGES.length)
    }, 4500)

    return () => clearInterval(timer)
  }, [])

  const suggestions =
    searchQuery.trim().length > 1
      ? toursSeed
          .filter(
            (t) =>
              t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.location.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          .slice(0, 5)
      : []

  const filteredTours = toursSeed.filter((tour) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      !q ||
      tour.title.toLowerCase().includes(q) ||
      tour.location.toLowerCase().includes(q) ||
      (tour.category && CATEGORY_LABELS[tour.category]?.toLowerCase().includes(q))
    const matchesCategory = !activeCategory || tour.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const handleExplore = () => {
    setShowSuggestions(false)
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
  }

  const categories = [
    { id: null, label: 'Todo', icon: '✨' },
    { id: 'excursion', label: 'Excursiones', icon: '🏖️' },
    { id: 'aventura', label: 'Aventura', icon: '🌊' },
    { id: 'cultura', label: 'Cultura', icon: '🏛️' },
    { id: 'naturaleza', label: 'Naturaleza', icon: '🌿' },
  ]

  return (
    <div className="tours-page">
      {/* ── HERO ── */}
      <section className="tours-hero">
        <div className="tours-hero-backgrounds" aria-hidden="true">
          {HERO_IMAGES.map((image, idx) => (
            <div
              key={image}
              className={`tours-hero-bg${idx === activeHeroImageIdx ? ' is-active' : ''}`}
              style={{ backgroundImage: `url('${image}')` }}
            />
          ))}
        </div>
        <div className="tours-overlay" />
        <div className="tours-hero-content">
          <p className="tours-kicker">🌴 Punta Cana · Puerto Plata · Republica Dominicana</p>
          <h1>
            Descubre y reserva<br />
            <span className="hero-highlight">experiencias increibles</span>
          </h1>

          {/* Search bar */}
          <div className="hero-search-wrapper" ref={searchRef}>
            <div className="hero-search-bar">
              <Search size={20} className="hero-search-icon" />
              <input
                type="text"
                className="hero-search-input"
                placeholder={PLACEHOLDERS[placeholderIdx]}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => e.key === 'Enter' && handleExplore()}
              />
              <button type="button" className="hero-search-btn" onClick={handleExplore}>
                Explorar
              </button>
            </div>

            {/* Autocomplete suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="hero-suggestions">
                {suggestions.map((tour) => (
                  <button
                    key={tour.id}
                    type="button"
                    className="hero-suggestion-item"
                    onClick={() => {
                      setShowSuggestions(false)
                      onOpenTour(tour.id)
                    }}
                  >
                    <img src={tour.image} alt={tour.title} className="suggestion-thumb" />
                    <div className="suggestion-info">
                      <span className="suggestion-title">{tour.title}</span>
                      <span className="suggestion-meta">
                        {tour.location} · {tour.duration}
                      </span>
                    </div>
                    <span className="suggestion-price">{tour.price}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Stats row */}
          <div className="hero-stats">
            <span>🏆 100+ experiencias</span>
            <span>⭐ 4.8 valoracion media</span>
            <span>🚐 Recogida disponible</span>
          </div>
        </div>

        {/* Featured mini-cards pinned to bottom of hero */}
        <div className="hero-featured-bar">
          <p className="hero-featured-label">Experiencias destacadas</p>
          <div className="hero-featured-cards">
            {toursSeed.slice(0, 4).map((tour) => (
              <button
                key={tour.id}
                type="button"
                className="hero-mini-card"
                onClick={() => onOpenTour(tour.id)}
              >
                <img src={tour.image} alt={tour.title} className="mini-card-img" />
                <div className="mini-card-body">
                  <p className="mini-card-title">{tour.title}</p>
                  <div className="mini-card-meta">
                    {tour.rating && (
                      <span className="mini-card-rating">⭐ {tour.rating}</span>
                    )}
                    <span className="mini-card-price">{tour.price}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="tours-categories-bar">
        <div className="categories-scroll">
          {categories.map((cat) => (
            <button
              key={cat.id ?? 'all'}
              type="button"
              className={`category-pill${activeCategory === cat.id ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="category-icon">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── CATALOG ── */}
      <section id="catalogo" className="tours-catalog">
        <div className="catalog-header">
          <h2>
            {activeCategory
              ? `${CATEGORY_LABELS[activeCategory]} en Punta Cana y Puerto Plata`
              : 'Explora Punta Cana y Puerto Plata'}
          </h2>
          <p className="catalog-count">{filteredTours.length} experiencias disponibles</p>
        </div>

        {filteredTours.length === 0 ? (
          <div className="catalog-empty">
            <p>No encontramos experiencias para "{searchQuery}"</p>
            <button type="button" onClick={() => { setSearchQuery(''); setActiveCategory(null) }}>
              Ver todas las experiencias
            </button>
          </div>
        ) : (
          <div className="tours-grid">
            {filteredTours.map((tour) => (
              <article className="tour-card" key={tour.id}>
                <button type="button" className="tour-card-link" onClick={() => onOpenTour(tour.id)}>
                  <div className="tour-card-image-wrapper">
                    <img className="tour-cover" src={tour.image} alt={tour.title} loading="lazy" />
                    <button
                      type="button"
                      className="tour-fav-btn"
                      aria-label="Guardar en favoritos"
                      onClick={(e) => e.stopPropagation()}
                    >
                      ♡
                    </button>
                    {tour.category && (
                      <span className="tour-category-badge">
                        {CATEGORY_LABELS[tour.category]}
                      </span>
                    )}
                  </div>
                  <div className="tour-card-body">
                    <p className="tour-location">{tour.location}</p>
                    <h3>{tour.title}</h3>
                    <div className="tour-meta">
                      <span className="tour-duration">{tour.duration}</span>
                      {tour.pickup && <span className="pickup-badge">· Recogida disponible</span>}
                    </div>
                    <div className="tour-footer">
                      {tour.rating != null && (
                        <span className="tour-rating">
                          ⭐ {tour.rating}{' '}
                          <span className="tour-review-count">({tour.reviewCount?.toLocaleString()})</span>
                        </span>
                      )}
                      <span className="tour-price">Desde {tour.price}</span>
                    </div>
                  </div>
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ── TRANSFER CTA ── */}
      <section className="transfer-cta-section">
        <div className="transfer-cta-content">
          <div className="transfer-cta-text">
            <h3>Necesitas traslado desde el aeropuerto?</h3>
            <p>Chofer profesional, puntual y comodo. Reserva con anticipacion y viaja tranquilo.</p>
          </div>
          <button type="button" className="transfer-cta-btn" onClick={onNavigateTransfer}>
            Reservar Transfer →
          </button>
        </div>
      </section>

      <footer className="tours-footer">
        <div className="footer-inner">
          <div>
            <p className="footer-brand">Montisa Travel</p>
            <p>Tours & Transfers · Republica Dominicana</p>
          </div>
          <div>
            <p>Puerto Plata · Punta Cana</p>
            <p>+1 (809) 000-0000</p>
          </div>
          <div>
            <p>© 2026 STM Servicios Turisticos Montisa</p>
            <p>Todos los derechos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
