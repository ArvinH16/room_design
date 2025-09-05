'use client'

import { useState, useRef } from 'react'
import { Upload, Image as ImageIcon, Camera } from 'lucide-react'

interface RoomUploadProps {
  onImageUpload: (imageDataUrl: string) => void
}

export default function RoomUpload({ onImageUpload }: RoomUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageUpload(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        className={`upload-area ${isDragging ? 'border-primary-500 bg-primary-50' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-primary-100 rounded-full">
            <Upload className="h-12 w-12 text-primary-600" />
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Upload Your Room Photo
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop an image here, or click to select a file
            </p>
            <p className="text-sm text-gray-500">
              Supports JPG, PNG, WebP up to 10MB
            </p>
          </div>

          <div className="flex space-x-4">
            <button className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              <ImageIcon className="h-5 w-5" />
              <span>Choose File</span>
            </button>
            
            <button className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Camera className="h-5 w-5" />
              <span>Take Photo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Example Images */}
      <div className="mt-12">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          Or try with example rooms
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-square bg-gray-200 rounded-lg cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center"
              onClick={() => {
                // In a real app, you'd have actual example images
                console.log(`Example room ${i} clicked`)
              }}
            >
              <div className="text-center">
                <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Example {i}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
