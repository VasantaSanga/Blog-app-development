/**
 * Main Server Entry Point
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config/env.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust proxy for accurate IP addresses
app.set('trust proxy', true);

// CORS
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// API routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`
  ╔══════════════════════════════════════════════╗
  ║     🚀 Scribely API Server Started           ║
  ╠══════════════════════════════════════════════╣
  ║  Environment: ${config.nodeEnv.padEnd(29)}║
  ║  Port:        ${config.port.toString().padEnd(29)}║
  ║  URL:         http://localhost:${config.port.toString().padEnd(14)}║
  ╚══════════════════════════════════════════════╝
  `);
});

export default app;
