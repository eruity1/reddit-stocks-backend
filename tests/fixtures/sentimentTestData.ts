export const testPosts = [
  {
    text: 'TSLA absolutely crushing it! 🚀🚀🚀 Earnings beat expectations by 30%, production up, margins improving. This is going to moon so hard. Loading up on calls!',
    ticker: 'TSLA',
    expectedSentiment: 'very positive',
  },
  {
    text: 'Just bought more NVDA. AI boom is real, revenue surge continues, and they just announced new partnerships. Bullish long term. Diamond hands! 💎🙌',
    ticker: 'NVDA',
    expectedSentiment: 'very positive',
  },

  {
    text: 'AAPL looking solid. New iPhone sales are good, services revenue growing. Not exciting but steady gains expected.',
    ticker: 'AAPL',
    expectedSentiment: 'positive',
  },
  {
    text: 'Picked up some MSFT shares today. Cloud business is strong and AI integration looks promising. Good long-term hold.',
    ticker: 'MSFT',
    expectedSentiment: 'positive',
  },

  {
    text: 'Anyone have thoughts on SPY? Market seems flat today, not sure which way it will go.',
    ticker: 'SPY',
    expectedSentiment: 'neutral',
  },
  {
    text: 'AAPL trading sideways. Waiting to see what happens with earnings.',
    ticker: 'AAPL',
    expectedSentiment: 'neutral',
  },

  {
    text: 'GME bagholders in shambles. Stock keeps dropping, no catalyst in sight. Should have sold at $300.',
    ticker: 'GME',
    expectedSentiment: 'negative',
  },
  {
    text: 'NKLA looking weak. More bad news about production delays. Might sell soon.',
    ticker: 'NKLA',
    expectedSentiment: 'negative',
  },

  {
    text: 'HOOD absolutely tanking. Another data breach, customers leaving in droves, terrible earnings. This is going to zero. Selling all my shares.',
    ticker: 'HOOD',
    expectedSentiment: 'very negative',
  },
  {
    text: 'Stay away from WISH. Total scam company, revenue collapsing, massive losses. Anyone still holding is going to get rekt.',
    ticker: 'WISH',
    expectedSentiment: 'very negative',
  },

  {
    text: 'AMC was pumping earlier but now dumping. Volatility is crazy. Not sure if I should hold or sell.',
    ticker: 'AMC',
    expectedSentiment: 'neutral',
  },
];

export const wallStreetBetsExamples = [
  "YOLO $50k into TSLA calls 🚀 This is either going to moon or I'm eating ramen for a year",
  'Diamond hands on GME! Not selling until we hit $1000 💎🙌',
  "Lost everything on SPY puts. Wife's boyfriend is not happy.",
  'AMD to the moon! 🚀🚀🚀 Lisa Su is a goddess',
  "Buying the dip on PLTR. Either retirement or Wendy's dumpster.",
];

export const stocksSubredditExamples = [
  'MSFT continues to show strong fundamentals. Cloud growth remains impressive and valuation is reasonable.',
  "Concerned about AAPL's growth slowing. China sales declining and competition increasing.",
  'KO is a solid dividend play. Not exciting but reliable income.',
  'TSLA valuation seems stretched. P/E ratio is concerning despite growth.',
  'Accumulating GOOGL on this dip. Search dominance and cloud business justify current prices.',
];

export const sentimentEdgeCases = [
  {
    text: '',
    expectedSentiment: 'neutral',
  },
  {
    text: '🚀🚀🚀🚀🚀',
    expectedSentiment: 'neutral',
  },
  {
    text: 'TSLA TSLA TSLA TSLA',
    expectedSentiment: 'neutral',
  },
  {
    text: 'This is not about stocks at all. Just random text about my day.',
    expectedSentiment: 'neutral',
  },
];
