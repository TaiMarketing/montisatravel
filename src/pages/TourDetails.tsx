import { useMemo, useState } from 'react'
import {
  Calendar,
  Bus,
  CheckCircle2,
  Clock3,
  Globe,
  Heart,
  MapPin,
  Share2,
  Star,
  User,
  Wallet,
} from 'lucide-react'
import type { Tour } from '../types/tour'
import { toursSeed } from '../data/toursSeed'
import './TourDetails.css'

interface TourDetailsProps {
  tour: Tour
  onBack: () => void
  onNavigateTransfer: () => void
  onOpenTour: (tourId: string) => void
}

const tourDetailById: Record<string, {
  rating: number
  reviews: number
  provider: string
  oldPrice: string
  description: string
  languages: string
  pickup: string
  gallery: string[]
}> = {
  'isla-saona-full-day': {
    rating: 4.6,
    reviews: 127,
    provider: 'Montisa Tours',
    oldPrice: 'USD 89',
    description: 'Navega por aguas turquesas, disfruta playa virgen, snorkel y almuerzo dominicano frente al mar.',
    languages: 'Espanol, English, Francais',
    pickup: 'Bavaro y Uvero Alto',
    gallery: ['/img/fotos-tours/34.png', '/img/fotos-tours/35.png', '/img/fotos-tours/40.png', '/img/fotos-tours/41.png', '/img/fotos-tours/42.png'],
  },
  'scape-park-hoyo-azul': {
    rating: 4.4,
    reviews: 92,
    provider: 'Montisa Adventure',
    oldPrice: 'USD 95',
    description: 'Aventura en Cap Cana con tirolinas, cuevas y salto al Hoyo Azul en un tour completo.',
    languages: 'Espanol, English',
    pickup: 'Punta Cana, Cap Cana',
    gallery: ['/img/fotos-tours/35.png', '/img/fotos-tours/36.png', '/img/fotos-tours/43.png', '/img/fotos-tours/44.png', '/img/fotos-tours/45.png'],
  },
  'safari-cultural-dominican': {
    rating: 4.2,
    reviews: 74,
    provider: 'Montisa Culture',
    oldPrice: 'USD 79',
    description: 'Recorrido inmersivo entre campos, cacao y gastronomia local con experiencias autenticas.',
    languages: 'Espanol, English, Deutsch',
    pickup: 'Bavaro, Cabeza de Toro',
    gallery: ['/img/fotos-tours/36.png', '/img/fotos-tours/37.png', '/img/fotos-tours/46.png', '/img/fotos-tours/47.png', '/img/fotos-tours/48.png'],
  },
  'charcos-damajagua': {
    rating: 4.7,
    reviews: 110,
    provider: 'Montisa Eco Tours',
    oldPrice: 'USD 99',
    description: 'Salta y desliza por cascadas naturales en una de las aventuras mas famosas de Puerto Plata.',
    languages: 'Espanol, English, Francais',
    pickup: 'Puerto Plata y Sosua',
    gallery: ['/img/fotos-tours/37.png', '/img/fotos-tours/38.png', '/img/fotos-tours/49.png', '/img/fotos-tours/50.png', '/img/fotos-tours/51.png'],
  },
  'centro-historico-malecon': {
    rating: 4.1,
    reviews: 54,
    provider: 'Montisa City Tours',
    oldPrice: 'USD 62',
    description: 'Historia, arquitectura y sabores locales en el casco urbano y malecon de Puerto Plata.',
    languages: 'Espanol, English',
    pickup: 'Centro de Puerto Plata',
    gallery: ['/img/fotos-tours/38.png', '/img/fotos-tours/39.png', '/img/fotos-tours/41.png', '/img/fotos-tours/44.png', '/img/fotos-tours/52.png'],
  },
  'cayo-arena-full-day': {
    rating: 4.8,
    reviews: 136,
    provider: 'Montisa Ocean Tours',
    oldPrice: 'USD 108',
    description: 'Excursion full day a Cayo Arena con snorkel, aguas cristalinas y navegacion costera.',
    languages: 'Espanol, English, Italiano',
    pickup: 'Puerto Plata y Cofresi',
    gallery: ['/img/fotos-tours/39.png', '/img/fotos-tours/40.png', '/img/fotos-tours/42.png', '/img/fotos-tours/50.png', '/img/fotos-tours/52.png'],
  },
}

