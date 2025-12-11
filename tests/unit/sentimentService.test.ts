import { describe, test, expect } from '@jest/globals';
import {
  analyzeSentiment,
  analyzeBatchSentiment,
  getTickerSentiment,
} from '../../src/services/sentimentService';

describe('SentimentService', () => {
  describe('analyzeSentiment', () => {
    test('should return neutral sentiment for empty text', () => {
      const result = analyzeSentiment('');
      expect(result.label).toBe('neutral');
      expect(result.normalizedScore).toBe(0);
    });

    test('should detect very positive sentiment with stock slang', () => {
      const text = 'TSLA is mooning! 🚀 Bullish af, great earnings!';
      const result = analyzeSentiment(text);

      expect(result.label).toBe('very positive');
      expect(result.normalizedScore).toBeGreaterThan(0.5);
      expect(result.positive.length).toBeGreaterThan(0);
    });

    test('should detect positive sentiment', () => {
      const text =
        'The company showed a decent performance, and the stock is looking good. A slight increase is expected.';
      const result = analyzeSentiment(text);

      expect(result.label).toBe('positive');
      expect(result.normalizedScore).toBeGreaterThan(0);
    });

    test('should detect neutral sentiment', () => {
      const text = 'Stock is trading sideways today. Waiting to see what happens.';
      const result = analyzeSentiment(text);

      expect(result.label).toBe('neutral');
      expect(result.normalizedScore).toBeGreaterThanOrEqual(-0.15);
      expect(result.normalizedScore).toBeLessThanOrEqual(0.15);
    });

    test('should detect negative sentiment', () => {
      const text =
        "The company reported some disappointing figures, and the stock saw a minor setback. There's a slight concern.";
      const result = analyzeSentiment(text);

      expect(result.label).toBe('negative');
      expect(result.normalizedScore).toBeLessThan(0);
    });

    test('should detect very negative sentiment', () => {
      const text = 'Stock is crashing! Dump it now, total disaster, getting rekt!';
      const result = analyzeSentiment(text);

      expect(result.label).toBe('very negative');
      expect(result.normalizedScore).toBeLessThan(-0.5);
      expect(result.negative.length).toBeGreaterThan(0);
    });

    test('should recognize stock market lexicon - moon/rocket', () => {
      const text = 'Going to the moon! 🚀';
      const result = analyzeSentiment(text);

      expect(result.normalizedScore).toBeGreaterThan(0);
      expect(result.positive).toContain('moon');
    });

    test('should recognize stock market lexicon - bearish', () => {
      const text = 'Very bearish on this stock';
      const result = analyzeSentiment(text);

      expect(result.normalizedScore).toBeLessThan(0);
      expect(result.negative).toContain('bearish');
    });

    test('should clean URLs from text', () => {
      const text = 'Great stock! Check out https://example.com for more info';
      const result = analyzeSentiment(text);

      expect(result.normalizedScore).toBeGreaterThan(0);
    });

    test('should handle text with only emojis', () => {
      const text = '🚀🚀🚀';
      const result = analyzeSentiment(text);

      expect(result.label).toBe('neutral');
    });
  });

  describe('analyzeBatchSentiment', () => {
    test('should analyze multiple texts', () => {
      const texts = [
        'Great stock, buying more!',
        'Terrible earnings, selling',
        'Neutral outlook for now',
      ];
      const result = analyzeBatchSentiment(texts);

      expect(result.results).toHaveLength(3);
      expect(result.results[0].normalizedScore).toBeGreaterThan(0);
      expect(result.results[1].normalizedScore).toBeLessThan(0);
      expect(typeof result.averageNormalized).toBe('number');
    });

    test('should calculate correct average sentiment', () => {
      const texts = ['Very bullish! 🚀', 'Very bearish'];
      const result = analyzeBatchSentiment(texts);

      expect(result.averageNormalized).toBeGreaterThan(-1);
      expect(result.averageNormalized).toBeLessThan(1);
    });

    test('should handle empty array', () => {
      const result = analyzeBatchSentiment([]);

      expect(result.results).toHaveLength(0);
      expect(result.averageNormalized).toBe(0);
    });

    describe('getTickerSentiment', () => {
      test('should extract sentiment for specific ticker', () => {
        const text = 'TSLA is mooning. GME is crashing, terrible news!';

        const tslaResult = getTickerSentiment(text, 'TSLA');
        const gmeResult = getTickerSentiment(text, 'GME');

        expect(tslaResult.normalizedScore).toBeGreaterThan(0);
        expect(gmeResult.normalizedScore).toBeLessThan(0);
      });

      test('should handle ticker not in text', () => {
        const text = 'AAPL looking good today';
        const result = getTickerSentiment(text, 'TSLA');

        expect(result.normalizedScore).toBeGreaterThan(0);
      });

      test('should be case insensitive for tickers', () => {
        const text = 'tsla is great';
        const result = getTickerSentiment(text, 'TSLA');

        expect(result.normalizedScore).toBeGreaterThan(0);
      });
    });

    describe('Edge cases', () => {
      test('should handle very long text', () => {
        const longText = 'good '.repeat(100);
        const result = analyzeSentiment(longText);

        expect(result.normalizedScore).toBeGreaterThan(0);
        expect(result.tokens.length).toBeGreaterThan(50);
      });

      test('should handle special characters', () => {
        const text = 'Stock is great!!! @#$% Amazing!!!';
        const result = analyzeSentiment(text);

        expect(result.normalizedScore).toBeGreaterThan(0);
      });

      test('should normalize score between -1 and 1', () => {
        const veryPositive = 'amazing excellent fantastic wonderful great'.repeat(10);
        const veryNegative = 'terrible awful horrible bad worst'.repeat(10);

        const posResult = analyzeSentiment(veryPositive);
        const negResult = analyzeSentiment(veryNegative);

        expect(posResult.normalizedScore).toBeGreaterThanOrEqual(-1);
        expect(posResult.normalizedScore).toBeLessThanOrEqual(1);
        expect(negResult.normalizedScore).toBeGreaterThanOrEqual(-1);
        expect(negResult.normalizedScore).toBeLessThanOrEqual(1);
      });
    });
  });
});
