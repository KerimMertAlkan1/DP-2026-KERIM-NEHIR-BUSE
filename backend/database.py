import json
import os
import logging
from datetime import datetime
from threading import Lock
from typing import Dict, List, Optional, Any

logging.basicConfig(
    level=logging.INFO,
    format='[AKTIF] [%(levelname)s] %(message)s'
)
logger = logging.getLogger(__name__)

class Database:
    def __init__(self, use_pool=True):
        self.use_pool = use_pool  # Kept for compatibility
        self.data_dir = 'data'
        self.sites_file = os.path.join(self.data_dir, 'sites.json')
        self.complaints_file = os.path.join(self.data_dir, 'complaints.json')
        self.scraping_history_file = os.path.join(self.data_dir, 'scraping_history.json')
        self.risk_analysis_file = os.path.join(self.data_dir, 'risk_analysis.json')
        
        # Thread safety
        self._lock = Lock()
        
        # Create data directory if it doesn't exist
        os.makedirs(self.data_dir, exist_ok=True)
        
        # Initialize files if they don't exist
        self._init_files()
        
        self.conn = self  # Mock connection for compatibility
    
    def _init_files(self):
        """Initialize JSON files if they don't exist"""
        files_to_init = {
            self.sites_file: {},
            self.complaints_file: [],
            self.scraping_history_file: [],
            self.risk_analysis_file: []
        }
        
        for file_path, default_data in files_to_init.items():
            if not os.path.exists(file_path):
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(default_data, f, ensure_ascii=False, indent=2)
    
    def _read_json(self, file_path: str) -> Any:
        """Read JSON file with thread safety"""
        with self._lock:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except (FileNotFoundError, json.JSONDecodeError):
                return {} if file_path.endswith('sites.json') else []
    
    def _write_json(self, file_path: str, data: Any):
        """Write JSON file with thread safety"""
        with self._lock:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
    
    def connect(self):
        """Mock connect for compatibility"""
        return True
    
    def close(self, force=False):
        """Mock close for compatibility"""
        pass
    
    def create_tables(self):
        """Mock create_tables for compatibility"""
        logger.info("✓ JSON dosya sistemi hazır")
        return True
    
    def get_or_create_site(self, domain: str) -> int:
        """Site'yi getir veya oluştur"""
        sites = self._read_json(self.sites_file)
        
        # Find existing site
        for site_id, site_data in sites.items():
            if site_data.get('domain') == domain:
                return int(site_id)
        
        # Create new site
        new_id = len(sites) + 1 if sites else 1
        sites[str(new_id)] = {
            'site_id': new_id,
            'domain': domain,
            'site_name': domain.split('.')[0].capitalize(),
            'created_date': datetime.now().isoformat(),
            'last_scanned_date': None,
            'risk_score': 0,
            'status': 'Active'
        }
        
        self._write_json(self.sites_file, sites)
        return new_id
    
    def save_complaint(self, site_id: int, source: str, title: str, content: str, 
                      author: str, date: datetime, rating: int, sentiment: str, 
                      url: str, is_resolved: bool = False) -> bool:
        """Şikayet kaydını kaydet"""
        try:
            complaints = self._read_json(self.complaints_file)
            
            new_complaint = {
                'complaint_id': len(complaints) + 1,
                'site_id': site_id,
                'source': source,
                'title': title,
                'content': content,
                'author': author,
                'date': date.isoformat() if date else None,
                'rating': rating,
                'sentiment': sentiment,
                'url': url,
                'is_resolved': is_resolved,
                'scraped_date': datetime.now().isoformat()
            }
            
            complaints.append(new_complaint)
            self._write_json(self.complaints_file, complaints)
            return True
        except Exception as e:
            logger.error(f"Şikayet kaydetme hatası: {str(e)}")
            return False
    
    def save_scraping_history(self, site_id: int, source: str, status: str, 
                             records_found: int, error_message: str = None, duration: int = None) -> bool:
        """Scraping geçmişini kaydet"""
        try:
            history = self._read_json(self.scraping_history_file)
            
            new_entry = {
                'history_id': len(history) + 1,
                'site_id': site_id,
                'source': source,
                'status': status,
                'records_found': records_found,
                'error_message': error_message,
                'scraped_date': datetime.now().isoformat(),
                'duration': duration
            }
            
            history.append(new_entry)
            self._write_json(self.scraping_history_file, history)
            return True
        except Exception as e:
            logger.error(f"Scraping geçmişi kaydetme hatası: {str(e)}")
            return False
    
    def test_connection(self) -> bool:
        """Mock test_connection for compatibility"""
        return True
    
    def update_site_risk_score(self, site_id: int, risk_score: int) -> bool:
        """Site risk skorunu güncelle"""
        try:
            sites = self._read_json(self.sites_file)
            
            if str(site_id) in sites:
                sites[str(site_id)]['risk_score'] = risk_score
                sites[str(site_id)]['last_scanned_date'] = datetime.now().isoformat()
                self._write_json(self.sites_file, sites)
                return True
            return False
        except Exception as e:
            logger.error(f"Risk skoru güncelleme hatası: {str(e)}")
            return False
    
    def migrate_add_isresolved_column(self) -> bool:
        """Mock migration for compatibility"""
        logger.info("✓ JSON sistemde migration gerekmiyor")
        return True
    
    def get_site_info(self, domain: str) -> Optional[Dict]:
        """Site bilgilerini getir"""
        sites = self._read_json(self.sites_file)
        complaints = self._read_json(self.complaints_file)
        
        # Find site
        site_data = None
        for site_id, site_info in sites.items():
            if site_info.get('domain') == domain:
                site_data = site_info
                site_data['site_id'] = int(site_id)
                break
        
        if not site_data:
            return None
        
        # Get complaints for this site
        site_complaints = [
            complaint for complaint in complaints 
            if complaint.get('site_id') == site_data['site_id']
        ]
        
        site_data['complaints'] = site_complaints
        site_data['total_complaints'] = len(site_complaints)
        
        # Calculate statistics
        resolved_count = sum(1 for c in site_complaints if c.get('is_resolved', False))
        unresolved_count = len(site_complaints) - resolved_count
        negative_count = sum(1 for c in site_complaints if c.get('sentiment') == 'negative')
        positive_count = sum(1 for c in site_complaints if c.get('sentiment') == 'positive')
        
        site_data['statistics'] = {
            'total': len(site_complaints),
            'negative': negative_count,
            'positive': positive_count,
            'neutral': len(site_complaints) - negative_count - positive_count,
            'resolved': resolved_count,
            'unresolved': unresolved_count
        }
        
        return site_data
    
    def get_all_sites(self) -> List[Dict]:
        """Tüm siteleri listele"""
        sites = self._read_json(self.sites_file)
        
        return [
            {
                'domain': site_info.get('domain'),
                'site_name': site_info.get('site_name'),
                'risk_score': site_info.get('risk_score', 0),
                'last_scanned_date': site_info.get('last_scanned_date')
            }
            for site_info in sites.values()
        ]
