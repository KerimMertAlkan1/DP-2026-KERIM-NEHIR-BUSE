# DP-2026-KERİM-NEHİR-BUSE
# 🛡️ Site Güvenlik Analiz Platformu

**DP-2026-KERİM-NEHİR-BUSE** - Online alışveriş sitelerinin güvenilirliğini analiz eden modern bir web platformu.

## 📋 Proje Hakkında

Bu platform, kullanıcıların online alışveriş yapmadan önce sitelerin güvenilirliğini kontrol etmelerini sağlayan kapsamlı bir güvenlik analiz sistemidir. Şikayetvar gibi güvenilir platformlardan toplanan gerçek kullanıcı şikayetlerini analiz ederek risk skorları ve detaylı raporlar sunar.

### 🎯 Ana Özellikler

- 🔍 **Anında Site Analizi** - URL girerek sitenin güvenlik durumunu hızlıca öğrenin
- 📊 **Detaylı Raporlar** - Kapsamlı güvenlik analizleri ve risk skorları
- 🛡️ **Güvenli Alışveriş** - Alışveriş öncesi güvenilirlik kontrolü
- 📈 **Sentiment Analizi** - Şikayetlerin duygusal analizi
- 🔄 **Çözülmüş Şikayet Takibi** - Sorunların çözüm durumunu izleme

## 🏗️ Teknoloji Altyapısı

### Frontend
- **React 18.2.0** - Modern ve performanslı kullanıcı arayüzü
- **React Router DOM 6.20.0** - Dinamik yönlendirme sistemi
- **Vite 5.0.8** - Hızlı geliştirme ve build aracı
- **Axios 1.6.2** - HTTP istemcisi

### Backend API
- RESTful API mimarisi
- MongoDB veritabanı entegrasyonu
- Web scraping ile şikayet verisi toplama
- Sentiment analizi motoru

## 🚀 Kurulum ve Çalıştırma

### Ön Gereksinimler
- Node.js (v18 veya üzeri)
- npm veya yarn paket yöneticisi
- MongoDB veritabanı

### Frontend Kurulumu

```bash
# Proje dizinine gidin
cd frontend

# Bağımlılıkları yükleyin
npm install
# veya
yarn install

# Geliştirme sunucusunu başlatın
npm run dev
# veya
yarn dev
```

### Backend Kurulumu

```bash
# Backend dizinine gidin
cd backend

# Bağımlılıkları yükleyin
npm install

# Veritabanını başlatın
npm run init-db

# Sunucuyu çalıştırın
npm run start
```

## 📱 Kullanım

### 1. Site Analizi
1. Ana sayfaya gidin
2. Arama kutusuna analiz edilecek site URL'sini girin
3. "Analiz Et" butonuna tıklayın
4. Otomatik tarama tamamlandığında detaylı raporu görüntüleyin

### 2. Analiz Edilmiş Siteler
- `/sites` sayfasından tüm analiz edilmiş siteleri görüntüleyebilirsiniz
- Her site için risk skorları ve özet bilgiler mevcuttur
- Detaylı rapora ulaşmak için site kartına tıklayın

### 3. Detaylı Rapor
- Risk skoru ve güvenlik seviyesi
- Şikayet sayısı ve çözüm oranları
- Sentiment analizi sonuçları
- Kategorilendirilmiş şikayetler
- Güvenlik önerileri

## 🔧 API Endpoints

### Site Analizi
- `POST /api/analyze` - Site güvenlik analizi başlatır
- `GET /api/site/:domain` - Site detaylarını getirir
- `GET /api/sites` - Tüm analiz edilmiş siteleri listeler

### Sistem Durumu
- `GET /api/health` - API sağlık durumunu kontrol eder
- `GET /api/db-status` - Veritabanı bağlantı durumunu kontrol eder
- `POST /api/init-db` - Veritabanını başlatır

## 🎨 Arayüz Özellikleri

- **Modern Tasarım** - Kullanıcı dostu ve responsive arayüz
- **Animasyonlar** - Akıcı geçişler ve etkileşimli elementler
- **Dark/Light Mod** - Göz yorgunluğunu azaltan tema seçenekleri
- **Mobil Uyumlu** - Tüm cihazlarda sorunsuz çalışma

## 📊 Analiz Süreci

1. **URL Girişi** - Kullanıcı site URL'sini girer
2. **Otomatik Tarama** - Sistem şikayet kaynaklarını tarar
3. **Veri Toplama** - Şikayetler ve yorumlar toplanır
4. **Analiz** - Sentiment analizi ve risk skorlama yapılır
5. **Raporlama** - Kapsamlı güvenlik raporu oluşturulur

## 🔒 Güvenlik Özellikleri

- **Veri Koruma** - Kullanıcı verileri güvenli şekilde saklanır
- **HTTPS** - Güvenli iletişim kanalları
- **Input Validation** - Giriş verileri doğrulanır
- **Rate Limiting** - Aşırı kullanım engellenir

## 🤝 Katkıda Bulunma

1. Projeyi fork edin
2. Geliştirme branch'ini oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inize push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır.

## 👥 Ekip

- **Kerim** - Frontend Geliştirici
- **Nehir** - Backend Geliştirici  
- **Buse** - UI/UX Tasarımcı

