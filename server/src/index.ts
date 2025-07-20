import express, { Request, Response } from 'express';
import cors from 'cors'; // FIX: Added cors import
import aiRoutes from './routes/aiRoutes';
import promptRoutes from './routes/promptRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // FIX: Enabled CORS
app.use(express.json());

// API Routes
app.use('/api/ai', aiRoutes);
app.use('/api/prompts', promptRoutes);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => { // FIX: Renamed unused 'req' to '_req'
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
