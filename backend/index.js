import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import achievementRoutes from './routes/achievementRoutes.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import userRoutes from './routes/userRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import askVaultRoutes from './routes/askVaultRoutes.js';
import devStatsRoutes from './routes/devStatsRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5050;

// Global error listeners
process.on('uncaughtException', (err) => {
  console.error(' UNCAUGHT EXCEPTION:', err.message);
});
process.on('unhandledRejection', (reason) => {
  console.error(' UNHANDLED REJECTION:', reason);
});

//  Updated CORS setup
app.use(cors({
  origin: [
  'http://localhost:5173',
  'https://vaultify-kappa.vercel.app'
  ],
  credentials: true,
}));
app.options('*', cors()); // Enable preflight

// Middleware
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('Vaultify Backend is running');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/achievements', achievementRoutes);
app.use('/user', userRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/askvault', askVaultRoutes);
app.use('/api/stats', devStatsRoutes);


// DB + Server start
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); 
    console.log('MongoDB connected');

    // ✅ Use 0.0.0.0 for Render
    app.listen(PORT, '0.0.0.0', () => {
      console.log(` Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error(' MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

startServer();
