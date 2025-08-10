const { PengaturanHalaman } = require("../models");

// Fungsi getAllPengaturan tidak perlu diubah, sudah benar.
const getAllPengaturan = async(req, res) => {
    try {
        const data = await PengaturanHalaman.findAll();
        const settingsObject = data.reduce((acc, item) => {
            acc[item.kunci_elemen] = item.nilai_elemen;
            return acc;
        }, {});
        res.status(200).json(settingsObject);
    } catch (error) {
        res.status(500).json({
            message: "Gagal mengambil data pengaturan",
            error: error.message,
        });
    }
};

// --- FUNGSI YANG DIPERBAIKI ---
const updatePengaturan = async(req, res) => {
    const settingsToUpdate = req.body;

    if (!Array.isArray(settingsToUpdate)) {
        return res.status(400).json({ message: "Input harus berupa array" });
    }

    const transaction = await PengaturanHalaman.sequelize.transaction();

    try {
        // Lakukan semua pembaruan dalam satu transaksi
        for (const setting of settingsToUpdate) {
            // Menggunakan upsert: update jika ada, insert jika tidak ada
            await PengaturanHalaman.upsert({
                kunci_elemen: setting.kunci_elemen,
                nilai_elemen: setting.nilai_elemen,
                // Kita perlu menyediakan semua kolom yang tidak boleh null
                // atau memiliki nilai default di sini.
                // Untuk kasus ini, kita bisa menebak dari kuncinya.
                nama_halaman: setting.kunci_elemen.split("_")[0],
                tipe_elemen: setting.kunci_elemen.includes("judul") ?
                    "text" :
                    "textarea",
            }, { transaction });
        }

        await transaction.commit();
        res.status(200).json({ message: "Pengaturan berhasil diperbarui" });
    } catch (error) {
        await transaction.rollback();
        console.error("Error updating settings:", error); // Log error untuk debugging
        res
            .status(500)
            .json({ message: "Gagal memperbarui pengaturan", error: error.message });
    }
};

module.exports = {
    getAllPengaturan,
    updatePengaturan,
};