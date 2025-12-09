const Sentiment = require('sentiment');

const sentiment = new Sentiment();

export interface SentimentResult {
  score: number;
  normalizedScore: number;
  comparative: number;
  tokens: string[];
  positive: string[];
  negative: string[];
  label: 'very positive' | 'positive' | 'neutral' | 'negative' | 'very negative';
}

const stockLexicon = {
  // Positive terms
  'moon': 3,
  'mooning': 3,
  'bullish': 3,
  'calls': 2,
  'tendies': 3,
  'rocket': 3,
  'rally': 2,
  'pump': 2,
  'breakout': 2,
  'gains': 2,
  'profit': 2,
  'winner': 2,
  'surge': 2,
  'soar': 2,
  'spike': 2,
  'green': 1,
  'buy': 1,
  'long': 1,
  'hold': 1,
  'diamond': 2,
  'hands': 1,
  'uptrend': 2,
  'outperform': 2,

  // Negative terms
  'bear': -2,
  'bearish': -3,
  'puts': -2,
  'crash': -3,
  'dump': -3,
  'sell': -1,
  'short': -1,
  'loss': -2,
  'losses': -2,
  'red': -1,
  'tank': -3,
  'plunge': -3,
  'drop': -2,
  'fall': -2,
  'decline': -2,
  'weak': -2,
  'overvalued': -2,
  'bubble': -2,
  'correction': -2,
  'bagholding': -3,
  'bagholder': -3,
  'rip': -2,
  'rug': -3,
  'scam': -3,
  'downtrend': -2,
};

export const analyzeSentiment = (text: string): SentimentResult => {
  if (!text || text.trim().length === 0) {
    return {
      score: 0,
      normalizedScore: 0,
      comparative: 0,
      tokens: [],
      positive: [],
      negative: [],
      label: 'neutral',
    };
  }

  const cleanedText = cleanText(text);
  const result = sentiment.analyze(cleanedText, { extras: stockLexicon });

  const normalizedScore = normalizeScore(result.comparative);

  const label = getSentimentLabel(normalizedScore);

  return {
    score: result.score,
    normalizedScore,
    comparative: result.comparative,
    tokens: result.tokens,
    positive: result.positive,
    negative: result.negative,
    label,
  };
};

export const analyzeBatchSentiment = (
  texts: string[]
): {
  averageScore: number;
  averageNormalized: number;
  results: SentimentResult[];
} => {
  const results = texts.map((text) => analyzeSentiment(text));

  const averageScore = results.reduce((sum, res) => sum + res.score, 0) / results.length || 0;
  const averageNormalized =
    results.reduce((sum, res) => sum + res.normalizedScore, 0) / results.length || 0;

  return {
    averageScore,
    averageNormalized,
    results,
  };
};

export const getTickerSentiment = (text: string, ticker: string): SentimentResult => {
  const sentences = text.split(/[.!?]+/);
  const relevantSentences = sentences.filter((sentence) =>
    sentence.toUpperCase().includes(ticker.toUpperCase())
  );

  if (relevantSentences.length === 0) {
    return analyzeSentiment(text);
  }

  const combinedText = relevantSentences.join('. ');
  return analyzeSentiment(combinedText);
};

const cleanText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/https?:\/\/[^\s]+/g, '')
    .replace(/[^\w\s.!?-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const normalizeScore = (comparative: number): number => {
  const normalized = Math.tanh(comparative * 3);

  return Math.round(normalized * 100) / 100;
};

const getSentimentLabel = (score: number): SentimentResult['label'] => {
  if (score >= 0.5) return 'very positive';
  if (score >= 0.15) return 'neutral';
  if (score <= -0.5) return 'very negative';
  if (score <= -0.15) return 'negative';
  return 'neutral';
};

export default {
  analyzeSentiment,
  analyzeBatchSentiment,
  getTickerSentiment,
};
