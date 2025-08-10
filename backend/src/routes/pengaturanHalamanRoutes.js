const express = require("express");
const {
    getAllPengaturan,
    updatePengaturan,
} = require("../controllers/pengaturanHalamanController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Rute Publik untuk mendapatkan semua pengaturan
router.get("/", getAllPengaturan);

// Rute yang Dilindungi (Admin) untuk memperbarui pengaturan
router.put("/", protect, updatePengaturan);

module.exports = router;