import express from 'express';
import cors from 'cors';
import promptRoutes from './routes/promptRoutes';
import aiRoutes from './routes/aiRoutes';
import { PORT } from './config';

const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Enable JSON body parsing

// Routes
app.use('/api/prompts', promptRoutes);
app.use('/api/ai', aiRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('AI Orchestrator Backend is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`AI Orchestrator Backend listening on port ${PORT}`);
});
