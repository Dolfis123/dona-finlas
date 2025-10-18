// Baris ini sudah benar dan lengkap untuk mengatasi semua error sebelumnya
const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/database");

const Berita = sequelize.define(
    "Berita", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        judul: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isi: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        gambar_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        kategori: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        // --- INI ADALAH PERBAIKAN PENTING ---
        // Dengan defaultValue, MySQL tahu harus mengisi apa untuk baris yang sudah ada
        tanggal_publikasi: {
            type: DataTypes.DATETIME,
            allowNull: false,
            defaultValue: Sequelize.NOW, // <-- INI SOLUSINYA
        },
        // Kolom penulis_id akan dibuat oleh relasi di models/index.js
    }, {
        tableName: "berita",
        timestamps: true,
    }
);

module.exports = Berita;