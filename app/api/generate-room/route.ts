import { NextRequest, NextResponse } from 'next/server'
import { Product, ProductPlacement, RoomAnalysis } from '@/types'
import { GoogleGenAI } from '@google/genai'
import * as fs from 'node:fs'
import * as path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { originalImageUrl, products, roomAnalysis } = await request.json()
    
    // Validate required parameters
    if (!originalImageUrl) {
      return NextResponse.json({ error: 'Original image URL is required' }, { status: 400 })
    }
    
    if (!products || !Array.isArray(products)) {
      return NextResponse.json({ error: 'Products array is required' }, { status: 400 })
    }
    
    if (!roomAnalysis) {
      return NextResponse.json({ error: 'Room analysis is required' }, { status: 400 })
    }
    
    // In a real implementation, this would call Google's Nano Banana API
    const result = await generateRoomWithNanoBanana(originalImageUrl, products, roomAnalysis)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Room generation API error:', error)
    return NextResponse.json({ error: 'Failed to generate room' }, { status: 500 })
  }
}

async function generateRoomWithNanoBanana(
  originalImageUrl: string,
  products: Product[],
  roomAnalysis: RoomAnalysis
): Promise<{ imageUrl: string; placements: ProductPlacement[] }> {
  const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY
  
  if (!GOOGLE_AI_API_KEY) {
    console.warn('GOOGLE_AI_API_KEY not configured, using mock generation')
    return generateMockRoomResult(originalImageUrl, products)
  }
  
  try {
    // Initialize Google Generative AI with Nano Banana (Gemini)
    const ai = new GoogleGenAI({ apiKey: GOOGLE_AI_API_KEY })
    
    // Convert original image URL to base64
    const originalImageBase64 = await imageUrlToBase64(originalImageUrl)
    
    // Create prompt for adding products to the room
    const prompt = createNanoBananaPrompt(roomAnalysis, products)
    
    // Prepare the content with text and image
    const contents = [
      { text: prompt },
      {
        inlineData: {
          mimeType: 'image/png',
          data: originalImageBase64,
        },
      },
    ]
    
    console.log('Generating room with Nano Banana (Gemini)...')
    
    // Generate the modified image
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: contents,
    })
    
    // Extract the generated image from the response
    let generatedImageUrl = originalImageUrl
    const generatedImageData = response.candidates?.[0]?.content?.parts?.find(
      (part: any) => part.inlineData
    )?.inlineData?.data
    
    if (generatedImageData) {
      // Convert base64 to a data URL
      generatedImageUrl = `data:image/png;base64,${generatedImageData}`
      console.log('Successfully generated room with products')
    } else {
      console.warn('No image generated in response')
    }
    
    // Calculate product placements
    const placements = generateIntelligentPlacements(products, roomAnalysis)
    
    return {
      imageUrl: generatedImageUrl,
      placements
    }
    
  } catch (error) {
    console.error('Google AI generation failed:', error)
    return generateMockRoomResult(originalImageUrl, products)
  }
}

function createNanoBananaPrompt(roomAnalysis: RoomAnalysis, products: Product[]): string {
  // Additional safety check
  if (!roomAnalysis) {
    throw new Error('Room analysis is required for prompt generation')
  }
  
  const productDescriptions = products.map((p, index) => 
    `${index + 1}. ${p.title} (${p.category || 'decor'})`
  ).join('\n')
  
  return `You are an expert interior designer. Transform this ${roomAnalysis.roomType} by thoughtfully adding the following products:

${productDescriptions}

Guidelines for placement:
- The room has a ${roomAnalysis.style} style with ${roomAnalysis.colors.join(', ')} colors
- Existing furniture includes: ${roomAnalysis.existingFurniture.join(', ')}
- Place lamps on side tables or in corners for ambient lighting
- Position rugs to define seating areas
- Add throw pillows to sofas and chairs for comfort and color
- Hang wall art at eye level with proper spacing
- Place plants near windows or in corners for natural elements
- Maintain realistic proportions and perspectives
- Ensure natural lighting and shadows
- Keep the overall composition balanced and inviting

The final image should look photorealistic, as if professionally staged by an interior designer. Add all products naturally into the existing room.`
}

// Helper function to convert image URL to base64
async function imageUrlToBase64(imageUrl: string): Promise<string> {
  try {
    // If it's already a data URL, extract the base64 part
    if (imageUrl.startsWith('data:')) {
      return imageUrl.split(',')[1]
    }
    
    // If it's a remote URL, fetch and convert
    const response = await fetch(imageUrl)
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    return buffer.toString('base64')
  } catch (error) {
    console.error('Failed to convert image to base64:', error)
    throw new Error('Failed to process image')
  }
}

function generateMockRoomResult(originalImageUrl: string, products: Product[]): { imageUrl: string; placements: ProductPlacement[] } {
  // For demo purposes, we'll return the original image with calculated placements
  const placements = generateIntelligentPlacements(products, {
    roomType: 'living room',
    style: 'modern',
    colors: ['white', 'gray'],
    lighting: 'natural',
    size: 'medium',
    existingFurniture: ['sofa'],
    recommendations: []
  })
  
  return {
    imageUrl: originalImageUrl,
    placements
  }
}

function generateIntelligentPlacements(products: Product[], roomAnalysis: RoomAnalysis): ProductPlacement[] {
  const placements: ProductPlacement[] = []
  
  products.forEach((product, index) => {
    let placement = calculateProductPlacement(product, index, roomAnalysis)
    
    placements.push({
      id: `placement-${product.id}`,
      product,
      ...placement
    })
  })
  
  return placements
}

function calculateProductPlacement(product: Product, index: number, roomAnalysis: RoomAnalysis): {
  x: number
  y: number
  width: number
  height: number
  rotation?: number
} {
  // Smart placement based on product type and room analysis
  const baseX = 10
  const baseY = 10
  
  // Determine placement based on product category and title
  if (product.title.toLowerCase().includes('lamp') || product.category === 'lighting') {
    // Lamps typically go on side tables or corners
    return {
      x: baseX + (index % 2) * 70, // Alternate sides
      y: 25 + Math.random() * 10,
      width: 8,
      height: 12
    }
  } else if (product.title.toLowerCase().includes('rug')) {
    // Rugs go in the center of seating areas
    return {
      x: 25 + Math.random() * 10,
      y: 55 + Math.random() * 10,
      width: 35 + Math.random() * 10,
      height: 20 + Math.random() * 5
    }
  } else if (product.title.toLowerCase().includes('pillow') || product.title.toLowerCase().includes('cushion')) {
    // Pillows go on sofas/chairs
    return {
      x: 30 + index * 8,
      y: 40 + Math.random() * 5,
      width: 6,
      height: 6
    }
  } else if (product.title.toLowerCase().includes('art') || product.title.toLowerCase().includes('mirror')) {
    // Wall art goes on walls
    return {
      x: 15 + index * 25,
      y: 10 + Math.random() * 15,
      width: 12,
      height: 8
    }
  } else if (product.title.toLowerCase().includes('plant')) {
    // Plants go in corners or near windows
    return {
      x: 5 + (index % 2) * 80,
      y: 30 + Math.random() * 20,
      width: 10,
      height: 15
    }
  } else {
    // Default placement for other items
    return {
      x: baseX + (index * 20) % 60,
      y: baseY + (index * 15) % 40,
      width: 12 + Math.random() * 8,
      height: 12 + Math.random() * 8
    }
  }
}
