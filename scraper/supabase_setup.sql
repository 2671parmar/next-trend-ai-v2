-- Create trending_articles table
CREATE TABLE IF NOT EXISTS trending_articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT UNIQUE NOT NULL,
  description TEXT,
  content TEXT,
  category TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_scraped TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_generating BOOLEAN DEFAULT FALSE
);

-- Create index on url for faster lookups
CREATE INDEX IF NOT EXISTS trending_articles_url_idx ON trending_articles(url);

-- Create index on date for faster sorting
CREATE INDEX IF NOT EXISTS trending_articles_date_idx ON trending_articles(date); 