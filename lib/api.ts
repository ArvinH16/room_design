import { Product, ProductPlacement, RoomAnalysis } from '@/types'

// Mock room analysis using computer vision concepts
export async function analyzeRoom(imageUrl: string): Promise<RoomAnalysis> {
  // In a real implementation, this would use Google Vision API or similar
  // For now, we'll simulate the analysis
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Mock analysis based on common room features
  return {
    roomType: 'living room',
    style: 'modern',
    colors: ['white', 'gray', 'beige'],
    lighting: 'natural',
    size: 'medium',
    existingFurniture: ['sofa', 'coffee table'],
    recommendations: [
      'Add accent lighting with table lamps',
      'Include throw pillows for color',
      'Consider a area rug to define the space',
      'Add wall art or decorative mirrors',
      'Include plants for natural elements'
    ]
  }
}

// Search for products using Exa AI
export async function searchProducts(roomAnalysis: RoomAnalysis): Promise<Product[]> {
  try {
    const searchQueries = generateSearchQueries(roomAnalysis)
    const allProducts: Product[] = []
    
    for (const query of searchQueries) {
      const response = await fetch('/api/search-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, roomAnalysis }),
      })
      
      if (response.ok) {
        const products = await response.json()
        allProducts.push(...products)
      }
    }
    
    // Remove duplicates and limit results
    const uniqueProducts = allProducts.filter((product, index, self) => 
      index === self.findIndex(p => p.url === product.url)
    )
    
    return uniqueProducts.slice(0, 8) // Limit to 8 products
  } catch (error) {
    console.error('Product search error:', error)
    // Return mock products as fallback
    return getMockProducts()
  }
}

// Generate room with products using Google's Nano Banana
export async function generateRoomWithProducts(
  originalImageUrl: string, 
  products: Product[], 
  roomAnalysis: RoomAnalysis
): Promise<{ imageUrl: string; placements: ProductPlacement[] }> {
  try {
    const response = await fetch('/api/generate-room', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        originalImageUrl, 
        products, 
        roomAnalysis 
      }),
    })
    
    if (response.ok) {
      return await response.json()
    } else {
      throw new Error('Image generation failed')
    }
  } catch (error) {
    console.error('Image generation error:', error)
    // Return mock placements as fallback
    return {
      imageUrl: originalImageUrl,
      placements: generateMockPlacements(products)
    }
  }
}

function generateSearchQueries(roomAnalysis: RoomAnalysis): string[] {
  const baseQueries = [
    `${roomAnalysis.style} ${roomAnalysis.roomType} furniture`,
    `${roomAnalysis.roomType} decor accessories`,
    `${roomAnalysis.style} lighting fixtures`,
  ]
  
  // Add specific recommendations as queries
  const recommendationQueries = roomAnalysis.recommendations.map(rec => 
    `${rec.replace(/[^a-zA-Z0-9\s]/g, '')} for ${roomAnalysis.roomType}`
  )
  
  return [...baseQueries, ...recommendationQueries.slice(0, 2)]
}

function getMockProducts(): Product[] {
  return [
    {
      id: '1',
      title: 'Modern Table Lamp',
      price: '$89.99',
      url: 'https://example.com/lamp',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
      description: 'Sleek modern table lamp with adjustable brightness',
      brand: 'IKEA',
      category: 'lighting'
    },
    {
      id: '2',
      title: 'Decorative Throw Pillows',
      price: '$34.99',
      url: 'https://example.com/pillows',
      imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
      description: 'Set of 2 geometric pattern throw pillows',
      brand: 'West Elm',
      category: 'decor'
    },
    {
      id: '3',
      title: 'Area Rug',
      price: '$199.99',
      url: 'https://example.com/rug',
      imageUrl: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&h=300&fit=crop',
      description: 'Modern geometric area rug, 5x7 feet',
      brand: 'Rugs USA',
      category: 'decor'
    },
    {
      id: '4',
      title: 'Wall Art Set',
      price: '$149.99',
      url: 'https://example.com/wall-art',
      imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=300&fit=crop',
      description: 'Abstract wall art set of 3 prints',
      brand: 'Etsy',
      category: 'decor'
    }
  ]
}

function generateMockPlacements(products: Product[]): ProductPlacement[] {
  // Generate realistic placements based on typical room layouts
  const placements: ProductPlacement[] = []
  
  products.forEach((product, index) => {
    let placement: Omit<ProductPlacement, 'id'> = {
      product,
      x: 0,
      y: 0,
      width: 10,
      height: 10
    }
    
    // Position products based on their category
    switch (product.category) {
      case 'lighting':
        placement = { ...placement, x: 15 + index * 20, y: 20, width: 8, height: 12 }
        break
      case 'decor':
        if (product.title.includes('Rug')) {
          placement = { ...placement, x: 30, y: 60, width: 40, height: 25 }
        } else if (product.title.includes('Pillow')) {
          placement = { ...placement, x: 25 + index * 5, y: 45, width: 6, height: 6 }
        } else {
          placement = { ...placement, x: 10 + index * 15, y: 15, width: 12, height: 8 }
        }
        break
      default:
        placement = { ...placement, x: 20 + index * 15, y: 40, width: 15, height: 20 }
    }
    
    placements.push({
      id: `placement-${product.id}`,
      ...placement
    })
  })
  
  return placements
}
