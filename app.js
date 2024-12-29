const express = require('express');
const path = require('path');
const session = require('express-session');

// Express app'i oluştur
const app = express();

// API rotalarını içe aktar
const apiRouter = require('./routes/api');

// API rotalarını kullan
app.use('/api', apiRouter);

// Session middleware'ini ekleyin (diğer middleware'lerden önce)
app.use(session({
    secret: 'gizli-anahtar',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // HTTPS kullanmıyorsanız false olmalı
}));

// Body parser middleware'lerini ekleyin
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const http = require('http').createServer(app);
const io = require('socket.io')(http);

// View engine ayarı
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static dosyalar için
app.use(express.static('public'));

// Router'ı import et
const appRouter = require('./routers/appRouters');

// Socket.io'yu router'a geçir
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Route'ları tanımla
app.use('/', appRouter);

// MySQL bağlantısı
const mysql = require('mysql2/promise');

// Veritabanı bağlantı havuzu oluştur
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // MySQL şifreniz varsa buraya ekleyin
    database: 'sisler_cafe',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Kullanıcı ekranı için route
app.get('/Kullanici_Ekrani', async (req, res) => {
    try {
        // Promise.all ile tüm sorguları paralel çalıştır
        const [
            [kahvaltiDatas],
            [atistirmalikDatas],
            [tatliDatas],
            [sicakIcecekDatas],
            [kahveDatas],
            [turkKahveDatas],
            [bitkiCayDatas],
            [sogukIcecekDatas],
            [sogukKahveDatas],
            [mesrubatDatas]
        ] = await Promise.all([
            pool.query("SELECT * FROM urunler WHERE kategori_id = 1"),
            pool.query("SELECT * FROM urunler WHERE kategori_id = 2"),
            pool.query("SELECT * FROM urunler WHERE kategori_id = 3"),
            pool.query("SELECT * FROM urunler WHERE kategori_id = 4"),
            pool.query("SELECT * FROM urunler WHERE kategori_id = 5"),
            pool.query("SELECT * FROM urunler WHERE kategori_id = 6"),
            pool.query("SELECT * FROM urunler WHERE kategori_id = 7"),
            pool.query("SELECT * FROM urunler WHERE kategori_id = 8"),
            pool.query("SELECT * FROM urunler WHERE kategori_id = 9"),
            pool.query("SELECT * FROM urunler WHERE kategori_id = 10")
        ]);

        res.render('Kullanici_Ekrani', {
            kahvaltiDatas,
            atistirmalikDatas,
            tatliDatas,
            sicakIcecekDatas,
            kahveDatas,
            turkKahveDatas,
            bitkiCayDatas,
            sogukIcecekDatas,
            sogukKahveDatas,
            mesrubatDatas
        });
    } catch (err) {
        console.error('Veritabanı hatası:', err);
        res.status(500).send("Veritabanı hatası");
    }
});

// Sepete ekleme route'u
app.post('/sepet/ekle', (req, res) => {
    try {
        if (!req.session.kullaniciSepet) {
            req.session.kullaniciSepet = [];
        }

        const { id, isim, fiyat, adet } = req.body;
        const urunIndex = req.session.kullaniciSepet.findIndex(item => item.id === id);
        
        if (urunIndex > -1) {
            // Ürün varsa adetini artır
            req.session.kullaniciSepet[urunIndex].adet += 1;
        } else {
            // Ürün yoksa yeni ekle
            req.session.kullaniciSepet.push({
                id: id,
                isim: isim,
                fiyat: parseFloat(fiyat),
                adet: 1
            });
        }

        req.session.save(err => {
            if (err) {
                console.error('Session kayıt hatası:', err);
                return res.json({ success: false, error: 'Session kaydedilemedi' });
            }
            res.json({ success: true, sepet: req.session.kullaniciSepet });
        });

    } catch (error) {
        console.error('Sepete ekleme hatası:', error);
        res.json({ success: false, error: 'Ürün eklenirken bir hata oluştu' });
    }
});

// Sepet güncelleme route'u
app.post('/sepet/guncelle', (req, res) => {
    if (!req.session.kullaniciSepet) {
        req.session.kullaniciSepet = [];
    }

    const { id, adet } = req.body;
    const urunIndex = req.session.kullaniciSepet.findIndex(item => item.id === id);

    if (urunIndex > -1) {
        if (adet > 0) {
            req.session.kullaniciSepet[urunIndex].adet = adet;
        } else {
            req.session.kullaniciSepet.splice(urunIndex, 1);
        }
    }

    res.json({ success: true, sepet: req.session.kullaniciSepet });
});

// Sepet bilgisini getirme route'u
app.get('/sepet/get', (req, res) => {
    res.json({ success: true, sepet: req.session.kullaniciSepet || [] });
});

// Sepet sayfası route'u
app.get('/sepet', (req, res) => {
    const sepet = req.session.kullaniciSepet || [];
    const toplamTutar = sepet.reduce((total, item) => {
        return total + (item.fiyat * item.adet);
    }, 0);
    
    res.render('Kullanici_Sepet', { 
        sepet: sepet,
        toplamTutar: toplamTutar.toFixed(2)
    });
});

