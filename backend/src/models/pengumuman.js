const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Pengumuman = sequelize.define(
    "Pengumuman", {
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
        level_penting: {
            type: DataTypes.STRING,
            defaultValue: "Informasi", // Contoh: 'Informasi' atau 'Penting'
        },
        tanggal_publikasi: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    }, {
        tableName: "pengumuman",
        timestamps: true, // Otomatis menambahkan createdAt dan updatedAt
    }
);

module.exports = Pengumuman;