const { About } = require("../models");

// Mendapatkan konten halaman Tentang Kami
const getAboutContent = async(req, res) => {
    try {
        // Cari data pertama, atau buat data kosong jika belum ada
        const [data] = await About.findOrCreate({
            where: { id: 1 },
            defaults: {
                id: 1,
                sejarah: "Isi sejarah kelurahan di sini...",
                visi: "Isi visi kelurahan di sini...",
                misi: "1. Misi pertama.\n2. Misi kedua.",
            },
        });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            message: "Gagal mengambil konten Halaman Tentang Kami",
            error: error.message,
        });
    }
};

// Memperbarui konten halaman Tentang Kami (Hanya Admin)
const updateAboutContent = async(req, res) => {
    const { sejarah, visi, misi } = req.body;
    try {
        // Menggunakan upsert: update jika id=1 ada, atau buat baru jika tidak ada.
        const [data] = await About.upsert({
            id: 1, // Selalu bekerja pada baris dengan id 1
            sejarah,
            visi,
            misi,
        });
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({
            message: "Gagal memperbarui konten Halaman Tentang Kami",
            error: error.message,
        });
    }
};

module.exports = {
    getAboutContent,
    updateAboutContent,
};