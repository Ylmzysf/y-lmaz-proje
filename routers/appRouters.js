const express = require("express");
const mysql = require("../data/dbManager");
const router = express.Router();
const qrCode = require("qrcode");
const mysql2 = require('mysql2');

// Body parser middleware'ini ekleyin
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Global sepet değişkenini tanımla
let sepet = [];  // 'let' kullanıyoruz çünkü içeriği değişecek

// Veritabanı bağlantısı
const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Veritabanı şifrenizi buraya girin
    database: 'sisler_cafe'
});

// Önce middleware'i tanımla - SADECE BİR KERE TANIMLANMALI
const checkAuth = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/login');
    }
};

router.get("/aylik-istatistikler", checkAuth, (req, res) => {
    res.render("aylik-istatistikler");
})

router.get("/gunluk-istatistikler", checkAuth, (req, res) => {
    res.render("gunluk-istatistikler");
})
router.get("/menu", checkAuth, (req, res) => {
    const queries = [
        // Kahvaltı (kategori_id: 1)
        'SELECT urun_id, urun_isim, urun_fiyat FROM urunler WHERE kategori_id = 1',
        // Atıştırmalıklar (kategori_id: 2)
        'SELECT urun_id, urun_isim, urun_fiyat FROM urunler WHERE kategori_id = 2',
        // Tatlılar (kategori_id: 3)
        'SELECT urun_id, urun_isim, urun_fiyat FROM urunler WHERE kategori_id = 3',
        // Sıcak İçecekler (kategori_id: 4)
        'SELECT urun_id, urun_isim, urun_fiyat FROM urunler WHERE kategori_id = 4',
        // Kahveler (kategori_id: 5)
        'SELECT urun_id, urun_isim, urun_fiyat FROM urunler WHERE kategori_id = 5',
        // Türk Kahveleri (kategori_id: 6)
        'SELECT urun_id, urun_isim, urun_fiyat FROM urunler WHERE kategori_id = 6',
        // Demleme Bitki Çayları (kategori_id: 7)
        'SELECT urun_id, urun_isim, urun_fiyat FROM urunler WHERE kategori_id = 7',
        // Soğuk İçecekler (kategori_id: 8)
        'SELECT urun_id, urun_isim, urun_fiyat FROM urunler WHERE kategori_id = 8',
        // Soğuk Kahveler (kategori_id: 9)
        'SELECT urun_id, urun_isim, urun_fiyat FROM urunler WHERE kategori_id = 9',
        // Meşrubatlar (kategori_id: 10)
        'SELECT urun_id, urun_isim, urun_fiyat FROM urunler WHERE kategori_id = 10'
    ];

    Promise.all(queries.map(query => {
        return new Promise((resolve, reject) => {
            connection.query(query, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }))
    .then(([kahvalti, atistirmalik, tatli, sicakIcecek, kahve, turkKahve, bitkiCay, sogukIcecek, sogukKahve, mesrubat]) => {
        res.render('menu', {
            kahvaltiDatas: kahvalti,
            atistirmalikDatas: atistirmalik,
            tatliDatas: tatli,
            sicakIcecekDatas: sicakIcecek,
            kahveDatas: kahve,
            turkKahveDatas: turkKahve,
            bitkiCayDatas: bitkiCay,
            sogukIcecekDatas: sogukIcecek,
            sogukKahveDatas: sogukKahve,
            mesrubatDatas: mesrubat,
            sepet: req.session.sepet || []
        });
    })
    .catch(error => {
        console.error('Veritabanı hatası:', error);
        res.status(500).send('Bir hata oluştu');
    });
});

router.get("/", (req, res) => {
    const userUrl = "127.0.0.1:3000/Kullanici-Siparis";
    qrCode.toDataURL(userUrl, (err, url) => {
        if (err) console.log(err);
        res.render("Login", { userData: url });
    })

})
router.get("/index", (req, res) => {
    res.render("index");
})

router.get("/login", (req, res) => {
    res.render("Login", { userData: '' });
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const query = 'SELECT * FROM kullaniciler WHERE kullanici_adi = ? AND sifre = ?';
        const [results] = await mysql.execute(query, [username, password]);

        if (results.length > 0) {
            // Kullanıcı girişi başarılı
            req.session.loggedIn = true;
            req.session.username = username;
            return res.redirect('/siparisler');
        } else {
            // Kullanıcı girişi başarısız
            return res.render('Login', {
                userData: '',
                error: 'Geçersiz kullanıcı adı veya şifre!'
            });
        }
    } catch (error) {
        console.error('Login hatası:', error);
        return res.render('Login', {
            userData: '',
            error: 'Bir hata oluştu!'
        });
    }
});

router.get("/Kullanici-Siparis", async(req, res) => {
    const [urunKahvalti,] = await mysql.execute("SELECT urunler.kategori_id, urunler.urun_id, urunler.urun_isim, urunler.urun_fiyat, kategoriler.kategori_adi FROM urunler INNER JOIN kategoriler ON urunler.kategori_id = kategoriler.kategori_id WHERE kategoriler.kategori_adi = 'Kahvaltı'");
    const [urunAtıstırmalik,] = await mysql.execute("SELECT urunler.kategori_id,urunler.urun_id,urunler.urun_isim,urunler.urun_fiyat,kategoriler.kategori_adi FROM urunler INNER JOIN kategoriler ON urunler.kategori_id=kategoriler.kategori_id WHERE kategoriler.kategori_adi= 'Atıştırmalıklar ve Yiyecekler'");
    const [urunTatli,] = await mysql.execute("SELECT urunler.kategori_id,urunler.urun_id,urunler.urun_isim,urunler.urun_fiyat,kategoriler.kategori_adi FROM urunler INNER JOIN kategoriler ON urunler.kategori_id=kategoriler.kategori_id WHERE kategoriler.kategori_adi= 'Tatlılar'");
    const [urunSicakIcecek,] = await mysql.execute("SELECT urunler.kategori_id,urunler.urun_id,urunler.urun_isim,urunler.urun_fiyat,kategoriler.kategori_adi FROM urunler INNER JOIN kategoriler ON urunler.kategori_id=kategoriler.kategori_id WHERE kategoriler.kategori_adi= 'Sıcak İçecekler'");
    const [urunKahve,] = await mysql.execute("SELECT urunler.kategori_id,urunler.urun_id,urunler.urun_isim,urunler.urun_fiyat,kategoriler.kategori_adi FROM urunler INNER JOIN kategoriler ON urunler.kategori_id=kategoriler.kategori_id WHERE kategoriler.kategori_adi= 'Kahveler'");
    const [urunTurkKahve,] = await mysql.execute("SELECT urunler.kategori_id,urunler.urun_id,urunler.urun_isim,urunler.urun_fiyat,kategoriler.kategori_adi FROM urunler INNER JOIN kategoriler ON urunler.kategori_id=kategoriler.kategori_id WHERE kategoriler.kategori_adi= 'Türk Kahveleri'");
    const [urunBitkiCay,] = await mysql.execute("SELECT urunler.kategori_id,urunler.urun_id,urunler.urun_isim,urunler.urun_fiyat,kategoriler.kategori_adi FROM urunler INNER JOIN kategoriler ON urunler.kategori_id=kategoriler.kategori_id WHERE kategoriler.kategori_adi= 'Demleme Bitki Çayları'");
    const [urunSogukIcecek,] = await mysql.execute("SELECT urunler.kategori_id,urunler.urun_id,urunler.urun_isim,urunler.urun_fiyat,kategoriler.kategori_adi FROM urunler INNER JOIN kategoriler ON urunler.kategori_id=kategoriler.kategori_id WHERE kategoriler.kategori_adi= 'Soğuk İçecekler'");
    const [urunSogukKahve,] = await mysql.execute("SELECT urunler.kategori_id,urunler.urun_id,urunler.urun_isim,urunler.urun_fiyat,kategoriler.kategori_adi FROM urunler INNER JOIN kategoriler ON urunler.kategori_id=kategoriler.kategori_id WHERE kategoriler.kategori_adi= 'Soğuk Kahveler'");
    const [urunMesrubat,] = await mysql.execute("SELECT urunler.kategori_id,urunler.urun_id,urunler.urun_isim,urunler.urun_fiyat,kategoriler.kategori_adi FROM urunler INNER JOIN kategoriler ON urunler.kategori_id=kategoriler.kategori_id WHERE kategoriler.kategori_adi= 'Meşrubatlar'");

    res.render("Kullanici_Ekrani", {
        kahvaltiDatas: urunKahvalti, atistirmalikDatas: urunAtıstırmalik,
        tatliDatas: urunTatli, sicakIcecekDatas: urunSicakIcecek, kahveDatas: urunKahve, turkKahveDatas: urunTurkKahve,
    
        bitkiCayDatas: urunBitkiCay, sogukIcecekDatas: urunSogukIcecek, sogukKahveDatas: urunSogukKahve, mesrubatDatas: urunMesrubat
    });
    
})
router.post("/index", (req, res) => {
    const { username, password } = req.body;
    if (username == "yetkili" && password == "sifre123")
        res.redirect("../index");
    res.redirect("../Kullanici-Siparis")
})

router.delete("/silUrun/:urunId", (req, res) => {
    const urunId = req.params.urunId;


    mysql.execute("DELETE FROM urunler WHERE urun_id = ?", [urunId])
        .then(result => {
            res.json({ success: true });
        })
        .catch(err => {
            console.error(err);
            res.json({ success: false });
        });
});
router.post("/urunEkle", (req, res) => {
    const { isim, fiyat, maliyet, kategoriId } = req.body;

    const sql = 'INSERT INTO urunler (urun_isim, urun_fiyat, urun_maliyet, kategori_id) VALUES (?, ?, ?, ?)';
    mysql.execute(sql, [isim, fiyat, maliyet, kategoriId], (err, results) => {
        if (err) {
            console.error('Veri eklerken hata:', err);
            return res.status(500).json({ success: false, message: 'Bir hata oluştu.' });
        }

        console.log('Veri eklendi:', results);
        res.json({ success: true, message: 'Ürün başarıyla eklendi!' });
    });


    
});

// Sepete ürün ekleme route'u
router.post('/sepete-ekle', (req, res) => {
    const { id, isim, fiyat } = req.body;
    
    // Debug için gelen verileri kontrol et
    console.log('Sepete eklenen ürün:', { id, isim, fiyat });

    if (!req.session.sepet) {
        req.session.sepet = [];
    }

    const urunIndex = req.session.sepet.findIndex(item => item.id === id);

    if (urunIndex !== -1) {
        req.session.sepet[urunIndex].adet++;
    } else {
        req.session.sepet.push({
            id: id,
            isim: isim,
            fiyat: parseFloat(fiyat),
            adet: 1
        });
    }

    res.json({ success: true, sepet: req.session.sepet });
});

// Sepetten azaltma route'u
router.post('/sepet/azalt', (req, res) => {
    const id = parseInt(req.body.id);
    
    if (!req.session.sepet) {
        return res.json({ success: false, error: 'Sepet bulunamadı' });
    }

    const urunIndex = req.session.sepet.findIndex(item => parseInt(item.id) === id);

    if (urunIndex !== -1) {
        req.session.sepet[urunIndex].adet--;
        
        if (req.session.sepet[urunIndex].adet <= 0) {
            req.session.sepet.splice(urunIndex, 1);
        }
        
        res.json({ success: true, sepet: req.session.sepet });
    } else {
        res.json({ success: false, error: 'Ürün bulunamadı' });
    }
});

// Sepet sayfası route'u
router.get('/sepet', (req, res) => {
    res.render('sepet', {
        sepet: req.session.sepet || []
    });
});

// Sipariş onaylama route'u
router.post('/siparis/onayla', (req, res) => {
    const { masaKodu } = req.body;
    
    // Masa kodu kontrolü
    if (!masaKodu || masaKodu < 1 || masaKodu > 20) {
        return res.status(400).json({
            success: false,
            error: 'Geçersiz masa kodu'
        });
    }

    // Sepet kontrolü
    if (!req.session.sepet || req.session.sepet.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Sepet boş'
        });
    }

    // Siparişleri veritabanına ekle
    const siparisPromises = req.session.sepet.map(item => {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO siparisler 
                (masa_kodu, urun_id, adet, siparis_tarih, toplam_fiyat, siparis_durum)
                VALUES (?, ?, ?, NOW(), ?, 1)
            `;
            
            const totalPrice = item.fiyat * item.adet;
            
            connection.query(
                query, 
                [masaKodu, parseInt(item.id), item.adet, totalPrice],
                (err, results) => {
                    if (err) {
                        console.error('Query error:', err);
                        reject(err);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    });

    Promise.all(siparisPromises)
        .then(() => {
            // Sepeti temizle
            req.session.sepet = [];
            res.json({ success: true });
        })
        .catch(err => {
            console.error('Sipariş kayıt hatası:', err);
            res.status(500).json({ 
                success: false, 
                error: 'Sipariş kaydedilirken bir hata oluştu' 
            });
        });
});

// Siparişler sayfası route'u
router.get('/siparisler', checkAuth, (req, res) => {
    const query = `
        SELECT 
            s.siparis_id,
            s.masa_kodu,
            s.adet,
            s.siparis_tarih,
            s.toplam_fiyat,
            s.siparis_durum,
            u.urun_isim,
            k.kategori_adi
        FROM siparisler s
        JOIN urunler u ON s.urun_id = u.urun_id
        JOIN kategoriler k ON u.kategori_id = k.kategori_id
        WHERE s.siparis_durum = 1
        ORDER BY s.siparis_tarih DESC
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Sorgu hatası:', err);
            res.status(500).send('Veritabanı hatası');
            return;
        }

        // Siparişleri masa bazında grupla
        const groupedOrders = {};
        results.forEach(siparis => {
            const masaKey = `masa_${siparis.masa_kodu}`;
            
            if (!groupedOrders[masaKey]) {
                groupedOrders[masaKey] = {
                    masa_kodu: siparis.masa_kodu,
                    siparis_tarih: siparis.siparis_tarih,
                    urunler: [],
                    toplam_tutar: 0
                };
            }

            groupedOrders[masaKey].urunler.push({
                urun_isim: siparis.urun_isim,
                adet: siparis.adet,
                toplam_fiyat: siparis.toplam_fiyat
            });

            groupedOrders[masaKey].toplam_tutar += siparis.toplam_fiyat || 0;
        });

        res.render('siparisler', { 
            siparisler: Object.values(groupedOrders)
        });
    });
});

