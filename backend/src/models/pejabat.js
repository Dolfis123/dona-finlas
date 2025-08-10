const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Pejabat = sequelize.define(
    "Pejabat", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nama_lengkap: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        jabatan: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        foto_url: {
            type: DataTypes.STRING,
            allowNull: true, // Boleh kosong jika belum ada foto
        },
        urutan: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 99, // Urutan default, agar yang baru tidak langsung di atas
        },
    }, {
        tableName: "pejabat",
        timestamps: true,
    }
);

module.exports = Pejabat;