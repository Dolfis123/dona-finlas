const sequelize = require("../config/database");

// Impor semua model yang telah kita buat
const User = require("./user");
const Berita = require("./berita");
const Pengumuman = require("./pengumuman");
const Pejabat = require("./pejabat");
const Galeri = require("./galeri");
const Agenda = require("./agenda");
const PotensiDaerah = require("./potensiDaerah");
const Dokumen = require("./dokumen");
const Faq = require("./faq"); // <-- Tambahkan ini
const PengaturanHalaman = require("./pengaturanHalaman"); // <-- Tambahkan ini
const About = require("./about"); // <-- Tambahkan ini
const Sambutan = require("./sambutan"); // <-- Tambahkan ini

// Kumpulkan semua model dalam satu objek
const models = {
    User,
    Berita,
    Pengumuman,
    Pejabat,
    Galeri,
    Agenda,
    PotensiDaerah,
    Dokumen,
    Faq, // <-- Tambahkan ini
    PengaturanHalaman, // <-- Tambahkan ini
    About, // <-- Tambahkan ini
    Sambutan, // <-- Tambahkan ini
};

// --- Definisikan Relasi Antar Tabel di sini ---

// Contoh: Satu User (penulis) bisa memiliki banyak Berita
User.hasMany(Berita, {
    foreignKey: {
        name: "penulis_id", // Nama kolom foreign key di tabel 'berita'
        allowNull: false,
    },
});
Berita.belongsTo(User, {
    foreignKey: "penulis_id",
});

// Anda bisa menambahkan relasi lain di sini jika diperlukan di masa depan

// Fungsi untuk sinkronisasi semua model dengan database
const syncDatabase = async() => {
    try {
        // Menggunakan { alter: true } agar Sequelize bisa menambahkan kolom baru
        // tanpa harus menghapus tabel yang sudah ada.
        await sequelize.sync({ alter: true });
        console.log("Database synchronized successfully.");
    } catch (error) {
        console.error("Unable to synchronize the database:", error);
    }
};

module.exports = {
    ...models,
    sequelize,
    syncDatabase,
};