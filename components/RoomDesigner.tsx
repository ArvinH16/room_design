'use client'

import { useState, useEffect, useRef } from 'react'
import { Loader2, RefreshCw, ShoppingBag, X } from 'lucide-react'
import { Product, ProductPlacement, RoomAnalysis } from '@/types'
import { analyzeRoom, searchProducts, generateRoomWithProducts } from '@/lib/api'
import ProductOverlay from './ProductOverlay'

interface RoomDesignerProps {
  imageUrl: string
  isAnalyzing: boolean
  onAnalysisComplete: () => void
}

export default function RoomDesigner({ 
  imageUrl, 
  isAnalyzing: initialAnalyzing, 
  onAnalysisComplete 
}: RoomDesignerProps) {
  const [roomAnalysis, setRoomAnalysis] = useState<RoomAnalysis | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [productPlacements, setProductPlacements] = useState<ProductPlacement[]>([])
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(initialAnalyzing)
  const [isSearchingProducts, setIsSearchingProducts] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (isAnalyzing) {
      performRoomAnalysis()
    }
  }, [isAnalyzing])

  const performRoomAnalysis = async () => {
    try {
      const analysis = await analyzeRoom(imageUrl)
      setRoomAnalysis(analysis)
      setIsAnalyzing(false)
      onAnalysisComplete()
      
      // Automatically search for products based on analysis
      searchForProducts(analysis)
    } catch (error) {
      console.error('Room analysis failed:', error)
      setIsAnalyzing(false)
      onAnalysisComplete()
    }
  }

  const searchForProducts = async (analysis: RoomAnalysis) => {
    setIsSearchingProducts(true)
    try {
      const searchResults = await searchProducts(analysis)
      setProducts(searchResults)
      
      // Generate image with products
      await generateImageWithProducts(searchResults, analysis)
    } catch (error) {
      console.error('Product search failed:', error)
    } finally {
      setIsSearchingProducts(false)
    }
  }

  const generateImageWithProducts = async (productList: Product[], analysis?: RoomAnalysis) => {
    setIsGeneratingImage(true)
    try {
      const analysisToUse = analysis || roomAnalysis
      if (!analysisToUse) {
        throw new Error('Room analysis is not available')
      }
      const result = await generateRoomWithProducts(imageUrl, productList, analysisToUse)
      setGeneratedImageUrl(result.imageUrl)
      setProductPlacements(result.placements)
    } catch (error) {
      console.error('Image generation failed:', error)
    } finally {
      setIsGeneratingImage(false)
    }
  }

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
  }

  const handleBuyProduct = (url: string) => {
    window.open(url, '_blank')
  }

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Analyzing Your Room</h3>
        <p className="text-gray-600 text-center">
          Our AI is examining your space to understand the layout, style, and lighting...
        </p>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Main Image Display */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="relative">
            <img 
              src={generatedImageUrl || imageUrl} 
              alt="Room design" 
              className="w-full h-auto"
            />
            
            {/* Product Overlays */}
            {productPlacements.map((placement) => (
              <ProductOverlay
                key={placement.id}
                placement={placement}
                onClick={() => handleProductClick(placement.product)}
              />
            ))}
            
            {/* Loading Overlays */}
            {isGeneratingImage && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-3" />
                  <p className="text-gray-900 font-medium">Generating your redesigned room...</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Controls */}
          <div className="p-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => roomAnalysis && searchForProducts(roomAnalysis)}
                  disabled={isSearchingProducts}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${isSearchingProducts ? 'animate-spin' : ''}`} />
                  <span>Refresh Design</span>
                </button>
              </div>
              
              <div className="text-sm text-gray-600">
                Click on products to view details and purchase
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Room Analysis */}
        {roomAnalysis && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Room Analysis</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600">Type:</span>
                <p className="text-gray-900 capitalize">{roomAnalysis.roomType}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Style:</span>
                <p className="text-gray-900 capitalize">{roomAnalysis.style}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Size:</span>
                <p className="text-gray-900 capitalize">{roomAnalysis.size}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Recommendations:</span>
                <ul className="text-gray-900 text-sm mt-1 space-y-1">
                  {roomAnalysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary-600 mr-2">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Product List */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Recommended Products
          </h3>
          
          {isSearchingProducts ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-3" />
              <p className="text-gray-600">Finding perfect products...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="flex space-x-3">
                    <img 
                      src={product.imageUrl} 
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {product.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{product.price}</p>
                      {product.brand && (
                        <p className="text-xs text-gray-500 mt-1">{product.brand}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold">{selectedProduct.title}</h3>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <img 
              src={selectedProduct.imageUrl} 
              alt={selectedProduct.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary-600">
                  {selectedProduct.price}
                </span>
                {selectedProduct.brand && (
                  <span className="text-sm text-gray-600">{selectedProduct.brand}</span>
                )}
              </div>
              
              {selectedProduct.description && (
                <p className="text-gray-600 text-sm">{selectedProduct.description}</p>
              )}
              
              <button
                onClick={() => handleBuyProduct(selectedProduct.url)}
                className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
