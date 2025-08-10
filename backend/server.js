const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const cors = require("cors"); // Impor CORS
const { sequelize, syncDatabase } = require("./src/models");
// Memuat variabel lingkungan dari file .env
dotenv.config();

// Membuat instance aplikasi Express
const app = express();

// --- KONFIGURASI CORS BARU ---
// Daftar domain yang diizinkan untuk mengakses API ini
const whitelist = [
    "http://localhost:5174",
    "https://skydance.life",
    "https://www.skydance.life",
];

const corsOptions = {
    origin: function(origin, callback) {
        // Izinkan jika origin ada di dalam whitelist, atau jika origin tidak ada (seperti saat menggunakan Postman)
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Akses ditolak oleh kebijakan CORS"));
        }
    },
};

// --- Middleware ---
// Menggunakan konfigurasi CORS yang baru
app.use(cors(corsOptions));

// Middleware untuk parsing body request sebagai JSON
app.use(express.json());
// Middleware untuk menyajikan file statis dari folder 'public'
app.use("/api", express.static(path.join(__dirname, "public")));

// --- Impor Rute ---
const authRoutes = require("./src/routes/authRoutes");
const beritaRoutes = require("./src/routes/beritaRoutes");
const pengumumanRoutes = require("./src/routes/pengumumanRoutes");
const pejabatRoutes = require("./src/routes/pejabatRoutes");
const galeriRoutes = require("./src/routes/galeriRoutes");
const agendaRoutes = require("./src/routes/agendaRoutes");
const potensiDaerahRoutes = require("./src/routes/potensiDaerahRoutes");
const dokumenRoutes = require("./src/routes/dokumenRoutes");
const faqRoutes = require("./src/routes/faqRoutes");
const pengaturanHalamanRoutes = require("./src/routes/pengaturanHalamanRoutes");
const aboutRoutes = require("./src/routes/aboutRoutes");
const sambutanRoutes = require("./src/routes/sambutanRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");

// --- Rute Dasar untuk Pengujian ---
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Selamat datang di API Sistem Informasi Kelurahan Padarni!",
    });
});

// --- Pemasangan Rute ke Aplikasi ---
app.use("/api/auth", authRoutes);
app.use("/api/berita", beritaRoutes);
app.use("/api/pengumuman", pengumumanRoutes);
app.use("/api/pejabat", pejabatRoutes);
app.use("/api/galeri", galeriRoutes);
app.use("/api/agenda", agendaRoutes);
app.use("/api/potensi-daerah", potensiDaerahRoutes);
app.use("/api/dokumen", dokumenRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/pengaturan-halaman", pengaturanHalamanRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/sambutan", sambutanRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Menentukan port dari file .env atau default ke 8000
const PORT = process.env.PORT || 8000;

// Fungsi untuk memulai server
const startServer = async() => {
    try {
        await sequelize.authenticate();
        console.log("Koneksi ke database MySQL berhasil.");

        await syncDatabase();

        app.listen(PORT, () => {
            console.log(`Server berjalan di http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Tidak dapat terhubung ke database:", error);
    }
};

// Memanggil fungsi untuk memulai server
startServer();