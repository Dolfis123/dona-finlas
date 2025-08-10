import React, { useState } from "react";
import { FileText, Search, ArrowLeft, ArrowRight, Clock } from "lucide-react";

// --- DATA DUMMY UNTUK SEMUA LAYANAN ---
const semuaLayanan = [
  {
    id: 1,
    nama: "Surat Keterangan Domisili",
    deskripsi:
      "Surat resmi yang menerangkan tempat tinggal Anda saat ini di wilayah Kelurahan Padarni.",
    status: "Tersedia",
    icon: <FileText size={32} className="text-blue-500" />,
  },
  {
    id: 2,
    nama: "Surat Keterangan Tidak Mampu (SKTM)",
    deskripsi:
      "Digunakan untuk keperluan pengajuan beasiswa, keringanan biaya kesehatan, atau bantuan sosial lainnya.",
    status: "Tersedia",
    icon: <FileText size={32} className="text-blue-500" />,
  },
  {
    id: 3,
    nama: "Surat Pengantar Nikah",
    deskripsi:
      "Surat pengantar dari kelurahan sebagai salah satu syarat untuk mendaftar pernikahan di KUA.",
    status: "Tersedia",
    icon: <FileText size={32} className="text-blue-500" />,
  },
  {
    id: 4,
    nama: "Surat Keterangan Usaha (SKU)",
    deskripsi:
      "Surat yang diperlukan untuk legalitas usaha mikro dan kecil atau untuk pengajuan pinjaman modal.",
    status: "Tersedia",
    icon: <FileText size={32} className="text-blue-500" />,
  },
  {
    id: 5,
    nama: "Surat Keterangan Kematian",
    deskripsi:
      "Dokumen resmi untuk mencatat dan melaporkan peristiwa kematian seorang warga.",
    status: "Tersedia",
    icon: <FileText size={32} className="text-blue-500" />,
  },
  {
    id: 6,
    nama: "Lapor Pindah Datang",
    deskripsi:
      "Layanan untuk warga yang baru pindah dan akan menetap di wilayah Kelurahan Padarni.",
    status: "Segera Hadir",
    icon: <Clock size={32} className="text-gray-400" />,
  },
  {
    id: 7,
    nama: "Surat Izin Mendirikan Bangunan (IMB)",
    deskripsi:
      "Pengurusan surat izin untuk memulai pembangunan atau renovasi bangunan secara legal.",
    status: "Segera Hadir",
    icon: <Clock size={32} className="text-gray-400" />,
  },
];

const PelayananPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // --- LOGIKA PENCARIAN & PAGINASI ---
  const filteredItems = semuaLayanan.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // Reset ke halaman 1 setiap kali melakukan pencarian baru
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Section Header */}
      <section className="bg-gray-800 text-white pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <FileText size={48} className="mx-auto mb-4 text-blue-400" />
          <h1 className="text-4xl md:text-5xl font-extrabold">
            Layanan Online
          </h1>
          <p className="text-lg mt-4 text-gray-300">
            Urus keperluan administrasi Anda dengan mudah dan cepat.
          </p>
        </div>
      </section>

      {/* Section Konten Layanan */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Fitur Pencarian */}
          <div className="mb-12 max-w-2xl mx-auto">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Cari layanan... (contoh: Domisili)"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Grid untuk Kartu Layanan */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {currentItems.length > 0 ? (
              currentItems.map((layanan) => (
                <div
                  key={layanan.id}
                  className={`bg-white rounded-lg shadow-lg p-6 flex flex-col transition-all duration-300 ${
                    layanan.status === "Tersedia"
                      ? "hover:shadow-xl hover:-translate-y-1"
                      : "opacity-60"
                  }`}
                >
                  <div className="flex items-center mb-4">
                    {layanan.icon}
                    <h3 className="ml-4 text-xl font-bold text-gray-800">
                      {layanan.nama}
                    </h3>
                  </div>
                  <p className="text-gray-600 flex-grow">{layanan.deskripsi}</p>
                  <div className="mt-6">
                    {layanan.status === "Tersedia" ? (
                      <button className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        Buat Surat
                      </button>
                    ) : (
                      <button className="w-full bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded-lg cursor-not-allowed">
                        Segera Hadir
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 text-center py-12">
                <p className="text-gray-500 text-xl">
                  Layanan tidak ditemukan.
                </p>
              </div>
            )}
          </div>

          {/* Komponen Paginasi */}
          {totalPages > 1 && (
            <div className="mt-16 flex justify-center items-center space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md bg-white text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed shadow"
              >
                <ArrowLeft size={20} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`px-4 py-2 rounded-md shadow ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md bg-white text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed shadow"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PelayananPage;
