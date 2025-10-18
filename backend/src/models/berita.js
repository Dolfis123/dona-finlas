const { DataTypes } = require("sequelize");
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
        // --- KOLOM BARU DITAMBAHKAN DI SINI ---
        tanggal_publikasi: {
            type: DataTypes.DATE, // Menggunakan tipe data DATE atau TIMESTAMP
            allowNull: false,
        },
        // Kolom penulis_id akan dibuat oleh relasi di models/index.js
    }, {
        tableName: "berita",
        timestamps: true, // Tetap gunakan ini untuk createdAt dan updatedAt
    }
);

module.exports = Berita;