app.post('/kullanici-sepet/ekle', (req, res) => {
    try {
        const { urunId, urunAdi, urunFiyat, adet } = req.body;
        
        if (!req.session.kullaniciSepet) {
            req.session.kullaniciSepet = [];
        }
        
        let sepet = req.session.kullaniciSepet;
        const urunIndex = sepet.findIndex(item => item.id === urunId);
        
        if (urunIndex > -1) {
            // Ürün varsa adetini güncelle
            sepet[urunIndex].adet = adet;
        } else {
            // Ürün yoksa yeni ekle
            sepet.push({
                id: urunId,
                isim: urunAdi,
                fiyat: parseFloat(urunFiyat),
                adet: adet
            });
        }
        
        req.session.kullaniciSepet = sepet;
        res.json({ success: true, sepet: sepet });
    } catch (error) {
        console.error('Sepete ekleme hatası:', error);
        res.status(500).json({ success: false, error: 'Ürün eklenirken bir hata oluştu' });
    }
});

app.post('/kullanici-sepet/azalt', (req, res) => {
    try {
        const { urunId, adet } = req.body;
        
        if (!req.session.kullaniciSepet) {
            req.session.kullaniciSepet = [];
        }
        
        let sepet = req.session.kullaniciSepet;
        const urunIndex = sepet.findIndex(item => item.id === urunId);
        
        if (urunIndex > -1) {
            if (adet > 0) {
                // Adet güncelle
                sepet[urunIndex].adet = adet;
            } else {
                // Ürünü sepetten kaldır
                sepet.splice(urunIndex, 1);
            }
        }
        
        req.session.kullaniciSepet = sepet;
        res.json({ success: true, sepet: sepet });
    } catch (error) {
        console.error('Sepetten azaltma hatası:', error);
        res.status(500).json({ success: false, error: 'Ürün azaltılırken bir hata oluştu' });
    }
});

app.get('/Kullanici_Sepet', (req, res) => {
    const sepet = req.session.kullaniciSepet || [];
    const toplamTutar = sepet.reduce((total, item) => total + (item.fiyat * item.adet), 0);
    
    res.render('Kullanici_Sepet', {
        sepet: sepet,
        toplamTutar: toplamTutar
    });
});

app.post('/kullanici-siparis/onayla', async (req, res) => {
    try {
        const { masaKodu } = req.body;
        const sepet = req.session.kullaniciSepet || [];
        
        if (sepet.length === 0) {
            return res.json({ success: false, error: 'Sepetiniz boş!' });
        }

        // Siparişleri veritabanına kaydet
        for (const item of sepet) {
            await pool.query(
                `INSERT INTO siparisler 
                (masa_kodu, urun_id, adet, siparis_tarih, toplam_fiyat, siparis_durum) 
                VALUES (?, ?, ?, CURDATE(), ?, 1)`,
                [
                    parseInt(masaKodu),
                    parseInt(item.id),
                    parseInt(item.adet),
                    parseInt(item.fiyat) * parseInt(item.adet) // toplam_fiyat integer olarak kaydedilecek
                ]
            );
        }
        
        // Sepeti temizle
        req.session.kullaniciSepet = [];
        res.json({ success: true });
    } catch (err) {
        console.error('Sipariş kayıt hatası:', err);
        res.json({ success: false, error: 'Sipariş kaydedilemedi: ' + err.message });
    }
});

// Mevcut sepet bilgisini almak için route
app.get('/kullanici-sepet/get', (req, res) => {
    const sepet = req.session.kullaniciSepet || [];
    res.json({ success: true, sepet: sepet });
});

// Sepetten ürün azaltma route'u
app.post('/sepet/azalt', (req, res) => {
    try {
        if (!req.session.kullaniciSepet) {
            return res.json({ success: false, error: 'Sepet bulunamadı' });
        }

        const { id } = req.body;
        const urunIndex = req.session.kullaniciSepet.findIndex(item => item.id === id);
        
        if (urunIndex > -1) {
            req.session.kullaniciSepet[urunIndex].adet -= 1;
            
            if (req.session.kullaniciSepet[urunIndex].adet <= 0) {
                // Ürünü sepetten kaldır
                req.session.kullaniciSepet.splice(urunIndex, 1);
            }

            req.session.save(err => {
                if (err) {
                    console.error('Session kayıt hatası:', err);
                    return res.json({ success: false, error: 'Session kaydedilemedi' });
                }
                res.json({ success: true, sepet: req.session.kullaniciSepet });
            });
        } else {
            res.json({ success: false, error: 'Ürün sepette bulunamadı' });
        }

    } catch (error) {
        console.error('Sepetten azaltma hatası:', error);
        res.json({ success: false, error: 'İşlem sırasında bir hata oluştu' });
    }
});

app.post('/sepet/azalt', (req, res) => {
    try {
        const { urunId } = req.body;
        
        if (!req.session.sepet) {
            req.session.sepet = [];
        }
        
        let sepet = req.session.sepet;
        const urunIndex = sepet.findIndex(item => item.id === urunId);
        
        if (urunIndex > -1) {
            if (sepet[urunIndex].adet > 1) {
                sepet[urunIndex].adet -= 1;
            } else {
                sepet.splice(urunIndex, 1);
            }
        }
        
        req.session.sepet = sepet;
        res.json({ success: true, sepet: sepet });
    } catch (error) {
        console.error('Sepetten azaltma hatası:', error);
        res.status(500).json({ success: false, error: 'Ürün azaltılırken bir hata oluştu' });
    }
});

app.get('/sepet/get', (req, res) => {
    const sepet = req.session.sepet || [];
    res.json({ success: true, sepet: sepet });
});

// Server'ı başlat
const port = 3000;
http.listen(port, () => {
    console.log(`Server ${port} portunda çalışıyor`);
});

// Socket bağlantılarını dinle
io.on('connection', (socket) => {
    console.log('Bir kullanıcı bağlandı');
    
    socket.on('disconnect', () => {
        console.log('Bir kullanıcı ayrıldı');
    });
});