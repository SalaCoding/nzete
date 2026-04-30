
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

// Config & Routes
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


app.use(express.static(path.join(__dirname, '../mosisa-na-nse/dist')));
// Middleware
app.use(helmet({ crossOriginResourcePolicy: false,
  contentSecurityPolicy: false,
 }));
app.use(cors(corsOptions));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

dns.setServers(["1.1.1.1", "1.0.0.1"]);

// Socket.io
const io = new Server(server, { cors: corsOptions });

app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);
  socket.on('join', (storyId) => socket.join(`story:${storyId}`));
  socket.on('leave', (storyId) => socket.leave(`story:${storyId}`));
  socket.on('disconnect', () => console.log('❌ Client disconnected:', socket.id));
});

// Routes
app.set('trust proxy', 1);
app.get('/', (req, res) => res.json({ status: 'ok', message: 'Server is running' }));
app.use('/api/number', authNumbers);
app.use('/api/auth', authRoutes);
app.use('/api/blog', authStory);
app.use('/api/qa', samboleRoute);

// Error Handlers
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Payload too large.' });
  }
  next(err);
});

app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.stack);
  res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
});

app.get(/^(?!\/(api|uploads|assets)).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../mosisa-na-nse/dist/index.html'));
});



// Server Start
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  connectDB()
    .then(() => console.log("✅ Database Connected"))
    .catch(err => console.error("❌ DB Connection Error:", err));
});

export { io };