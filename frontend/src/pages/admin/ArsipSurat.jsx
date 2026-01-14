import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 1. Import useNavigate
import api from "../../utils/api"; 
import { Printer, Search, FileText, Calendar, User } from "lucide-react";

const ArsipSurat = () => {
  const [dataArsip, setDataArsip] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const navigate = useNavigate(); // ✅ 2. Inisialisasi hook

  useEffect(() => {
    fetchArsip();
  }, []);

  const fetchArsip = async () => {
    setLoading(true);
    try {
      // Pastikan URL API backend benar
      const res = await api.get("/surat/arsip"); 
      setDataArsip(res.data);
    } catch (error) {
      console.error("Gagal mengambil data arsip", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 3. LOGIC CETAK BARU (Navigasi ke halaman React)
const handleCetak = (item) => {
    // Cek nama jenis surat dari database (pastikan huruf besar/kecilnya sesuai)
    const jenis = item.jenis_surat ? item.jenis_surat.toUpperCase() : "";

    if (jenis.includes("DOMISILI")) {
        // Jika surat domisili, arahkan ke template domisili
        navigate(`/cetak/domisili/${item.id_arsip}`);
    } else if (jenis.includes("OAP") || jenis.includes("PAPUA")) {
        navigate(`/cetak/oap/${item.id_arsip}`);
    } else {
        // Default ke SKTM (atau bisa dibuat else if lain)
        navigate(`/cetak/sktm/${item.id_arsip}`);
    }
  };

  // Logic Filter
  const filteredData = dataArsip.filter((item) => {
    const term = searchTerm.toLowerCase();
    const nama = item.nama_lengkap ? item.nama_lengkap.toLowerCase() : "";
    const nik = item.nik ? item.nik.toString() : "";
    const noSurat = item.no_surat ? item.no_surat.toLowerCase() : "";
    return nama.includes(term) || nik.includes(term) || noSurat.includes(term);
  });

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header & Search (Sama seperti sebelumnya) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="text-blue-600" />
            Arsip Surat Keluar
          </h1>
          <p className="text-sm text-gray-500 mt-1">Riwayat surat yang diterbitkan.</p>
        </div>
        <div className="relative w-full md:w-1/3">
           {/* Input Search (Sama) */}
           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Memuat data arsip...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                   {/* Header Table (Sama) */}
                   <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">No. Surat</th>
                   <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Pemohon</th>
                   <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Jenis</th>
                   <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">TTD</th>
                   <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.id_arsip} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4">
                        <div className="text-sm font-bold">{item.no_surat}</div>
                        <div className="text-xs text-gray-500 flex gap-1"><Calendar size={12}/> {formatDate(item.tgl_surat)}</div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="text-sm font-medium">{item.nama_lengkap}</div>
                        <div className="text-xs text-gray-500">{item.nik}</div>
                    </td>
                    <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">{item.jenis_surat}</span>
                    </td>
                    <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 flex gap-1"><User size={14}/> {item.nama_pegawai}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {/* ✅ TOMBOL CETAK DIPERBARUI */}
                      <button
                        onClick={() => handleCetak(item)} // Kirim object item full
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md"
                      >
                        <Printer size={16} /> Cetak
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArsipSurat;