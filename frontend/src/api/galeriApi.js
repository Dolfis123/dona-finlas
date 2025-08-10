const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const getToken = () => localStorage.getItem("authToken");

const galeriApi = {
    getAll: async() => {
        const response = await fetch(`${API_BASE_URL}/galeri`);
        if (!response.ok) throw new Error("Gagal mengambil data galeri");
        return response.json();
    },

    create: async(formData) => {
        const response = await fetch(`${API_BASE_URL}/galeri`, {
            method: "POST",
            headers: { Authorization: `Bearer ${getToken()}` },
            body: formData,
        });
        if (!response.ok) throw new Error("Gagal membuat item galeri baru");
        return response.json();
    },

    update: async(id, formData) => {
        const response = await fetch(`${API_BASE_URL}/galeri/${id}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${getToken()}` },
            body: formData,
        });
        if (!response.ok) throw new Error("Gagal memperbarui item galeri");
        return response.json();
    },

    delete: async(id) => {
        const response = await fetch(`${API_BASE_URL}/galeri/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!response.ok) throw new Error("Gagal menghapus item galeri");
        return response.json();
    },
};

export default galeriApi;