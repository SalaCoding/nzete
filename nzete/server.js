import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { corsOptions } from './config/corsConfig.js';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dns from "node:dns/promises";
import helmet from 'helmet';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import authStory from './routes/authStory.js';
import authRoutes from './routes/authRoutes.js';
import authNumbers from './routes/authNumbers.js';
import samboleRoute from './routes/samboleRoute.js';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Security
app.use(cors(corsOptions));
app.use(helmet({ crossOriginResourcePolicy: false, contentSecurityPolicy: false }));

// Parsers
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// Static
const distPath = path.join(__dirname, '../mosisa-na-nse/dist');
app.use(express.static(distPath));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

dns.setServers(["1.1.1.1", "1.0.0.1"]);

// Socket.io
const io = new Server(server, { cors: corsOptions });
app.use((req, res, next) => { req.io = io; next(); });

// API routes
app.set('trust proxy', 1);
app.get('/', (req, res) => res.json({ status: 'ok' }));
app.use('/api/number', authNumbers);
app.use('/api/auth', authRoutes);
app.use('/api/blog', authStory);
app.use('/api/qa', samboleRoute);

// SPA fallback
app.get('/:path(*)', (req, res) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return res.status(404).json({ error: 'Not Found' });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  connectDB().then(() => console.log("DB Connected"));
});

export { io };
