-- Database setup for Astrovaani Backend
-- Run this script to create the necessary database structure

CREATE DATABASE IF NOT EXISTS astrovaani_db;
USE astrovaani_db;

-- Create user table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(15) UNIQUE NOT NULL,
    name VARCHAR(100),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create vendors table
CREATE TABLE IF NOT EXISTS vendors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    rating DECIMAL(3, 2) DEFAULT 0,
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    vendor_id INT,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    total_amount DECIMAL(10, 2),
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    payment_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    image_url VARCHAR(255),
    author VARCHAR(100) DEFAULT 'Admin',
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create horoscope table
CREATE TABLE IF NOT EXISTS horoscopes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    zodiac_sign VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    prediction TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_sign_date (zodiac_sign, date)
);

-- Insert sample data for vendors (optional)
INSERT IGNORE INTO vendors (name, category, description, price, rating, image_url) VALUES
('Pandit Rajesh Sharma', 'Astrologer', 'Expert in Vedic Astrology with 15+ years experience', 500.00, 4.8, 'https://example.com/astrologer1.jpg'),
('Guru Priya Devi', 'Tarot Reader', 'Professional Tarot card reader and spiritual guide', 300.00, 4.6, 'https://example.com/tarot1.jpg'),
('Acharya Vikram Singh', 'Numerologist', 'Numerology expert with deep knowledge of number science', 400.00, 4.7, 'https://example.com/numerologist1.jpg');

-- Insert sample blog posts (optional)
INSERT IGNORE INTO blogs (title, content, excerpt, image_url) VALUES
('Understanding Your Zodiac Sign', 'Learn about the characteristics and traits of your zodiac sign...', 'Discover what your zodiac sign says about you', 'https://example.com/blog1.jpg'),
('The Power of Numerology', 'Explore how numbers influence your life and destiny...', 'Unlock the secrets hidden in numbers', 'https://example.com/blog2.jpg');

-- Create indexes for better performance
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_vendor_id ON bookings(vendor_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_horoscopes_sign_date ON horoscopes(zodiac_sign, date);
CREATE INDEX idx_vendors_category ON vendors(category);

SHOW TABLES;
