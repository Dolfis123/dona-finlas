const express = require("express");
const {
    getAllPengumuman,
    createPengumuman,
    updatePengumuman,
    deletePengumuman,
} = require("../controllers/pengumumanController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Rute Publik
router.get("/", getAllPengumuman);

// Rute yang Dilindungi (Admin)
router.post("/", protect, createPengumuman);
router.put("/:id", protect, updatePengumuman);
router.delete("/:id", protect, deletePengumuman);

module.exports = router;