const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const getToken = () => localStorage.getItem("authToken");

const pengumumanApi = {
    getAll: async() => {
        const response = await fetch(`${API_BASE_URL}/pengumuman`);
        if (!response.ok) throw new Error("Gagal mengambil data pengumuman");
        return response.json();
    },

    create: async(data) => {
        const response = await fetch(`${API_BASE_URL}/pengumuman`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Mengirim data sebagai JSON
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(data), // Mengubah objek menjadi string JSON
        });
        if (!response.ok) throw new Error("Gagal membuat pengumuman baru");
        return response.json();
    },

    update: async(id, data) => {
        const response = await fetch(`${API_BASE_URL}/pengumuman/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Gagal memperbarui pengumuman");
        return response.json();
    },

    delete: async(id) => {
        const response = await fetch(`${API_BASE_URL}/pengumuman/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        if (!response.ok) throw new Error("Gagal menghapus pengumuman");
        return response.json();
    },
};

export default pengumumanApi;