# BeeMate PWA - Pollution Explorer Game

A Progressive Web App serious game for collecting air pollution data through photos and audio recordings.

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173 in your browser (preferably mobile or DevTools mobile mode).

## Game Flow

1. **Home** → Choose Explorer Mode or Enter Passphrase
2. **Name** → Enter player name
3. **Mode Select** → Pick Explorer (Reporter disabled)
4. **Welcome** → Meet your bee character (Pollini)
5. **Character Reveal** → See your starter card
6. **Dashboard** → Take photos, record audio, view map
7. **Capture** → Preview → Tag → Submit → Processing
8. **Results** → See R/NR classification, quality, points
9. **Confirm/Reject** → Provide feedback on results
10. **Evolution** → Power Up when threshold reached!

## Architecture

- **Frontend**: React 18 + TypeScript + Vite PWA
- **Backend**: Express.js proxy to M3C services
- **State**: Zustand with localStorage persistence
- **Maps**: Leaflet + OpenStreetMap
- **Audio**: MediaRecorder API with WAV conversion
- **Camera**: Native file input with capture attribute

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 3001)
- `MOCK_SERVICES` - Use mock AI responses (default: true)
- `M3C_BASE_URL` - M3C services base URL

### Frontend (.env)
- `VITE_API_BASE_URL` - Backend API URL

## Key Features

- 📷 Photo capture with pollution source tagging
- 🎤 Audio recording (30s max) with WAV conversion
- 🗺️ Leaflet maps showing contribution locations
- 🐝 Pokemon-style evolution tree (3 paths)
- 🍯 Points system with quality bonuses
- 🔑 Passcode save/restore system
- 📱 Mobile-first dark theme design
- ♿ Accessible UI for children 9-13
