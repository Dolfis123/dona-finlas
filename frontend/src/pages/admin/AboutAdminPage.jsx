/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import aboutApi from "../../api/aboutApi";
import {
  Save,
  RotateCcw,
  XCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const AboutAdminPage = () => {
  const [content, setContent] = useState({ sejarah: "", visi: "", misi: "" });
  const [initialContent, setInitialContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await aboutApi.get();
      setContent(data);
      setInitialContent(data);
    } catch (error) {
      showNotification("Gagal memuat konten.", "error");
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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await aboutApi.update(content);
      showNotification("Konten berhasil disimpan.", "add");
      fetchData(); // Muat ulang data untuk menyinkronkan state
    } catch (error) {
      showNotification("Gagal menyimpan konten.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setContent(initialContent);
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
          Manajemen Halaman Tentang Kami
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

      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div>
          <label className="block text-lg font-bold text-gray-700 mb-2">
            Sejarah
          </label>
          <textarea
            value={content.sejarah || ""}
            onChange={(e) => handleChange("sejarah", e.target.value)}
            rows="6"
            className="w-full border border-gray-300 rounded-md shadow-sm p-2"
          ></textarea>
        </div>
        <div>
          <label className="block text-lg font-bold text-gray-700 mb-2">
            Visi
          </label>
          <textarea
            value={content.visi || ""}
            onChange={(e) => handleChange("visi", e.target.value)}
            rows="3"
            className="w-full border border-gray-300 rounded-md shadow-sm p-2"
          ></textarea>
        </div>
        <div>
          <label className="block text-lg font-bold text-gray-700 mb-2">
            Misi
          </label>
          <p className="text-sm text-gray-500 mb-2">
            Pisahkan setiap poin misi dengan menekan tombol Enter (baris baru).
          </p>
          <textarea
            value={content.misi || ""}
            onChange={(e) => handleChange("misi", e.target.value)}
            rows="6"
            className="w-full border border-gray-300 rounded-md shadow-sm p-2"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default AboutAdminPage;
