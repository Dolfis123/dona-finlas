import React, { useState, useEffect } from "react";
import {
  Leaf,
  ShoppingBasket,
  Utensils,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

// Impor file API yang kita butuhkan
import potensiDaerahApi from "../../api/potensiDaerahApi";
import pengaturanHalamanApi from "../../api/pengaturanHalamanApi";

const PotensiDaerahPage = () => {
  // State untuk menyimpan data dinamis
  const [semuaPotensi, setSemuaPotensi] = useState([]);
  const [pengaturan, setPengaturan] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Menampilkan 6 item per halaman

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // useEffect untuk mengambil semua data dari API saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [potensiData, pengaturanData] = await Promise.all([
          potensiDaerahApi.getAll(),
          pengaturanHalamanApi.getAll(),
        ]);

        setSemuaPotensi(potensiData);
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

  // --- LOGIKA PAGINASI DINAMIS ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = semuaPotensi.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(semuaPotensi.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // Fungsi untuk memilih ikon berdasarkan kategori
  const getCategoryIcon = (kategori) => {
    const lowerCaseKategori = kategori.toLowerCase();
    if (lowerCaseKategori.includes("kuliner")) {
      return <Utensils size={24} className="text-orange-500" />;
    }
    if (lowerCaseKategori.includes("kerajinan")) {
      return <ShoppingBasket size={24} className="text-purple-500" />;
    }
    if (lowerCaseKategori.includes("wisata")) {
      return <Leaf size={24} className="text-green-500" />;
    }
    return <Leaf size={24} className="text-gray-500" />;
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
    <div className="bg-gray-50">
      {/* Section Header Dinamis */}
      <section className="bg-gray-800 text-white pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <Leaf size={48} className="mx-auto mb-4 text-green-400" />
          <h1 className="text-4xl md:text-5xl font-extrabold">
            {pengaturan.potensi_judul || "Potensi Daerah"}
          </h1>
          <p className="text-lg mt-4 text-gray-300">
            {pengaturan.potensi_subjudul ||
              "Menjelajahi keunggulan kuliner, kerajinan, dan wisata di Kelurahan Padarni."}
          </p>
        </div>
      </section>

      {/* Section Konten Potensi Daerah Dinamis */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col group"
              >
                <div className="relative">
                  <img
                    src={`${backendUrl}/images/${item.gambar_url}`}
                    alt={item.nama_potensi}
                    className="w-full h-56 object-cover transform transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md">
                    {getCategoryIcon(item.kategori)}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-sm font-semibold text-blue-600">
                    {item.kategori}
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-gray-800 flex-grow">
                    {item.nama_potensi}
                  </h3>
                  <p className="text-gray-600 mt-3">{item.deskripsi}</p>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 font-medium">
                      {item.kontak_info}
                    </p>
                  </div>
                </div>
              </div>
            ))}
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

export default PotensiDaerahPage;
