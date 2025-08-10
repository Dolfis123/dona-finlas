const { Agenda } = require("../models");

// Mendapatkan semua agenda, diurutkan berdasarkan tanggal
const getAllAgenda = async(req, res) => {
    try {
        const data = await Agenda.findAll({
            order: [
                ["tanggal_kegiatan", "ASC"]
            ], // Urutkan dari tanggal terdekat
        });
        res.status(200).json(data);
    } catch (error) {
        res
            .status(500)
            .json({ message: "Gagal mengambil data agenda", error: error.message });
    }
};

// Menambah agenda baru (Hanya Admin)
const createAgenda = async(req, res) => {
    const { nama_kegiatan, deskripsi, tanggal_kegiatan, waktu, lokasi } =
    req.body;
    try {
        const itemBaru = await Agenda.create({
            nama_kegiatan,
            deskripsi,
            tanggal_kegiatan,
            waktu,
            lokasi,
        });
        res.status(201).json(itemBaru);
    } catch (error) {
        res
            .status(400)
            .json({ message: "Gagal menambah agenda", error: error.message });
    }
};

// Mengedit agenda (Hanya Admin)
const updateAgenda = async(req, res) => {
    const { nama_kegiatan, deskripsi, tanggal_kegiatan, waktu, lokasi } =
    req.body;
    try {
        const item = await Agenda.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Agenda tidak ditemukan" });
        }
        await item.update({
            nama_kegiatan,
            deskripsi,
            tanggal_kegiatan,
            waktu,
            lokasi,
        });
        res.status(200).json(item);
    } catch (error) {
        res
            .status(400)
            .json({ message: "Gagal memperbarui agenda", error: error.message });
    }
};

// Menghapus agenda (Hanya Admin)
const deleteAgenda = async(req, res) => {
    try {
        const item = await Agenda.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Agenda tidak ditemukan" });
        }
        await item.destroy();
        res.status(200).json({ message: "Agenda berhasil dihapus" });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Gagal menghapus agenda", error: error.message });
    }
};

module.exports = {
    getAllAgenda,
    createAgenda,
    updateAgenda,
    deleteAgenda,
};