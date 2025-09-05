# Room Designer - AI-Powered Interior Design App

An intelligent room design application that uses AI to analyze uploaded room photos, suggest design improvements, and find real products that can be purchased and visualized in the space.

## Features

🏠 **Room Analysis**: Upload a photo and get AI-powered analysis of your room's style, size, and existing furniture

🔍 **Smart Product Search**: Uses Exa AI to find real products from major retailers with current prices and purchase links

🎨 **Visual Placement**: Smart product placement with interactive overlays on your original room photo

🛒 **One-Click Shopping**: Click on any placed product to view details and purchase directly from the retailer

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **AI Integration**: 
  - Exa AI for intelligent product search
  - Google Nano Banana (Gemini 2.5 Flash) for AI-powered image editing
  - Computer vision concepts for room analysis
- **Image Processing**: Canvas API, Sharp
- **UI Components**: Lucide React icons

### Google Nano Banana (Gemini) Integration

This app uses Google's Nano Banana (Gemini 2.5 Flash Image) for AI-powered image editing. Nano Banana can:
- Take your existing room photo as input
- Add products seamlessly using natural language prompts
- Generate photorealistic results with proper lighting and perspective
- Maintain the original room's style and aesthetic

Unlike the traditional Imagen API, Nano Banana supports image editing and modifications, making it perfect for our room design use case.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- API keys for:
  - Exa AI (for product search)
  - Google AI (for Nano Banana image editing)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd room_designer
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

Edit `.env.local` and add your API keys:
```
EXA_API_KEY=your_exa_ai_api_key_here
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How It Works

1. **Upload**: User uploads a photo of their room
2. **Analysis**: AI analyzes the room for style, size, colors, and existing furniture
3. **Search**: System generates search queries and uses Exa AI to find relevant products
4. **Placement**: Smart algorithms place products as interactive overlays on your room image
5. **Interaction**: Users can click on placed products to view details and purchase

## API Endpoints

- `POST /api/search-products` - Search for products using Exa AI
- `POST /api/generate-room` - Generate room with product placements using Nano Banana AI

## Project Structure

```
room_designer/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── RoomUpload.tsx     # File upload interface
│   ├── RoomDesigner.tsx   # Main designer interface
│   └── ProductOverlay.tsx # Interactive product overlays
├── lib/                   # Utility functions
│   └── api.ts            # API client functions
├── types/                 # TypeScript type definitions
│   └── index.ts          # Main types
└── public/               # Static assets
```

## Configuration

### Exa AI Setup
1. Sign up at [Exa AI](https://exa.ai)
2. Get your API key from the dashboard
3. Add it to your `.env.local` file

### Google AI Setup
1. Visit [Google AI Studio](https://aistudio.google.com/) or [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Generative Language API
3. Create an API key
4. Add it to your `.env.local` file as `GOOGLE_AI_API_KEY`
5. The API supports the `gemini-2.5-flash-image-preview` model for image editing

## Development

The application includes mock data and fallbacks for development without API keys. To test with real APIs:

1. Configure your API keys
2. The system will automatically switch from mock data to real API calls
3. Monitor the console for any API errors

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Add environment variables in the Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

1. Build the application: `npm run build`
2. Set environment variables on your platform
3. Deploy the `.next` folder and `package.json`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
