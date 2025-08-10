// =======================================================================
// FILE: src/models/dokumen.js
// Mendefinisikan struktur tabel 'dokumen' di database.
// =======================================================================

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Dokumen = sequelize.define(
    "Dokumen", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nama_dokumen: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        deskripsi: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        file_url: {
            type: DataTypes.STRING,
            allowNull: false, // Akan menyimpan nama file, bukan URL lengkap
        },
        tipe_file: {
            type: DataTypes.STRING,
            allowNull: false, // Contoh: 'application/pdf'
        },
        ukuran_file: {
            type: DataTypes.STRING,
            allowNull: false, // Contoh: '128.50 KB'
        },
    }, {
        tableName: "dokumen",
        timestamps: true,
    }
);

module.exports = Dokumen;