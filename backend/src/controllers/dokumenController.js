// =======================================================================
// FILE: src/controllers/dokumenController.js
// Berisi semua logika untuk mengelola data dokumen.
// =======================================================================

const { Dokumen: DokumenModel } = require("../models"); // Menggunakan alias untuk menghindari konflik nama

const getAllDokumen = async(req, res) => {
    try {
        const data = await DokumenModel.findAll({ order: [
                ["createdAt", "DESC"]
            ] });
        res.status(200).json(data);
    } catch (error) {
        res
            .status(500)
            .json({ message: "Gagal mengambil data dokumen", error: error.message });
    }
};

const createDokumen = async(req, res) => {
    const { nama_dokumen, deskripsi } = req.body;
    try {
        if (!req.file) {
            return res.status(400).json({ message: "File dokumen wajib diunggah" });
        }
        const { filename, mimetype, size } = req.file;
        const itemBaru = await DokumenModel.create({
            nama_dokumen,
            deskripsi,
            file_url: filename,
            tipe_file: mimetype,
            ukuran_file: `${(size / 1024).toFixed(2)} KB`, // Simpan ukuran dalam KB
        });
        res.status(201).json(itemBaru);
    } catch (error) {
        res
            .status(400)
            .json({ message: "Gagal menambah dokumen", error: error.message });
    }
};

const updateDokumen = async(req, res) => {
    const { nama_dokumen, deskripsi } = req.body;
    try {
        const item = await DokumenModel.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Dokumen tidak ditemukan" });
        }

        // Ambil data file lama sebagai default
        let { file_url, tipe_file, ukuran_file } = item;

        // Jika ada file baru yang diunggah, perbarui data file
        if (req.file) {
            file_url = req.file.filename;
            tipe_file = req.file.mimetype;
            ukuran_file = `${(req.file.size / 1024).toFixed(2)} KB`;
            // TODO: Tambahkan logika untuk menghapus file lama dari server
        }

        await item.update({
            nama_dokumen,
            deskripsi,
            file_url,
            tipe_file,
            ukuran_file,
        });
        res.status(200).json(item);
    } catch (error) {
        res
            .status(400)
            .json({ message: "Gagal memperbarui dokumen", error: error.message });
    }
};

const deleteDokumen = async(req, res) => {
    try {
        const item = await DokumenModel.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Dokumen tidak ditemukan" });
        }
        // TODO: Tambahkan logika untuk menghapus file fisik dari folder 'public/documents'
        await item.destroy();
        res.status(200).json({ message: "Dokumen berhasil dihapus" });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Gagal menghapus dokumen", error: error.message });
    }
};

module.exports = { getAllDokumen, createDokumen, updateDokumen, deleteDokumen };