// Model 'Layanan' tidak diimpor sesuai permintaan
const { Berita, Pengumuman, User } = require("../models");

/**
 * Mengambil data agregat untuk halaman dashboard.
 */
const getDashboardData = async(req, res) => {
    try {
        // Menghitung total data dari masing-masing model yang ada
        const totalBerita = await Berita.count();
        const totalPengumuman = await Pengumuman.count();
        const totalPengguna = await User.count();

        // Data simulasi untuk konten yang belum memiliki model/tabel sendiri
        const aktivitasTerkini = [
            { id: 1, teks: "User baru telah mendaftar.", waktu: "15 menit lalu" },
            {
                id: 2,
                teks: "Berita 'Kegiatan Posyandu Bulan Agustus' telah dipublikasikan.",
                waktu: "2 jam lalu",
            },
            {
                id: 3,
                teks: "Pengumuman 'Jadwal Ronda Malam' diperbarui.",
                waktu: "1 hari lalu",
            },
        ];

        const dataGrafik = {
            labels: ["Mei", "Juni", "Juli", "Agustus"],
            data: [120, 190, 150, 210],
        };

        // Mengirim respons JSON dengan data yang sudah dikumpulkan
        res.status(200).json({
            stats: {
                berita: totalBerita,
                pengumuman: totalPengumuman,
                pengguna: totalPengguna,
                // 'layanan' dihapus dari statistik
            },
            aktivitas: aktivitasTerkini,
            grafik: dataGrafik,
        });
    } catch (error) {
        console.error("Error saat mengambil data dashboard:", error);
        res.status(500).json({
            message: "Terjadi kesalahan pada server saat mengambil data dashboard.",
        });
    }
};

module.exports = {
    getDashboardData,
};