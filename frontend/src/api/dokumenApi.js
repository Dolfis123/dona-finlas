const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const getToken = () => localStorage.getItem("authToken");

const dokumenApi = {
    getAll: async() => {
        const response = await fetch(`${API_BASE_URL}/dokumen`);
        if (!response.ok) throw new Error("Gagal mengambil data dokumen");
        return response.json();
    },

    create: async(formData) => {
        const response = await fetch(`${API_BASE_URL}/dokumen`, {
            method: "POST",
            headers: { Authorization: `Bearer ${getToken()}` },
            body: formData,
        });
        // --- PERUBAHAN DI SINI ---
        if (!response.ok) {
            // Membaca pesan error spesifik dari backend
            const errorData = await response.json();
            throw new Error(errorData.message || "Gagal membuat dokumen baru");
        }
        return response.json();
    },

    update: async(id, formData) => {
        const response = await fetch(`${API_BASE_URL}/dokumen/${id}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${getToken()}` },
            body: formData,
        });
        // --- PERUBAHAN DI SINI ---
        if (!response.ok) {
            // Membaca pesan error spesifik dari backend
            const errorData = await response.json();
            throw new Error(errorData.message || "Gagal memperbarui dokumen");
        }
        return response.json();
    },

    delete: async(id) => {
        const response = await fetch(`${API_BASE_URL}/dokumen/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Gagal menghapus dokumen");
        }
        return response.json();
    },
};

export default dokumenApi;