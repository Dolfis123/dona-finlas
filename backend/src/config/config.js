// Mengimpor library dotenv untuk membaca file .env
require("dotenv").config();

// Mengekspor konfigurasi database
module.exports = {
    // Konfigurasi untuk lingkungan pengembangan (development)
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        // Opsi tambahan untuk logging query SQL di console
        logging: console.log,
    },
    // Anda bisa menambahkan konfigurasi untuk 'test' dan 'production' di sini nanti
    test: {
        // ...
    },
    production: {
        // ...
    },
};