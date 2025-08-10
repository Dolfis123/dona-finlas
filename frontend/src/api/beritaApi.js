// src/api/beritaApi.js

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// --- FUNGSI YANG DIPERBAIKI ---
const getToken = () => {
  // Mengambil token yang sudah disimpan di localStorage saat login
  return localStorage.getItem("authToken");
};

const beritaApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/berita`);
    if (!response.ok) throw new Error("Gagal mengambil data berita");
    return response.json();
  },
  // --- FUNGSI BARU DITAMBAHKAN DI SINI ---
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/berita/${id}`);
    if (!response.ok) throw new Error("Gagal mengambil detail berita");
    return response.json();
  },

  create: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/berita`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`, // Menggunakan token yang benar
      },
      body: formData,
    });
    if (!response.ok) throw new Error("Gagal membuat berita baru");
    return response.json();
  },

  update: async (id, formData) => {
    const response = await fetch(`${API_BASE_URL}/berita/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getToken()}`, // Menggunakan token yang benar
      },
      body: formData,
    });
    if (!response.ok) throw new Error("Gagal memperbarui berita");
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/berita/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`, // Menggunakan token yang benar
      },
    });
    if (!response.ok) throw new Error("Gagal menghapus berita");
    return response.json();
  },
};

export default beritaApi;
