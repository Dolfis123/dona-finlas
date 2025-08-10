const express = require("express");
const {
    getAllPotensiDaerah,
    createPotensiDaerah,
    updatePotensiDaerah,
    deletePotensiDaerah,
} = require("../controllers/potensiDaerahController");
const { protect } = require("../middlewares/authMiddleware");
const { uploadImage } = require("../middlewares/uploadMiddleware"); // <-- Impor

const router = express.Router();

// Rute Publik
router.get("/", getAllPotensiDaerah);

// Rute yang Dilindungi (Admin)
router.post("/", protect, uploadImage, createPotensiDaerah);
router.put("/:id", protect, uploadImage, updatePotensiDaerah);
router.delete("/:id", protect, deletePotensiDaerah);

module.exports = router;