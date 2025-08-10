const { Sequelize } = require("sequelize");

// Mengimpor library dotenv untuk membaca file .env
require("dotenv").config();

// Membuat instance Sequelize baru dengan konfigurasi dari file .env
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS, {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        // Menonaktifkan logging di sini agar tidak terlalu ramai,
        // kita bisa mengaktifkannya di config.js untuk debugging
        logging: false,
    }
);

// Mengekspor instance sequelize agar bisa digunakan di file lain
module.exports = sequelize;