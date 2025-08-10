const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Sambutan = sequelize.define(
    "Sambutan", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        isi_sambutan: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: "Isi lengkap dari kata sambutan kepala lurah.",
        },
        foto_url: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "Nama file foto kepala lurah.",
        },
        // --- ATRIBUT BARU DITAMBAHKAN DI SINI ---
        nama_lurah: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "Nama lengkap kepala lurah.",
        },
        jabatan_lurah: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "Kepala Kelurahan Padarni",
            comment: "Jabatan resmi yang ditampilkan di bawah nama.",
        },
    }, {
        tableName: "sambutan",
        timestamps: true, // Otomatis menambahkan createdAt dan updatedAt
    }
);

module.exports = Sambutan;