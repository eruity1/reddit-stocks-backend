-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stocks table
CREATE TABLE IF NOT EXISTS stocks (
  id SERIAL PRIMARY KEY,
  ticker VARCHAR(10) UNIQUE NOT NULL,
  company_name VARCHAR(255),
  first_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_stock_ticker ON stocks(ticker);

CREATE TABLE IF NOT EXISTS mentions (
  id SERIAL PRIMARY KEY,
  stock_id INTEGER NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
  subreddit VARCHAR(100) NOT NULL,
  post_id VARCHAR(50) NOT NULL,
  post_title TEXT,
  post_url TEXT,
  author VARCHAR(100),
  score INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  sentiment_score DECIMAL(3,2) DEFAULT 0.0, -- Range from -1.0 to 1.0
  mentioned_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, stock_id)
);

CREATE INDEX IF NOT EXISTS idx_mentions_stock_id ON mentions(stock_id);
CREATE INDEX IF NOT EXISTS idx_mentions_subreddit ON mentions(subreddit);
CREATE INDEX IF NOT EXISTS idx_mentions_mentioned_at ON mentions(mentioned_at DESC);
CREATE INDEX IF NOT EXISTS idx_mentions_sentiment ON mentions(sentiment_score);

-- Subreddit prefrences
CREATE TABLE IF NOT EXISTS subreddit_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subreddit_name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, subreddit_name)
);

CREATE INDEX IF NOT EXiSTS idx_subreddit_prefs_user_id ON subreddit_preferences(user_id);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stock_id INTEGER NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
  alert_type VARCHAR(50) NOT NULL, --"mention_spike", "sentiment_change"
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_is_read ON alerts(is_read);
CREATE INDEX IF NOT EXISTS idx_alerts_creaeted_at ON alerts(created_at DESC);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language "plpgsql";

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
