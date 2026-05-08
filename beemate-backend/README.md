# BeeMate Backend

Backend proxy and game logic server for the BeeMate serious game.

Setup
```bash npm install cp .env.example .env npm run dev```
## API Endpoints | Method | Path | Description 
POST | /api/identify/image | Submit image for pollution identification 
POST | /api/identify/audio | Submit audio for pollution identification 
POST | /api/passcode/generate | Generate a passcode from game state
POST | /api/passcode/restore | Restore game state from passcode 
GET | /api/facts/random | Get a random pollution fact
GET | /health | Health check 

## Environment Variables
`PORT` - Server port (default: 3001)
`CORS_ORIGIN` - Allowed CORS origin 
`M3C_BASE_URL` - Base URL for M3C services responsible for audio/image recognition.
`MOCK_SERVICES` - Use mock responses (true/false)
