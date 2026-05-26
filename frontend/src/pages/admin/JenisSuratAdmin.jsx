import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  List,
  X,
  AlertCircle,
} from "lucide-react";

const JenisSuratAdmin = () => {
  // --- KONFIGURASI API ---
  // Pastikan VITE_BACKEND_URL di .env adalah http://localhost:8000/api
  const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/surat/master`;

  // --- STATE ---
  const [jenisSuratList, setJenisSuratList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id_jenis : "",
    kode_surat: "",
    nama_surat: "",
    status_aktif: "Y",
  });

  // State untuk Syarat
  const [showSyaratModal, setShowSyaratModal] = useState(false);
  const [selectedSurat, setSelectedSurat] = useState(null);
  const [newSyarat, setNewSyarat] = useState({ nama_dokumen: "", wajib: "Y" });

  // Helper untuk Header (Token)
  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // --- 1. FETCH DATA ---
  const fetchJenisSurat = async () => {
    setIsLoading(true);
    try {
      // Menggunakan axios agar jika 404 langsung masuk ke catch
      const response = await axios.get(`${API_BASE}/jenis`, getHeaders());
      setJenisSuratList(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Fetch Error Details:", error.response || error);
      alert("Gagal mengambil data. Pastikan Backend jalan dan URL .env benar.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJenisSurat();
  }, []);

  // --- 2. HANDLER CRUD JENIS SURAT ---
  const handleOpenModal = (item = null) => {
    if (item) {
      setIsEditing(true);
      setFormData({
        id_jenis: item.id_jenis,
        kode_surat: item.kode_surat,
        nama_surat: item.nama_surat,
        status_aktif: item.status_aktif,
      });
    } else {
      setIsEditing(false);
      setFormData({
        id_jenis: "",
        kode_surat: "",
        nama_surat: "",
        status_aktif: "Y",
      });
    }
    setShowModal(true);
  };

  const handleMainSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(
          `${API_BASE}/jenis/${formData.id_jenis}`,
          formData,
          getHeaders(),
        );
      } else {
        await axios.post(`${API_BASE}/jenis`, formData, getHeaders());
      }
      setShowModal(false);
      fetchJenisSurat();
    } catch (error) {
      console.error("Submit Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Gagal menyimpan data.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus jenis surat ini?")) return;
    try {
      await axios.delete(`${API_BASE}/jenis/${id}`, getHeaders());
      fetchJenisSurat();
    } catch (error) {
      alert("Gagal menghapus.");
    }
  };

  // --- 3. HANDLER SYARAT ---
  const openSyaratModal = (surat) => {
    setSelectedSurat(surat);
    setShowSyaratModal(true);
  };

  const handleAddSyarat = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_BASE}/syarat`,
        {
          id_jenis: selectedSurat.id_jenis,
          nama_dokumen: newSyarat.nama_dokumen,
          wajib: newSyarat.wajib,
        },
        getHeaders(),
      );

      // Refresh data agar list syarat terupdate
      const res = await axios.get(`${API_BASE}/jenis`, getHeaders());
      const updated = res.data.find((s) => s.id_jenis === selectedSurat.id_jenis);
      setSelectedSurat(updated);
      setJenisSuratList(res.data);
      setNewSyarat({ nama_dokumen: "", wajib: "Y" });
    } catch (error) {
      alert("Gagal menambah syarat");
    }
  };

  const handleDeleteSyarat = async (id_syarat) => {
    if (!window.confirm("Hapus syarat ini?")) return;
    try {
      await axios.delete(`${API_BASE}/syarat/${id_syarat}`, getHeaders());
      const res = await axios.get(`${API_BASE}/jenis`, getHeaders());
      const updated = res.data.find((s) => s.id_jenis === selectedSurat.id_jenis);
      setSelectedSurat(updated);
      setJenisSuratList(res.data);
    } catch (error) {
      alert("Gagal menghapus syarat.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="text-blue-600" /> Master Jenis Surat
            </h1>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg flex items-center gap-2 shadow-md"
          >
            <Plus size={20} /> Buat Jenis Baru
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden border">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
              <tr>
                <th className="p-4">No</th>
                <th className="p-4">Kode</th>
                <th className="p-4">Nama Surat</th>
                <th className="p-4">Syarat</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center">
                    Memuat data...
                  </td>
                </tr>
              ) : (
                jenisSuratList.map((item, index) => (
                  <tr key={item.id_jenis} className="border-b hover:bg-gray-50">
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4 font-mono font-bold text-blue-600">
                      {item.kode_surat}
                    </td>
                    <td className="p-4 font-medium">{item.nama_surat}</td>
                    <td className="p-4">
                      // CARI BAGIAN INI:
                      <div className="flex flex-wrap gap-1">
                        {item.syarat?.map((s, idx) => (
                          <span
                            key={s.id_jenis || idx}
                            className="bg-gray-100 px-2 py-1 rounded text-xs"
                          >
                            {/* ^--- Gunakan s.id_jenis jika ada, jika tidak ada gunakan idx --- */}
                            {s.nama_dokumen} {s.wajib === "Y" && "*"}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${item.status_aktif === "Y" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {item.status_aktif === "Y" ? "Aktif" : "Non-Aktif"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openSyaratModal(item)}
                          className="p-2 bg-purple-100 text-purple-600 rounded-full"
                        >
                          <List size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="p-2 bg-yellow-100 text-yellow-600 rounded-full"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id_jenis)}
                          className="p-2 bg-red-100 text-red-600 rounded-full"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL FORM JENIS */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {isEditing ? "Edit Jenis Surat" : "Jenis Surat Baru"}
              </h2>
              <form onSubmit={handleMainSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold">Kode Surat</label>
                  <input
                    type="text"
                    value={formData.kode_surat}
                    onChange={(e) =>
                      setFormData({ ...formData, kode_surat: e.target.value })
                    }
                    className="w-full border rounded p-2 uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold">Nama Surat</label>
                  <input
                    type="text"
                    value={formData.nama_surat}
                    onChange={(e) =>
                      setFormData({ ...formData, nama_surat: e.target.value })
                    }
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold">Status</label>
                  <select
                    value={formData.status_aktif}
                    onChange={(e) =>
                      setFormData({ ...formData, status_aktif: e.target.value })
                    }
                    className="w-full border rounded p-2"
                  >
                    <option value="Y">Aktif</option>
                    <option value="N">Non-Aktif</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-200 rounded"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL SYARAT */}
        {showSyaratModal && selectedSurat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden">
              <div className="bg-purple-600 p-4 text-white flex justify-between items-center">
                <h3 className="font-bold">
                  Syarat: {selectedSurat.nama_surat}
                </h3>
                <button onClick={() => setShowSyaratModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <form
                  onSubmit={handleAddSyarat}
                  className="flex gap-2 mb-4 items-end"
                >
                  <div className="flex-1">
                    <label className="text-xs font-bold">Nama Dokumen</label>
                    <input
                      type="text"
                      className="w-full border p-2 rounded"
                      value={newSyarat.nama_dokumen}
                      onChange={(e) =>
                        setNewSyarat({
                          ...newSyarat,
                          nama_dokumen: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="w-24">
                    <label className="text-xs font-bold">Wajib?</label>
                    <select
                      className="w-full border p-2 rounded"
                      value={newSyarat.wajib}
                      onChange={(e) =>
                        setNewSyarat({ ...newSyarat, wajib: e.target.value })
                      }
                    >
                      <option value="Y">Ya</option>
                      <option value="N">Tidak</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="bg-purple-600 text-white p-2 rounded"
                  >
                    <Plus size={20} />
                  </button>
                </form>
                <div className="space-y-2">
                  {selectedSurat.syarat?.map((s) => (
                    <div
                      key={s.id_jenis}
                      className="flex justify-between bg-gray-50 p-2 rounded border"
                    >
                      <span>
                        {s.nama_dokumen}{" "}
                        {s.wajib === "Y" && (
                          <span className="text-red-500">*</span>
                        )}
                      </span>
                      <button
                        onClick={() => handleDeleteSyarat(s.id_jenis)}
                        className="text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JenisSuratAdmin;
