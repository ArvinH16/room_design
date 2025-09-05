export interface Product {
  id: string
  title: string
  price: string
  url: string
  imageUrl: string
  description?: string
  brand?: string
  category?: string
}

export interface ProductPlacement {
  id: string
  product: Product
  x: number
  y: number
  width: number
  height: number
  rotation?: number
}

export interface RoomAnalysis {
  roomType: string
  style: string
  colors: string[]
  lighting: string
  size: 'small' | 'medium' | 'large'
  existingFurniture: string[]
  recommendations: string[]
}

export interface ExaSearchResult {
  title: string
  url: string
  text: string
  highlights?: string[]
  publishedDate?: string
}

export interface ExaSearchResponse {
  results: ExaSearchResult[]
  autopromptString?: string
}
