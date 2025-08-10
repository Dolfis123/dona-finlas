const express = require("express");
const {
    getAllAgenda,
    createAgenda,
    updateAgenda,
    deleteAgenda,
} = require("../controllers/agendaController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Rute Publik
router.get("/", getAllAgenda);

// Rute yang Dilindungi (Admin)
router.post("/", protect, createAgenda);
router.put("/:id", protect, updateAgenda);
router.delete("/:id", protect, deleteAgenda);

module.exports = router;