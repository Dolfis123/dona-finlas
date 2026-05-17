const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const cors = require("cors"); // Impor CORS
// Menambahkan 'User' ke dalam import dari folder models
const { sequelize, syncDatabase, User } = require("./src/models"); 

// Memuat variabel lingkungan dari file .env
dotenv.config();

// Membuat instance aplikasi Express
const app = express();

// --- KONFIGURASI CORS BARU ---
// Daftar domain yang diizinkan untuk mengakses API ini
const whitelist = [
    "http://localhost:5174",
    "https://kelurahanpadarni.blog",
    "https://www.kelurahanpadarni.blog",
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

// app.use(cors()); // <-- SAYA KOMENTARI KARENA INI MEMBUAT WHITELIST DI ATAS TIDAK BERGUNA DAN MEMBUKA API KE SEMUA ORANG

// Middleware untuk parsing body request sebagai JSON
app.use(express.json());
// Middleware untuk menyajikan file statis dari folder 'public'
app.use("/api", express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, 'public')));

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
const suratRoutes = require("./src/routes/suratRoutes");
const pegawaiRoutes = require("./src/routes/pegawaiRoutes");

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
app.use("/api/surat", suratRoutes);
app.use("/api/pegawai", pegawaiRoutes);


// =====================================================================
// --- FUNGSI BARU: Membuat Super Admin Default Otomatis ---
// =====================================================================
const createDefaultSuperAdmin = async () => {
    try {
        if (!User) {
            console.warn("⚠️ Model User belum ter-import dengan benar dari ./src/models");
            return;
        }

        // Cek apakah user dengan username 'admin' sudah ada
        const adminExists = await User.findOne({ where: { username: 'admin' } });
        
        if (!adminExists) {
            // Jika belum ada, buat baru. Kolom password akan di-hash oleh hook di model User.js
            await User.create({
                username: 'admin',
                password: 'admin123', 
                nama_lengkap: 'Super Admin Padarni',
                role: 'super_admin'
            });
            console.log("✅ Akun Super Admin default berhasil dibuat! (Username: admin, Pass: admin123)");
        } else {
            console.log("ℹ️ Akun Super Admin sudah ada. Melewati proses pembuatan.");
        }
    } catch (error) {
        console.error("❌ Gagal membuat akun Super Admin default:", error);
    }
};
// =====================================================================

// Menentukan port dari file .env atau default ke 8000
const PORT = process.env.PORT || 8000;

// Fungsi untuk memulai server
const startServer = async() => {
    try {
        await sequelize.authenticate();
        console.log("Koneksi ke database MySQL berhasil.");

        await syncDatabase();

        // <-- MENGUBAH DI SINI: Memanggil fungsi pembuat admin setelah tabel berhasil di-sync
        await createDefaultSuperAdmin();

        app.listen(PORT, () => {
            console.log(`Server berjalan di http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Tidak dapat terhubung ke database:", error);
    }
};

// Memanggil fungsi untuk memulai server
startServer();