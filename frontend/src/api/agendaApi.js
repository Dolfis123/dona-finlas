const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const getToken = () => localStorage.getItem("authToken");

const agendaApi = {
    getAll: async() => {
        const response = await fetch(`${API_BASE_URL}/agenda`);
        if (!response.ok) throw new Error("Gagal mengambil data agenda");
        return response.json();
    },

    create: async(data) => {
        const response = await fetch(`${API_BASE_URL}/agenda`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Gagal membuat agenda baru");
        return response.json();
    },

    update: async(id, data) => {
        const response = await fetch(`${API_BASE_URL}/agenda/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Gagal memperbarui agenda");
        return response.json();
    },

    delete: async(id) => {
        const response = await fetch(`${API_BASE_URL}/agenda/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        if (!response.ok) throw new Error("Gagal menghapus agenda");
        return response.json();
    },
};

export default agendaApi;