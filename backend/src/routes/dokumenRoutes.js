// =======================================================================
// FILE: src/routes/dokumenRoutes.js
// Mendefinisikan alamat URL untuk API dokumen.
// =======================================================================

const express = require("express");
const {
    getAllDokumen,
    createDokumen,
    updateDokumen,
    deleteDokumen,
} = require("../controllers/dokumenController");
const { protect } = require("../middlewares/authMiddleware");
const { uploadDocument } = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Rute Publik untuk mendapatkan semua dokumen
router.get("/", getAllDokumen);

// Rute yang Dilindungi (Admin) untuk mengelola dokumen
router.post("/", protect, uploadDocument, createDokumen);
router.put("/:id", protect, uploadDocument, updateDokumen);
router.delete("/:id", protect, deleteDokumen);

module.exports = router;