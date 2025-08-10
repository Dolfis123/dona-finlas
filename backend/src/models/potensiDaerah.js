const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PotensiDaerah = sequelize.define(
    "PotensiDaerah", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nama_potensi: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        deskripsi: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        kategori: {
            type: DataTypes.STRING,
            allowNull: false, // Contoh: "Kuliner", "Kerajinan", "Wisata"
        },
        gambar_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        kontak_info: {
            type: DataTypes.STRING,
            allowNull: true, // Bisa berupa nomor telepon, alamat, dll.
        },
    }, {
        tableName: "potensi_daerah",
        timestamps: true,
    }
);

module.exports = PotensiDaerah;