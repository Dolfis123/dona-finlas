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
        console.log("=== Upaya Login ===");
        console.log("Username Input:", username);

        // 1. Cari user berdasarkan username
        const user = await User.findOne({ where: { username } });

        // Jika user tidak ditemukan
        if (!user) {
            console.log("Hasil: User TIDAK ditemukan di database.");
            return res.status(401).json({ message: "Username atau password salah" });
        }

        console.log("Hasil: User ditemukan.");
        console.log("Hash di Database:", user.password);

        // 2. Bandingkan password yang diinput dengan hash di DB
        const isMatch = await bcrypt.compare(password, user.password);

        console.log("Password Input:", password);
        console.log("Apakah Password Cocok?:", isMatch);

        if (isMatch) {
            // Jika cocok, buat token
            const token = generateToken(user.id);
            console.log("Login Berhasil, Token dibuat.");

            return res.json({
                id: user.id,
                username: user.username,
                nama_lengkap: user.nama_lengkap,
                role: user.role,
                token: token,
            });
        } else {
            console.log("Hasil: Password salah.");
            return res.status(401).json({ message: "Username atau password salah" });
        }

    } catch (error) {
        console.error("EROR LOGIN:", error.message);
        res.status(500).json({
            message: "Terjadi kesalahan pada server",
            error: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
};