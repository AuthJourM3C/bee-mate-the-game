import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { corsConfig } from './config/cors.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

const app = express();

app.use(morgan('dev'));
app.use(cors(corsConfig));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'BeeMate API is healthy', timestamp: new Date().toISOString() });
});

app.use(notFound);
app.use(errorHandler);

export default app;