router.get('/logout', (req, res) => {
    // Oturumu sonlandır
    req.session.destroy((err) => {
        if (err) {
            console.error('Oturum sonlandırma hatası:', err);
        }
        // Logout sayfasına yönlendir
        res.render('logout');
    });
});

// Sipariş onaylama route'u
router.post('/siparis/onayla/:masaKodu', (req, res) => {
    const masaKodu = req.params.masaKodu;
    console.log('Onaylama isteği alındı. Masa kodu:', masaKodu);
    
    const query = `
        UPDATE siparisler 
        SET siparis_durum = 0 
        WHERE masa_kodu = ? AND siparis_durum = 1
    `;

    connection.query(query, [masaKodu], (err, result) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).json({ 
                success: false, 
                error: 'Veritabanı hatası: ' + err.message 
            });
        }

        console.log('Query sonucu:', result);

        if (result.affectedRows > 0) {
            console.log('Sipariş başarıyla onaylandı');
            res.json({ success: true });
        } else {
            console.log('Güncellenecek sipariş bulunamadı');
            res.json({ 
                success: false, 
                error: 'Güncellenecek sipariş bulunamadı' 
            });
        }
    });
});

// Menü güncelleme sayfası
router.get('/menu-guncelle', checkAuth, (req, res) => {
    const kategoriQuery = `
        SELECT * FROM kategoriler 
        ORDER BY kategori_id
    `;

    const urunQuery = `
        SELECT u.*, k.kategori_adi 
        FROM urunler u 
        JOIN kategoriler k ON u.kategori_id = k.kategori_id 
        ORDER BY u.kategori_id ASC, u.urun_isim ASC
    `;

    connection.query(kategoriQuery, (err, kategoriler) => {
        if (err) {
            console.error('Kategori sorgu hatası:', err);
            res.status(500).send('Veritabanı hatası');
            return;
        }

        connection.query(urunQuery, (err, urunler) => {
            if (err) {
                console.error('Ürün sorgu hatası:', err);
                res.status(500).send('Veritabanı hatası');
                return;
            }

            res.render('menu_guncelle', { 
                kategoriler: kategoriler,
                urunler: urunler
            });
        });
    });
});

