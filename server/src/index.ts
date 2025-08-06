import express, { Request, Response } from 'express';
import cors from 'cors';
import aiRoutes from './routes/aiRoutes';
import promptRoutes from './routes/promptRoutes';
import collaborationRoutes from './routes/collaborationRoutes';
import evaluationRoutes from './routes/evaluationRoutes';
import responsibleAIRoutes from './routes/responsibleAIRoutes';
import multimodalRoutes from './routes/multimodalRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/ai', aiRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/collaboration', collaborationRoutes);
app.use('/api/evaluation', evaluationRoutes);
app.use('/api/responsible-ai', responsibleAIRoutes);
app.use('/api/multimodal', multimodalRoutes);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
