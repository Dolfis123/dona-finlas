const { Faq } = require("../models");

// Mendapatkan semua data FAQ, dikelompokkan berdasarkan kategori
const getAllFaq = async(req, res) => {
    try {
        const data = await Faq.findAll({
            order: [
                ["kategori", "ASC"],
                ["createdAt", "ASC"],
            ],
        });
        // Mengelompokkan hasil berdasarkan kategori untuk frontend
        const groupedFaq = data.reduce((acc, item) => {
            const { kategori } = item;
            if (!acc[kategori]) {
                acc[kategori] = [];
            }
            acc[kategori].push(item);
            return acc;
        }, {});
        res.status(200).json(groupedFaq);
    } catch (error) {
        res
            .status(500)
            .json({ message: "Gagal mengambil data FAQ", error: error.message });
    }
};

// Menambah item FAQ baru (Hanya Admin)
const createFaq = async(req, res) => {
    const { pertanyaan, jawaban, kategori } = req.body;
    try {
        const itemBaru = await Faq.create({ pertanyaan, jawaban, kategori });
        res.status(201).json(itemBaru);
    } catch (error) {
        res
            .status(400)
            .json({ message: "Gagal menambah item FAQ", error: error.message });
    }
};

// Mengedit item FAQ (Hanya Admin)
const updateFaq = async(req, res) => {
    const { pertanyaan, jawaban, kategori } = req.body;
    try {
        const item = await Faq.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item FAQ tidak ditemukan" });
        }
        await item.update({ pertanyaan, jawaban, kategori });
        res.status(200).json(item);
    } catch (error) {
        res
            .status(400)
            .json({ message: "Gagal memperbarui item FAQ", error: error.message });
    }
};

// Menghapus item FAQ (Hanya Admin)
const deleteFaq = async(req, res) => {
    try {
        const item = await Faq.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item FAQ tidak ditemukan" });
        }
        await item.destroy();
        res.status(200).json({ message: "Item FAQ berhasil dihapus" });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Gagal menghapus item FAQ", error: error.message });
    }
};

module.exports = {
    getAllFaq,
    createFaq,
    updateFaq,
    deleteFaq,
};