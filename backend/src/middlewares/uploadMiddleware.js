const multer = require("multer");
const path = require("path");
const fs = require("fs"); // <-- 1. WAJIB TAMBAHKAN INI

// --- Konfigurasi Penyimpanan (DIPERBAIKI) ---
const storage = (folder) => {
    // Tentukan lokasi folder
    const dir = `public/${folder}`;

    // 2. CEK & BUAT FOLDER OTOMATIS JIKA BELUM ADA
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    return multer.diskStorage({
        destination: (req, file, cb) => cb(null, dir),
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(
                null,
                file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
            );
        },
    });
};

// --- Filter File (Tetap Sama) ---
const imageFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Hanya file gambar yang diizinkan!"), false);
    }
};

const documentFileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.mimetype.includes("word")) {
        cb(null, true);
    } else {
        cb(new Error("Hanya file PDF atau DOCX yang diizinkan!"), false);
    }
};

// --- Fungsi Handler Error (Tetap Sama) ---
const createUpload = (config) => (req, res, next) => {
    const upload = multer(config).single(config.fieldName);

    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
                const limitInMB = config.limits.fileSize / 1024 / 1024;
                return res.status(400).json({
                    message: `File terlalu besar. Ukuran maksimal adalah ${limitInMB} MB.`,
                });
            }
            return res.status(400).json({ message: err.message });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
};

// --- Ekspor Middleware (Tetap Sama) ---
const uploadImage = createUpload({
    storage: storage("images"),
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fieldName: "gambar",
});

const uploadDocument = createUpload({
    storage: storage("documents"),
    fileFilter: documentFileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fieldName: "dokumen",
});

module.exports = { uploadImage, uploadDocument };