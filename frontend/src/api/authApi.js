// Mengambil base URL dari file .env
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const authApi = {
    login: async(username, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Jika respons tidak OK (status 400, 401, 500, dll.), lemparkan error
            throw new Error(data.message || "Gagal untuk login");
        }

        return data; // Mengembalikan data user beserta token
    },

    // Anda bisa menambahkan fungsi register di sini jika diperlukan nanti
    // register: async (userData) => { ... }
};

export default authApi;