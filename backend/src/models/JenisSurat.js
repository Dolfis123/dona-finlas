const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const JenisSurat = sequelize.define(
  "JenisSurat",
  {
    id_jenis: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    kode_surat: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true, // Contoh: 'DOM', 'SKTM'
    },
    nama_surat: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    status_aktif: {
      type: DataTypes.ENUM("Y", "N"),
      defaultValue: "Y",
    },
  },
  {
    tableName: "tb_jenis_surat",
    timestamps: false,
  }
);

module.exports = JenisSurat;