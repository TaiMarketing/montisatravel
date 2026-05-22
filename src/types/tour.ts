export interface Tour {
  id: string
  title: string
  duration: string
  price: string
  image: string
  location: 'Punta Cana' | 'Puerto Plata'
  rating?: number
  reviewCount?: number
  category?: 'excursion' | 'aventura' | 'cultura' | 'naturaleza'
  pickup?: boolean
}
