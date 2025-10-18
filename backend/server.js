const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const cors = require("cors"); // Impor CORS
const { sequelize, syncDatabase, User } = require("./src/models"); // <- TAMBAHKAN User DI SINI

// Memuat variabel lingkungan dari file .env
dotenv.config();

// Membuat instance aplikasi Express
const app = express();

// --- KONFIGURASI CORS BARU ---
const whitelist = [
    "http://localhost:5174",
    "https://kelurahanpadarni.blog",
];

const corsOptions = {
    origin: function(origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Akses ditolak oleh kebijakan CORS"));
        }
    },
};

// --- Middleware ---
app.use(cors(corsOptions));
app.use(express.json());
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


// --- FUNGSI BARU UNTUK MEMBUAT ADMIN DEFAULT ---
const createDefaultAdmin = async() => {
    try {
        // 1. Cek apakah user 'superadmin' sudah ada
        const adminExists = await User.findOne({ where: { username: 'superadmin' } });

        // 2. Jika tidak ada, buat user baru
        if (!adminExists) {
            console.log("User 'superadmin' tidak ditemukan, membuat user baru...");
            await User.create({
                username: 'dona',
                // Password ini akan otomatis di-hash oleh hook di model Anda
                password: 'dona_kadam',
                nama_lengkap: 'Dona Kadam',
                role: 'superadmin'
            });
            console.log("User 'superadmin' berhasil dibuat. Silakan login dan segera ganti password!");
        } else {
            // 3. Jika sudah ada, tidak melakukan apa-apa
            console.log("User 'superadmin' sudah ada di database.");
        }
    } catch (error) {
        console.error("Gagal membuat user admin default:", error);
    }
};


// Fungsi untuk memulai server
const startServer = async() => {
    try {
        await sequelize.authenticate();
        console.log("Koneksi ke database MySQL berhasil.");

        await syncDatabase();

        // Panggil fungsi untuk membuat admin default setelah sinkronisasi database
        await createDefaultAdmin();

        app.listen(PORT, () => {
            console.log(`Server berjalan di http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Tidak dapat terhubung ke database:", error);
    }
};

// Memanggil fungsi untuk memulai server
startServer();