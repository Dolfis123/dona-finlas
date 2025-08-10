// Fungsi ini akan menjadi pusat untuk semua panggilan API kita.
// Ia secara otomatis akan menambahkan base URL dan token otentikasi.

const getApiUrl = (path) => {
    // Mengambil base URL dari file .env
    const baseUrl =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
    return `${baseUrl}${path}`;
};

// Fungsi untuk mengambil token dari penyimpanan lokal (misalnya, setelah login)
const getToken = () => {
    // Untuk saat ini, kita gunakan token placeholder.
    // Nantinya, ini akan mengambil token yang disimpan setelah admin login.
    return "YOUR_JWT_TOKEN"; // GANTI DENGAN TOKEN YANG ANDA DAPAT DARI POSTMAN
};

// Fungsi fetch yang sudah dikonfigurasi
const api = {
    get: async(path) => {
        const response = await fetch(getApiUrl(path));
        return response.json();
    },

    post: async(path, body) => {
        const response = await fetch(getApiUrl(path), {
            method: "POST",
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
            body: body, // Body akan berupa FormData
        });
        return response.json();
    },

    put: async(path, body) => {
        const response = await fetch(getApiUrl(path), {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
            body: body, // Body akan berupa FormData
        });
        return response.json();
    },

    delete: async(path) => {
        const response = await fetch(getApiUrl(path), {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.json();
    },
};

export default api;