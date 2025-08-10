const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();

// Rute untuk registrasi: POST /api/auth/register
router.post("/register", registerUser);

// Rute untuk login: POST /api/auth/login
router.post("/login", loginUser);

module.exports = router;