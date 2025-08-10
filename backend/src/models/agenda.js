const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Agenda = sequelize.define(
    "Agenda", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nama_kegiatan: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        deskripsi: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        tanggal_kegiatan: {
            type: DataTypes.DATEONLY, // Hanya menyimpan tanggal, tanpa waktu
            allowNull: false,
        },
        waktu: {
            type: DataTypes.STRING,
            allowNull: false, // Contoh: "08:00 WIT - Selesai"
        },
        lokasi: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: "agenda",
        timestamps: true,
    }
);

module.exports = Agenda;