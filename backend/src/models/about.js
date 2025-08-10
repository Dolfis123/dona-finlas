const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const About = sequelize.define(
    "About", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        sejarah: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        visi: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        misi: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: "Pisahkan setiap poin misi dengan baris baru.",
        },
    }, {
        tableName: "about",
        timestamps: true, // Otomatis menambahkan createdAt dan updatedAt
    }
);

module.exports = About;