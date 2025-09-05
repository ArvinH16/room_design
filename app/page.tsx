'use client'

import { useState } from 'react'
import { Upload, Camera, Sparkles, ShoppingBag } from 'lucide-react'
import RoomUpload from '@/components/RoomUpload'
import RoomDesigner from '@/components/RoomDesigner'

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleImageUpload = (imageDataUrl: string) => {
    setUploadedImage(imageDataUrl)
    setIsAnalyzing(true)
  }

  const handleAnalysisComplete = () => {
    setIsAnalyzing(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="h-8 w-8 text-primary-600 mr-2" />
          <h1 className="text-4xl font-bold text-gray-900">Room Designer</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Upload a photo of your room and let AI transform it with personalized design recommendations and real products you can buy.
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="text-center p-6 bg-white rounded-xl shadow-sm">
          <Camera className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Upload Your Room</h3>
          <p className="text-gray-600">Take a photo or upload an existing image of your room</p>
        </div>
        <div className="text-center p-6 bg-white rounded-xl shadow-sm">
          <Sparkles className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
          <p className="text-gray-600">Our AI analyzes your space and suggests perfect design improvements</p>
        </div>
        <div className="text-center p-6 bg-white rounded-xl shadow-sm">
          <ShoppingBag className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Shop & Visualize</h3>
          <p className="text-gray-600">See products placed in your room and buy them with one click</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {!uploadedImage ? (
          <RoomUpload onImageUpload={handleImageUpload} />
        ) : (
          <RoomDesigner 
            imageUrl={uploadedImage}
            isAnalyzing={isAnalyzing}
            onAnalysisComplete={handleAnalysisComplete}
          />
        )}
      </div>
    </div>
  )
}
