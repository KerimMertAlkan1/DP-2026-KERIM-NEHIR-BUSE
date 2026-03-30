from flask import Flask, request, jsonify
from flask_cors import CORS
from scraper_service import ScraperService
from database import Database
import logging
from config import API_HOST, API_PORT, DEBUG
import signal
import sys

logging.basicConfig(
    level=logging.INFO,
    format='[AKTIF] [%(levelname)s] %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Frontend'den erişim için

# Timeout ayarları (scraping uzun sürebilir)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config['PERMANENT_SESSION_LIFETIME'] = 600  # 10 dakika

scraper_service = ScraperService()

# Graceful shutdown
def signal_handler(sig, frame):
    logger.info('Shutting down gracefully...')
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

@app.route('/', methods=['GET'])
def root():
    """Ana sayfa - API bilgisi"""
    return jsonify({
        'message': 'Site Güvenlik Analizi API',
        'version': '1.0.0',
        'endpoints': {
            'health': '/api/health',
            'analyze': '/api/analyze (POST)',
            'site': '/api/site/<domain>',
            'sites': '/api/sites'
        }
    }), 200

@app.route('/api/health', methods=['GET'])
def health_check():
    """API sağlık kontrolü"""
    return jsonify({'status': 'ok', 'message': 'API çalışıyor'})

@app.route('/api/analyze', methods=['POST'])
def analyze_site():
    """Site analizi başlat (async benzeri - uzun sürebilir)"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Geçersiz istek'}), 400
            
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL gerekli'}), 400
        
        logger.info(f"Site analizi başlatılıyor: {url}")
        
        # Site analizini başlat (bu işlem uzun sürebilir - 5-10 dakika)
        # Not: Production'da background task kullanılmalı
        try:
            result = scraper_service.process_site(url)
            
            if 'error' in result:
                logger.error(f"Analiz hatası: {result.get('error')}")
                return jsonify(result), 500
            
            logger.info(f"Analiz tamamlandı: {result.get('total_complaints', 0)} kayıt bulundu")
            return jsonify(result), 200
            
        except KeyboardInterrupt:
            logger.warning("Analiz kullanıcı tarafından iptal edildi")
            return jsonify({'error': 'Analiz iptal edildi'}), 500
        except Exception as e:
            logger.error(f"Analiz sırasında hata: {str(e)}", exc_info=True)
            return jsonify({'error': f'Analiz hatası: {str(e)}'}), 500
        
    except Exception as e:
        logger.error(f"Analiz endpoint hatası: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

@app.route('/api/site/<domain>', methods=['GET'])
def get_site_info(domain):
    """Site bilgilerini getir"""
    try:
        db = Database()
        site_info = db.get_site_info(domain)
        
        if not site_info:
            return jsonify({'error': 'Site bulunamadı'}), 404
        
        return jsonify(site_info), 200
        
    except Exception as e:
        logger.error(f"Site bilgisi getirme hatası: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/sites', methods=['GET'])
def get_all_sites():
    """Tüm siteleri listele"""
    try:
        db = Database()
        sites = db.get_all_sites()
        return jsonify({'sites': sites}), 200
        
    except Exception as e:
        logger.error(f"Siteleri listeleme hatası: {str(e)}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    # Erişim URL'lerini belirle
    if API_HOST == '0.0.0.0':
        access_urls = [
            f"http://localhost:{API_PORT}",
            f"http://127.0.0.1:{API_PORT}",
            f"http://0.0.0.0:{API_PORT} (tüm interface'ler)"
        ]
    else:
        access_urls = [f"http://{API_HOST}:{API_PORT}"]
    
    if DEBUG:
        logger.info("=" * 60)
        logger.info("🚀 Development Server Başlatılıyor")
        logger.info("=" * 60)
        logger.info("Erişim URL'leri:")
        for url in access_urls:
            logger.info(f"  → {url}")
        logger.info("=" * 60)
        logger.warning("⚠️  Bu bir development server'dır. Production için WSGI server kullanın!")
        logger.info("=" * 60)
        app.run(host=API_HOST, port=API_PORT, debug=DEBUG, threaded=True)
    else:
        # Production modunda Waitress kullan
        try:
            from waitress import serve
            logger.info("=" * 60)
            logger.info("🚀 Scraper Servisi Başlatılıyor")
            logger.info("=" * 60)
            logger.info("Erişim URL'leri:")
            for url in access_urls:
                logger.info(f"  → {url}")
            logger.info("=" * 60)
            serve(app, host=API_HOST, port=API_PORT, threads=4, channel_timeout=600)
        except ImportError:
            logger.warning("Waitress yüklü değil, development server kullanılıyor")
            logger.warning("Production için: pip install waitress")
            logger.info("=" * 60)
            logger.info("🚀 Server Başlatılıyor")
            logger.info("=" * 60)
            logger.info("Erişim URL'leri:")
            for url in access_urls:
                logger.info(f"  → {url}")
            logger.info("=" * 60)
            app.run(host=API_HOST, port=API_PORT, debug=False, threaded=True)

