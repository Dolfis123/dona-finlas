const express = require("express");
const {
    getAboutContent,
    updateAboutContent,
} = require("../controllers/aboutController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Rute Publik untuk mendapatkan konten
router.get("/", getAboutContent);

// Rute yang Dilindungi (Admin) untuk memperbarui konten
router.put("/", protect, updateAboutContent);

module.exports = router;