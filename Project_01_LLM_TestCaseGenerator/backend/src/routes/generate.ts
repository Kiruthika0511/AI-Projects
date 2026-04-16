import { Router, Request, Response } from 'express';
import { generateTestCase, GenerateOptions } from '../services/llmService';

const router = Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const payload: GenerateOptions = req.body;
        
        if (!payload.provider || !payload.requirement || !payload.keys) {
            res.status(400).json({ error: 'Missing required parameters' });
            return;
        }

        const generatedTestCase = await generateTestCase(payload);
        
        res.json({ result: generatedTestCase });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'An error occurred during generation' });
    }
});

export default router;
