-- Astrovaani Database Setup for CyberPanel
-- Run this script in your CyberPanel MySQL database

-- Set the database charset
SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

-- Use your database (replace 'your_username_astrovaani' with your actual database name)
-- In CyberPanel, database name format is usually: username_databasename
USE your_username_astrovaani;

-- =============================================
-- Table: users (for authentication)
-- =============================================
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone` varchar(15) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `whatsapp_verified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`),
  KEY `idx_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- Table: community (vendors/astrologers)
-- =============================================
CREATE TABLE IF NOT EXISTS `community` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `category` varchar(50) NOT NULL,
  `subcategory` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT 0.00,
  `total_ratings` int(11) DEFAULT 0,
  `image_url` varchar(500) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `experience_years` int(11) DEFAULT NULL,
  `specialization` text DEFAULT NULL,
  `languages` varchar(200) DEFAULT NULL,
  `availability_start` time DEFAULT NULL,
  `availability_end` time DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  `is_verified` tinyint(1) DEFAULT 0,
  `status` enum('active','inactive','suspended') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_rating` (`rating`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- Table: booking (appointments/sessions)
-- =============================================
CREATE TABLE IF NOT EXISTS `booking` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `vendor_id` int(11) NOT NULL,
  `booking_date` date NOT NULL,
  `booking_time` time NOT NULL,
  `duration` int(11) DEFAULT 30 COMMENT 'Duration in minutes',
  `service_type` varchar(50) DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) DEFAULT 0.00,
  `final_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','confirmed','in_progress','completed','cancelled','refunded') DEFAULT 'pending',
  `payment_status` enum('pending','paid','failed','refunded') DEFAULT 'pending',
  `payment_id` varchar(100) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `booking_notes` text DEFAULT NULL,
  `vendor_notes` text DEFAULT NULL,
  `rating` int(11) DEFAULT NULL COMMENT '1-5 star rating',
  `review` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_vendor_id` (`vendor_id`),
  KEY `idx_booking_date` (`booking_date`),
  KEY `idx_status` (`status`),
  KEY `idx_payment_status` (`payment_status`),
  CONSTRAINT `fk_booking_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_booking_vendor` FOREIGN KEY (`vendor_id`) REFERENCES `community` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- Table: blog (blog posts and articles)
-- =============================================
CREATE TABLE IF NOT EXISTS `blog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext NOT NULL,
  `featured_image` varchar(500) DEFAULT NULL,
  `author` varchar(100) DEFAULT 'Admin',
  `category` varchar(50) DEFAULT NULL,
  `tags` varchar(200) DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT 1,
  `is_featured` tinyint(1) DEFAULT 0,
  `views_count` int(11) DEFAULT 0,
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_category` (`category`),
  KEY `idx_published` (`is_published`),
  KEY `idx_featured` (`is_featured`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- Table: horoscope (daily horoscopes)
-- =============================================
CREATE TABLE IF NOT EXISTS `horoscope` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `zodiac_sign` varchar(20) NOT NULL,
  `date` date NOT NULL,
  `prediction` text NOT NULL,
  `love_prediction` text DEFAULT NULL,
  `career_prediction` text DEFAULT NULL,
  `health_prediction` text DEFAULT NULL,
  `lucky_number` int(11) DEFAULT NULL,
  `lucky_color` varchar(50) DEFAULT NULL,
  `lucky_time` varchar(50) DEFAULT NULL,
  `compatibility_sign` varchar(20) DEFAULT NULL,
  `mood` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_sign_date` (`zodiac_sign`, `date`),
  KEY `idx_zodiac_sign` (`zodiac_sign`),
  KEY `idx_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- Table: contact (contact form submissions)
-- =============================================
CREATE TABLE IF NOT EXISTS `contact` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `subject` varchar(200) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('new','read','replied','closed') DEFAULT 'new',
  `admin_notes` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- Table: payments (payment transactions)
-- =============================================
CREATE TABLE IF NOT EXISTS `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'INR',
  `payment_gateway` varchar(50) DEFAULT 'razorpay',
  `gateway_payment_id` varchar(100) DEFAULT NULL,
  `gateway_order_id` varchar(100) DEFAULT NULL,
  `gateway_signature` varchar(255) DEFAULT NULL,
  `status` enum('pending','success','failed','refunded') DEFAULT 'pending',
  `failure_reason` text DEFAULT NULL,
  `refund_amount` decimal(10,2) DEFAULT 0.00,
  `refund_id` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_booking_id` (`booking_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_gateway_payment_id` (`gateway_payment_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_payment_booking` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_payment_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- Insert Sample Data
-- =============================================

-- Sample vendors/astrologers
INSERT IGNORE INTO `community` (`name`, `category`, `subcategory`, `description`, `price`, `rating`, `total_ratings`, `image_url`, `phone`, `experience_years`, `specialization`, `languages`, `availability_start`, `availability_end`, `is_available`, `is_verified`) VALUES
('Pandit Rajesh Sharma', 'Astrologer', 'Vedic Astrology', 'Expert in Vedic Astrology with deep knowledge of birth chart analysis and predictions', 500.00, 4.8, 125, 'https://via.placeholder.com/300x300?text=Astrologer', '+919876543210', 15, 'Birth Chart Analysis, Marriage Compatibility, Career Guidance', 'Hindi, English', '09:00:00', '20:00:00', 1, 1),
('Dr. Priya Devi', 'Tarot Reader', 'Angel Cards', 'Professional Tarot card reader and spiritual healer with intuitive guidance', 350.00, 4.6, 89, 'https://via.placeholder.com/300x300?text=Tarot', '+919876543211', 8, 'Tarot Reading, Angel Card Reading, Spiritual Healing', 'Hindi, English, Punjabi', '10:00:00', '18:00:00', 1, 1),
('Acharya Vikram Singh', 'Numerologist', 'Life Path Numbers', 'Numerology expert with deep understanding of number science and destiny', 400.00, 4.7, 67, 'https://via.placeholder.com/300x300?text=Numerologist', '+919876543212', 12, 'Life Path Analysis, Name Numerology, Business Numerology', 'Hindi, English', '11:00:00', '19:00:00', 1, 1),
('Guru Meera Bhatt', 'Palmist', 'Hand Reading', 'Palm reading expert with ability to read life lines and predict future', 300.00, 4.5, 45, 'https://via.placeholder.com/300x300?text=Palmist', '+919876543213', 10, 'Palm Reading, Life Line Analysis, Future Predictions', 'Hindi, Gujarati, English', '09:30:00', '17:30:00', 1, 1);

-- Sample blog posts
INSERT IGNORE INTO `blog` (`title`, `slug`, `excerpt`, `content`, `featured_image`, `category`, `tags`, `is_published`, `is_featured`) VALUES
('Understanding Your Zodiac Sign: A Complete Guide', 'understanding-zodiac-signs-complete-guide', 'Discover the characteristics, traits, and hidden secrets of your zodiac sign in this comprehensive guide.', 'Your zodiac sign reveals incredible insights about your personality, relationships, and life path. In this comprehensive guide, we explore each of the 12 zodiac signs...', 'https://via.placeholder.com/800x400?text=Zodiac+Guide', 'Astrology', 'zodiac, astrology, personality, horoscope', 1, 1),
('The Power of Numerology in Daily Life', 'power-of-numerology-daily-life', 'Learn how numbers influence your daily decisions and discover your life path number.', 'Numerology is the ancient science of numbers that reveals the hidden patterns in your life. Every number carries a unique vibration and meaning...', 'https://via.placeholder.com/800x400?text=Numerology', 'Numerology', 'numerology, life path, numbers, destiny', 1, 0),
('Tarot Cards: Your Guide to Inner Wisdom', 'tarot-cards-guide-inner-wisdom', 'Explore the mystical world of tarot cards and learn how they can guide your spiritual journey.', 'Tarot cards have been used for centuries as a tool for divination and self-reflection. Each card carries deep symbolism and meaning...', 'https://via.placeholder.com/800x400?text=Tarot+Cards', 'Tarot', 'tarot, divination, spirituality, guidance', 1, 0);

-- Sample horoscope data for today
INSERT IGNORE INTO `horoscope` (`zodiac_sign`, `date`, `prediction`, `love_prediction`, `career_prediction`, `health_prediction`, `lucky_number`, `lucky_color`, `mood`) VALUES
('Aries', CURDATE(), 'Today brings new opportunities and fresh energy. Your natural leadership qualities will shine.', 'Romance is in the air. Single Aries may meet someone special.', 'A promotion or new project opportunity may present itself.', 'High energy levels. Perfect day for physical activities.', 7, 'Red', 'Energetic'),
('Taurus', CURDATE(), 'Stability and comfort are your themes today. Focus on practical matters.', 'Existing relationships grow stronger through honest communication.', 'Financial gains are possible. Stick to your budget plans.', 'Take care of your throat and neck area.', 4, 'Green', 'Calm'),
('Gemini', CURDATE(), 'Communication and learning are highlighted. Share your ideas freely.', 'Intellectual connections lead to romantic possibilities.', 'Networking and social connections boost your career prospects.', 'Mental stimulation is good, but dont overdo it.', 3, 'Yellow', 'Curious'),
('Cancer', CURDATE(), 'Family and home matters take precedence. Trust your intuition.', 'Emotional depth strengthens your relationships.', 'Creative projects and nurturing roles are favored.', 'Pay attention to your digestive system.', 2, 'Silver', 'Nurturing');

-- Set foreign key checks back on
SET foreign_key_checks = 1;

-- Show all tables to verify creation
SHOW TABLES;
