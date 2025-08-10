const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Faq = sequelize.define(
    "Faq", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        pertanyaan: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        jawaban: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        kategori: {
            type: DataTypes.STRING,
            allowNull: false, // Contoh: "Pelayanan Umum", "Kependudukan"
        },
    }, {
        tableName: "faq",
        timestamps: true,
    }
);

module.exports = Faq;