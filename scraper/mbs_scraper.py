import os
from datetime import datetime, timedelta
import time
import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client
from typing import Dict, List
import logging
from ratelimit import limits, sleep_and_retry
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Supabase setup
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise Exception("Missing Supabase credentials. Please check your .env file.")

logger.info(f"Connecting to Supabase at {SUPABASE_URL}")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class MBSScraper:
    BASE_URL = "https://www.mortgagenewsdaily.com/topic/mbs"
    
    def __init__(self):
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Run in headless mode
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        
        self.driver = webdriver.Chrome(
            service=Service(ChromeDriverManager().install()),
            options=chrome_options
        )
        
    def __del__(self):
        if hasattr(self, 'driver'):
            self.driver.quit()
    
    def scrape_article_list(self) -> List[Dict]:
        """Scrape the main MBS page for article listings using Selenium"""
        try:
            logger.info("Starting to scrape article list")
            self.driver.get(self.BASE_URL)
            logger.info(f"Loading URL: {self.BASE_URL}")
            
            # Wait for the news article list to load
            WebDriverWait(self.driver, 20).until(
                EC.presence_of_element_located((By.CLASS_NAME, "article"))
            )
            
            # Wait specifically for article descriptions to load
            WebDriverWait(self.driver, 20).until(
                EC.presence_of_element_located((By.CLASS_NAME, "article-body"))
            )
            
            # Let the page fully load and render
            time.sleep(8)  # Increased from 5 to 8 seconds
            
            # Get the page source and parse with BeautifulSoup
            soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            articles = []
            
            # Find all article blocks
            article_blocks = soup.find_all('div', class_='article')
            logger.info(f"Found {len(article_blocks)} article blocks")
            
            for article in article_blocks:
                try:
                    # Get article title and URL
                    title_elem = article.find('div', class_='article-title').find('a')
                    if not title_elem:
                        continue
                        
                    title = title_elem.get_text(strip=True)
                    url = title_elem.get('href', '')
                    if not url.startswith('http'):
                        url = f"https://www.mortgagenewsdaily.com{url}"
                    
                    # Get article date
                    date_elem = article.find('div', class_='article-byline')
                    date_text = date_elem.get_text(strip=True) if date_elem else ""
                    
                    # Get article description - try multiple class combinations
                    desc_elem = None
                    for class_name in ['article-body hidden-xs', 'article-body', 'article-content']:
                        desc_elem = article.find('div', class_=class_name)
                        if desc_elem and desc_elem.get_text(strip=True):
                            break
                    
                    description = desc_elem.get_text(strip=True) if desc_elem else ""
                    
                    logger.info(f"Found article: {title}")
                    logger.info(f"Description: {description[:100]}...")  # Log first 100 chars of description
                    
                    # Only append if we have both title and description
                    if title and description:
                        articles.append({
                            'title': title,
                            'url': url,
                            'date': date_text,
                            'description': description
                        })
                except Exception as e:
                    logger.error(f"Error processing individual article block: {e}")
                    continue
            
            logger.info(f"Successfully scraped {len(articles)} articles")
            return articles
            
        except Exception as e:
            logger.error(f"Error scraping article list: {e}")
            return []

    def scrape_article_content(self, url: str) -> str:
        """Scrape the content from an individual article page using Selenium"""
        try:
            logger.info(f"Scraping content from {url}")
            self.driver.get(url)
            
            # Wait for content to load with more specific class
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "article-body"))
            )
            
            # Let the page fully load
            time.sleep(2)
            
            soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            
            # Try different possible content div classes
            content_div = None
            for class_name in ['article-body', 'article-content', 'article-text']:
                content_div = soup.find('div', class_=class_name)
                if content_div:
                    break
            
            if not content_div:
                logger.warning(f"No content div found for {url}")
                return ""
                
            # Extract only paragraph text
            paragraphs = content_div.find_all('p')
            logger.info(f"Found {len(paragraphs)} paragraphs")
            content = ' '.join(p.get_text(strip=True) for p in paragraphs)
            
            return content
            
        except Exception as e:
            logger.error(f"Error scraping article content: {e}")
            return ""

    def truncate_table(self):
        """Truncate the mbs_articles table before starting new scrape"""
        try:
            logger.info("Truncating mbs_articles table")
            result = supabase.table('mbs_articles').delete().neq('id', 0).execute()
            logger.info("Table truncated successfully")
        except Exception as e:
            logger.error(f"Error truncating table: {e}")
            raise e

    def update_database(self):
        """Update Supabase with fresh article data"""
        try:
            logger.info("Starting database update")
            
            # Truncate table first
            self.truncate_table()
            
            # Get articles from main page
            articles = self.scrape_article_list()
            
            for article in articles:
                try:
                    # Always scrape content since we're starting fresh
                    logger.info(f"Processing article: {article['title']}")
                    content = self.scrape_article_content(article['url'])
                    
                    # Insert into database
                    logger.info("Inserting article into database")
                    result = supabase.table('mbs_articles').insert({
                        'title': article['title'],
                        'url': article['url'],
                        'description': article['description'],
                        'content': content,
                        'category': 'Mortgage',
                        'date': datetime.now().isoformat(),
                        'last_scraped': datetime.now().isoformat(),
                        'is_generating': False
                    }).execute()
                    logger.info(f"Insert result: {result}")
                except Exception as e:
                    logger.error(f"Error processing article {article['url']}: {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"Error updating database: {e}")

def main():
    logger.info("Starting MBS scraper")
    scraper = MBSScraper()
    scraper.update_database()
    logger.info("Scraper finished")

if __name__ == "__main__":
    main()