// Yeni ürün ekleme
router.post('/menu-ekle', (req, res) => {
    const { urun_isim, urun_fiyat, urun_maliyet, kategori_id } = req.body;
    
    const query = `
        INSERT INTO urunler (urun_isim, urun_fiyat, urun_maliyet, kategori_id) 
        VALUES (?, ?, ?, ?)
    `;

    connection.query(query, [urun_isim, urun_fiyat, urun_maliyet, kategori_id], (err, result) => {
        if (err) {
            console.error('Ekleme hatası:', err);
            res.status(500).send('Veritabanı hatası');
            return;
        }

        res.redirect('/menu-guncelle');
    });
});

// Ürün silme
router.delete('/urun-sil/:id', (req, res) => {
    const urunId = req.params.id;
    
    const query = `DELETE FROM urunler WHERE urun_id = ?`;

    connection.query(query, [urunId], (err, result) => {
        if (err) {
            console.error('Silme hatası:', err);
            res.json({ success: false, error: err.message });
            return;
        }

        res.json({ success: true });
    });
});

// Personel listesi sayfası route'u
router.get("/personel-listesi", checkAuth, (req, res) => {
    res.render("personel-listesi");
});

// Personel API route'ları
router.get("/api/personel-listesi", checkAuth, async (req, res) => {
    try {
        const query = `
            SELECT 
                p.personel_id,
                p.ad,
                p.soyad,
                pg.maas_tutari,
                pg.ek_mesai_ucreti,
                pg.toplam_gider,
                pg.odeme_tarihi
            FROM personel p
            LEFT JOIN personel_gider pg ON p.personel_id = pg.personel_id
            ORDER BY p.personel_id ASC
        `;

        connection.query(query, (err, results) => {
            if (err) {
                console.error('Sorgu hatası:', err);
                return res.status(500).json({ 
                    success: false, 
                    error: err.message 
                });
            }

            res.json({
                success: true,
                personeller: results
            });
        });

    } catch (error) {
        console.error('Veritabanı hatası:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Personel ekleme API route'u
router.post("/api/personel-ekle", checkAuth, (req, res) => {
    try {
        console.log('Request body:', req.body); // Debug için

        if (!req.body) {
            return res.status(400).json({
                success: false,
                error: 'Veri gönderilmedi'
            });
        }

        const { ad, soyad, maas_tutari, ek_mesai_ucreti, odeme_tarihi } = req.body;

        if (!ad || !soyad) {
            return res.status(400).json({
                success: false,
                error: 'Ad ve soyad zorunludur'
            });
        }

        const formattedDate = new Date(odeme_tarihi).toISOString().split('T')[0];

        connection.beginTransaction(err => {
            if (err) throw err;

            connection.query(
                'INSERT INTO personel (ad, soyad) VALUES (?, ?)',
                [ad, soyad],
                (err, result) => {
                    if (err) {
                        return connection.rollback(() => {
                            res.status(500).json({ 
                                success: false, 
                                error: err.message 
                            });
                        });
                    }

                    const personelId = result.insertId;

                    connection.query(
                        'INSERT INTO personel_gider (personel_id, maas_tutari, ek_mesai_ucreti, odeme_tarihi) VALUES (?, ?, ?, ?)',
                        [personelId, maas_tutari, ek_mesai_ucreti || 0, formattedDate],
                        (err, result) => {
                            if (err) {
                                return connection.rollback(() => {
                                    res.status(500).json({ 
                                        success: false, 
                                        error: err.message 
                                    });
                                });
                            }

                            connection.commit(err => {
                                if (err) {
                                    return connection.rollback(() => {
                                        res.status(500).json({ 
                                            success: false, 
                                            error: err.message 
                                        });
                                    });
                                }
                                res.json({ success: true });
                            });
                        }
                    );
                }
            );
        });
    } catch (error) {
        console.error('Hata:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Personel listesi endpoint'i
router.get('/personel-listesi', async (req, res) => {
    try {
        const [personeller] = await pool.query(`
            SELECT 
                p.personel_id,
                p.ad,
                p.soyad,
                pg.maas_tutari,
                pg.ek_mesai_ucreti,
                pg.toplam_gider,
                pg.odeme_tarihi
            FROM personel p
            LEFT JOIN personel_gider pg ON p.personel_id = pg.personel_id
            ORDER BY p.personel_id ASC
        `);

        res.json({
            success: true,
            personeller: personeller
        });

    } catch (error) {
        console.error('Veritabanı sorgu hatası:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Personel silme route'u
router.delete("/api/personel-sil/:id", checkAuth, (req, res) => {
    const personelId = req.params.id;
    
    connection.query('DELETE FROM personel WHERE personel_id = ?', [personelId], (err, result) => {
        if (err) {
            console.error('Silme hatası:', err);
            return res.status(500).json({ 
                success: false, 
                error: err.message 
            });
        }

        res.json({ success: true });
    });
});

// Personel güncelleme route'u
router.put("/api/personel-guncelle/:id", checkAuth, (req, res) => {
    const personelId = req.params.id;
    const { ad, soyad, maas_tutari, ek_mesai_ucreti, odeme_tarihi } = req.body;
    
    connection.beginTransaction(err => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                error: err.message 
            });
        }

        // Önce personel bilgilerini güncelle
        connection.query(
            'UPDATE personel SET ad = ?, soyad = ? WHERE personel_id = ?',
            [ad, soyad, personelId],
            (err, result) => {
                if (err) {
                    return connection.rollback(() => {
                        res.status(500).json({ 
                            success: false, 
                            error: err.message 
                        });
                    });
                }

                // Sonra maaş bilgilerini güncelle
                const formattedDate = new Date(odeme_tarihi).toISOString().split('T')[0];
                connection.query(
                    'UPDATE personel_gider SET maas_tutari = ?, ek_mesai_ucreti = ?, odeme_tarihi = ? WHERE personel_id = ?',
                    [maas_tutari, ek_mesai_ucreti || 0, formattedDate, personelId],
                    (err, result) => {
                        if (err) {
                            return connection.rollback(() => {
                                res.status(500).json({ 
                                    success: false, 
                                    error: err.message 
                                });
                            });
                        }

                        connection.commit(err => {
                            if (err) {
                                return connection.rollback(() => {
                                    res.status(500).json({ 
                                        success: false, 
                                        error: err.message 
                                    });
                                });
                            }
                            res.json({ success: true });
                        });
                    }
                );
            }
        );
    });
});

// Sipariş iptal route'u
router.post('/siparis/iptal/:masaKodu', (req, res) => {
    const masaKodu = req.params.masaKodu;

    // Siparişleri veritabanından sil
    const query = `
        DELETE FROM siparisler 
        WHERE masa_kodu = ? AND siparis_durum = 1
    `;

    connection.query(query, [masaKodu], (err, result) => {
        if (err) {
            console.error('Sipariş iptal hatası:', err);
            return res.status(500).json({
                success: false,
                error: 'Sipariş iptal edilirken bir hata oluştu'
            });
        }

        if (result.affectedRows > 0) {
            res.json({
                success: true,
                message: 'Sipariş başarıyla iptal edildi'
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'İptal edilecek sipariş bulunamadı'
            });
        }
    });
});
router.get("/en-begenilenler", checkAuth, (req, res) => {
    const query = `
        SELECT 
            u.urun_id,
            u.urun_isim,
            u.urun_fiyat,
            COALESCE(SUM(s.adet), 0) as toplam_adet,
            COALESCE(SUM(s.adet * u.urun_fiyat), 0) as toplam_satis
        FROM urunler u
        LEFT JOIN siparisler s ON u.urun_id = s.urun_id
        WHERE s.siparis_durum = 0 
        GROUP BY u.urun_id, u.urun_isim, u.urun_fiyat
        ORDER BY toplam_adet DESC
        LIMIT 10
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).send('Bir hata oluştu');
        }

        // Toplam satış tutarını hesapla
        const toplamSatis = results.reduce((total, item) => {
            return total + (item.toplam_satis || 0);
        }, 0);

        // Her ürün için yüzdeyi hesapla
        results = results.map(item => ({
            ...item,
            yuzde: ((item.toplam_satis || 0) / toplamSatis * 100).toFixed(2)
        }));

        res.render('en-begenilenler', { 
            urunler: results,
            toplamSatis: toplamSatis
        });
    });
});

// En çok satanlar API endpoint'i
router.get('/api/en-cok-satanlar', (req, res) => {
    const query = `
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
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).json({ 
                success: false, 
                error: 'Veritabanı hatası' 
            });
        }

        res.json({
            success: true,
            en_cok_satanlar: results
        });
    });
});

module.exports = router;