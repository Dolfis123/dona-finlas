const { PengajuanSementara, JenisSurat, ArsipSurat,PengajuanSurat, Pegawai } = require("../models");

// Fungsi helper untuk bikin Kode Tiket Unik
// Format: REQ-TIMESTAMP-RANDOM (Contoh: REQ-170988-X7Z)
const generateTicket = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `REQ-${timestamp}-${random}`;
};

// 1. [WARGA] Mengajukan Surat Baru
// 1. [WARGA] Mengajukan Surat Baru
exports.ajukanSurat = async (req, res) => {
  try {
    // Gunakan 'let' agar nilai id_jenis bisa kita timpa jika perlu
    let { 
      id_jenis, 
      nik, 
      nama_lengkap, 
      no_hp, 
      data_form_json, 
      data_berkas_json 
    } = req.body;

    // 1. Validasi Dasar
    if (!id_jenis || !nik || !nama_lengkap) {
      return res.status(400).json({ message: "Data utama (Jenis, NIK, Nama) wajib diisi." });
    }

    // 2. PROTEKSI FOREIGN KEY: 
    // Jika id_jenis yang dikirim adalah STRING (Nama Surat), cari ID-nya di database
    if (isNaN(id_jenis)) {
      const jenisFound = await JenisSurat.findOne({ 
        where: { nama_surat: id_jenis } 
      });

      if (!jenisFound) {
        return res.status(400).json({ 
          message: `Jenis surat '${id_jenis}' tidak terdaftar di sistem.` 
        });
      }
      // Timpa nilai id_jenis dengan ID (angka) yang asli dari database
      id_jenis = jenisFound.id_jenis;
    }

    // 3. Generate Tiket
    const kode_tiket = generateTicket();

    // 4. Pastikan JSON aman
    const finalFormJson = typeof data_form_json === 'object' 
      ? JSON.stringify(data_form_json) 
      : data_form_json;

    const finalBerkasJson = typeof data_berkas_json === 'object' 
      ? JSON.stringify(data_berkas_json) 
      : (data_berkas_json || "{}");

    // 5. Simpan ke Database
    const pengajuan = await PengajuanSementara.create({
      kode_tiket,
      id_jenis, // Sekarang dijamin berisi Angka (ID)
      nik,
      nama_lengkap: nama_lengkap.toUpperCase(),
      no_hp,
      data_form_json: finalFormJson,
      data_berkas_json: finalBerkasJson,
      status: "PENDING"
    });

    res.status(201).json({
      message: "Pengajuan berhasil dikirim!",
      ticket: kode_tiket,
      data: pengajuan
    });

  } catch (error) {
    console.error("CRITICAL ERROR BACKEND:", error);
    res.status(500).json({ 
      message: "Gagal mengajukan surat", 
      error: error.message 
    });
  }
};

