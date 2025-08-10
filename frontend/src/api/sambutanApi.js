const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const getToken = () => localStorage.getItem("authToken");

const sambutanApi = {
    // Mengambil konten kata sambutan
    get: async() => {
        const response = await fetch(`${API_BASE_URL}/sambutan`);
        if (!response.ok) throw new Error("Gagal mengambil data sambutan");
        return response.json();
    },

    // Memperbarui konten kata sambutan (menggunakan FormData untuk file)
    update: async(formData) => {
        const response = await fetch(`${API_BASE_URL}/sambutan`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
            body: formData,
        });
        if (!response.ok) throw new Error("Gagal memperbarui kata sambutan");
        return response.json();
    },
};

export default sambutanApi;