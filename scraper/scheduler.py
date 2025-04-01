from apscheduler.schedulers.blocking import BlockingScheduler
from mbs_scraper import MBSScraper
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def scrape_job():
    logger.info("Starting scheduled scrape job")
    scraper = MBSScraper()
    scraper.update_database()
    logger.info("Completed scheduled scrape job")

def main():
    scheduler = BlockingScheduler()
    # Run every 6 hours
    scheduler.add_job(scrape_job, 'interval', hours=6)
    # Also run immediately when started
    scheduler.add_job(scrape_job)
    
    logger.info("Starting scheduler...")
    scheduler.start()

if __name__ == "__main__":
    main()