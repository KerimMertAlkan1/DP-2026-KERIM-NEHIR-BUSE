import requests
import logging
import time
from typing import Optional

logger = logging.getLogger(__name__)

class Translator:
    """Google Translate kullanarak metin çevirisi yapar"""
    
    def __init__(self):
        self.base_url = "https://translate.googleapis.com/translate_a/single"
        self.session = requests.Session()
        self.delay = 1  # API limitlerini aşmamak için bekleme süresi
        
    def translate_to_turkish(self, text: str, max_retries: int = 3) -> Optional[str]:
        """
        Metni Türkçe'ye çevirir
        
        Args:
            text: Çevrilecek metin
            max_retries: Maksimum deneme sayısı
            
        Returns:
            Çevrilmiş metin veya None (hata durumunda)
        """
        if not text or not text.strip():
            return text
            
        # Eğer metin zaten Türkçe ise, çevirme
        if self.is_turkish(text):
            logger.debug(f"Metin zaten Türkçe, çevirme atlandı: {text[:50]}...")
            return text
            
        # Metin çok uzunsa kısalt (Google Translate limiti ~5000 karakter)
        if len(text) > 3000:
            text = text[:3000] + "..."
            
        for attempt in range(max_retries):
            try:
                params = {
                    'client': 'gtx',
                    'sl': 'auto',  # source language (auto-detect)
                    'tl': 'tr',    # target language (Turkish)
                    'dt': 't',     # translation
                    'q': text
                }
                
                response = self.session.get(
                    self.base_url, 
                    params=params, 
                    timeout=10,  # Increased timeout
                    headers={
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                )
                response.raise_for_status()
                
                # Google Translate response formatını parse et
                result = response.json()
                
                if result and len(result) > 0 and result[0]:
                    translated_text = ''.join([item[0] for item in result[0] if item[0]])
                    
                    if translated_text and translated_text != text:
                        logger.info(f"Çeviri başarılı: {text[:30]}... -> {translated_text[:30]}...")
                        time.sleep(self.delay)  # Rate limiting
                        return translated_text
                    else:
                        logger.warning(f"Çeviri aynı metni döndürdü: {text[:30]}...")
                        
            except requests.exceptions.Timeout:
                logger.warning(f"Çeviri timeout (deneme {attempt + 1}/{max_retries})")
            except requests.exceptions.RequestException as e:
                logger.warning(f"Çeviri isteği hatası (deneme {attempt + 1}/{max_retries}): {str(e)[:100]}")
            except Exception as e:
                logger.warning(f"Çeviri hatası (deneme {attempt + 1}/{max_retries}): {str(e)[:100]}")
                
            if attempt < max_retries - 1:
                time.sleep(2)  # Longer delay between retries
                    
        logger.error(f"Çeviri başarısız, orijinal metin kullanılıyor: {text[:50]}...")
        return text  # Hata durumunda orijinal metni döndür
    
    def translate_complaint(self, title: str, content: str) -> tuple[str, str]:
        """
        Şikayet başlığını ve içeriğini Türkçe'ye çevirir
        
        Args:
            title: Şikayet başlığı
            content: Şikayet içeriği
            
        Returns:
            (çevrilmiş_başlık, çevrilmiş_içerik) tuple
        """
        # Başlığı çevir
        translated_title = self.translate_to_turkish(title)
        
        # İçeriği çevir
        translated_content = self.translate_to_turkish(content)
        
        # Eğer içerik Türkçe ise ama başlık İngilizce ise, sadece başlığı çevir
        if self.is_turkish(content) and not self.is_turkish(title):
            translated_title = self.translate_to_turkish(title)
            return translated_title, content
            
        # Eğer başlık Türkçe ise ama içerik İngilizce ise, sadece içeriği çevir
        if self.is_turkish(title) and not self.is_turkish(content):
            translated_content = self.translate_to_turkish(content)
            return title, translated_content
            
        return translated_title, translated_content
    
    def is_turkish(self, text: str) -> bool:
        """
        Metnin Türkçe olup olmadığını kontrol eder
        
        Args:
            text: Kontrol edilecek metin
            
        Returns:
            True ise metin Türkçe
        """
        if not text or len(text.strip()) < 3:
            return False
            
        text_lower = text.lower()
        
        # Türkçe karakter kontrolü (en güvenilir yöntem) - sadece Türkçe'ye özgü harfler
        turkish_chars = set('çğıöşü')
        
        # Özel durum: eğer sadece 'ı' karakteri varsa ve diğer Türkçe karakterler yoksa,
        # bu muhtemelen encoding hatasıdır, Türkçe sayma
        has_dotless_i = 'ı' in text_lower
        has_other_turkish_chars = any(char in turkish_chars for char in text_lower if char != 'ı')
        
        if has_other_turkish_chars:
            return True
            
        # Eğer sadece dotless i varsa, diğer kriterlere göre devam et
        if has_dotless_i and not has_other_turkish_chars:
            # Bu durumda kelime analizine devam et, dotless i'yi dikkate alma
            pass
        
        # Türkçe kelime kontrolü (daha kapsamlı liste)
        turkish_word_patterns = [
            ' ve ', ' ile ', ' için ', ' ama ', ' fakat ', ' ancak ', ' çünkü ', ' bu ', ' şu ', ' o ',
            ' bir ', ' iki ', ' üç ', ' dört ', ' beş ', ' çok ', ' az ', ' iyi ', ' kötü ', ' güzel ',
            ' ürün ', ' hizmet ', ' müşteri ', ' sipariş ', ' teslimat ', ' kargo ', ' fiyat ',
            ' gün ', ' hafta ', ' yıl ', ' ay ', ' dakika ', ' saat ', ' para ', ' tl ', ' ₺ ', ' yok ', ' var ', 
            ' değil ', ' değilmi ', ' olmadı ', ' oldu ', ' geldi ', ' gitti ', ' aldı ', ' satın ', ' teslim ',
            ' iade ', ' garanti ', ' sorun ', ' hata ', ' yanlış ', ' doğru ', ' teşekkür ', ' rica ', ' lütfen ',
            ' mümkün ', ' gerçekten ', ' hiç ', ' hiçbir ', ' herhangi ', ' böyle ', ' şöyle ', ' böyle ',
            ' gibi ', ' olarak ', ' içinde ', ' üzerinde ', ' dışında ', ' sonra ', ' önce ', ' şimdi'
        ]
        
        # İngilizce kelimeler kontrolü (daha hassas)
        english_common_words = [
            ' the ', ' and ', ' or ', ' but ', ' in ', ' on ', ' at ', ' to ', ' for ', ' of ', ' with ',
            ' very ', ' good ', ' bad ', ' great ', ' service ', ' delivery ', ' product ', ' quality ',
            ' would ', ' could ', ' should ', ' have ', ' been ', ' this ', ' that ', ' from ',
            ' they ', ' their ', ' what ', ' when ', ' where ', ' how ', ' why ', ' which ',
            ' made ', ' order ', ' customer ', ' support ', ' company ', ' fast ', ' best ',
            ' did ', ' not ', ' work ', ' after ', ' buying ', ' payed ', ' extra ', ' express ',
            ' charged ', ' double ', ' somehow ', ' talk ', ' about ', ' immediately '
        ]
        
        # Metin analiz oranı
        words = text_lower.split()
        if not words:
            return False
            
        # Türkçe kelime sayısı
        turkish_word_count = 0
        for pattern in turkish_word_patterns:
            turkish_word_count += text_lower.count(pattern)
        
        # İngilizce kelime sayısı  
        english_word_count = 0
        for word in english_common_words:
            english_word_count += text_lower.count(word)
        
        # Debug için log
        logger.debug(f"Text: {text_lower[:50]}...")
        logger.debug(f"Turkish words: {turkish_word_count}, English words: {english_word_count}")
        logger.debug(f"Turkish chars: {has_other_turkish_chars}, Dotless i: {has_dotless_i}")
        
        # Türkçe karakter varsa direkt Türkçe kabul et
        if has_other_turkish_chars:
            return True
            
        # Türkçe kelimeler İngilizce kelimelerden fazlaysa Türkçe kabul et
        if turkish_word_count > english_word_count:
            return True
            
        # Eğer sadece İngilizce kelimeler varsa ve Türkçe işareti yoksa İngilizce kabul et
        if english_word_count > 0 and turkish_word_count == 0 and not has_other_turkish_chars:
            return False
            
        # Diğer durumlarda (karışık veya belirsiz) -> İngilizce olarak kabul et (çeviri için daha güvenli)
        return False

# Global translator instance
translator = Translator()
