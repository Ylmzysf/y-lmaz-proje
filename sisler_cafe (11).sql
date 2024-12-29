-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1:3306
-- Üretim Zamanı: 29 Ara 2024, 15:22:42
-- Sunucu sürümü: 8.3.0
-- PHP Sürümü: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `sisler_cafe`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `kategoriler`
--

DROP TABLE IF EXISTS `kategoriler`;
CREATE TABLE IF NOT EXISTS `kategoriler` (
  `kategori_id` int NOT NULL,
  `kategori_adi` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_turkish_ci NOT NULL,
  PRIMARY KEY (`kategori_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;

--
-- Tablo döküm verisi `kategoriler`
--

INSERT INTO `kategoriler` (`kategori_id`, `kategori_adi`) VALUES
(1, 'Kahvaltı'),
(2, 'Atıştırmalıklar ve Yiyecekler'),
(3, 'Tatlılar'),
(4, 'Sıcak İçecekler'),
(5, 'Kahveler'),
(6, 'Türk Kahveleri'),
(7, 'Demleme Bitki Çayları'),
(8, 'Soğuk İçecekler'),
(9, 'Soğuk Kahveler'),
(10, 'Meşrubatlar');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `kullaniciler`
--

DROP TABLE IF EXISTS `kullaniciler`;
CREATE TABLE IF NOT EXISTS `kullaniciler` (
  `kullanici_adi` varchar(20) COLLATE utf8mb3_turkish_ci NOT NULL,
  `sifre` varchar(20) COLLATE utf8mb3_turkish_ci NOT NULL,
  PRIMARY KEY (`kullanici_adi`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;

--
-- Tablo döküm verisi `kullaniciler`
--

INSERT INTO `kullaniciler` (`kullanici_adi`, `sifre`) VALUES
('admin', '12345');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `personel`
--

DROP TABLE IF EXISTS `personel`;
CREATE TABLE IF NOT EXISTS `personel` (
  `personel_id` int NOT NULL AUTO_INCREMENT,
  `ad` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `soyad` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  PRIMARY KEY (`personel_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

--
-- Tablo döküm verisi `personel`
--

INSERT INTO `personel` (`personel_id`, `ad`, `soyad`) VALUES
(4, 'yusuf', 'yılmaz'),
(5, 'batuhan', 'yüksel'),
(10, 'ferdi', 'kadıoğlu');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `personel_gider`
--

DROP TABLE IF EXISTS `personel_gider`;
CREATE TABLE IF NOT EXISTS `personel_gider` (
  `gider_id` int NOT NULL AUTO_INCREMENT,
  `personel_id` int NOT NULL,
  `maas_tutari` decimal(10,2) NOT NULL,
  `ek_mesai_ucreti` decimal(10,2) DEFAULT '0.00',
  `toplam_gider` decimal(10,2) GENERATED ALWAYS AS ((`maas_tutari` + `ek_mesai_ucreti`)) STORED,
  `odeme_tarihi` date NOT NULL,
  PRIMARY KEY (`gider_id`),
  KEY `personel_id` (`personel_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

--
-- Tablo döküm verisi `personel_gider`
--

INSERT INTO `personel_gider` (`gider_id`, `personel_id`, `maas_tutari`, `ek_mesai_ucreti`, `odeme_tarihi`) VALUES
(5, 4, 19000.00, 1500.00, '2024-12-31'),
(7, 5, 14665.00, 1860.00, '2024-12-03'),
(11, 10, 370000.00, 20000.00, '2024-12-05');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `siparisler`
--

DROP TABLE IF EXISTS `siparisler`;
CREATE TABLE IF NOT EXISTS `siparisler` (
  `siparis_id` int NOT NULL AUTO_INCREMENT,
  `masa_kodu` int NOT NULL,
  `urun_id` int NOT NULL,
  `adet` int NOT NULL,
  `siparis_tarih` date NOT NULL,
  `toplam_fiyat` int DEFAULT NULL,
  `siparis_durum` tinyint(1) NOT NULL,
  PRIMARY KEY (`siparis_id`),
  KEY `masa_kodu` (`masa_kodu`),
  KEY `urun_id` (`urun_id`)
) ENGINE=InnoDB AUTO_INCREMENT=290 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;

--
-- Tablo döküm verisi `siparisler`
--

INSERT INTO `siparisler` (`siparis_id`, `masa_kodu`, `urun_id`, `adet`, `siparis_tarih`, `toplam_fiyat`, `siparis_durum`) VALUES
(1, 1, 18, 0, '2024-12-27', NULL, 0),
(2, 1, 66, 5, '2024-12-27', NULL, 0),
(3, 1, 58, 3, '2024-12-27', NULL, 0),
(4, 1, 22, 1, '2024-12-27', 195, 0),
(5, 1, 18, 1, '2024-12-27', 170, 0),
(6, 1, 145, 1, '2024-12-27', 100, 0),
(7, 1, 9, 1, '2024-10-27', 280, 0),
(8, 1, 36, 1, '2024-12-27', 230, 0),
(19, 17, 30, 1, '2024-12-27', 125, 0),
(24, 5, 18, 1, '2024-12-27', 170, 0),
(26, 10, 23, 1, '2024-12-27', 210, 0),
(27, 10, 20, 1, '2024-12-27', 195, 0),
(28, 10, 24, 1, '2024-12-27', 115, 0),
(29, 10, 25, 1, '2024-12-27', 135, 0),
(34, 6, 31, 1, '2024-12-28', 125, 0),
(35, 6, 42, 1, '2024-12-28', 250, 0),
(38, 18, 30, 1, '2024-12-28', 125, 0),
(39, 18, 27, 1, '2024-12-28', 180, 0),
(40, 18, 17, 1, '2024-12-28', 170, 0),
(41, 3, 32, 1, '2024-12-28', 135, 0),
(42, 3, 31, 1, '2024-12-28', 125, 0),
(43, 3, 24, 1, '2024-12-28', 115, 0),
(44, 3, 25, 1, '2024-11-28', 135, 0),
(46, 14, 145, 1, '2024-12-26', 100, 0),
(47, 14, 30, 2, '2024-12-28', 250, 0),
(48, 14, 31, 1, '2024-12-28', 125, 0),
(49, 14, 32, 2, '2024-12-28', 270, 0),
(50, 14, 24, 1, '2024-12-28', 115, 0),
(51, 14, 25, 1, '2024-12-28', 135, 0),
(52, 14, 9, 1, '2024-12-28', 280, 0),
(53, 14, 26, 1, '2024-12-28', 115, 0),
(54, 14, 33, 1, '2024-12-28', 220, 0),
(56, 10, 30, 15, '2024-12-28', 1875, 0),
(58, 19, 18, 14, '2024-12-28', 2380, 0),
(59, 19, 22, 4, '2024-12-28', 780, 0),
(60, 5, 22, 2, '2024-12-28', 390, 0),
(61, 5, 23, 5, '2024-12-28', 1050, 0),
(62, 3, 18, 3, '2024-12-28', 510, 0),
(63, 3, 30, 9, '2024-12-28', 1125, 0),
(65, 3, 9, 7, '2024-12-28', 1960, 0),
(67, 4, 145, 4, '2024-12-28', 400, 0),
(68, 4, 25, 1, '2024-12-28', 135, 0),
(69, 1, 15, 2, '2024-12-28', 400, 0),
(70, 1, 29, 1, '2024-12-28', 160, 0),
(71, 1, 43, 1, '2024-12-28', 265, 0),
(72, 1, 34, 1, '2024-12-28', 230, 0),
(73, 1, 39, 1, '2024-12-28', 250, 0),
(74, 18, 23, 4, '2024-12-28', 840, 0),
(75, 18, 20, 1, '2024-12-28', 195, 0),
(76, 18, 22, 2, '2024-12-28', 390, 0),
(77, 18, 18, 4, '2024-12-28', 680, 0),
(78, 11, 23, 6, '2024-12-28', 1260, 0),
(79, 11, 20, 1, '2024-12-28', 195, 0),
(80, 12, 53, 1, '2024-12-28', 95, 0),
(81, 12, 54, 1, '2024-12-28', 60, 0),
(82, 12, 57, 5, '2024-12-28', 250, 0),
(83, 12, 56, 4, '2024-12-28', 100, 0),
(84, 12, 60, 1, '2024-12-28', 105, 0),
(85, 12, 57, 1, '2024-12-28', 50, 0),
(86, 12, 56, 1, '2024-12-28', 25, 0),
(87, 12, 53, 1, '2024-12-28', 95, 0),
(88, 12, 61, 3, '2024-12-28', 300, 0),
(89, 20, 60, 1, '2024-12-28', 105, 0),
(90, 20, 57, 1, '2024-12-28', 50, 0),
(91, 20, 61, 3, '2024-12-28', 300, 0),
(92, 1, 56, 17, '2024-12-28', 425, 0),
(93, 14, 76, 5, '2024-12-28', 425, 0),
(94, 14, 75, 1, '2024-12-28', 80, 0),
(95, 14, 73, 1, '2024-12-28', 85, 0),
(96, 14, 62, 1, '2024-12-28', 95, 0),
(97, 14, 61, 1, '2024-12-28', 100, 0),
(98, 14, 77, 1, '2024-12-28', 75, 0),
(99, 14, 78, 1, '2024-12-28', 90, 0),
(100, 14, 79, 1, '2024-12-28', 85, 0),
(103, 6, 145, 2, '2024-12-28', 200, 0),
(106, 11, 20, 1, '2024-12-28', 195, 0),
(107, 11, 22, 1, '2024-12-28', 195, 0),
(110, 11, 12, 1, '2024-12-28', 180, 0),
(111, 11, 11, 1, '2024-12-28', 115, 0),
(112, 2, 22, 1, '2024-12-28', 195, 0),
(113, 2, 20, 1, '2024-12-28', 195, 0),
(114, 2, 18, 1, '2024-12-28', 170, 0),
(116, 12, 18, 5, '2024-12-28', 850, 0),
(119, 12, 22, 2, '2024-12-28', 390, 0),
(120, 5, 27, 1, '2024-12-28', 180, 0),
(121, 5, 31, 1, '2024-12-28', 125, 0),
(122, 5, 32, 1, '2024-12-28', 135, 0),
(123, 5, 24, 1, '2024-12-28', 115, 0),
(124, 5, 25, 1, '2024-12-28', 135, 0),
(125, 5, 17, 11, '2024-12-28', 1870, 0),
(126, 7, 18, 2, '2024-12-28', 340, 0),
(127, 7, 20, 3, '2024-12-28', 585, 0),
(128, 7, 22, 3, '2024-12-28', 585, 0),
(129, 4, 20, 2, '2024-12-28', 390, 0),
(130, 4, 22, 3, '2024-12-28', 585, 0),
(131, 4, 23, 3, '2024-12-28', 630, 0),
(132, 2, 20, 1, '2024-12-28', 195, 0),
(133, 2, 22, 3, '2024-12-28', 585, 0),
(134, 2, 23, 2, '2024-12-28', 420, 0),
(135, 10, 20, 1, '2024-12-28', 195, 0),
(136, 10, 22, 3, '2024-12-28', 585, 0),
(137, 10, 23, 3, '2024-12-28', 630, 0),
(138, 1, 20, 3, '2024-12-28', 585, 0),
(139, 1, 22, 3, '2024-12-28', 585, 0),
(140, 1, 20, 3, '2024-12-28', 585, 0),
(141, 1, 18, 3, '2024-12-28', 510, 0),
(142, 7, 22, 4, '2024-12-28', 780, 0),
(143, 7, 20, 3, '2024-12-28', 585, 0),
(144, 7, 18, 3, '2024-12-28', 510, 0),
(145, 1, 20, 8, '2024-12-28', 1560, 0),
(146, 1, 22, 2, '2024-12-28', 390, 0),
(147, 1, 18, 2, '2024-12-28', 340, 0),
(148, 9, 18, 3, '2024-12-28', 510, 0),
(149, 9, 20, 4, '2024-12-28', 780, 0),
(150, 5, 20, 4, '2024-12-28', 780, 0),
(151, 5, 22, 4, '2024-12-28', 780, 0),
(152, 6, 20, 3, '2024-12-28', 585, 0),
(153, 6, 22, 3, '2024-12-28', 585, 0),
(154, 6, 23, 2, '2024-12-28', 420, 0),
(155, 10, 20, 3, '2024-12-28', 585, 0),
(156, 10, 22, 3, '2024-12-28', 585, 0),
(157, 10, 23, 4, '2024-12-28', 840, 0),
(158, 20, 20, 5, '2024-12-28', 975, 0),
(159, 20, 18, 6, '2024-12-28', 1020, 0),
(160, 20, 22, 6, '2024-12-28', 1170, 0),
(161, 20, 23, 3, '2024-12-28', 630, 0),
(165, 10, 18, 3, '2024-12-28', 510, 0),
(166, 10, 20, 2, '2024-12-28', 390, 0),
(167, 10, 22, 2, '2024-12-28', 390, 0),
(168, 3, 18, 3, '2024-12-28', 510, 0),
(169, 3, 20, 2, '2024-12-28', 390, 0),
(170, 3, 22, 1, '2024-12-28', 195, 0),
(171, 20, 18, 1, '2024-12-28', 170, 0),
(172, 20, 20, 3, '2024-12-28', 585, 0),
(173, 20, 22, 3, '2024-12-28', 585, 0),
(174, 20, 23, 3, '2024-12-28', 630, 0),
(176, 20, 145, 2, '2024-12-28', 200, 0),
(177, 9, 18, 2, '2024-12-28', 340, 0),
(178, 9, 20, 1, '2024-12-28', 195, 0),
(179, 9, 22, 2, '2024-12-28', 390, 0),
(180, 8, 18, 2, '2024-12-28', 340, 0),
(181, 8, 20, 2, '2024-12-28', 390, 0),
(182, 8, 22, 2, '2024-12-28', 390, 0),
(184, 15, 23, 2, '2024-12-28', 420, 0),
(185, 7, 18, 3, '2024-12-28', 510, 0),
(186, 7, 20, 2, '2024-12-28', 390, 0),
(187, 7, 22, 2, '2024-12-28', 390, 0),
(188, 20, 18, 4, '2024-12-28', 680, 0),
(189, 20, 23, 2, '2024-12-28', 420, 0),
(191, 10, 18, 2, '2024-12-28', 340, 0),
(192, 10, 20, 2, '2024-12-28', 390, 0),
(193, 10, 9, 2, '2024-12-28', 560, 0),
(194, 11, 13, 2, '2024-12-28', 240, 0),
(195, 11, 27, 1, '2024-12-28', 180, 0),
(196, 11, 25, 1, '2024-12-28', 135, 0),
(197, 11, 24, 1, '2024-12-28', 115, 0),
(198, 16, 18, 2, '2024-12-28', 340, 0),
(199, 16, 20, 2, '2024-12-28', 390, 0),
(200, 16, 22, 2, '2024-12-28', 390, 0),
(201, 8, 15, 1, '2024-12-28', 200, 0),
(202, 8, 14, 1, '2024-12-28', 190, 0),
(203, 8, 13, 1, '2024-12-28', 120, 0),
(204, 8, 12, 4, '2024-12-28', 720, 0),
(205, 6, 18, 1, '2024-12-28', 170, 0),
(206, 6, 10, 1, '2024-12-28', 135, 0),
(207, 6, 57, 1, '2024-12-28', 50, 0),
(208, 6, 92, 1, '2024-12-28', 85, 0),
(209, 4, 18, 2, '2024-12-28', 340, 0),
(210, 4, 23, 2, '2024-12-28', 420, 0),
(211, 4, 22, 1, '2024-12-28', 195, 0),
(212, 4, 20, 1, '2024-12-28', 195, 0),
(213, 4, 61, 1, '2024-12-28', 100, 0),
(214, 4, 62, 1, '2024-12-28', 95, 0),
(215, 4, 73, 2, '2024-12-28', 170, 0),
(216, 4, 78, 1, '2024-12-28', 90, 0),
(217, 6, 23, 1, '2024-12-28', 210, 0),
(218, 6, 27, 1, '2024-12-28', 180, 0),
(219, 6, 60, 1, '2024-12-28', 105, 0),
(220, 9, 18, 2, '2024-12-28', 340, 0),
(221, 12, 18, 1, '2024-12-28', 170, 0),
(222, 12, 22, 1, '2024-12-28', 195, 0),
(223, 12, 145, 1, '2024-12-28', 100, 0),
(224, 1, 22, 3, '2024-12-28', 585, 0),
(225, 5, 44, 1, '2024-06-28', 30, 0),
(226, 5, 48, 1, '2024-12-28', 170, 0),
(227, 5, 51, 1, '2024-12-28', 160, 0),
(228, 5, 61, 1, '2024-12-28', 100, 0),
(229, 10, 20, 1, '2024-12-28', 195, 0),
(230, 10, 22, 1, '2024-12-28', 195, 0),
(231, 10, 23, 1, '2024-12-28', 210, 0),
(232, 7, 18, 2, '2024-12-29', 340, 0),
(233, 7, 20, 2, '2024-12-29', 390, 0),
(234, 10, 18, 1, '2024-07-29', 170, 0),
(235, 10, 20, 2, '2024-08-29', 390, 0),
(236, 10, 22, 2, '2024-12-29', 390, 0),
(237, 19, 18, 2, '2024-12-29', 340, 0),
(238, 19, 22, 2, '2024-12-29', 390, 0),
(239, 19, 20, 2, '2024-12-29', 390, 0),
(240, 20, 77, 10, '2024-12-29', 750, 0),
(241, 20, 63, 2, '2024-12-29', 150, 0),
(242, 20, 68, 3, '2024-12-29', 360, 0),
(243, 20, 140, 2, '2024-12-29', 120, 0),
(253, 2, 18, 2, '2024-12-29', 340, 0),
(254, 2, 20, 2, '2024-12-29', 390, 0),
(257, 1, 164, 24, '2024-12-29', 11472, 0),
(262, 15, 18, 5, '2024-12-29', 850, 0),
(263, 15, 23, 4, '2024-12-29', 840, 0),
(264, 15, 22, 1, '2024-12-29', 195, 0),
(265, 15, 20, 1, '2024-12-29', 195, 0),
(266, 4, 18, 1, '2024-12-29', 170, 0),
(267, 4, 20, 1, '2024-12-29', 195, 0),
(268, 20, 18, 2, '2024-12-29', 340, 0),
(269, 20, 166, 2, '2024-12-29', 356, 0),
(270, 20, 164, 1, '2024-12-29', 478, 0),
(271, 20, 163, 1, '2024-12-29', 150, 0),
(272, 14, 18, 4, '2024-12-29', 680, 0),
(273, 14, 145, 1, '2024-12-29', 100, 0),
(274, 14, 23, 1, '2024-12-29', 210, 0),
(275, 14, 163, 1, '2024-12-29', 150, 0),
(276, 19, 18, 3, '2024-12-29', 510, 1),
(277, 19, 22, 2, '2024-12-29', 390, 1),
(278, 19, 20, 2, '2024-12-29', 390, 1),
(279, 19, 17, 1, '2024-12-29', 170, 1),
(280, 19, 16, 1, '2024-12-29', 80, 1),
(281, 5, 23, 3, '2024-12-29', 630, 1),
(282, 5, 22, 1, '2024-12-29', 195, 1),
(283, 5, 20, 2, '2024-12-29', 390, 1),
(284, 5, 18, 3, '2024-12-29', 510, 1),
(285, 5, 163, 1, '2024-12-29', 150, 1),
(286, 5, 34, 1, '2024-12-29', 230, 1),
(287, 5, 33, 1, '2024-12-29', 220, 1),
(288, 5, 35, 1, '2024-12-29', 230, 1),
(289, 5, 46, 2, '2024-12-29', 360, 1);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `urunler`
--

DROP TABLE IF EXISTS `urunler`;
CREATE TABLE IF NOT EXISTS `urunler` (
  `urun_id` int NOT NULL AUTO_INCREMENT,
  `urun_isim` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_turkish_ci NOT NULL,
  `urun_fiyat` int NOT NULL,
  `urun_maliyet` int NOT NULL,
  `kategori_id` int DEFAULT NULL,
  PRIMARY KEY (`urun_id`),
  KEY `kategori_id` (`kategori_id`)
) ENGINE=InnoDB AUTO_INCREMENT=168 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;

--
-- Tablo döküm verisi `urunler`
--

INSERT INTO `urunler` (`urun_id`, `urun_isim`, `urun_fiyat`, `urun_maliyet`, `kategori_id`) VALUES
(9, 'Burger Tabağı', 280, 130, 2),
(10, 'Sosis Tava', 135, 80, 2),
(11, 'Patates Tabağı', 115, 50, 2),
(12, 'Sisler Atıştırmalık Tabağı', 180, 90, 2),
(13, 'Sigara Böreği', 120, 50, 2),
(14, 'Paçanga Böreği', 190, 90, 2),
(15, 'Tortilla', 200, 90, 2),
(16, 'Kurabiye Tabağı', 80, 20, 2),
(17, 'Kestane', 170, 100, 2),
(18, 'Beyaz Peynirli Gözleme', 170, 60, 1),
(20, 'Kaşarlı Yumurtalı Gözleme', 195, 70, 1),
(22, 'Karışık Gözleme', 195, 70, 1),
(23, 'Kavurmalı Gözleme', 210, 80, 1),
(24, 'Kaşarlı  Tost', 115, 40, 2),
(25, 'Karışık Tost', 135, 60, 2),
(26, 'Beyaz Peynirli Tost', 115, 50, 2),
(27, 'Kavurmalı Tost', 180, 70, 2),
(28, 'Sisler Bulvarı Spesyal Tost', 210, 80, 2),
(29, 'Ton Balıklı Sandviç', 160, 70, 2),
(30, 'Beyaz Peynirli Sandviç', 125, 60, 2),
(31, 'Kaşarlı Sandviç', 125, 60, 2),
(32, 'Kaşarlı Salamlı Sandviç', 135, 75, 2),
(33, 'Mantı', 220, 70, 2),
(34, 'Tikka Masala Soslu Penne', 230, 90, 2),
(35, 'Krema Soslu Penne', 230, 90, 2),
(36, 'Köri Soslu Penne ', 230, 90, 2),
(37, 'Pesto Soslu Penne', 230, 90, 2),
(38, 'Penne Arabiata', 210, 90, 2),
(39, 'Tavuk Pirzola', 250, 100, 2),
(40, 'Tavuk Biftek', 250, 100, 2),
(41, 'Köri Soslu Tavuk', 250, 100, 2),
(42, 'Krema Soslu Tavuk', 250, 100, 2),
(43, 'Tikka Masala Soslu Tavuk', 265, 100, 2),
(44, 'Dondurma Top', 30, 15, 3),
(45, 'Mozaik Pasta ', 160, 40, 3),
(46, 'Yanardağ Pasta', 180, 40, 3),
(47, 'Marlenka ', 180, 40, 3),
(48, 'Tiramisu', 170, 50, 3),
(49, 'Limonlu Chessecake', 180, 40, 3),
(50, 'Frambuazlı Cheesecake', 180, 40, 3),
(51, 'Magnolia', 160, 60, 3),
(52, 'Sufle', 180, 50, 3),
(53, 'Sıcak Çikolata', 95, 20, 4),
(54, 'Sıcak Süt', 60, 5, 4),
(55, 'Ballı Süt', 85, 10, 8),
(56, 'Çay ', 25, 3, 4),
(57, 'Fincan Çay', 50, 5, 4),
(58, 'Sütlü Çay', 60, 6, 8),
(59, 'Salep', 95, 30, 4),
(60, 'Fındıklı Salep', 105, 35, 4),
(61, 'Pumpkin Latte', 100, 35, 5),
(62, 'Chai Tea Latte', 95, 30, 5),
(63, 'Türk Kahvesi', 75, 20, 6),
(64, 'Büyük Türk Kahvesi', 115, 30, 6),
(65, 'Sütlü Türk Kahvesi', 80, 25, 6),
(66, 'Büyük Sütlü Türk Kahvesi', 120, 35, 6),
(67, 'Sütlü Dibek Kahvesi', 80, 30, 6),
(68, 'Büyük Sütlü Dibek Kahvesi', 120, 40, 6),
(69, 'Damla Sakızlı Türk Kahvesi', 80, 30, 6),
(70, 'Büyük Damla Sakızlı Türk Kahvesi', 120, 40, 6),
(71, 'Osmanlı Kahvesi', 80, 30, 6),
(72, 'Büyük Osmanlı Kahvesi', 120, 40, 6),
(73, 'Filtre Kahve ', 85, 30, 5),
(74, 'İlave Süt', 15, 1, 8),
(75, 'Sade Nescafe ', 80, 20, 5),
(76, 'Sütlü Nescafe', 85, 21, 5),
(77, 'Espresso', 75, 20, 5),
(78, 'Double Espresso', 90, 25, 5),
(79, 'Americano', 85, 20, 5),
(80, 'Macchiato', 85, 20, 5),
(82, 'Fındık Aromalı Latte', 100, 30, 9),
(83, 'Vanilya Aromalı Latte', 100, 30, 9),
(84, 'Mocha', 100, 30, 9),
(85, 'White Chocolate Mocha', 100, 30, 9),
(86, 'Karamel Macchiato', 100, 30, 9),
(87, 'Kappucino', 95, 30, 9),
(88, 'Affagato', 125, 30, 9),
(89, 'Adaçayı', 85, 15, 7),
(90, 'Ihlamur', 85, 15, 7),
(91, 'Papatya Çayı ', 85, 15, 7),
(92, 'Yeşil Çay', 85, 15, 7),
(93, 'Melisa Çayı', 85, 15, 7),
(94, 'Elma Çayı', 85, 15, 7),
(95, 'Kış Çayı ', 90, 20, 7),
(96, 'Hasta Çayı', 90, 20, 7),
(97, 'Çikolatalı Milshake', 110, 40, 8),
(98, 'Karamelli Milkshake', 110, 40, 8),
(99, 'Çilekli Milkshake', 110, 40, 8),
(100, 'Orman Meyveli Milkshake', 110, 40, 8),
(101, 'Frambuazlı Milkshake', 110, 40, 8),
(102, 'Vanilyalı Milkshake', 110, 40, 8),
(103, 'Karpuz Çilekli Milkshake', 110, 40, 8),
(104, 'Karpuzlu Milshake', 110, 40, 8),
(105, 'Kivili Milkshake', 110, 40, 8),
(106, 'Muzlu Milshake', 110, 40, 8),
(107, 'Oreolu Milshake', 165, 50, 8),
(108, 'Brownieli Milshake', 165, 50, 8),
(109, 'İced Americano', 100, 30, 9),
(110, 'İced Latte', 110, 30, 9),
(111, 'İced Mocha', 120, 35, 9),
(112, 'Frappe', 100, 35, 9),
(113, 'Cold Brew', 125, 35, 9),
(115, 'Çilekli Limonata', 105, 15, 8),
(116, 'Karadut', 95, 10, 8),
(117, 'Sıkma Portakal Suyu', 110, 30, 10),
(118, 'Çilekli Smoothie', 110, 60, 8),
(119, 'Muzlu Smoothie', 110, 60, 8),
(120, 'Kivili Smoothie', 110, 60, 8),
(121, 'Böğürtlenli Smoothie', 110, 60, 8),
(122, 'Orman Meyveli Smoothie', 110, 60, 8),
(123, 'Çilekli Frozen', 105, 20, 8),
(124, 'Kavunlu Frozen', 105, 20, 8),
(125, 'Karpuzlu Frozen', 105, 20, 8),
(126, 'Kivili Frozen', 105, 20, 8),
(127, 'Naneli Frozen', 105, 20, 8),
(128, 'Limonlu Frozen', 105, 20, 8),
(129, 'Orman Meyveli Frozen', 105, 20, 8),
(130, 'Karpuz Çilekli Frozen', 105, 20, 8),
(131, 'Muzlu Frozen', 105, 20, 8),
(132, 'Blue Lagon', 105, 70, 8),
(133, 'İce Tea', 65, 20, 10),
(134, 'Pepsi', 65, 20, 10),
(135, 'Yedigün', 65, 20, 10),
(136, 'SevenUp', 65, 20, 10),
(137, 'Meyve Suyu', 65, 15, 10),
(138, 'Soda ', 45, 15, 10),
(139, 'Meyveli Soda', 50, 20, 10),
(140, 'Sıkma Limon Soda', 60, 25, 10),
(141, 'Churchill', 65, 25, 10),
(142, 'Ayran', 50, 20, 10),
(143, 'Su', 20, 5, 8),
(145, 'Sucuklu Omlet', 100, 70, 1),
(163, 'ekmek', 150, 10, 1),
(164, 'zurna dürüm', 478, 150, 1),
(166, 'salam', 178, 58, 1);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `urunler_yedek`
--

DROP TABLE IF EXISTS `urunler_yedek`;
CREATE TABLE IF NOT EXISTS `urunler_yedek` (
  `urun_id` int NOT NULL DEFAULT '0',
  `urun_isim` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_turkish_ci NOT NULL,
  `urun_fiyat` int NOT NULL,
  `urun_maliyet` int NOT NULL,
  `kategori_id` int DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_turkish_ci;

--
-- Tablo döküm verisi `urunler_yedek`
--

INSERT INTO `urunler_yedek` (`urun_id`, `urun_isim`, `urun_fiyat`, `urun_maliyet`, `kategori_id`) VALUES
(9, 'Burger Tabağı', 280, 130, 2),
(10, 'Sosis Tava', 135, 80, 2),
(11, 'Patates Tabağı', 115, 50, 2),
(12, 'Sisler Atıştırmalık Tabağı', 180, 90, 2),
(13, 'Sigara Böreği', 120, 50, 2),
(14, 'Paçanga Böreği', 190, 90, 2),
(15, 'Tortilla', 200, 90, 2),
(16, 'Kurabiye Tabağı', 80, 20, 2),
(17, 'Kestane', 170, 100, 2),
(18, 'Beyaz Peynirli Gözleme', 170, 60, 1),
(20, 'Kaşarlı Yumurtalı Gözleme', 195, 70, 1),
(22, 'Karışık Gözleme', 195, 70, 1),
(23, 'Kavurmalı Gözleme', 210, 80, 1),
(24, 'Kaşarlı  Tost', 115, 40, 2),
(25, 'Karışık Tost', 135, 60, 2),
(26, 'Beyaz Peynirli Tost', 115, 50, 2),
(27, 'Kavurmalı Tost', 180, 70, 2),
(28, 'Sisler Bulvarı Spesyal Tost', 210, 80, 2),
(29, 'Ton Balıklı Sandviç', 160, 70, 2),
(30, 'Beyaz Peynirli Sandviç', 125, 60, 2),
(31, 'Kaşarlı Sandviç', 125, 60, 2),
(32, 'Kaşarlı Salamlı Sandviç', 135, 75, 2),
(33, 'Mantı', 220, 70, 2),
(34, 'Tikka Masala Soslu Penne', 230, 90, 2),
(35, 'Krema Soslu Penne', 230, 90, 2),
(36, 'Köri Soslu Penne ', 230, 90, 2),
(37, 'Pesto Soslu Penne', 230, 90, 2),
(38, 'Penne Arabiata', 210, 90, 2),
(39, 'Tavuk Pirzola', 250, 100, 2),
(40, 'Tavuk Biftek', 250, 100, 2),
(41, 'Köri Soslu Tavuk', 250, 100, 2),
(42, 'Krema Soslu Tavuk', 250, 100, 2),
(43, 'Tikka Masala Soslu Tavuk', 265, 100, 2),
(44, 'Dondurma Top', 30, 15, 3),
(45, 'Mozaik Pasta ', 160, 40, 3),
(46, 'Yanardağ Pasta', 180, 40, 3),
(47, 'Marlenka ', 180, 40, 3),
(48, 'Tiramisu', 170, 50, 3),
(49, 'Limonlu Chessecake', 180, 40, 3),
(50, 'Frambuazlı Cheesecake', 180, 40, 3),
(51, 'Magnolia', 160, 60, 3),
(52, 'Sufle', 180, 50, 3),
(53, 'Sıcak Çikolata', 95, 20, 4),
(54, 'Sıcak Süt', 60, 5, 4),
(55, 'Ballı Süt', 85, 10, 8),
(56, 'Çay ', 25, 3, 4),
(57, 'Fincan Çay', 50, 5, 4),
(58, 'Sütlü Çay', 60, 6, 8),
(59, 'Salep', 95, 30, 4),
(60, 'Fındıklı Salep', 105, 35, 4),
(61, 'Pumpkin Latte', 100, 35, 5),
(62, 'Chai Tea Latte', 95, 30, 5),
(63, 'Türk Kahvesi', 75, 20, 6),
(64, 'Büyük Türk Kahvesi', 115, 30, 6),
(65, 'Sütlü Türk Kahvesi', 80, 25, 6),
(66, 'Büyük Sütlü Türk Kahvesi', 120, 35, 6),
(67, 'Sütlü Dibek Kahvesi', 80, 30, 6),
(68, 'Büyük Sütlü Dibek Kahvesi', 120, 40, 6),
(69, 'Damla Sakızlı Türk Kahvesi', 80, 30, 6),
(70, 'Büyük Damla Sakızlı Türk Kahvesi', 120, 40, 6),
(71, 'Osmanlı Kahvesi', 80, 30, 6),
(72, 'Büyük Osmanlı Kahvesi', 120, 40, 6),
(73, 'Filtre Kahve ', 85, 30, 5),
(74, 'İlave Süt', 15, 1, 8),
(75, 'Sade Nescafe ', 80, 20, 5),
(76, 'Sütlü Nescafe', 85, 21, 5),
(77, 'Espresso', 75, 20, 5),
(78, 'Double Espresso', 90, 25, 5),
(79, 'Americano', 85, 20, 5),
(80, 'Macchiato', 85, 20, 5),
(82, 'Fındık Aromalı Latte', 100, 30, 9),
(83, 'Vanilya Aromalı Latte', 100, 30, 9),
(84, 'Mocha', 100, 30, 9),
(85, 'White Chocolate Mocha', 100, 30, 9),
(86, 'Karamel Macchiato', 100, 30, 9),
(87, 'Kappucino', 95, 30, 9),
(88, 'Affagato', 125, 30, 9),
(89, 'Adaçayı', 85, 15, 7),
(90, 'Ihlamur', 85, 15, 7),
(91, 'Papatya Çayı ', 85, 15, 7),
(92, 'Yeşil Çay', 85, 15, 7),
(93, 'Melisa Çayı', 85, 15, 7),
(94, 'Elma Çayı', 85, 15, 7),
(95, 'Kış Çayı ', 90, 20, 7),
(96, 'Hasta Çayı', 90, 20, 7),
(97, 'Çikolatalı Milshake', 110, 40, 8),
(98, 'Karamelli Milkshake', 110, 40, 8),
(99, 'Çilekli Milkshake', 110, 40, 8),
(100, 'Orman Meyveli Milkshake', 110, 40, 8),
(101, 'Frambuazlı Milkshake', 110, 40, 8),
(102, 'Vanilyalı Milkshake', 110, 40, 8),
(103, 'Karpuz Çilekli Milkshake', 110, 40, 8),
(104, 'Karpuzlu Milshake', 110, 40, 8),
(105, 'Kivili Milkshake', 110, 40, 8),
(106, 'Muzlu Milshake', 110, 40, 8),
(107, 'Oreolu Milshake', 165, 50, 8),
(108, 'Brownieli Milshake', 165, 50, 8),
(109, 'İced Americano', 100, 30, 9),
(110, 'İced Latte', 110, 30, 9),
(111, 'İced Mocha', 120, 35, 9),
(112, 'Frappe', 100, 35, 9),
(113, 'Cold Brew', 125, 35, 9),
(115, 'Çilekli Limonata', 105, 15, 10),
(116, 'Karadut', 95, 10, 10),
(117, 'Sıkma Portakal Suyu', 110, 30, 10),
(118, 'Çilekli Smoothie', 110, 60, 10),
(119, 'Muzlu Smoothie', 110, 60, 10),
(120, 'Kivili Smoothie', 110, 60, 10),
(121, 'Böğürtlenli Smoothie', 110, 60, 10),
(122, 'Orman Meyveli Smoothie', 110, 60, 10),
(123, 'Çilekli Frozen', 105, 20, 10),
(124, 'Kavunlu Frozen', 105, 20, 10),
(125, 'Karpuzlu Frozen', 105, 20, 10),
(126, 'Kivili Frozen', 105, 20, 10),
(127, 'Naneli Frozen', 105, 20, 10),
(128, 'Limonlu Frozen', 105, 20, 10),
(129, 'Orman Meyveli Frozen', 105, 20, 10),
(130, 'Karpuz Çilekli Frozen', 105, 20, 10),
(131, 'Muzlu Frozen', 105, 20, 10),
(132, 'Blue Lagon', 105, 70, 10),
(133, 'İce Tea', 65, 20, 10),
(134, 'Pepsi', 65, 20, 10),
(135, 'Yedigün', 65, 20, 10),
(136, 'SevenUp', 65, 20, 10),
(137, 'Meyve Suyu', 65, 15, 10),
(138, 'Soda ', 45, 15, 10),
(139, 'Meyveli Soda', 50, 20, 10),
(140, 'Sıkma Limon Soda', 60, 25, 10),
(141, 'Churchill', 65, 25, 10),
(142, 'Ayran', 50, 20, 10),
(143, 'Su', 20, 5, 8),
(144, 'Sucuklu Omlet', 100, 70, 1),
(145, 'Sucuklu Omlet', 100, 70, 1),
(146, 'Sucuklu Omlet', 100, 70, 1),
(150, 'asd', 11111, 121, 1),
(151, 'asd', 11111, 121, 1),
(153, 'asd', 11111, 121, 1),
(154, 'sss', 1000, 100, 1),
(155, 'sss', 1000, 100, 1),
(158, 'aaaa', 100, 12, 1),
(159, 'aaaa', 100, 12, 1);

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `personel_gider`
--
ALTER TABLE `personel_gider`
  ADD CONSTRAINT `personel_gider_ibfk_1` FOREIGN KEY (`personel_id`) REFERENCES `personel` (`personel_id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `siparisler`
--
ALTER TABLE `siparisler`
  ADD CONSTRAINT `siparisler_ibfk_1` FOREIGN KEY (`urun_id`) REFERENCES `urunler` (`urun_id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `urunler`
--
ALTER TABLE `urunler`
  ADD CONSTRAINT `fk_kategori` FOREIGN KEY (`kategori_id`) REFERENCES `kategoriler` (`kategori_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_kategorii` FOREIGN KEY (`kategori_id`) REFERENCES `kategoriler` (`kategori_id`),
  ADD CONSTRAINT `urunler_ibfk_1` FOREIGN KEY (`kategori_id`) REFERENCES `kategoriler` (`kategori_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
