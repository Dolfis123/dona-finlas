const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ArsipSurat = sequelize.define(
  "ArsipSurat",
  {
    id_arsip: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // --- LEGALITAS ---
    no_surat_manual: {
      type: DataTypes.STRING(100),
      allowNull: false, // Diisi manual oleh admin
    },
    tgl_surat: {
      type: DataTypes.DATEONLY, // Hanya tanggal (YYYY-MM-DD)
      allowNull: false,
    },
    id_pegawai_ttd: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Relasi akan diatur di index.js
    },
    id_admin: {
      type: DataTypes.INTEGER,
      allowNull: true, // ID User admin yang memproses (opsional)
    },

    // --- DATA SNAPSHOT (Salinan dari Pengajuan) ---
    kode_tiket_asal: DataTypes.STRING(20),
    jenis_surat_snapshot: DataTypes.STRING(100),
    nik: DataTypes.STRING(16),
    nama_lengkap: DataTypes.STRING(100),

    // --- DATA FINAL (JSON) ---
    data_form_final: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    tgl_arsip: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "tb_arsip_surat",
    timestamps: false,
  }
);

module.exports = ArsipSurat;