const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Pegawai = sequelize.define(
  "Pegawai",
  {
    // --- 1. ATRIBUT/KOLOM TABEL ---
    id_pegawai: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nip: {
      type: DataTypes.STRING(25),
      allowNull: false,
      unique: true,
    },
    nama_lengkap: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    jabatan: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    status_aktif: {
      type: DataTypes.ENUM("Y", "N"),
      defaultValue: "Y",
    },
    // Tambahkan definisi timestamps di sini agar boleh NULL (menghindari error SQL)
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true, 
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  },
  {
    // --- 2. OPSI MODEL ---
    tableName: "tb_pegawai",
    timestamps: true, // Aktifkan timestamps
    paranoid: true,   // Aktifkan Soft Delete (butuh deletedAt)
  }
);

module.exports = Pegawai;