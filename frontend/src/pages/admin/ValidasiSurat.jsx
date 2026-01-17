import React, { useState, useEffect } from "react";
import api from "../../utils/api"; // Pastikan path ini benar sesuai struktur folder Anda
import { Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ValidasiSurat = () => {
  const [antrean, setAntrean] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Tambahkan loading state
  const navigate = useNavigate();

  useEffect(() => {
    fetchAntrean();
  }, []);

  const fetchAntrean = async () => {
    setIsLoading(true);
    try {
      // Tidak perlu tulis full URL, cukup endpointnya saja karena sudah diatur di api.js
      const res = await api.get("/surat/antrean");
      setAntrean(res.data);
    } catch (error) {
      console.error("Gagal ambil antrean", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus data ini permanen?")) return;
    try {
      await api.delete(`/surat/hapus/${id}`);
      // Hapus item dari state langsung biar UI terasa cepat (Optimistic UI)
      setAntrean(antrean.filter((item) => item.id_pengajuan !== id));
      alert("Data berhasil dihapus.");
    } catch (error) {
      alert("Gagal hapus data. Coba lagi.");
      fetchAntrean(); // Refresh data jika gagal hapus
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Antrean Validasi Surat</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tiket</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Pemohon</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Jenis Surat</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    Memuat data antrean...
                  </td>
                </tr>
              ) : antrean.length > 0 ? (
                antrean.map((item) => (
                  <tr key={item.id_pengajuan} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-blue-100 text-blue-800 py-1 px-2 rounded font-mono font-bold text-sm">
                            {item.kode_tiket}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{item.nama_lengkap}</div>
                      <div className="text-xs text-gray-500 mt-1">NIK: {item.nik}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        {item.detail_jenis?.nama_surat || "Surat Umum"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <div className="flex justify-center gap-2">
                        {/* TOMBOL DETAIL */}
                        <button
                          onClick={() => navigate(`/admin/validasi-surat/${item.id_pengajuan}`)}
                          className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm font-medium inline-flex items-center gap-1 transition shadow-sm"
                          title="Proses Surat"
                        >
                          <Eye size={16} /> Proses
                        </button>
                        
                        {/* TOMBOL HAPUS */}
                        <button
                          onClick={() => handleDelete(item.id_pengajuan)}
                          className="bg-white border border-red-200 text-red-600 p-2 rounded-md hover:bg-red-50 transition shadow-sm"
                          title="Hapus Permanen"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-gray-400">
                    <div className="flex flex-col items-center">
                        <span className="text-4xl mb-2">📭</span>
                        <p>Tidak ada antrean surat saat ini.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ValidasiSurat;