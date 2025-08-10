const express = require("express");
const {
    getAllFaq,
    createFaq,
    updateFaq,
    deleteFaq,
} = require("../controllers/faqController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Rute Publik
router.get("/", getAllFaq);

// Rute yang Dilindungi (Admin)
router.post("/", protect, createFaq);
router.put("/:id", protect, updateFaq);
router.delete("/:id", protect, deleteFaq);

module.exports = router;