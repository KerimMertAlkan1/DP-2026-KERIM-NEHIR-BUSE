import os
from dotenv import load_dotenv

load_dotenv()

# API Configuration
# 0.0.0.0 = tüm network interface'lerini dinle (tüm IP'lerden erişim)
# localhost veya 127.0.0.1 = sadece local erişim
API_HOST = os.getenv('API_HOST', '0.0.0.0')
API_PORT = int(os.getenv('API_PORT', 5000))
DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'

# Scraping Configuration
SCRAPING_DELAY = int(os.getenv('SCRAPING_DELAY', 2))  # seconds between requests
MAX_RESULTS = int(os.getenv('MAX_RESULTS', 50))

