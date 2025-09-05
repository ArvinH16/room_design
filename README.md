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
  - Mock implementation for product placement (see note below)
  - Computer vision concepts for room analysis
- **Image Processing**: Canvas API, Sharp
- **UI Components**: Lucide React icons

### Important Note on Google Imagen API

The Google Imagen API (including Imagen 4.0 / "Nano Banana") is designed for **generating new images from text prompts**, not for editing existing images or placing products into photos. This app uses a smart mock implementation that:
- Analyzes your room photo
- Finds real products using Exa AI
- Places product overlays intelligently based on product type
- Maintains your original room photo

For details on implementing the actual Imagen API for image generation, see [IMAGEN_IMPLEMENTATION_GUIDE.md](IMAGEN_IMPLEMENTATION_GUIDE.md).

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- API keys for:
  - Exa AI (for product search)
  - Google AI (for image generation)

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
- `POST /api/generate-room` - Generate room with product placements (uses mock implementation)

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
1. Enable the Generative AI API in Google Cloud Console
2. Create an API key
3. Add it to your `.env.local` file as `GOOGLE_AI_API_KEY`
4. The request uses the `?key=` query parameter (no Authorization header)

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
