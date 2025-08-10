// Definisikan URL dasar dari backend Anda di satu tempat.
// Jika nanti alamat server berubah, Anda hanya perlu mengubahnya di sini.
const API_BASE_URL = "https://skydance.life/api";

/**
 * Mengambil data agregat untuk halaman dashboard.
 * @returns {Promise<Object>} Objek berisi data stats, aktivitas, dan grafik.
 */
export const getDashboardData = async() => {
    try {
        // Gabungkan URL dasar dengan endpoint spesifik.
        // Ditambahkan /api/ sesuai dengan struktur route di backend
        const response = await fetch(`${API_BASE_URL}/dashboard/dashboard-data`); // Jika response dari server tidak OK (misal: error 404 atau 500), // lemparkan error agar bisa ditangkap oleh blok catch di komponen.

        if (!response.ok) {
            throw new Error(`Gagal mengambil data. Status: ${response.status}`);
        } // Ubah response menjadi format JSON.

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Terjadi kesalahan di service API dashboard:", error); // Lemparkan kembali error agar komponen yang memanggil tahu bahwa terjadi masalah.
        throw error;
    }
};

// Anda bisa menambahkan fungsi API lain di sini di kemudian hari. Contoh:
// export const getBeritaList = async () => { ... };
// export const createBerita = async (dataBerita) => { ... };