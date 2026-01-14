const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SyaratSurat = sequelize.define(
  "SyaratSurat",
  {
    id_syarat: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_jenis: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // References akan kita atur di index.js (Asosiasi)
    },
    nama_dokumen: {
      type: DataTypes.STRING(255),
      allowNull: false, // Contoh: "Fotokopi KTP"
    },
    wajib: {
      type: DataTypes.ENUM("Y", "N"),
      defaultValue: "Y",
    },
  },
  {
    tableName: "tb_syarat_surat",
    timestamps: false,
  }
);

module.exports = SyaratSurat;