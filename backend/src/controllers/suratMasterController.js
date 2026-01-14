const { JenisSurat, SyaratSurat, Pegawai } = require("../models");

// --- PEGAWAI (PEJABAT TTD) ---

// Ambil semua data pegawai
exports.getAllPegawai = async (req, res) => {
  try {
    const data = await Pegawai.findAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data pegawai", error: error.message });
  }
};

// Tambah pegawai baru
exports.createPegawai = async (req, res) => {
  try {
    const { nip, nama_lengkap, jabatan } = req.body;
    const newPegawai = await Pegawai.create({ nip, nama_lengkap, jabatan });
    res.status(201).json({ message: "Pegawai berhasil ditambahkan", data: newPegawai });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambah pegawai", error: error.message });
  }
};

// --- JENIS SURAT & SYARAT ---

// Ambil semua jenis surat beserta syaratnya
exports.getAllJenisSurat = async (req, res) => {
  try {
    const data = await JenisSurat.findAll({
      where: { status_aktif: "Y" },
      include: [
        {
          model: SyaratSurat,
          as: "syarat", // Sesuai alias di index.js
          attributes: ["nama_dokumen", "wajib"],
        },
      ],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil jenis surat", error: error.message });
  }
};

// Buat Jenis Surat Baru (Contoh: Surat Kematian)
exports.createJenisSurat = async (req, res) => {
  try {
    const { kode_surat, nama_surat } = req.body;
    const newJenis = await JenisSurat.create({ kode_surat, nama_surat });
    res.status(201).json({ message: "Jenis surat berhasil dibuat", data: newJenis });
  } catch (error) {
    res.status(500).json({ message: "Gagal membuat jenis surat", error: error.message });
  }
};

// Tambah Syarat untuk surat tertentu
exports.addSyaratSurat = async (req, res) => {
  try {
    const { id_jenis, nama_dokumen, wajib } = req.body;
    const newSyarat = await SyaratSurat.create({ id_jenis, nama_dokumen, wajib });
    res.status(201).json({ message: "Syarat berhasil ditambahkan", data: newSyarat });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambah syarat", error: error.message });
  }
};