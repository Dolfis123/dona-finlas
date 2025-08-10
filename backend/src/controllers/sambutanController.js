const { Sambutan } = require("../models");

// Mendapatkan konten kata sambutan
const getSambutan = async(req, res) => {
    try {
        // Cari data pertama, atau buat data kosong jika belum ada
        const [data] = await Sambutan.findOrCreate({
            where: { id: 1 },
            defaults: {
                id: 1,
                isi_sambutan: "Isi kata sambutan di sini...",
                nama_lurah: "Nama Kepala Lurah",
                jabatan_lurah: "Kepala Kelurahan Padarni",
                foto_url: null,
            },
        });
        res.status(200).json(data);
    } catch (error) {
        res
            .status(500)
            .json({ message: "Gagal mengambil kata sambutan", error: error.message });
    }
};

// Memperbarui konten kata sambutan (Hanya Admin)
const updateSambutan = async(req, res) => {
    const { isi_sambutan, nama_lurah, jabatan_lurah } = req.body;
    try {
        // Cek apakah ada file baru yang diunggah
        const foto_url = req.file ? req.file.filename : req.body.foto_url;

        // Menggunakan upsert: update jika id=1 ada, atau buat baru jika tidak ada.
        const [data] = await Sambutan.upsert({
            id: 1, // Selalu bekerja pada baris dengan id 1
            isi_sambutan,
            nama_lurah,
            jabatan_lurah,
            foto_url,
        });
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({
            message: "Gagal memperbarui kata sambutan",
            error: error.message,
        });
    }
};

module.exports = {
    getSambutan,
    updateSambutan,
};