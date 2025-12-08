INSERT INTO stocks (ticker, company_name) VALUES
  ('AAPL', 'Apple Inc.'),
  ('TSLA', 'Tesla Inc.'),
  ('NVDA', 'NVIDIA Corporation'),
  ('AMD', 'Advanced Micro Devices'),
  ('GME', 'GameStop Corp.'),
  ('AMC', 'AMC Entertainment Holdings'),
  ('SPY', 'SPDR S&P 500 ETF Trust'),
  ('QQQ', 'Invesco QQQ Trust'),
  ('MSFT', 'Microsoft Corporation'),
  ('GOOGL', 'Alphabet Inc.')
ON CONFLICT (ticker) DO NOTHING;
