const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const getToken = () => localStorage.getItem("authToken");

const pejabatApi = {
    getAll: async() => {
        const response = await fetch(`${API_BASE_URL}/pejabat`);
        if (!response.ok) throw new Error("Gagal mengambil data pejabat");
        return response.json();
    },

    create: async(formData) => {
        const response = await fetch(`${API_BASE_URL}/pejabat`, {
            method: "POST",
            headers: { Authorization: `Bearer ${getToken()}` },
            body: formData,
        });
        if (!response.ok) throw new Error("Gagal membuat data pejabat baru");
        return response.json();
    },

    update: async(id, formData) => {
        const response = await fetch(`${API_BASE_URL}/pejabat/${id}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${getToken()}` },
            body: formData,
        });
        if (!response.ok) throw new Error("Gagal memperbarui data pejabat");
        return response.json();
    },

    delete: async(id) => {
        const response = await fetch(`${API_BASE_URL}/pejabat/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!response.ok) throw new Error("Gagal menghapus data pejabat");
        return response.json();
    },
};

export default pejabatApi;