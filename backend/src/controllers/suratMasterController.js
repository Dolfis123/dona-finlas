const { JenisSurat, SyaratSurat, Pegawai } = require("../models");


// --- Tambah pegawai baru (FIXED) ---
exports.createPegawai = async (req, res) => {
  try {
    // Tambahkan status_aktif di sini
    const { nip, nama_lengkap, jabatan, status_aktif } = req.body;
    
    // Cek Duplikasi NIP
    const existing = await Pegawai.findOne({ where: { nip } });
    if (existing) {
        return res.status(400).json({ message: "NIP sudah digunakan pegawai lain!" });
    }

    const newPegawai = await Pegawai.create({ 
        nip, 
        nama_lengkap, 
        jabatan,
        // Pastikan default 'Y' jika kosong
        status_aktif: status_aktif || 'Y' 
    });
    
    res.status(201).json({ message: "Pegawai berhasil ditambahkan", data: newPegawai });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambah pegawai", error: error.message });
  }
};

// --- Update pegawai (FIXED) ---
exports.updatePegawai = async (req, res) => {
    try {
        const { id } = req.params;
        const { nip, nama_lengkap, jabatan, status_aktif } = req.body;

        const pegawai = await Pegawai.findByPk(id);

        if (!pegawai) {
            return res.status(404).json({ message: "Pegawai tidak ditemukan" });
        }

        // Update data
        await pegawai.update({
            nip,
            nama_lengkap,
            jabatan,
            status_aktif
        });

        res.status(200).json({ 
            message: "Data pegawai berhasil diperbarui", 
            data: pegawai 
        });

    } catch (error) {
        // Ini akan menangkap error jika kolom status_aktif tidak ada di DB
        console.error("Error Update:", error); 
        res.status(500).json({ message: "Server Error: Gagal update data", error: error.message });
    }
};
// --- PEGAWAI (PEJABAT TTD) ---

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

// ==========================================
// 5. DELETE: Hapus pegawai
// ==========================================
exports.deletePegawai = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Cari pegawai dulu
        const pegawai = await Pegawai.findByPk(id);

        // 2. Cek apakah ada?
        if (!pegawai) {
            return res.status(404).json({ message: "Pegawai tidak ditemukan" });
        }

        // 3. Hapus data (Hard Delete)
        await pegawai.destroy();

        // 4. Kirim respon sukses
        res.status(200).json({ message: "Pegawai berhasil dihapus" });

    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus pegawai", error: error.message });
    }
};

// ... (Kode getAllJenisSurat, createJenisSurat, addSyaratSurat yang sudah ada biarkan saja) ...

// ==========================================
// TAMBAHAN: UPDATE & DELETE JENIS SURAT
// ==========================================

// 4. UPDATE: Edit Jenis Surat
exports.updateJenisSurat = async (req, res) => {
  try {
    const { id } = req.params;
    const { kode_surat, nama_surat, status_aktif } = req.body;
    
    const surat = await JenisSurat.findByPk(id);
    if (!surat) return res.status(404).json({ message: "Data tidak ditemukan" });

    await surat.update({ kode_surat, nama_surat, status_aktif });
    res.status(200).json({ message: "Berhasil diupdate" });
  } catch (error) {
    res.status(500).json({ message: "Gagal update", error: error.message });
  }
};

// 5. DELETE: Hapus Jenis Surat
exports.deleteJenisSurat = async (req, res) => {
  try {
    const { id } = req.params;
    const surat = await JenisSurat.findByPk(id);
    
    if (!surat) return res.status(404).json({ message: "Data tidak ditemukan" });

    // Hapus data (Hard Delete)
    await surat.destroy();
    
    res.status(200).json({ message: "Berhasil dihapus" });
  } catch (error) {
    // Error biasanya karena ada relasi (foreign key constraint) di tabel syarat
    res.status(500).json({ message: "Gagal hapus. Hapus dulu syarat surat ini!", error: error.message });
  }
};

// ... kode controller sebelumnya ...

// 6. DELETE SYARAT (Hapus item syarat, misal: hapus syarat "KTP")
exports.deleteSyarat = async (req, res) => {
  try {
    const { id } = req.params; // ID dari tabel syarat_surat
    const syarat = await SyaratSurat.findByPk(id);

    if (!syarat) return res.status(404).json({ message: "Syarat tidak ditemukan" });

    await syarat.destroy();
    res.status(200).json({ message: "Syarat berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus syarat", error: error.message });
  }
};