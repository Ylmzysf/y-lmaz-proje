const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sisler_cafe'
});

router.get('/gunluk-istatistikler', async (req, res) => {
    try {
        const bugun = new Date().toISOString().split('T')[0];
        console.log('Sorgu tarihi:', bugun);

        // Bekleyen siparişler (siparis_durum = 1 olanlar)
        const [bekleyenSiparisler] = await pool.query(`
            SELECT COUNT(*) as count 
            FROM siparisler 
            WHERE DATE(siparis_tarih) = CURDATE()
            AND siparis_durum = 1
        `);

        // Günlük toplam sipariş ve ciro
        const [toplamSiparisler] = await pool.query(`
            SELECT 
                COUNT(*) as count,
                COALESCE(SUM(toplam_fiyat), 0) as toplam_ciro
            FROM siparisler 
            WHERE DATE(siparis_tarih) = CURDATE()
        `);

        console.log('Bekleyen siparişler:', bekleyenSiparisler[0]);
        console.log('Toplam siparişler:', toplamSiparisler[0]);

        res.json({
            success: true,
            bekleyen_siparisler: bekleyenSiparisler[0].count,
            toplam_siparis: toplamSiparisler[0].count,
            gunluk_ciro: toplamSiparisler[0].toplam_ciro || 0
        });

    } catch (error) {
        console.error('Veritabanı sorgu hatası:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message
        });
    }
});

// Yeni endpoint: Son 7 günün gelir, gider ve kar analizi
router.get('/haftalik-analiz', async (req, res) => {
    try {
        console.log('Haftalık analiz sorgusu başladı');

        const [haftalikVeriler] = await pool.query(`
            SELECT 
                s.siparis_tarih,
                s.adet,
                s.toplam_fiyat as gelir,
                u.urun_maliyet as maliyet,
                u.urun_isim
            FROM siparisler s
            JOIN urunler u ON s.urun_id = u.urun_id
            WHERE s.siparis_tarih >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
            ORDER BY s.siparis_tarih ASC
        `);

        console.log('Sorgu sonucu:', haftalikVeriler);

        // Günlük verileri hesapla
        const gunlukOzet = {};
        
        haftalikVeriler.forEach(siparis => {
            const tarih = siparis.siparis_tarih.toISOString().split('T')[0];
            const gunlukGelir = siparis.gelir * siparis.adet;
            const gunlukMaliyet = siparis.maliyet * siparis.adet;
            const gunlukKar = gunlukGelir - gunlukMaliyet;

            if (!gunlukOzet[tarih]) {
                gunlukOzet[tarih] = {
                    gelir: 0,
                    gider: 0,
                    kar: 0
                };
            }

            gunlukOzet[tarih].gelir += gunlukGelir;
            gunlukOzet[tarih].gider += gunlukMaliyet;
            gunlukOzet[tarih].kar += gunlukKar;
        });

        // Son 7 günü doldur (eksik günler için 0 değeri)
        const sonuclar = [];
        const bugun = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const tarih = new Date(bugun);
            tarih.setDate(tarih.getDate() - i);
            const tarihStr = tarih.toISOString().split('T')[0];
            
            sonuclar.push({
                tarih: tarihStr,
                gelir: gunlukOzet[tarihStr]?.gelir || 0,
                gider: gunlukOzet[tarihStr]?.gider || 0,
                kar: gunlukOzet[tarihStr]?.kar || 0
            });
        }

        console.log('İşlenmiş sonuçlar:', sonuclar);

        res.json({
            success: true,
            haftalik_analiz: sonuclar
        });

    } catch (error) {
        console.error('Hata detayı:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message,
            stack: error.stack
        });
    }
});

