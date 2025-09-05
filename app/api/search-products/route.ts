import { NextRequest, NextResponse } from 'next/server'
import { Product, RoomAnalysis } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { query, roomAnalysis } = await request.json()
    
    // In a real implementation, this would call Exa AI API
    const products = await searchWithExaAI(query, roomAnalysis)
    
    return NextResponse.json(products)
  } catch (error) {
    console.error('Product search API error:', error)
    return NextResponse.json({ error: 'Failed to search products' }, { status: 500 })
  }
}

async function searchWithExaAI(query: string, roomAnalysis: RoomAnalysis): Promise<Product[]> {
  const EXA_API_KEY = process.env.EXA_API_KEY
  
  if (!EXA_API_KEY) {
    console.warn('EXA_API_KEY not configured, using mock data')
    return getMockProductsForQuery(query)
  }
  
  try {
    // Exa AI search request
    const response = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: {
        'x-api-key': EXA_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `${query} buy online furniture home decor`,
        type: 'neural',
        useAutoprompt: true,
        numResults: 5,
        includeDomains: [
          'ikea.com',
          'wayfair.com',
          'westelm.com',
          'target.com',
          'amazon.com',
          'overstock.com',
          'crateandbarrel.com'
        ],
        contents: {
          text: true,
          highlights: true,
        }
      }),
    })
    
    if (!response.ok) {
      throw new Error(`Exa API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Parse Exa results into Product objects
    const products: Product[] = data.results.map((result: any, index: number) => {
      // Extract price from text content (this is a simplified approach)
      const priceMatch = result.text.match(/\$[\d,]+\.?\d*/g)
      const price = priceMatch ? priceMatch[0] : '$0.00'
      
      // Generate a product image URL (in real app, you'd extract from the page)
      const imageUrl = generateProductImageUrl(query, index)
      
      return {
        id: `exa-${index}-${Date.now()}`,
        title: result.title,
        price,
        url: result.url,
        imageUrl,
        description: result.highlights?.[0] || result.text.substring(0, 100) + '...',
        category: categorizeProduct(query)
      }
    })
    
    return products.filter(p => p.price !== '$0.00') // Filter out products without prices
    
  } catch (error) {
    console.error('Exa AI search failed:', error)
    return getMockProductsForQuery(query)
  }
}

function getMockProductsForQuery(query: string): Product[] {
  // Return different mock products based on query
  if (query.includes('lamp') || query.includes('lighting')) {
    return [
      {
        id: 'mock-lamp-1',
        title: 'Modern Table Lamp',
        price: '$89.99',
        url: 'https://www.ikea.com/us/en/p/fado-table-lamp-white-10096372/',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
        description: 'Sleek modern table lamp with soft lighting',
        brand: 'IKEA',
        category: 'lighting'
      }
    ]
  } else if (query.includes('pillow') || query.includes('cushion')) {
    return [
      {
        id: 'mock-pillow-1',
        title: 'Decorative Throw Pillows',
        price: '$34.99',
        url: 'https://www.westelm.com/products/outdoor-pillow-covers-b2956/',
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
        description: 'Set of 2 geometric pattern throw pillows',
        brand: 'West Elm',
        category: 'decor'
      }
    ]
  } else if (query.includes('rug')) {
    return [
      {
        id: 'mock-rug-1',
        title: 'Modern Area Rug',
        price: '$199.99',
        url: 'https://www.wayfair.com/rugs/pdp/loloi-margot-area-rug-w002642456.html',
        imageUrl: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&h=300&fit=crop',
        description: 'Modern geometric area rug, 5x7 feet',
        brand: 'Loloi',
        category: 'decor'
      }
    ]
  } else {
    return [
      {
        id: 'mock-general-1',
        title: 'Home Decor Item',
        price: '$49.99',
        url: 'https://www.target.com/c/home-decor/',
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
        description: 'Beautiful home decor piece',
        brand: 'Target',
        category: 'decor'
      }
    ]
  }
}

function generateProductImageUrl(query: string, index: number): string {
  // Generate Unsplash URLs based on query type
  const imageQueries = {
    lamp: 'photo-1507003211169-0a1dd7228f2d',
    pillow: 'photo-1586023492125-27b2c045efd7',
    rug: 'photo-1506439773649-6e0eb8cfb237',
    art: 'photo-1541961017774-22349e4a1262',
    plant: 'photo-1416879595882-3373a0480b5b',
    default: 'photo-1586023492125-27b2c045efd7'
  }
  
  let imageId = imageQueries.default
  
  for (const [key, id] of Object.entries(imageQueries)) {
    if (query.toLowerCase().includes(key)) {
      imageId = id
      break
    }
  }
  
  return `https://images.unsplash.com/${imageId}?w=300&h=300&fit=crop&auto=format`
}

function categorizeProduct(query: string): string {
  if (query.includes('lamp') || query.includes('light')) return 'lighting'
  if (query.includes('furniture')) return 'furniture'
  return 'decor'
}
