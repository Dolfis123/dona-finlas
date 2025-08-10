const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const getToken = () => localStorage.getItem("authToken");

const potensiDaerahApi = {
    getAll: async() => {
        const response = await fetch(`${API_BASE_URL}/potensi-daerah`);
        if (!response.ok) throw new Error("Gagal mengambil data potensi daerah");
        return response.json();
    },

    create: async(formData) => {
        const response = await fetch(`${API_BASE_URL}/potensi-daerah`, {
            method: "POST",
            headers: { Authorization: `Bearer ${getToken()}` },
            body: formData,
        });
        if (!response.ok) throw new Error("Gagal membuat data potensi daerah baru");
        return response.json();
    },

    update: async(id, formData) => {
        const response = await fetch(`${API_BASE_URL}/potensi-daerah/${id}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${getToken()}` },
            body: formData,
        });
        if (!response.ok) throw new Error("Gagal memperbarui data potensi daerah");
        return response.json();
    },

    delete: async(id) => {
        const response = await fetch(`${API_BASE_URL}/potensi-daerah/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!response.ok) throw new Error("Gagal menghapus data potensi daerah");
        return response.json();
    },
};

export default potensiDaerahApi;