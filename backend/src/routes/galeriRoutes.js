const express = require("express");
const {
    getAllGaleri,
    createGaleriItem,
    updateGaleriItem,
    deleteGaleriItem,
} = require("../controllers/galeriController");
const { protect } = require("../middlewares/authMiddleware");
const { uploadImage } = require("../middlewares/uploadMiddleware"); // <-- Impor

const router = express.Router();

// Rute Publik
router.get("/", getAllGaleri);

// Rute yang Dilindungi (Admin)
router.post("/", protect, uploadImage, createGaleriItem);
router.put("/:id", protect, uploadImage, updateGaleriItem);
router.delete("/:id", protect, deleteGaleriItem);

module.exports = router;