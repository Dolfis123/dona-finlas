const jwt = require("jsonwebtoken");
const { User } = require("../models");

const protect = async(req, res, next) => {
    let token;

    // Cek apakah token ada di header 'Authorization' dan dimulai dengan 'Bearer'
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // 1. Ambil token dari header (tanpa kata 'Bearer ')
            token = req.headers.authorization.split(" ")[1];

            // 2. Verifikasi token menggunakan JWT_SECRET
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Cari user di database berdasarkan id dari token,
            //    dan lampirkan data user ke object request (tanpa password)
            req.user = await User.findByPk(decoded.id, {
                attributes: { exclude: ["password"] },
            });

            // 4. Lanjutkan ke controller berikutnya
            next();
        } catch (error) {
            console.error(error);
            return res
                .status(401)
                .json({ message: "Tidak terotorisasi, token gagal" });
        }
    }

    if (!token) {
        return res
            .status(401)
            .json({ message: "Tidak terotorisasi, tidak ada token" });
    }
};

module.exports = { protect };