// Aylık istatistikler endpoint'i
router.get('/aylik-istatistikler', async (req, res) => {
    try {
        const buAy = new Date().toISOString().slice(0, 7); // YYYY-MM formatı
        
        // Aylık kar hesaplama (gelir - gider)
        const [aylikKar] = await pool.query(`
            SELECT 
                COALESCE(SUM(s.toplam_fiyat), 0) as toplam_gelir,
                COALESCE(SUM(s.adet * u.urun_maliyet), 0) as toplam_gider
            FROM siparisler s
            JOIN urunler u ON s.urun_id = u.urun_id
            WHERE DATE_FORMAT(siparis_tarih, '%Y-%m') = ?
        `, [buAy]);

        // Aylık toplam sipariş ve ciro
        const [toplamSiparisler] = await pool.query(`
            SELECT 
                COUNT(*) as count,
                COALESCE(SUM(toplam_fiyat), 0) as toplam_ciro
            FROM siparisler 
            WHERE DATE_FORMAT(siparis_tarih, '%Y-%m') = ?
        `, [buAy]);

        const kar = aylikKar[0].toplam_gelir - aylikKar[0].toplam_gider;

        res.json({
            success: true,
            aylik_kar: kar,
            toplam_siparis: toplamSiparisler[0].count,
            aylik_ciro: toplamSiparisler[0].toplam_ciro || 0
        });

    } catch (error) {
        console.error('Veritabanı sorgu hatası:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message
        });
    }
});

// Son 12 ayın analizi endpoint'i
router.get('/yillik-analiz', async (req, res) => {
    try {
        // Son 12 ayın verilerini getir (mevcut ay dahil)
        const [yillikVeriler] = await pool.query(`
            SELECT 
                DATE_FORMAT(s.siparis_tarih, '%Y-%m') as ay,
                SUM(s.toplam_fiyat) as gelir,
                SUM(s.adet * u.urun_maliyet) as gider
            FROM siparisler s
            JOIN urunler u ON s.urun_id = u.urun_id
            WHERE s.siparis_tarih >= DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 11 MONTH)
            GROUP BY DATE_FORMAT(s.siparis_tarih, '%Y-%m')
            ORDER BY ay ASC
        `);

        // Son 12 ayı doldur (mevcut ay dahil)
        const sonuclar = [];
        const bugun = new Date();
        
        // Başlangıç ayını 11 ay öncesinden başlat
        for (let i = 11; i >= 0; i--) {
            const tarih = new Date(bugun.getFullYear(), bugun.getMonth() - i, 1);
            const ayStr = tarih.toISOString().slice(0, 7);
            
            // Eğer bu ay ise ve veri yoksa, boş bir kayıt oluştur
            const aylikVeri = yillikVeriler.find(item => item.ay === ayStr) || {
                gelir: 0,
                gider: 0
            };
            
            sonuclar.push({
                ay: ayStr,
                gelir: aylikVeri.gelir || 0,
                gider: aylikVeri.gider || 0,
                kar: (aylikVeri.gelir || 0) - (aylikVeri.gider || 0)
            });
        }

        console.log('Yıllık analiz sonuçları:', sonuclar); // Debug için

        res.json({
            success: true,
            yillik_analiz: sonuclar
        });

    } catch (error) {
        console.error('Hata detayı:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message,
            stack: error.stack
        });
    }
});

// En çok satan 10 ürün endpoint'i
router.get('/en-cok-satanlar', async (req, res) => {
    try {
        const [enCokSatanlar] = await pool.query(`
        SELECT 
            u.urun_id,
            u.urun_isim,
            u.urun_fiyat,
            COALESCE(SUM(s.adet), 0) as satis_adedi,
            COALESCE(SUM(s.adet * u.urun_fiyat), 0) as toplam_gelir
        FROM urunler u
        LEFT JOIN siparisler s ON u.urun_id = s.urun_id
        WHERE s.siparis_durum = 0 
        GROUP BY u.urun_id, u.urun_isim, u.urun_fiyat
        ORDER BY satis_adedi DESC
        LIMIT 10
        `);

        res.json({
            success: true,
            en_cok_satanlar: enCokSatanlar
        });

    } catch (error) {
        console.error('Veritabanı sorgu hatası:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message
        });
    }
});

module.exports = router;