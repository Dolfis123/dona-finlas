const { Pejabat } = require("../models");

// Mendapatkan semua data pejabat, diurutkan berdasarkan kolom 'urutan'
const getAllPejabat = async(req, res) => {
    try {
        const data = await Pejabat.findAll({
            order: [
                ["urutan", "ASC"]
            ],
        });
        res.status(200).json(data);
    } catch (error) {
        res
            .status(500)
            .json({ message: "Gagal mengambil data pejabat", error: error.message });
    }
};

// Membuat data pejabat baru (Hanya Admin)
const createPejabat = async(req, res) => {
    const { nama_lengkap, jabatan, urutan } = req.body;
    try {
        const foto_url = req.file ? req.file.filename : null; // <-- Ambil nama file
        const pejabatBaru = await Pejabat.create({
            nama_lengkap,
            jabatan,
            foto_url,
            urutan,
        });
        res.status(201).json(pejabatBaru);
    } catch (error) {
        res
            .status(400)
            .json({ message: "Gagal membuat data pejabat", error: error.message });
    }
};

const updatePejabat = async(req, res) => {
    const { nama_lengkap, jabatan, urutan } = req.body;
    try {
        const pejabat = await Pejabat.findByPk(req.params.id);
        if (!pejabat) {
            return res.status(404).json({ message: "Data pejabat tidak ditemukan" });
        }
        const foto_url = req.file ? req.file.filename : pejabat.foto_url; // <-- Cek file baru
        await pejabat.update({ nama_lengkap, jabatan, foto_url, urutan });
        res.status(200).json(pejabat);
    } catch (error) {
        res.status(400).json({
            message: "Gagal memperbarui data pejabat",
            error: error.message,
        });
    }
};

// Menghapus data pejabat (Hanya Admin)
const deletePejabat = async(req, res) => {
    try {
        const pejabat = await Pejabat.findByPk(req.params.id);
        if (!pejabat) {
            return res.status(404).json({ message: "Data pejabat tidak ditemukan" });
        }
        await pejabat.destroy();
        res.status(200).json({ message: "Data pejabat berhasil dihapus" });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Gagal menghapus data pejabat", error: error.message });
    }
};

module.exports = {
    getAllPejabat,
    createPejabat,
    updatePejabat,
    deletePejabat,
};