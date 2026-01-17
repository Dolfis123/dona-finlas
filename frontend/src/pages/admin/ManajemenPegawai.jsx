import React, { useState, useEffect } from "react";

const ManajemenPegawai = () => {
  // --- STATE & LOGIC ---
  const [pegawaiList, setPegawaiList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // State Form
  const [formData, setFormData] = useState({
    id: "", // Kita pakai 'id' di state internal frontend
    nip: "",
    nama_lengkap: "",
    jabatan: "",
    status_aktif: "Y",
  });

  const API_URL = "http://localhost:8000/api/pegawai"; 

  // --- 1. FETCH DATA ---
  const fetchPegawai = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setPegawaiList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPegawai();
  }, []);

  // --- 2. HANDLER INPUT ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- 3. BUKA MODAL (FIXED) ---
  const handleOpenModal = (pegawai = null) => {
    if (pegawai) {
      // MODE EDIT
      setIsEditing(true);
      // PERBAIKAN DI SINI: Mapping 'id_pegawai' dari DB ke 'id' form
      setFormData({
        id: pegawai.id_pegawai, // <<-- KUNCI PERBAIKANNYA
        nip: pegawai.nip,
        nama_lengkap: pegawai.nama_lengkap,
        jabatan: pegawai.jabatan,
        status_aktif: pegawai.status_aktif,
      });
    } else {
      // MODE TAMBAH
      setIsEditing(false);
      setFormData({
        id: "",
        nip: "",
        nama_lengkap: "",
        jabatan: "",
        status_aktif: "Y",
      });
    }
    setShowModal(true);
  };

  // --- 4. SUBMIT FORM (FIXED) ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tentukan URL dan Method
    // Pastikan formData.id terisi saat mode edit
    const url = isEditing ? `${API_URL}/${formData.id}` : API_URL;
    const method = isEditing ? "PUT" : "POST";

    // Siapkan data yang mau dikirim (buang ID dari body request agar bersih)
    const payload = {
        nip: formData.nip,
        nama_lengkap: formData.nama_lengkap,
        jabatan: formData.jabatan,
        status_aktif: formData.status_aktif
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert(isEditing ? "Berhasil diperbarui!" : "Berhasil ditambahkan!");
        fetchPegawai(); // Refresh tabel
        setShowModal(false); // Tutup modal
      } else {
        console.error("Error backend:", result);
        alert("Gagal: " + (result.message || "Terjadi kesalahan di server"));
      }
    } catch (error) {
      console.error("Error fetch:", error);
      alert("Gagal koneksi ke server.");
    }
  };

  // --- 5. DELETE ---
  const handleDelete = async (id) => {
    if (window.confirm("Hapus pegawai ini?")) {
      try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (response.ok) fetchPegawai();
        else alert("Gagal menghapus data");
      } catch (error) {
        console.error(error);
      }
    }
  };

  // --- TAMPILAN (JSX) ---
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manajemen Pegawai</h1>
            <p className="text-gray-500 mt-1">Kelola data pejabat penanda tangan surat</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 flex items-center gap-2"
          >
            + Tambah Pegawai
          </button>
        </div>

        {/* Table */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-4 px-6 font-semibold">No</th>
                  <th className="py-4 px-6 font-semibold">NIP</th>
                  <th className="py-4 px-6 font-semibold">Nama Lengkap</th>
                  <th className="py-4 px-6 font-semibold">Jabatan</th>
                  <th className="py-4 px-6 font-semibold text-center">Status</th>
                  <th className="py-4 px-6 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {isLoading ? (
                  <tr><td colSpan="6" className="py-8 text-center text-gray-400">Memuat data...</td></tr>
                ) : pegawaiList.length > 0 ? (
                  pegawaiList.map((item, index) => (
                    <tr key={item.id_pegawai || index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-6">{index + 1}</td>
                      <td className="py-4 px-6 font-mono text-gray-500">{item.nip}</td>
                      <td className="py-4 px-6 font-medium text-gray-800">{item.nama_lengkap}</td>
                      <td className="py-4 px-6">{item.jabatan}</td>
                      <td className="py-4 px-6 text-center">
                        {item.status_aktif === "Y" ? (
                          <span className="bg-green-100 text-green-700 py-1 px-3 rounded-full text-xs font-bold">Aktif</span>
                        ) : (
                          <span className="bg-red-100 text-red-700 py-1 px-3 rounded-full text-xs font-bold">Non-Aktif</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex item-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenModal(item)}
                            className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 flex items-center justify-center"
                            title="Edit"
                          >
                             ✎
                          </button>
                          <button
                            onClick={() => handleDelete(item.id_pegawai)}
                            className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center"
                            title="Hapus"
                          >
                             🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="py-8 text-center text-gray-500">Belum ada data pegawai.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {isEditing ? "Edit Pegawai" : "Tambah Pegawai Baru"}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NIP</label>
                  <input
                    type="number"
                    name="nip"
                    value={formData.nip}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    name="nama_lengkap"
                    value={formData.nama_lengkap}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
                  <input
                    type="text"
                    name="jabatan"
                    value={formData.jabatan}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status_aktif"
                    value={formData.status_aktif}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="Y">Aktif</option>
                    {/* PERBAIKAN: Value harus "N" sesuai database, bukan "T" */}
                    <option value="N">Tidak Aktif</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md"
                  >
                    Simpan Data
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