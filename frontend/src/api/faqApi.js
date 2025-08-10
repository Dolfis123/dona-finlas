const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const getToken = () => localStorage.getItem("authToken");

const faqApi = {
    getAll: async() => {
        const response = await fetch(`${API_BASE_URL}/faq`);
        if (!response.ok) throw new Error("Gagal mengambil data FAQ");
        return response.json();
    },

    create: async(data) => {
        const response = await fetch(`${API_BASE_URL}/faq`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Gagal membuat FAQ baru");
        return response.json();
    },

    update: async(id, data) => {
        const response = await fetch(`${API_BASE_URL}/faq/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Gagal memperbarui FAQ");
        return response.json();
    },

    delete: async(id) => {
        const response = await fetch(`${API_BASE_URL}/faq/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        if (!response.ok) throw new Error("Gagal menghapus FAQ");
        return response.json();
    },
};

export default faqApi;