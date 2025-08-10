const express = require("express");
const {
    getSambutan,
    updateSambutan,
} = require("../controllers/sambutanController");
const { protect } = require("../middlewares/authMiddleware");
const { uploadImage } = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Rute Publik untuk mendapatkan konten
router.get("/", getSambutan);

// Rute yang Dilindungi (Admin) untuk memperbarui konten
// Middleware uploadImage akan menangani file yang diunggah dengan nama field 'gambar'
router.put("/", protect, uploadImage, updateSambutan);

module.exports = router;