// 2. [WARGA] Cek Status Surat (Berdasarkan Kode Tiket)
// 2. [WARGA] Cek Status Surat (Berdasarkan Kode Tiket) - VERSI PINTAR
exports.cekStatusSurat = async (req, res) => {
  try {
    const { kode_tiket } = req.params;

    // LANGKAH 1: Coba cari di antrean sementara terlebih dahulu
    const dataSementara = await PengajuanSementara.findOne({
      where: { kode_tiket },
      include: [
        { model: JenisSurat, as: "detail_jenis", attributes: ["nama_surat"] }
      ]
    });

    // Jika ketemu di antrean sementara, berarti statusnya masih PENDING atau VALIDASI
    if (dataSementara) {
      return res.status(200).json({
        kode_tiket: dataSementara.kode_tiket,
        nama_lengkap: dataSementara.nama_lengkap,
        jenis_surat: dataSementara.detail_jenis ? dataSementara.detail_jenis.nama_surat : "Surat",
        status: "MENUNGGU VALIDASI",
        keterangan: "Surat Anda sedang dalam antrean pemeriksaan oleh petugas kelurahan."
      });
    }

    // LANGKAH 2: Jika tidak ada di sementara, cek apakah sudah masuk ke tabel ArsipSurat?
    const dataArsip = await ArsipSurat.findOne({
      where: { kode_tiket_asal: kode_tiket }
    });

    // Jika ketemu di tabel arsip, artinya surat SUDAH DISETUJUI & SELESAI
    if (dataArsip) {
      return res.status(200).json({
        kode_tiket: dataArsip.kode_tiket_asal,
        nama_lengkap: dataArsip.nama_lengkap,
        jenis_surat: dataArsip.jenis_surat_snapshot,
        status: "SELESAI / DISETUJUI",
        no_surat: dataArsip.no_surat_manual,
        tgl_selesai: dataArsip.tgl_surat,
        keterangan: `Surat Anda telah diterbitkan dengan Nomor: ${dataArsip.no_surat_manual}. Silakan ambil berkas fisik di kantor kelurahan.`
      });
    }

    // LANGKAH 3: Jika di kedua tabel tidak ditemukan, baru kirim status 404
    return res.status(404).json({ message: "Kode tiket tidak terdaftar atau salah ketik." });

  } catch (error) {
    console.error("Error Cek Status:", error);
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

// 3. [ADMIN] Lihat Antrean Masuk (Pending)
exports.getAntreanPending = async (req, res) => {
  try {
    const data = await PengajuanSementara.findAll({
      where: { status: "PENDING" },
      include: [
        { model: JenisSurat, as: "detail_jenis", attributes: ["nama_surat"] }
      ],
      order: [['tgl_pengajuan', 'ASC']] // Yang lama di atas
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil antrean", error: error.message });
  }
};

// 4. [ADMIN] Update Data Pengajuan (Jika ada salah ketik saat validasi)
exports.updatePengajuan = async (req, res) => {
  try {
    const { id } = req.params;
    const { nik, nama_lengkap, data_form_json } = req.body;

    await PengajuanSementara.update(
      { nik, nama_lengkap, data_form_json },
      { where: { id_pengajuan: id } }
    );

    res.status(200).json({ message: "Data pengajuan berhasil diperbarui." });
  } catch (error) {
    res.status(500).json({ message: "Gagal update data", error: error.message });
  }
};
const { sequelize } = require("../models");

// 5. [ADMIN] FINALISASI SURAT (Pindah ke Arsip & Hapus Antrean)
exports.finalizeSurat = async (req, res) => {
  // Mulai Transaksi Database
  // (Gunanya: Kalau ada error di tengah jalan, semua perubahan dibatalkan otomatis)
  const t = await sequelize.transaction();

  try {
    const { id_pengajuan, no_surat_manual, id_pegawai_ttd, tgl_surat } = req.body;

    // A. CEK DUPLIKAT NOMOR SURAT
    // Kita cek dulu apakah nomor manual yang diketik admin sudah pernah dipakai?
    const cekDuplikat = await ArsipSurat.findOne({
      where: { no_surat_manual: no_surat_manual }
    });

    if (cekDuplikat) {
      // Jika nomor sudah ada, stop proses dan kirim error
      await t.rollback();
      return res.status(400).json({ 
        message: `GAGAL: Nomor surat '${no_surat_manual}' sudah pernah digunakan! Silakan cek buku agenda.` 
      });
    }

    // B. AMBIL DATA DARI PENGAJUAN SEMENTARA
  const dataPending = await PengajuanSementara.findByPk(id_pengajuan, {
      include: [{ model: JenisSurat, as: 'detail_jenis' }] // Tambahkan include ini
    });
    
    if (!dataPending) {
      await t.rollback();
      return res.status(404).json({ message: "Data pengajuan tidak ditemukan." });
    }

  // C. PINDAHKAN KE ARSIP
    const arsipBaru = await ArsipSurat.create({
      no_surat_manual: no_surat_manual,
      tgl_surat: tgl_surat || new Date(),
      id_pegawai_ttd: id_pegawai_ttd,
      id_admin: null, 
      
      kode_tiket_asal: dataPending.kode_tiket,
      
      // PERBAIKAN: Ambil nama jenis surat dari relasi, bukan hardcode "Surat Resmi"
      jenis_surat_snapshot: dataPending.detail_jenis ? dataPending.detail_jenis.nama_surat : "Surat Keterangan",
      
      nik: dataPending.nik,
      nama_lengkap: dataPending.nama_lengkap,
      
      // Pastikan JSON disalin utuh
      data_form_final: dataPending.data_form_json 
    }, { transaction: t });

    // D. HAPUS DARI SEMENTARA (DELETE)
    await PengajuanSementara.destroy({
      where: { id_pengajuan: id_pengajuan },
      transaction: t
    });

    // Jika sampai sini lancar, Simpan Perubahan Permanen
  await t.commit();
    
    res.status(200).json({
      message: "Sukses! Surat berhasil divalidasi dan diarsipkan.",
      data_arsip: arsipBaru
    });

  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: "Gagal memproses surat", error: error.message });
  }
};

// 6. [ADMIN] Hapus Pengajuan (Misal data spam/double)
exports.deletePengajuan = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PengajuanSementara.destroy({
      where: { id_pengajuan: id }
    });

    if (!deleted) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    res.status(200).json({ message: "Pengajuan berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus data", error: error.message });
  }
};
exports.getAllArsip = async (req, res) => {
  try {
    const dataArsip = await ArsipSurat.findAll({
      // PERBAIKAN DI SINI:
      // Gunakan 'tgl_arsip' atau 'id_arsip' untuk mengurutkan dari yang terbaru
      order: [["tgl_arsip", "DESC"]], 
      
      include: [
        {
          model: Pegawai,
          as: "pegawai_ttd",
          attributes: ["nama_lengkap", "jabatan", "nip"],
        },
      ],
    });

    // ... (sisa kode mapping di bawahnya tetap sama) ...
    
    const formattedData = dataArsip.map((item) => {
        // ... kode mapping tetap sama ...
        const pgw = item.pegawai_ttd || {};
        return {
            id_arsip: item.id_arsip,
            no_surat: item.no_surat_manual,
            tgl_surat: item.tgl_surat,
            nama_lengkap: item.nama_lengkap,
            nik: item.nik,
            jenis_surat: item.jenis_surat_snapshot,
            nama_pegawai: pgw.nama_lengkap || "Data Pegawai Hilang",
            jabatan_pegawai: pgw.jabatan || "-",
            nip_pegawai: pgw.nip || "-"
        };
    });

    res.status(200).json(formattedData);

  } catch (error) {
    console.error("Error get arsip:", error);
    res.status(500).json({ message: "Gagal mengambil data arsip." });
  }
};
// ... kode atas sama ...

