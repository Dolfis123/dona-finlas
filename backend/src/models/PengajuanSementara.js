const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PengajuanSementara = sequelize.define(
  "PengajuanSementara",
  {
    id_pengajuan: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    kode_tiket: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true, // Tiket unik (misal: REQ-1234)
    },
    id_jenis: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // --- Data Pemohon Standar ---
    nik: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    nama_lengkap: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    no_hp: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    
    // --- KUNCI: Data Dinamis (JSON) ---
    // Menyimpan isian form (Gaji, Kampus, Alamat Asal, dll)
    data_form_json: {
      type: DataTypes.JSON, 
      allowNull: true,
    },
    
    // Menyimpan nama file upload
    data_berkas_json: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    // --- Status & Tracking ---
    tgl_pengajuan: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "VALIDASI", "DITOLAK"),
      defaultValue: "PENDING",
    },
    keterangan_tolak: {
      type: DataTypes.TEXT,
      allowNull: true, // Diisi jika admin menolak
    },
  },
  {
    tableName: "tb_pengajuan_sementara",
    timestamps: true, // Aktifkan createdAt/updatedAt untuk tracking kapan diedit
  }
);

module.exports = PengajuanSementara;