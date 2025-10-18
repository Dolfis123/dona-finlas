// Versi file yang bersih untuk memastikan tidak ada karakter tersembunyi
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
        tanggal_publikasi: {
            type: DataTypes.DATETIME,
            allowNull: false,
            defaultValue: Sequelize.NOW,
        },
    }, {
        tableName: "berita",
        timestamps: true,
    }
);

module.exports = Berita;