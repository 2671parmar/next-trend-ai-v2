# MBS News Scraper

This service scrapes MBS (Mortgage Backed Securities) news from MortgageNewsDaily and stores it in a Supabase database.

## Setup

1. Create a `.env` file with:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the scheduler:
```bash
python scheduler.py
```

The scraper will run every 6 hours and store the data in Supabase. 