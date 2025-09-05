# Nano Banana (Gemini) Integration Guide

This guide explains how Google's Nano Banana (Gemini 2.5 Flash) is integrated into the Room Designer app for AI-powered image editing.

## Overview

Nano Banana is Google's advanced image generation model that can:
- Edit existing images based on text prompts
- Add objects seamlessly with proper lighting and perspective
- Maintain photorealistic quality
- Handle complex multi-object placements

## Implementation Details

### 1. API Setup

The integration uses the `@google/genai` SDK:

```javascript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });
```

### 2. Image Editing Process

When a user uploads a room photo and products are found:

1. **Convert Original Image to Base64**
   ```javascript
   const originalImageBase64 = await imageUrlToBase64(originalImageUrl);
   ```

2. **Create Intelligent Prompt**
   The prompt includes:
   - Product details (names and categories)
   - Room analysis (style, colors, existing furniture)
   - Specific placement guidelines
   - Quality requirements

3. **Call Nano Banana API**
   ```javascript
   const response = await ai.models.generateContent({
     model: 'gemini-2.5-flash-image-preview',
     contents: [
       { text: prompt },
       {
         inlineData: {
           mimeType: 'image/png',
           data: originalImageBase64,
         },
       },
     ],
   });
   ```

4. **Extract Generated Image**
   The response contains the edited image as base64 data.

### 3. Prompt Engineering

The prompt is carefully crafted to ensure high-quality results:

```javascript
You are an expert interior designer. Transform this [room type] by thoughtfully adding the following products:

[Product List]

Guidelines for placement:
- Room style and colors
- Existing furniture
- Product-specific placement rules
- Lighting and perspective requirements
- Photorealistic quality standards
```

### 4. Product Placement Logic

Even with AI generation, we calculate placement coordinates for interactive overlays:
- Lamps: Side tables or corners
- Rugs: Center of seating areas
- Pillows: On sofas/chairs
- Wall art: Eye level with proper spacing
- Plants: Near windows or corners

### 5. Error Handling

The implementation includes fallbacks:
- Missing API key: Uses mock generation
- API errors: Falls back to original image with overlays
- Invalid responses: Graceful degradation

## Testing

Run the test script to verify your setup:

```bash
node test-nano-banana.js
```

This will:
1. Check for API key configuration
2. Generate a test room image
3. Save the result locally
4. Provide feedback on the integration status

## Best Practices

1. **API Key Security**
   - Never commit API keys to version control
   - Use environment variables
   - Implement rate limiting

2. **Image Quality**
   - Convert images to base64 properly
   - Maintain aspect ratios
   - Use appropriate image formats (PNG/JPEG)

3. **Prompt Optimization**
   - Be specific about placement
   - Include style consistency requirements
   - Request photorealistic quality

4. **Performance**
   - Cache generated images
   - Implement loading states
   - Handle large images efficiently

## Limitations

- Maximum image size: 20MB
- Processing time: 5-15 seconds
- Rate limits apply (see Google AI documentation)
- Best results with clear, well-lit room photos

## Troubleshooting

### "API key not valid"
- Verify key in Google AI Studio
- Check for typos in .env.local
- Ensure API is enabled

### "Model not found"
- Use exact model name: `gemini-2.5-flash-image-preview`
- Check for API updates

### No image in response
- Verify prompt clarity
- Check input image format
- Review API response structure

## Future Enhancements

1. **Advanced Features**
   - Multiple room angles
   - Style transfer between rooms
   - Seasonal decorations
   - Custom furniture generation

2. **Optimization**
   - Streaming responses
   - Progressive image loading
   - Batch processing

3. **User Experience**
   - Real-time preview
   - Adjustment sliders
   - Undo/redo functionality

## Resources

- [Google AI Documentation](https://ai.google.dev/gemini-api/docs/image-generation)
- [Gemini API Reference](https://ai.google.dev/api/rest)
- [Best Practices Guide](https://ai.google.dev/gemini-api/docs/image-generation#best_practices)
