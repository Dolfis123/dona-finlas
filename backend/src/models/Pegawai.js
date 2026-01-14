const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Pastikan path ini mengarah ke file database.js kamu

const Pegawai = sequelize.define(
  "Pegawai",
  {
    id_pegawai: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nip: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    nama_lengkap: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    jabatan: {
      type: DataTypes.STRING(50),
      allowNull: false, // Contoh: 'Lurah', 'Sekretaris'
    },
    status_aktif: {
      type: DataTypes.ENUM("Y", "N"),
      defaultValue: "Y",
    },
  },
  {
    tableName: "tb_pegawai", // Nama tabel di database
    timestamps: false, // Kita tidak butuh createdAt/updatedAt untuk tabel master ini (opsional)
  }
);

module.exports = Pegawai;