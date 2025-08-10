const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const getToken = () => localStorage.getItem("authToken");

const aboutApi = {
    // Mengambil konten halaman 'Tentang Kami'
    get: async() => {
        const response = await fetch(`${API_BASE_URL}/about`);
        if (!response.ok)
            throw new Error("Gagal mengambil konten Halaman Tentang Kami");
        return response.json();
    },

    // Memperbarui konten halaman 'Tentang Kami'
    update: async(data) => {
        const response = await fetch(`${API_BASE_URL}/about`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok)
            throw new Error("Gagal memperbarui konten Halaman Tentang Kami");
        return response.json();
    },
};

export default aboutApi;