exports.getDetailArsip = async (req, res) => {
  try {
    const { id_arsip } = req.params;
    
    const data = await ArsipSurat.findOne({
      where: { id_arsip },
      include: [
        {
          model: Pegawai,
          as: "pegawai_ttd",
          attributes: ["nama_lengkap", "jabatan", "nip"],
        },
      ],
    });

    if (!data) return res.status(404).json({ message: "Data tidak ditemukan" });

    // === PERBAIKAN DI SINI (DOUBLE PARSING) ===
    let detailForm = data.data_form_final;

    try {
        // Cek 1: Jika string, coba parse jadi object/string bersih
        if (typeof detailForm === 'string') {
            detailForm = JSON.parse(detailForm);
        }
        
        // Cek 2: Jika hasilnya MASIH string (kasus double stringify seperti di ID 8), parse sekali lagi
        if (typeof detailForm === 'string') {
            detailForm = JSON.parse(detailForm);
        }
    } catch (e) {
        console.error("Gagal parse JSON:", e);
        detailForm = {};
    }
    // ==========================================

    const responseData = {
        ...data.toJSON(),
        detail: detailForm || {} 
    };

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ... kode lainnya ...

// 7. [ADMIN] Ambil Detail 1 Pengajuan (Pending)
exports.getDetailPengajuan = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await PengajuanSementara.findOne({
      where: { id_pengajuan: id },
      include: [
        { model: JenisSurat, as: "detail_jenis", attributes: ["nama_surat", "kode_surat"] }
      ]
    });

    if (!data) return res.status(404).json({ message: "Pengajuan tidak ditemukan" });

    // Parse JSON jika masih string (jaga-jaga)
    let formData = data.data_form_json;
    if (typeof formData === 'string') {
        try { formData = JSON.parse(formData); } catch(e) {}
    }
    
    // Kirim data rapi
    const responseData = { ...data.toJSON(), data_form_json: formData };
    res.status(200).json(responseData);

  } catch (error) {
    res.status(500).json({ message: "Error server", error: error.message });
  }
};