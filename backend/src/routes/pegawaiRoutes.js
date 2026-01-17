const express = require('express');
const router = express.Router();
const pegawaiController = require('../controllers/suratMasterController'); 

// Rute CRUD Pegawai
router.get('/', pegawaiController.getAllPegawai);           // Ambil Semua
// router.get('/:id', pegawaiController.getPegawaiById);      // Ambil Satu
router.post('/', pegawaiController.createPegawai);          // Tambah
router.put('/:id', pegawaiController.updatePegawai);       // Edit
router.delete('/:id', pegawaiController.deletePegawai);    // Hapus

module.exports = router;