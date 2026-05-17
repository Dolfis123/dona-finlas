import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Save, Search, UserCheck, UserX, Loader2 } from "lucide-react";

const ManajemenPegawai = () => {
  // --- STATE & LOGIC ---
  const [pegawaiList, setPegawaiList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    id: "",
    nip: "",
    nama_lengkap: "",
    jabatan: "",
    status_aktif: "Y",
  });

  const API_URL = `${import.meta.env.VITE_BACKEND_URL}/pegawai`;

  // --- 1. FETCH DATA ---
  const fetchPegawai = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const result = Array.isArray(data) ? data : [];
      setPegawaiList(result);
      setFilteredList(result);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPegawai();
  }, []);

  // --- 2. SEARCH LOGIC ---
  useEffect(() => {
    const results = pegawaiList.filter(p =>
      p.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nip.includes(searchTerm)
    );
    setFilteredList(results);
  }, [searchTerm, pegawaiList]);

  // --- 3. HANDLER INPUT ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Auto uppercase untuk nama agar rapi di surat
    const finalValue = name === "nama_lengkap" ? value.toUpperCase() : value;
    setFormData({ ...formData, [name]: finalValue });
  };

  const handleOpenModal = (pegawai = null) => {
    if (pegawai) {
      setIsEditing(true);
      setFormData({
        id: pegawai.id_pegawai,
        nip: pegawai.nip,
        nama_lengkap: pegawai.nama_lengkap,
        jabatan: pegawai.jabatan,
        status_aktif: pegawai.status_aktif,
      });
    } else {
      setIsEditing(false);
      setFormData({ id: "", nip: "", nama_lengkap: "", jabatan: "", status_aktif: "Y" });
    }
    setShowModal(true);
  };

  // --- 4. SUBMIT FORM ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi Sederhana
    if (formData.nip.length < 8) return alert("NIP minimal 8 karakter");
    
    setIsSubmitting(true);
    const url = isEditing ? `${API_URL}/${formData.id}` : API_URL;
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nip: formData.nip,
          nama_lengkap: formData.nama_lengkap,
          jabatan: formData.jabatan,
          status_aktif: formData.status_aktif
        }),
      });

      if (response.ok) {
        setShowModal(false);
        fetchPegawai();
      } else {
        const err = await response.json();
        alert("Gagal: " + err.message);
      }
    } catch (error) {
      alert("Gagal koneksi ke server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 5. DELETE ---
  const handleDelete = async (id, nama) => {
    if (window.confirm(`Hapus data pegawai: ${nama}?\nData yang sudah dihapus tidak bisa dikembalikan.`)) {
      try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (response.ok) fetchPegawai();
        else alert("Gagal menghapus. Data mungkin sedang digunakan di arsip surat.");
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Manajemen Pegawai</h1>
            <p className="text-gray-500">Pejabat berwenang penanda tangan dokumen kelurahan.</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2 font-semibold"
          >
            <Plus size={20} /> Tambah Pegawai
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Cari berdasarkan NIP atau Nama..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table Container */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-gray-600 text-sm font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">No</th>
                  <th className="py-4 px-6">Informasi Pegawai</th>
                  <th className="py-4 px-6">Jabatan</th>
                  <th className="py-4 px-6 text-center">Status Aktif</th>
                  <th className="py-4 px-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <Loader2 className="animate-spin mx-auto text-blue-500 mb-2" size={32} />
                      <p className="text-gray-400">Menarik data dari server...</p>
                    </td>
                  </tr>
                ) : filteredList.length > 0 ? (
                  filteredList.map((item, index) => (
                    <tr key={item.id_pegawai} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-4 px-6 text-gray-400 font-medium">{index + 1}</td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-gray-800">{item.nama_lengkap}</div>
                        <div className="text-xs font-mono text-gray-500">NIP: {item.nip}</div>
                      </td>
                      <td className="py-4 px-6 text-gray-700">{item.jabatan}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          item.status_aktif === "Y" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                        }`}>
                          {item.status_aktif === "Y" ? <UserCheck size={12}/> : <UserX size={12}/>}
                          {item.status_aktif === "Y" ? "AKTIF" : "NON-AKTIF"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleOpenModal(item)}
                            className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                            title="Edit Data"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id_pegawai, item.nama_lengkap)}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            title="Hapus Pegawai"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-20 text-center text-gray-400 italic">
                      Data tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        <p className="mt-4 text-sm text-gray-400">
          * Pegawai dengan status <b>Aktif</b> akan muncul di pilihan penanda tangan surat.
        </p>

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="bg-blue-600 px-6 py-4 flex justify-between items-center text-white">
                <h2 className="text-lg font-bold">
                  {isEditing ? "Perbarui Data Pegawai" : "Tambah Pegawai Baru"}
                </h2>
                <button onClick={() => setShowModal(false)} className="hover:rotate-90 transition-transform">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Nomor Induk Pegawai (NIP)</label>
                  <input
                    type="text"
                    name="nip"
                    placeholder="Contoh: 1980xxxx xxxx x xxx"
                    value={formData.nip}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Nama Lengkap (Tanpa Gelar)</label>
                  <input
                    type="text"
                    name="nama_lengkap"
                    placeholder="Nama akan otomatis dikapitalisasi"
                    value={formData.nama_lengkap}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all uppercase"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Jabatan Resmi</label>
                  <input
                    type="text"
                    name="jabatan"
                    placeholder="Contoh: Lurah / Sekretaris Lurah"
                    value={formData.jabatan}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Status Ketersediaan</label>
                  <select
                    name="status_aktif"
                    value={formData.status_aktif}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white cursor-pointer"
                  >
                    <option value="Y">✅ AKTIF (Dapat Tanda Tangan)</option>
                    <option value="N">❌ NON-AKTIF (Sembunyikan dari Pilihan)</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex justify-center items-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>}
                    {isSubmitting ? "Proses..." : "Simpan Data"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManajemenPegawai;