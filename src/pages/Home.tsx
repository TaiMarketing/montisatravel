import './Home.css'
import { toursSeed } from '../data/toursSeed'

interface HomeProps {
  onNavigateTransfer: () => void
  onOpenTour: (tourId: string) => void
}

export default function Home({ onNavigateTransfer, onOpenTour }: HomeProps) {
  return (
    <div className="tours-page">
      <section className="tours-hero">
        <div className="tours-overlay" />
        <div className="tours-hero-content">
          <p className="tours-kicker">Montisa Travel</p>
          <h1>Tours inolvidables en Punta Cana y Puerto Plata</h1>
          <p>
            Vive experiencias autenticas con rutas guiadas, aventura, playa y cultura local.
            Elige tu proximo tour y combina tu viaje con nuestro servicio de transfer.
          </p>
          <div className="tours-hero-actions">
            <button type="button" className="primary-cta" onClick={onNavigateTransfer}>
              Reservar transfer
            </button>
            <a href="#catalogo" className="ghost-cta">Ver tours</a>
          </div>
        </div>
      </section>

      <section id="catalogo" className="tours-catalog">
        {toursSeed.map((tour) => (
          <article className="tour-card" key={tour.id}>
            <button type="button" className="tour-card-link" onClick={() => onOpenTour(tour.id)}>
              <img className="tour-cover" src={tour.image} alt={tour.title} loading="lazy" />
              <div className="tour-card-body">
                <h2>{tour.title}</h2>
                <div className="tour-meta">
                  <span className="tour-duration">Duracion: {tour.duration}</span>
                  <span className="tour-price">Desde {tour.price}</span>
                </div>
              </div>
            </button>
          </article>
        ))}
      </section>

      <footer className="tours-footer">
        <p>Montisa Travel Tours and Transfers</p>
        <p>Puerto Plata, Republica Dominicana</p>
        <p>+1 (809) 000-0000</p>
      </footer>
    </div>
  )
}
