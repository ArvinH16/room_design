# Imagen API Implementation Guide

Based on the [Google Imagen API documentation](https://ai.google.dev/gemini-api/docs/imagen), here's how to properly implement the Imagen API in your Room Designer app.

## Important Note

The Imagen API is designed for **generating new images from text prompts**, not for editing existing images or placing products into existing room photos. For a room designer app that places products into existing photos, you would need a different approach.

## Correct Imagen API Implementation

### 1. Install the Google Generative AI SDK

```bash
npm install @google/genai
```

### 2. Using the SDK (Recommended)

```typescript
import { GoogleGenAI } from "@google/genai";

async function generateRoomImage(prompt: string) {
  const genAI = new GoogleGenAI(process.env.GOOGLE_AI_API_KEY!);
  
  const response = await genAI.models.generateImages({
    model: 'imagen-4.0-generate-001', // or 'imagen-4.0-fast-generate-001' for faster results
    prompt: prompt,
    config: {
      numberOfImages: 4,
      aspectRatio: "16:9",
      personGeneration: "allow_adult"
    },
  });

  // Process generated images
  const images = response.generatedImages.map(img => ({
    base64: img.image.imageBytes,
    // Convert to data URL or save to file
  }));

  return images;
}
```

### 3. Using REST API

```typescript
async function generateRoomImageREST(prompt: string) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${GOOGLE_AI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [
          {
            prompt: prompt
          }
        ],
        parameters: {
          sampleCount: 4,        // 1-4 images
          aspectRatio: "16:9",   // Options: "1:1", "3:4", "4:3", "9:16", "16:9"
          personGeneration: "allow_adult" // Options: "dont_allow", "allow_adult", "allow_all"
        }
      }),
    }
  );

  const data = await response.json();
  // Response: { "predictions": [{ "bytesBase64Encoded": "..." }] }
  
  return data.predictions;
}
```

## Available Models

- **`imagen-4.0-generate-001`** - Standard quality
- **`imagen-4.0-ultra-generate-001`** - Ultra quality (best)
- **`imagen-4.0-fast-generate-001`** - Fast generation
- **`imagen-3.0-generate-002`** - Previous generation

## For Room Designer App

Since Imagen generates new images rather than editing existing ones, for a room designer app you have several options:

### Option 1: Generate New Room Designs
Use Imagen to generate completely new room designs based on the analysis and product descriptions:

```typescript
const prompt = `A modern living room with white walls, natural lighting, featuring a sleek table lamp, decorative throw pillows, and a geometric area rug. Photorealistic, interior design photography, 16:9 aspect ratio`;
```

### Option 2: Hybrid Approach
1. Use Imagen to generate product placement ideas
2. Use the mock overlay system for the actual product placement on the original image
3. Consider using other image editing APIs or tools for actual image composition

### Option 3: Future Enhancement
Wait for image editing capabilities in the API or use other services like:
- Google's Image Editor API (when available)
- Third-party image editing services
- Custom ML models for image inpainting/editing

## Current Implementation

Your current mock implementation is actually the right approach for a room designer app that needs to:
1. Keep the original room photo
2. Place specific products at specific locations
3. Allow interactive product selection

The Imagen API would be better suited for generating inspiration images or completely new room designs based on style preferences.
