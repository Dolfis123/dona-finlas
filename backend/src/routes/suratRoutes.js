const express = require("express");
const router = express.Router();
const masterController = require("../controllers/suratMasterController");
const pengajuanController = require("../controllers/suratPengajuanController");
const cetakController = require("../controllers/cetakSuratController");

// --- ROUTE ADMIN (MASTER DATA) ---
router.get("/master/pegawai", masterController.getAllPegawai);
router.post("/master/pegawai", masterController.createPegawai);

router.get("/master/jenis", masterController.getAllJenisSurat);
router.post("/master/jenis", masterController.createJenisSurat);
router.post("/master/syarat", masterController.addSyaratSurat);
router.put("/master/jenis/:id", masterController.updateJenisSurat);
router.delete("/master/jenis/:id", masterController.deleteJenisSurat);

// --- ROUTE PUBLIC (WARGA) ---
router.post("/ajukan", pengajuanController.ajukanSurat); // Warga kirim form
router.get("/status/:kode_tiket", pengajuanController.cekStatusSurat); // Warga cek status

// --- ROUTE ADMIN (TRANSAKSI) ---
router.get("/antrean", pengajuanController.getAntreanPending); // Admin lihat list
router.get("/arsip", pengajuanController.getAllArsip);
router.put("/update/:id", pengajuanController.updatePengajuan); // Admin edit data salah
router.post("/finalize", pengajuanController.finalizeSurat);
router.delete("/hapus/:id", pengajuanController.deletePengajuan);
router.get("/cetak/:id_arsip", cetakController.cetakSuratPDF);
// Di bawah router.get("/arsip", ...);
router.get("/arsip/:id_arsip", pengajuanController.getDetailArsip);
// ... route antrean ...
router.get("/pengajuan/:id", pengajuanController.getDetailPengajuan); // <--- TAMBAHKAN INI
module.exports = router;