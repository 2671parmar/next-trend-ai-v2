import os
import time
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
from supabase import create_client, Client
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import chromedriver_autoinstaller
from bs4 import BeautifulSoup
import re
import requests

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialize Supabase client
supabase: Client = create_client(
    os.getenv('SUPABASE_URL', ''),
    os.getenv('SUPABASE_SERVICE_KEY', '')
)

class TrendingScraper:
    def __init__(self):
        self.base_url = "https://www.mortgagenewsdaily.com/aroundtheweb"
        
        # Install ChromeDriver that matches the installed Chrome version
        chromedriver_autoinstaller.install()
        
        # Initialize Chrome driver with the same setup as MBS scraper
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Run in headless mode
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
        
        self.driver = webdriver.Chrome(options=chrome_options)
        
    def __del__(self):
        if hasattr(self, 'driver'):
            self.driver.quit()

    def get_content_by_source(self, url: str, source: str) -> Optional[str]:
        """Extract content based on the source website."""
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            
            content = ""
            if source == "CNBC":
                content_div = soup.select_one('div.PageBuilder-col-9.PageBuilder-col.PageBuilder-article')
                if content_div:
                    content = content_div.get_text(strip=True)
            elif source == "Calculated Risk Blog":
                content_div = soup.select_one('div.post.hentry.uncustomized-post-template')
                if content_div:
                    content = content_div.get_text(strip=True)
            elif source == "Marketwatch":
                content_div = soup.select_one('div.column-full.css-j1bzmn')
                if content_div:
                    content = content_div.get_text(strip=True)
            elif source == "Eye on Housing":
                content_div = soup.select_one('div.entry-content')
                if content_div:
                    content = content_div.get_text(strip=True)
            elif source == "PR Newswire":
                content_div = soup.select_one('div.release-body')
                if content_div:
                    content = content_div.get_text(strip=True)
            elif source == "The Basis Point":
                content_div = soup.select_one('div.entry-content')
                if content_div:
                    content = content_div.get_text(strip=True)
            elif source == "Federal Reserve":
                content_div = soup.select_one('div.content')
                if content_div:
                    content = content_div.get_text(strip=True)
            
            if not content:
                logger.warning(f"Warning: No content found for {source} at {url}")
                return None
            
            return content
        except Exception as e:
            logger.error(f"Error fetching content from {url}: {e}")
            return None
            
    def scrape_article_list(self) -> List[Dict[str, Any]]:
        """Scrape the list of articles from the Around the Web page."""
        try:
            logger.info(f"Navigating to {self.base_url}")
            self.driver.get(self.base_url)
            
            # Wait for the article list to load
            WebDriverWait(self.driver, 20).until(
                EC.presence_of_element_located((By.CLASS_NAME, "atw-list-items"))
            )
            
            # Let the page fully load and render
            time.sleep(8)  # Same delay as MBS scraper
            
            # Get the page source and parse with BeautifulSoup
            soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            article_items = soup.find('ul', class_='atw-list-items').find_all('li')
            
            if not article_items:
                logger.error("Could not find article items on the page")
                return []
                
            articles = []
            logger.info(f"Found {len(article_items)} articles")
            
            for item in article_items:
                try:
                    # Extract title and URL from the <a> tag
                    link = item.find('a')
                    if not link:
                        continue
                        
                    title = link.get_text(strip=True)
                    url = link.get('href')
                    
                    if not url or not title:
                        continue
                        
                    # Extract source and date
                    source_span = item.find('span', class_='atw-source')
                    date_span = item.find('span', class_='atw-date')
                    
                    source = source_span.get_text(strip=True) if source_span else "Unknown"
                    date_text = date_span.get_text(strip=True) if date_span else ""
                    
                    # Get article content based on source
                    content = self.get_content_by_source(url, source)
                    
                    logger.info(f"Found article: {title}")
                    logger.info(f"Source: {source}, Date: {date_text}")
                    
                    articles.append({
                        'title': title,
                        'url': url,
                        'description': f"From {source}",  # Using source as part of description
                        'category': source,  # Using source as category
                        'date': date_text,
                        'content': content
                    })
                    
                except Exception as e:
                    logger.error(f"Error processing article: {str(e)}")
                    continue
                    
            logger.info(f"Successfully scraped {len(articles)} articles")
            return articles
            
        except Exception as e:
            logger.error(f"Error scraping article list: {str(e)}")
            return []

    def truncate_table(self):
        """Truncate the trending_articles table."""
        try:
            logger.info("Truncating trending_articles table")
            response = supabase.table('trending_articles').delete().neq('id', 0).execute()
            logger.info("Successfully truncated trending_articles table")
        except Exception as e:
            logger.error(f"Error truncating table: {str(e)}")

    def save_to_database(self, articles: List[Dict[str, Any]]):
        """Save scraped articles to the database."""
        for article in articles:
            try:
                # Parse the date string to a datetime object
                date_str = article['date']
                try:
                    # Example format: "Thu, Apr 3 2025, 8:59 AM"
                    date_obj = datetime.strptime(date_str, "%a, %b %d %Y, %I:%M %p")
                except ValueError:
                    date_obj = datetime.now()

                # Insert new article
                response = supabase.table('trending_articles').insert({
                    'title': article['title'],
                    'url': article['url'],
                    'description': article['description'],
                    'category': article['category'],
                    'content': article['content'],
                    'date': date_obj.isoformat(),
                    'last_scraped': datetime.now().isoformat(),
                    'is_generating': False
                }).execute()
                
                logger.info(f"Inserted new article: {article['title']}")
                    
            except Exception as e:
                logger.error(f"Error saving article to database: {str(e)}")
                continue

def main():
    logger.info("Starting trending articles scraper")
    scraper = TrendingScraper()
    
    # Truncate the table before inserting new data
    scraper.truncate_table()
    
    # Get articles from main page
    articles = scraper.scrape_article_list()
    
    if not articles:
        logger.error("No articles found to scrape")
        return
        
    # Save articles to database
    scraper.save_to_database(articles)
    
    logger.info(f"Scraped and saved {len(articles)} articles")
    logger.info("Scraper finished")

if __name__ == "__main__":
    main() 