export default function TourDetails({ tour, onBack, onNavigateTransfer, onOpenTour }: TourDetailsProps) {
  const [passengers, setPassengers] = useState('1 adulto')
  const [language, setLanguage] = useState('Espanol')
  const [isMobileBookingOpen, setIsMobileBookingOpen] = useState(false)
  const details = tourDetailById[tour.id]

  const relatedTours = useMemo(() => toursSeed.filter((item) => item.id !== tour.id).slice(0, 4), [tour.id])

  return (
    <div className="tour-details-page">
      <div className="tour-layout">
        <main className="tour-main">
          <header className="tour-heading">
            <h1>{tour.title}</h1>
            <div className="tour-subhead">
              <span><Star size={16} /> {details.rating.toFixed(1)}</span>
              <span>{details.reviews} reviews</span>
              <span>Activity provider: {details.provider}</span>
            </div>
            <div className="tour-share-row">
              <button type="button"><Heart size={16} /> Add to wishlist</button>
              <button type="button"><Share2 size={16} /> Share</button>
            </div>
          </header>

          <section className="tour-gallery">
            <img src={details.gallery[0]} alt={tour.title} className="gallery-main" />
            <div className="gallery-grid">
              {details.gallery.slice(1).map((image, index) => (
                <img key={`${tour.id}-${index}`} src={image} alt={`${tour.title} ${index + 2}`} />
              ))}
            </div>
          </section>

          <section className="mobile-booking-card">
            <p className="from-price">From <span>{details.oldPrice}</span></p>
            <p className="current-price">{tour.price} <small>per person</small></p>

            <button
              type="button"
              className="check-btn"
              onClick={() => setIsMobileBookingOpen((value) => !value)}
              aria-expanded={isMobileBookingOpen}
            >
              Book now
            </button>

            {isMobileBookingOpen && (
              <div className="mobile-booking-fields">
                <label>
                  <User size={16} />
                  <select value={passengers} onChange={(event) => setPassengers(event.target.value)}>
                    <option>1 adulto</option>
                    <option>2 adultos</option>
                    <option>3 adultos</option>
                    <option>4 adultos</option>
                  </select>
                </label>

                <label>
                  <Calendar size={16} />
                  <input type="date" />
                </label>

                <label>
                  <Globe size={16} />
                  <select value={language} onChange={(event) => setLanguage(event.target.value)}>
                    <option>Espanol</option>
                    <option>English</option>
                    <option>Francais</option>
                  </select>
                </label>

                <button type="button" className="check-btn" onClick={onNavigateTransfer}>Check availability</button>

                <div className="booking-benefits">
                  <p><CheckCircle2 size={16} /> Free cancellation</p>
                  <p><CheckCircle2 size={16} /> Reserve now and pay later</p>
                  <p><MapPin size={16} /> Pickup included</p>
                </div>
              </div>
            )}
          </section>

          <p className="tour-description">{details.description}</p>

          <section className="tour-features">
            <article><CheckCircle2 size={20} /><div><h3>Free cancellation</h3><p>Cancel up to 24 hours in advance for a full refund</p></div></article>
            <article><Wallet size={20} /><div><h3>Reserve now and pay later</h3><p>Book your spot and pay nothing today</p></div></article>
            <article><Clock3 size={20} /><div><h3>Duration {tour.duration}</h3><p>Check availability to see start times</p></div></article>
            <article><Globe size={20} /><div><h3>Live tour guide</h3><p>{details.languages}</p></div></article>
            <article><Bus size={20} /><div><h3>Pickup included</h3><p>{details.pickup}</p></div></article>
            <article><Calendar size={20} /><div><h3>Flexible date</h3><p>Reschedule once without additional fee</p></div></article>
          </section>

          <section className="tour-itinerary">
            <h2>Itinerary</h2>
            <div className="itinerary-grid">
              <ol>
                <li><span />Pickup point: {details.pickup}</li>
                <li><span />Bus/coach transfer</li>
                <li><span />Main activity and free time</li>
                <li><span />Return transfer</li>
              </ol>
            </div>
          </section>

          <section className="related-tours">
            <h2>You might also like...</h2>
            <div className="related-grid">
              {relatedTours.map((item) => (
                <button key={item.id} type="button" className="related-card" onClick={() => onOpenTour(item.id)}>
                  <img src={item.image} alt={item.title} />
                  <h3>{item.title}</h3>
                  <p>{item.duration}</p>
                  <strong>From {item.price}</strong>
                </button>
              ))}
            </div>
          </section>

          <section className="customer-photos">
            <h2>Customer photos</h2>
            <div className="photo-grid">
              <img src={details.gallery[2]} alt="Customer photo 1" className="photo-big" />
              <img src={details.gallery[3]} alt="Customer photo 2" />
              <img src={details.gallery[4]} alt="Customer photo 3" />
              <img src={details.gallery[1]} alt="Customer photo 4" />
              <img src={details.gallery[0]} alt="Customer photo 5" />
            </div>
          </section>

          <section className="tour-reviews">
            <h2>Customer reviews</h2>
            <div className="reviews-head">
              <div>
                <p className="reviews-score">{details.rating.toFixed(1)} / 5</p>
                <p>Based on {details.reviews} reviews</p>
              </div>
              <div className="review-bars">
                <p>Guide <span>4.5/5</span></p>
                <p>Transport <span>4.2/5</span></p>
                <p>Value <span>4.4/5</span></p>
              </div>
            </div>
            <article className="review-card">
              <p className="review-top">★★★★☆ 4 - Verified booking</p>
              <p>
                Great day overall. Smooth transfer, friendly team and excellent snorkeling stops.
                Recommended if you want a complete day with beach and activities.
              </p>
            </article>
          </section>

          <button type="button" className="tour-back" onClick={onBack}>Back to tours</button>
        </main>

        <aside className="booking-card">
          <p className="from-price">From <span>{details.oldPrice}</span></p>
          <p className="current-price">{tour.price} <small>per person</small></p>

          <label>
            <User size={16} />
            <select value={passengers} onChange={(event) => setPassengers(event.target.value)}>
              <option>1 adulto</option>
              <option>2 adultos</option>
              <option>3 adultos</option>
              <option>4 adultos</option>
            </select>
          </label>

          <label>
            <Calendar size={16} />
            <input type="date" />
          </label>

          <label>
            <Globe size={16} />
            <select value={language} onChange={(event) => setLanguage(event.target.value)}>
              <option>Espanol</option>
              <option>English</option>
              <option>Francais</option>
            </select>
          </label>

          <button type="button" className="check-btn" onClick={onNavigateTransfer}>Check availability</button>

          <div className="booking-benefits">
            <p><CheckCircle2 size={16} /> Free cancellation</p>
            <p><CheckCircle2 size={16} /> Reserve now and pay later</p>
            <p><MapPin size={16} /> Pickup included</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
