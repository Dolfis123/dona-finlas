import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { Eye, Trash2, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ValidasiSurat = () => {
  const [antrean, setAntrean] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAntrean();
  }, []);

  const fetchAntrean = async () => {
    try {
      const res = await api.get("/surat/antrean");
      setAntrean(res.data);
    } catch (error) {
      console.error("Gagal ambil antrean", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus data ini permanen?")) return;
    try {
      await api.delete(`/surat/hapus/${id}`);
      fetchAntrean();
    } catch (error) {
      alert("Gagal hapus data");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Antrean Validasi Surat</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Tiket</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Pemohon</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Jenis Surat</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {antrean.map((item) => (
              <tr key={item.id_pengajuan} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-blue-600 font-bold font-mono">{item.kode_tiket}</td>
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-800">{item.nama_lengkap}</div>
                  <div className="text-xs text-gray-500">NIK: {item.nik}</div>
                </td>
                <td className="px-6 py-4">
                   <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                    {item.detail_jenis?.nama_surat}
                   </span>
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  {/* TOMBOL LIHAT DETAIL */}
                  <button
                    onClick={() => navigate(`/admin/validasi-surat/${item.id_pengajuan}`)}
                    className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm font-bold inline-flex items-center gap-1"
                  >
                    <Eye size={16} /> Detail & Proses
                  </button>
                  
                  <button
                    onClick={() => handleDelete(item.id_pengajuan)}
                    className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200"
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {antrean.length === 0 && (
              <tr><td colSpan="4" className="text-center py-8 text-gray-400">Tidak ada antrean.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ValidasiSurat;