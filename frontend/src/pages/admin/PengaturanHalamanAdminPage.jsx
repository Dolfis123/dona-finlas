/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import pengaturanHalamanApi from "../../api/pengaturanHalamanApi";
import {
  Save,
  RotateCcw,
  XCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const PengaturanHalamanAdminPage = () => {
  const [settings, setSettings] = useState({});
  const [initialSettings, setInitialSettings] = useState({});
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
      const data = await pengaturanHalamanApi.getAll();
      setSettings(data);
      setInitialSettings(data);
    } catch (error) {
      showNotification("Gagal memuat data pengaturan.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const changedSettings = Object.keys(settings)
        .filter((key) => settings[key] !== initialSettings[key])
        .map((key) => ({
          kunci_elemen: key,
          nilai_elemen: settings[key],
        }));

      if (changedSettings.length === 0) {
        showNotification("Tidak ada perubahan untuk disimpan.", "edit");
        return;
      }

      await pengaturanHalamanApi.update(changedSettings);
      showNotification("Pengaturan berhasil disimpan.", "add");
      fetchData();
    } catch (error) {
      showNotification("Gagal menyimpan pengaturan.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSettings(initialSettings);
  };

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
    return <p className="text-center">Memuat pengaturan...</p>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Pengaturan Tampilan Halaman
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Kolom Kiri */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">
              Halaman Beranda
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Judul Utama
                </label>
                <textarea
                  value={settings.home_judul || ""}
                  onChange={(e) => handleChange("home_judul", e.target.value)}
                  rows="2"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subjudul
                </label>
                <textarea
                  value={settings.home_subjudul || ""}
                  onChange={(e) =>
                    handleChange("home_subjudul", e.target.value)
                  }
                  rows="3"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  URL Gambar Latar
                </label>
                <input
                  type="text"
                  value={settings.home_bg_image || ""}
                  onChange={(e) =>
                    handleChange("home_bg_image", e.target.value)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">
              Halaman Berita
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Judul Header
                </label>
                <input
                  type="text"
                  value={settings.berita_judul || ""}
                  onChange={(e) => handleChange("berita_judul", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subjudul Header
                </label>
                <textarea
                  value={settings.berita_subjudul || ""}
                  onChange={(e) =>
                    handleChange("berita_subjudul", e.target.value)
                  }
                  rows="2"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">
              Halaman Pengumuman
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Judul Header
                </label>
                <input
                  type="text"
                  value={settings.pengumuman_judul || ""}
                  onChange={(e) =>
                    handleChange("pengumuman_judul", e.target.value)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subjudul Header
                </label>
                <textarea
                  value={settings.pengumuman_subjudul || ""}
                  onChange={(e) =>
                    handleChange("pengumuman_subjudul", e.target.value)
                  }
                  rows="2"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">
              Halaman Agenda
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Judul Header
                </label>
                <input
                  type="text"
                  value={settings.agenda_judul || ""}
                  onChange={(e) => handleChange("agenda_judul", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subjudul Header
                </label>
                <textarea
                  value={settings.agenda_subjudul || ""}
                  onChange={(e) =>
                    handleChange("agenda_subjudul", e.target.value)
                  }
                  rows="2"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                ></textarea>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">
              Halaman Struktur Organisasi
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Judul Header
                </label>
                <input
                  type="text"
                  value={settings.struktur_judul || ""}
                  onChange={(e) =>
                    handleChange("struktur_judul", e.target.value)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subjudul Header
                </label>
                <textarea
                  value={settings.struktur_subjudul || ""}
                  onChange={(e) =>
                    handleChange("struktur_subjudul", e.target.value)
                  }
                  rows="2"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">
              Halaman Tentang Kami
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Judul Header
                </label>
                <input
                  type="text"
                  value={settings.about_judul || ""}
                  onChange={(e) => handleChange("about_judul", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subjudul Header
                </label>
                <textarea
                  value={settings.about_subjudul || ""}
                  onChange={(e) =>
                    handleChange("about_subjudul", e.target.value)
                  }
                  rows="2"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">
              Halaman Galeri
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Judul Header
                </label>
                <input
                  type="text"
                  value={settings.galeri_judul || ""}
                  onChange={(e) => handleChange("galeri_judul", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subjudul Header
                </label>
                <textarea
                  value={settings.galeri_subjudul || ""}
                  onChange={(e) =>
                    handleChange("galeri_subjudul", e.target.value)
                  }
                  rows="2"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">
              Halaman Potensi Daerah
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Judul Header
                </label>
                <input
                  type="text"
                  value={settings.potensi_judul || ""}
                  onChange={(e) =>
                    handleChange("potensi_judul", e.target.value)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subjudul Header
                </label>
                <textarea
                  value={settings.potensi_subjudul || ""}
                  onChange={(e) =>
                    handleChange("potensi_subjudul", e.target.value)
                  }
                  rows="2"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">
              Halaman Kontak
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Judul Header
                </label>
                <input
                  type="text"
                  value={settings.kontak_judul || ""}
                  onChange={(e) => handleChange("kontak_judul", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subjudul Header
                </label>
                <textarea
                  value={settings.kontak_subjudul || ""}
                  onChange={(e) =>
                    handleChange("kontak_subjudul", e.target.value)
                  }
                  rows="2"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                ></textarea>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">
              Halaman FAQ
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Judul Header
                </label>
                <input
                  type="text"
                  value={settings.faq_judul || ""}
                  onChange={(e) => handleChange("faq_judul", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subjudul Header
                </label>
                <textarea
                  value={settings.faq_subjudul || ""}
                  onChange={(e) => handleChange("faq_subjudul", e.target.value)}
                  rows="2"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                ></textarea>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">
              Halaman Download Documents
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Judul Header
                </label>
                <input
                  type="text"
                  value={settings.dokumen_judul || ""}
                  onChange={(e) =>
                    handleChange("dokumen_judul", e.target.value)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subjudul Header
                </label>
                <textarea
                  value={settings.dokumen_subjudul || ""}
                  onChange={(e) =>
                    handleChange("dokumen_subjudul", e.target.value)
                  }
                  rows="2"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PengaturanHalamanAdminPage;
