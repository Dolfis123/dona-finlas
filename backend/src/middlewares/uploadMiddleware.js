const multer = require("multer");
const path = require("path");

// --- Konfigurasi Penyimpanan (Tidak Berubah) ---
const storage = (folder) =>
    multer.diskStorage({
        destination: (req, file, cb) => cb(null, `public/${folder}`),
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(
                null,
                file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
            );
        },
    });

// --- Filter File (Tidak Berubah) ---
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

// --- FUNGSI BARU UNTUK MENANGANI ERROR ---
const createUpload = (config) => (req, res, next) => {
    const upload = multer(config).single(config.fieldName);

    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Menangkap error spesifik dari Multer
            if (err.code === "LIMIT_FILE_SIZE") {
                const limitInMB = config.limits.fileSize / 1024 / 1024;
                return res.status(400).json({
                    message: `File terlalu besar. Ukuran maksimal adalah ${limitInMB} MB.`,
                });
            }
            return res.status(400).json({ message: err.message });
        } else if (err) {
            // Menangkap error lain (misal dari file filter)
            return res.status(400).json({ message: err.message });
        }
        // Jika tidak ada error, lanjutkan
        next();
    });
};

// --- EKSPOR BARU MENGGUNAKAN FUNGSI HANDLER ---
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