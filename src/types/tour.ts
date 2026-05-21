export interface Tour {
  id: string
  title: string
  duration: string
  price: string
  image: string
  location: 'Punta Cana' | 'Puerto Plata'
  rating?: number
  reviewCount?: number
  highlights?: string[]
}
