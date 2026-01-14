const sequelize = require("../config/database");

// --- 1. Impor Model Lama (Website Kelurahan) ---
const User = require("./user"); // Sesuaikan nama file jika huruf besar/kecil beda
const Berita = require("./berita");
const Pengumuman = require("./pengumuman");
const Pejabat = require("./pejabat"); // (Ini pejabat untuk profil website)
const Galeri = require("./galeri");
const Agenda = require("./agenda");
const PotensiDaerah = require("./potensiDaerah");
const Dokumen = require("./dokumen");
const Faq = require("./faq");
const PengaturanHalaman = require("./pengaturanHalaman");
const About = require("./about");
const Sambutan = require("./sambutan");

// --- 2. Impor Model Baru (Sistem Surat Online) ---
// Pastikan nama file sesuai dengan yang kamu buat (Case Sensitive)
const Pegawai = require("./Pegawai"); // Pejabat untuk TTD Surat
const JenisSurat = require("./JenisSurat");
const SyaratSurat = require("./SyaratSurat");
const PengajuanSementara = require("./PengajuanSementara");
const ArsipSurat = require("./ArsipSurat");

// --- 3. Kumpulkan semua model dalam satu objek ---
const models = {
  // Model Website
  User,
  Berita,
  Pengumuman,
  Pejabat,
  Galeri,
  Agenda,
  PotensiDaerah,
  Dokumen,
  Faq,
  PengaturanHalaman,
  About,
  Sambutan,
  // Model Surat
  Pegawai,
  JenisSurat,
  SyaratSurat,
  PengajuanSementara,
  ArsipSurat,
};

// --- 4. Definisikan Relasi Antar Tabel (Associations) ---

// === RELASI MODEL WEBSITE LAMA ===
User.hasMany(Berita, {
  foreignKey: {
    name: "penulis_id",
    allowNull: false,
  },
});
Berita.belongsTo(User, {
  foreignKey: "penulis_id",
});

// === RELASI SISTEM SURAT ONLINE (BARU) ===

// A. Relasi Jenis Surat <-> Syarat Surat
// (Satu jenis surat punya banyak syarat dokumen)
JenisSurat.hasMany(SyaratSurat, { foreignKey: "id_jenis", as: "syarat" });
SyaratSurat.belongsTo(JenisSurat, { foreignKey: "id_jenis", as: "jenis_surat" });

// B. Relasi Jenis Surat <-> Pengajuan Sementara
// (Satu jenis surat bisa diajukan oleh banyak warga)
JenisSurat.hasMany(PengajuanSementara, { foreignKey: "id_jenis", as: "pengajuan" });
PengajuanSementara.belongsTo(JenisSurat, { foreignKey: "id_jenis", as: "detail_jenis" });

// C. Relasi Pegawai <-> Arsip Surat
// (Satu pegawai bisa menandatangani banyak surat arsip)
Pegawai.hasMany(ArsipSurat, { foreignKey: "id_pegawai_ttd", as: "arsip_ditandatangani" });
ArsipSurat.belongsTo(Pegawai, { foreignKey: "id_pegawai_ttd", as: "pegawai_ttd" });

// D. Relasi User (Admin) <-> Arsip Surat (Opsional)
// (Mencatat admin mana yang memproses surat)
User.hasMany(ArsipSurat, { foreignKey: "id_admin", as: "surat_diproses" });
ArsipSurat.belongsTo(User, { foreignKey: "id_admin", as: "admin_pemroses" });


// --- 5. Fungsi Sinkronisasi Database ---
const syncDatabase = async () => {
  try {
    // alter: true -> Cerdas mendeteksi perubahan kolom tanpa menghapus data
    await sequelize.sync({ alter: true });
    console.log(">>> Database & Tabel berhasil disinkronisasi (All Models Synced).");
  } catch (error) {
    console.error(">>> Gagal sinkronisasi database:", error);
  }
};

module.exports = {
  ...models,
  sequelize,
  syncDatabase,
};