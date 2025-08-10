const { PotensiDaerah } = require("../models");

// Mendapatkan semua data potensi daerah
const getAllPotensiDaerah = async(req, res) => {
    try {
        const data = await PotensiDaerah.findAll({
            order: [
                ["kategori", "ASC"],
                ["nama_potensi", "ASC"],
            ],
        });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            message: "Gagal mengambil data potensi daerah",
            error: error.message,
        });
    }
};

// Menambah data potensi daerah baru (Hanya Admin)
const createPotensiDaerah = async(req, res) => {
    const { nama_potensi, deskripsi, kategori, kontak_info } = req.body;
    try {
        const gambar_url = req.file ? req.file.filename : null; // <-- Ambil nama file
        const itemBaru = await PotensiDaerah.create({
            nama_potensi,
            deskripsi,
            kategori,
            gambar_url,
            kontak_info,
        });
        res.status(201).json(itemBaru);
    } catch (error) {
        res.status(400).json({
            message: "Gagal menambah data potensi daerah",
            error: error.message,
        });
    }
};

const updatePotensiDaerah = async(req, res) => {
    const { nama_potensi, deskripsi, kategori, kontak_info } = req.body;
    try {
        const item = await PotensiDaerah.findByPk(req.params.id);
        if (!item) {
            return res
                .status(404)
                .json({ message: "Data potensi daerah tidak ditemukan" });
        }
        const gambar_url = req.file ? req.file.filename : item.gambar_url; // <-- Cek file baru
        await item.update({
            nama_potensi,
            deskripsi,
            kategori,
            gambar_url,
            kontak_info,
        });
        res.status(200).json(item);
    } catch (error) {
        res.status(400).json({
            message: "Gagal memperbarui data potensi daerah",
            error: error.message,
        });
    }
};

// Menghapus data potensi daerah (Hanya Admin)
const deletePotensiDaerah = async(req, res) => {
    try {
        const item = await PotensiDaerah.findByPk(req.params.id);
        if (!item) {
            return res
                .status(404)
                .json({ message: "Data potensi daerah tidak ditemukan" });
        }
        await item.destroy();
        res.status(200).json({ message: "Data potensi daerah berhasil dihapus" });
    } catch (error) {
        res.status(500).json({
            message: "Gagal menghapus data potensi daerah",
            error: error.message,
        });
    }
};

module.exports = {
    getAllPotensiDaerah,
    createPotensiDaerah,
    updatePotensiDaerah,
    deletePotensiDaerah,
};