import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

import generateRoute from './routes/generate';

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'LLM TestCaseGenerator Backend is running.' });
});

app.use('/api/generate', generateRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
