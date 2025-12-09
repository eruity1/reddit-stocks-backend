import express, { Request, Response } from 'express';
import {
  analyzeSentiment,
  analyzeBatchSentiment,
  getTickerSentiment,
} from '../services/sentimentService';

const router = express.Router();

router.post('/analyze', (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required and must be a string' });
    }

    const result = analyzeSentiment(text);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze sentiment',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.post('/batch', (req: Request, res: Response) => {
  try {
    const { texts } = req.body;

    if (!Array.isArray(texts)) {
      return res.status(400).json({ error: 'texts must be an array' });
    }

    if (texts.length === 0) {
      return res.status(400).json({ error: 'texts array cannot be empty' });
    }

    if (texts.length > 100) {
      return res.status(400).json({ error: 'Maximum 100 texts allowed per batch' });
    }

    const result = analyzeBatchSentiment(texts);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Batch sentiment analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze batch sentiment',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.post('/ticker', (req: Request, res: Response) => {
  try {
    const { text, ticker } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required and must be a string' });
    }

    if (!ticker || typeof ticker !== 'string') {
      return res.status(400).json({ error: 'Ticker is required and must be a string' });
    }

    const result = getTickerSentiment(text, ticker);
    res.json({
      success: true,
      ticker: ticker.toUpperCase(),
      result,
    });
  } catch (error) {
    console.error('Ticker sentiment analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze ticker sentiment',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.get('/test', (_req: Request, res: Response) => {
  const examples = [
    {
      text: 'TSLA is mooning! 🚀 Great earnings report, bullish af!',
      ticker: 'TSLA',
    },
    {
      text: 'GME getting dumped hard. Might be time to sell and cut losses.',
      ticker: 'GME',
    },
    {
      text: 'AAPL steady as always. Nothing exciting but solid hold.',
      ticker: 'AAPL',
    },
  ];

  const results = examples.map((example) => ({
    ...example,
    sentiment: getTickerSentiment(example.text, example.ticker),
  }));

  res.json({
    success: true,
    message: 'Sentiment analysis test results',
    examples: results,
  });
});

export default router;
