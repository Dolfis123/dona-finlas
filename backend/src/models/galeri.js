const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Galeri = sequelize.define(
    "Galeri", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        deskripsi: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gambar_url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        kategori: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tanggal_upload: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    }, {
        tableName: "galeri",
        timestamps: true,
    }
);

module.exports = Galeri;