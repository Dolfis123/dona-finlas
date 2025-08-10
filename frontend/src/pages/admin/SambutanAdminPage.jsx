/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import sambutanApi from "../../api/sambutanApi";
import {
  Save,
  RotateCcw,
  XCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const SambutanAdminPage = () => {
  const [content, setContent] = useState({
    isi_sambutan: "",
    nama_lurah: "",
    jabatan_lurah: "",
    foto_url: "",
  });
  const [initialContent, setInitialContent] = useState({});
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await sambutanApi.get();
      setContent(data);
      setInitialContent(data);
      if (data.foto_url) {
        setPreview(`${backendUrl}/images/${data.foto_url}`);
      }
    } catch (error) {
      showNotification("Gagal memuat konten sambutan.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (field, value) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const formData = new FormData();
    formData.append("isi_sambutan", content.isi_sambutan);
    formData.append("nama_lurah", content.nama_lurah);
    formData.append("jabatan_lurah", content.jabatan_lurah);
    if (foto) {
      formData.append("gambar", foto);
    } else {
      formData.append("foto_url", content.foto_url || "");
    }

    try {
      await sambutanApi.update(formData);
      showNotification("Kata sambutan berhasil disimpan.", "add");
      fetchData();
    } catch (error) {
      showNotification("Gagal menyimpan kata sambutan.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setContent(initialContent);
    setPreview(
      initialContent.foto_url
        ? `${backendUrl}/images/${initialContent.foto_url}`
        : null
    );
    setFoto(null);
  };

  // Komponen untuk notifikasi
  const Notification = () => {
    if (!notification.message) return null;

    const colors = {
      add: "bg-green-100 border-green-500 text-green-700",
      edit: "bg-blue-100 border-blue-500 text-blue-700",
      delete: "bg-red-100 border-red-500 text-red-700",
      error: "bg-red-100 border-red-500 text-red-700",
    };

    const icons = {
      add: <CheckCircle />,
      edit: <AlertCircle />,
      delete: <XCircle />,
      error: <XCircle />,
    };

    return (
      <div
        className={`p-4 border-l-4 rounded-md mb-4 flex items-center ${
          colors[notification.type]
        }`}
        role="alert"
      >
        {icons[notification.type]}
        <p className="ml-3 font-medium">{notification.message}</p>
      </div>
    );
  };

  if (loading) {
    return <p className="text-center">Memuat konten...</p>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Manajemen Kata Sambutan
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg flex items-center hover:bg-gray-300"
          >
            <RotateCcw size={16} className="mr-2" /> Batal
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 disabled:bg-blue-400"
          >
            <Save size={16} className="mr-2" />{" "}
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>

      <Notification />

      <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Form Teks */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={content.nama_lurah || ""}
              onChange={(e) => handleChange("nama_lurah", e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Jabatan
            </label>
            <input
              type="text"
              value={content.jabatan_lurah || ""}
              onChange={(e) => handleChange("jabatan_lurah", e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Isi Sambutan
            </label>
            <textarea
              value={content.isi_sambutan || ""}
              onChange={(e) => handleChange("isi_sambutan", e.target.value)}
              rows="12"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            ></textarea>
          </div>
        </div>

        {/* Kolom Kanan: Form Foto */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Foto Kepala Lurah
          </label>
          <div className="mt-1 p-4 border-2 border-dashed border-gray-300 rounded-md text-center">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-40 h-52 mx-auto rounded-md object-cover mb-4"
              />
            ) : (
              <div className="w-40 h-52 mx-auto bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                <span>Tidak ada foto</span>
              </div>
            )}
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SambutanAdminPage;
