import React, { useState, useEffect, useMemo } from "react";
import {
  Download,
  FileText,
  Search,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

// Impor file API yang kita butuhkan
import dokumenApi from "../../api/dokumenApi";
import pengaturanHalamanApi from "../../api/pengaturanHalamanApi";

const DownloadDokumenPage = () => {
  // State untuk menyimpan data dinamis
  const [semuaDokumen, setSemuaDokumen] = useState([]);
  const [pengaturan, setPengaturan] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk pencarian dan paginasi
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // useEffect untuk mengambil semua data dari API saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dokumenData, pengaturanData] = await Promise.all([
          dokumenApi.getAll(),
          pengaturanHalamanApi.getAll(),
        ]);

        setSemuaDokumen(dokumenData);
        setPengaturan(pengaturanData);
      } catch (err) {
        setError("Gagal memuat data dari server. Silakan coba lagi nanti.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Array kosong berarti efek ini hanya berjalan sekali

  // --- LOGIKA PENCARIAN & PAGINASI DINAMIS ---
  const filteredItems = useMemo(
    () =>
      semuaDokumen.filter((item) =>
        item.nama_dokumen.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [semuaDokumen, searchTerm]
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Memuat halaman...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Section Header Dinamis */}
      <section className="bg-gray-800 text-white pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <Download size={48} className="mx-auto mb-4 text-blue-400" />
          <h1 className="text-4xl md:text-5xl font-extrabold">
            {pengaturan.dokumen_judul || "Download Dokumen"}
          </h1>
          <p className="text-lg mt-4 text-gray-300">
            {pengaturan.dokumen_subjudul ||
              "Unduh formulir dan dokumen penting dengan mudah."}
          </p>
        </div>
      </section>

      {/* Section Konten Dinamis */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl mx-auto">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Cari dokumen... (contoh: KTP, KK)"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-6">
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-6 rounded-lg shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 p-3 bg-blue-100 text-blue-600 rounded-lg">
                      <FileText size={24} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-gray-800">
                        {item.nama_dokumen}
                      </h3>
                      <p className="text-gray-600 mt-1 text-sm">
                        {item.deskripsi}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span
                          className={`font-semibold px-2 py-0.5 rounded-md ${
                            item.tipe_file.includes("pdf")
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {item.tipe_file.split("/")[1] || "FILE"}
                        </span>
                        <span>{item.ukuran_file}</span>
                      </div>
                    </div>
                  </div>
                  <a
                    href={`${backendUrl}/documents/${item.file_url}`}
                    download
                    className="flex-shrink-0 w-full sm:w-auto mt-4 sm:mt-0"
                  >
                    <button className="w-full sm:w-auto bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                      <Download size={16} className="mr-2" />
                      Unduh
                    </button>
                  </a>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-xl">
                  Dokumen tidak ditemukan.
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
                className="p-2 rounded-md bg-white text-gray-700 hover:bg-gray-200 disabled:opacity-50 shadow"
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
                className="p-2 rounded-md bg-white text-gray-700 hover:bg-gray-200 disabled:opacity-50 shadow"
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

export default DownloadDokumenPage;
