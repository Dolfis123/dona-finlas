const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const getToken = () => localStorage.getItem("authToken");

const pengaturanHalamanApi = {
    // Mengambil semua pengaturan dalam format objek { kunci: nilai }
    getAll: async() => {
        const response = await fetch(`${API_BASE_URL}/pengaturan-halaman`);
        if (!response.ok) throw new Error("Gagal mengambil data pengaturan");
        return response.json();
    },

    // Memperbarui beberapa pengaturan sekaligus
    update: async(settingsArray) => {
        const response = await fetch(`${API_BASE_URL}/pengaturan-halaman`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(settingsArray),
        });
        if (!response.ok) throw new Error("Gagal memperbarui pengaturan");
        return response.json();
    },

    // TODO: Di masa depan, Anda bisa membuat fungsi khusus untuk upload gambar
    // uploadImage: async (key, file) => { ... }
};

export default pengaturanHalamanApi;