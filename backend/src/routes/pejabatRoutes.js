const express = require("express");
const {
    getAllPejabat,
    createPejabat,
    updatePejabat,
    deletePejabat,
} = require("../controllers/pejabatController");
const { protect } = require("../middlewares/authMiddleware");
const { uploadImage } = require("../middlewares/uploadMiddleware"); // <-- Impor

const router = express.Router();

// Rute Publik
router.get("/", getAllPejabat);

// Rute yang Dilindungi (Admin)
router.post("/", protect, uploadImage, createPejabat);
router.put("/:id", protect, uploadImage, updatePejabat);
router.delete("/:id", protect, deletePejabat);

module.exports = router;