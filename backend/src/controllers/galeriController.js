const { Galeri } = require("../models");

// Mendapatkan semua item galeri, diurutkan dari yang terbaru
const getAllGaleri = async(req, res) => {
    try {
        const data = await Galeri.findAll({
            order: [
                ["tanggal_upload", "DESC"]
            ],
        });
        res.status(200).json(data);
    } catch (error) {
        res
            .status(500)
            .json({ message: "Gagal mengambil data galeri", error: error.message });
    }
};

// Menambah item galeri baru (Hanya Admin)
const createGaleriItem = async(req, res) => {
    const { deskripsi, kategori } = req.body;
    try {
        if (!req.file) {
            // Validasi jika tidak ada file yang diunggah
            return res.status(400).json({ message: "Gambar wajib diunggah" });
        }
        const gambar_url = req.file.filename; // <-- Ambil nama file
        const itemBaru = await Galeri.create({
            deskripsi,
            gambar_url,
            kategori,
            tanggal_upload: new Date(),
        });
        res.status(201).json(itemBaru);
    } catch (error) {
        res
            .status(400)
            .json({ message: "Gagal menambah item galeri", error: error.message });
    }
};

const updateGaleriItem = async(req, res) => {
    const { deskripsi, kategori } = req.body;
    try {
        const item = await Galeri.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item galeri tidak ditemukan" });
        }
        const gambar_url = req.file ? req.file.filename : item.gambar_url; // <-- Cek file baru
        await item.update({ deskripsi, gambar_url, kategori });
        res.status(200).json(item);
    } catch (error) {
        res
            .status(400)
            .json({ message: "Gagal memperbarui item galeri", error: error.message });
    }
};

// Menghapus item galeri (Hanya Admin)
const deleteGaleriItem = async(req, res) => {
    try {
        const item = await Galeri.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item galeri tidak ditemukan" });
        }
        await item.destroy();
        res.status(200).json({ message: "Item galeri berhasil dihapus" });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Gagal menghapus item galeri", error: error.message });
    }
};

module.exports = {
    getAllGaleri,
    createGaleriItem,
    updateGaleriItem,
    deleteGaleriItem,
};