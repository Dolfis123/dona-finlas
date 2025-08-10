const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Fungsi untuk membuat token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "1d", // Token berlaku selama 1 hari
    });
};

// --- Registrasi Admin (hanya untuk membuat admin pertama) ---
const registerUser = async(req, res) => {
    const { username, password, nama_lengkap } = req.body;

    try {
        // Cek apakah username sudah ada
        const userExists = await User.findOne({ where: { username } });
        if (userExists) {
            return res.status(400).json({ message: "Username sudah digunakan" });
        }

        // Buat user baru (password akan di-hash otomatis oleh hook di model)
        const user = await User.create({
            username,
            password,
            nama_lengkap,
            role: "superadmin", // Admin pertama sebagai superadmin
        });

        if (user) {
            res.status(201).json({
                id: user.id,
                username: user.username,
                nama_lengkap: user.nama_lengkap,
                token: generateToken(user.id),
            });
        } else {
            res.status(400).json({ message: "Data user tidak valid" });
        }
    } catch (error) {
        res
            .status(500)
            .json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// --- Login Admin ---
const loginUser = async(req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Cari user berdasarkan username
        const user = await User.findOne({ where: { username } });

        // 2. Jika user ditemukan, bandingkan password yang diinput dengan yang ada di DB
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                id: user.id,
                username: user.username,
                nama_lengkap: user.nama_lengkap,
                token: generateToken(user.id),
            });
        } else {
            res.status(401).json({ message: "Username atau password salah" });
        }
    } catch (error) {
        res
            .status(500)
            .json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
};