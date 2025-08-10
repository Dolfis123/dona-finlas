const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PengaturanHalaman = sequelize.define(
    "PengaturanHalaman", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nama_halaman: {
            type: DataTypes.STRING,
            allowNull: false, // Contoh: 'home', 'about', 'kontak'
        },
        kunci_elemen: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // Setiap kunci harus unik
        },
        nilai_elemen: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        tipe_elemen: {
            type: DataTypes.STRING,
            allowNull: false, // Contoh: 'text', 'textarea', 'image_url'
        },
    }, {
        tableName: "pengaturan_halaman",
        timestamps: true,
    }
);

module.exports = PengaturanHalaman;