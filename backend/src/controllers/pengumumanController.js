const { Pengumuman } = require("../models");

// Mendapatkan semua pengumuman
const getAllPengumuman = async(req, res) => {
    try {
        const data = await Pengumuman.findAll({
            order: [
                ["tanggal_publikasi", "DESC"]
            ],
        });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            message: "Gagal mengambil data pengumuman",
            error: error.message,
        });
    }
};

// Membuat pengumuman baru (Hanya Admin)
const createPengumuman = async(req, res) => {
    const { judul, isi, level_penting } = req.body;
    try {
        const pengumumanBaru = await Pengumuman.create({
            judul,
            isi,
            level_penting,
            tanggal_publikasi: new Date(),
        });
        res.status(201).json(pengumumanBaru);
    } catch (error) {
        res
            .status(400)
            .json({ message: "Gagal membuat pengumuman", error: error.message });
    }
};

// Mengedit pengumuman (Hanya Admin)
const updatePengumuman = async(req, res) => {
    const { judul, isi, level_penting } = req.body;
    try {
        const pengumuman = await Pengumuman.findByPk(req.params.id);
        if (!pengumuman) {
            return res.status(404).json({ message: "Pengumuman tidak ditemukan" });
        }
        await pengumuman.update({ judul, isi, level_penting });
        res.status(200).json(pengumuman);
    } catch (error) {
        res
            .status(400)
            .json({ message: "Gagal memperbarui pengumuman", error: error.message });
    }
};

// Menghapus pengumuman (Hanya Admin)
const deletePengumuman = async(req, res) => {
    try {
        const pengumuman = await Pengumuman.findByPk(req.params.id);
        if (!pengumuman) {
            return res.status(404).json({ message: "Pengumuman tidak ditemukan" });
        }
        await pengumuman.destroy();
        res.status(200).json({ message: "Pengumuman berhasil dihapus" });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Gagal menghapus pengumuman", error: error.message });
    }
};

module.exports = {
    getAllPengumuman,
    createPengumuman,
    updatePengumuman,
    deletePengumuman,
};