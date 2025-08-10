const express = require("express");
const {
  getAllBerita,
  getBeritaById,
  createBerita,
  updateBerita,
  deleteBerita,
} = require("../controllers/beritaController");
const { protect } = require("../middlewares/authMiddleware");
const { uploadImage } = require("../middlewares/uploadMiddleware"); // <-- Impor middleware upload

const router = express.Router();

// --- Rute Publik (Tidak perlu login) ---
// GET /api/berita -> Mendapatkan semua berita
router.get("/", getAllBerita);
// GET /api/berita/:id -> Mendapatkan satu berita
router.get("/:id", getBeritaById);

// --- Rute yang Dilindungi (Harus login sebagai admin) ---
// POST /api/berita -> Membuat berita baru
router.post("/", protect, uploadImage, createBerita);
// PUT /api/berita/:id -> Mengedit berita
router.put("/:id", protect, uploadImage, updateBerita);
// DELETE /api/berita/:id -> Menghapus berita
router.delete("/:id", protect, deleteBerita);

module.exports = router;
