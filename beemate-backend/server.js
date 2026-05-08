import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`\n🐝 BeeMate Backend running on port ${PORT}`);
  console.log(`   Mode: ${process.env.MOCK_SERVICES === 'true' ? 'MOCK' : 'LIVE'} services`);
  console.log(`   M3C Base URL: ${process.env.M3C_BASE_URL || 'https://m3capps.jour.auth.gr/api'}`);
  console.log(`   CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}\n`);
});