const { Berita, User } = require("../models");

// --- Mendapatkan SEMUA berita ---
const getAllBerita = async(req, res) => {
    try {
        const berita = await Berita.findAll({
            // Sertakan data penulis dari tabel User
            include: {
                model: User,
                attributes: ["nama_lengkap"], // Hanya ambil kolom nama_lengkap
            },
            order: [
                ["tanggal_publikasi", "DESC"]
            ], // Urutkan dari yang terbaru
        });
        res.status(200).json(berita);
    } catch (error) {
        res
            .status(500)
            .json({ message: "Gagal mengambil data berita", error: error.message });
    }
};

// --- Mendapatkan SATU berita berdasarkan ID ---
const getBeritaById = async(req, res) => {
    try {
        const berita = await Berita.findByPk(req.params.id, {
            include: {
                model: User,
                attributes: ["nama_lengkap"],
            },
        });

        if (!berita) {
            return res.status(404).json({ message: "Berita tidak ditemukan" });
        }
        res.status(200).json(berita);
    } catch (error) {
        res
            .status(500)
            .json({ message: "Gagal mengambil data berita", error: error.message });
    }
};

const createBerita = async(req, res) => {
    const { judul, isi, kategori } = req.body;

    try {
        // Ambil nama file dari req.file yang disediakan oleh multer
        const gambar_url = req.file ? req.file.filename : null;

        const beritaBaru = await Berita.create({
            judul,
            isi,
            kategori,
            gambar_url, // Simpan nama file ke database
            penulis_id: req.user.id,
            tanggal_publikasi: new Date(),
        });
        res.status(201).json(beritaBaru);
    } catch (error) {
        res
            .status(400)
            .json({ message: "Gagal membuat berita", error: error.message });
    }
};

// --- PERUBAHAN DI updateBerita ---
const updateBerita = async(req, res) => {
    const { judul, isi, kategori } = req.body;

    try {
        const berita = await Berita.findByPk(req.params.id);
        if (!berita) {
            return res.status(404).json({ message: "Berita tidak ditemukan" });
        }

        // Cek apakah ada file baru yang diunggah
        const gambar_url = req.file ? req.file.filename : berita.gambar_url;

        await berita.update({ judul, isi, kategori, gambar_url });
        res.status(200).json(berita);
    } catch (error) {
        res
            .status(400)
            .json({ message: "Gagal memperbarui berita", error: error.message });
    }
};
// --- Menghapus berita (Hanya untuk Admin) ---
const deleteBerita = async(req, res) => {
    try {
        const berita = await Berita.findByPk(req.params.id);

        if (!berita) {
            return res.status(404).json({ message: "Berita tidak ditemukan" });
        }

        // (Opsional) Cek apakah user yang menghapus adalah penulis asli
        // if (berita.penulis_id !== req.user.id) {
        //   return res.status(403).json({ message: 'Anda tidak memiliki izin untuk menghapus berita ini' });
        // }

        await berita.destroy();
        res.status(200).json({ message: "Berita berhasil dihapus" });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Gagal menghapus berita", error: error.message });
    }
};

module.exports = {
    getAllBerita,
    getBeritaById,
    createBerita,
    updateBerita,
    deleteBerita,
};