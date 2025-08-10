import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const BeritaModal = ({ isOpen, onClose, onSave, berita }) => {
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState("");
  const [isi, setIsi] = useState("");
  const [gambar, setGambar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(""); // State untuk pesan error

  // Batas ukuran file dalam MB
  const IMAGE_MAX_SIZE_MB = 5;
  const IMAGE_MAX_SIZE_BYTES = IMAGE_MAX_SIZE_MB * 1024 * 1024;

  useEffect(() => {
    if (berita) {
      setJudul(berita.judul);
      setKategori(berita.kategori);
      setIsi(berita.isi);
      setPreview(
        berita.gambar_url
          ? `${import.meta.env.VITE_BACKEND_URL}/images/${berita.gambar_url}`
          : null
      );
    } else {
      setJudul("");
      setKategori("");
      setIsi("");
      setGambar(null);
      setPreview(null);
    }
    setError(""); // Reset error setiap kali modal dibuka
  }, [berita, isOpen]);

  // --- FUNGSI YANG DIPERBARUI DENGAN VALIDASI ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Cek ukuran file
      if (file.size > IMAGE_MAX_SIZE_BYTES) {
        setError(
          `Ukuran file terlalu besar. Maksimal ${IMAGE_MAX_SIZE_MB} MB.`
        );
        e.target.value = null; // Hapus file dari input
        return;
      }

      setError(""); // Hapus pesan error jika valid
      setGambar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("kategori", kategori);
    formData.append("isi", isi);
    if (gambar) {
      formData.append("gambar", gambar);
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl sm:text-2xl font-bold">
            {berita ? "Edit Berita" : "Tambah Berita Baru"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Judul Berita
              </label>
              <input
                type="text"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Kategori
              </label>
              <input
                type="text"
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Isi Berita
              </label>
              <textarea
                value={isi}
                onChange={(e) => setIsi(e.target.value)}
                rows="6"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gambar Thumbnail
              </label>
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {/* --- PESAN INFORMATIF DITAMBAHKAN DI SINI --- */}
              <p className="text-xs text-gray-500 mt-1">
                Ukuran file maksimal: {IMAGE_MAX_SIZE_MB} MB.
              </p>
              {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-4 h-32 w-auto rounded-md object-cover"
                />
              )}
            </div>
          </div>
          <div className="p-4 flex justify-end space-x-3 border-t bg-gray-50 rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BeritaModal;
