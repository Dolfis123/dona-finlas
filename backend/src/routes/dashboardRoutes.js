const express = require("express");
const router = express.Router();

// Impor fungsi controller yang relevan
const { getDashboardData } = require("../controllers/dashboardController");

// Definisikan route untuk dashboard
// GET /api/dashboard-data akan menjalankan fungsi getDashboardData
router.get("/dashboard-data", getDashboardData);

module.exports = router;