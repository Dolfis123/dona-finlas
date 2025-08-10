import React, { useState, useEffect } from "react";
import { Camera, X, ArrowLeft, ArrowRight } from "lucide-react";

// Impor file API yang kita butuhkan
import galeriApi from "../../api/galeriApi";
import pengaturanHalamanApi from "../../api/pengaturanHalamanApi";

const GaleriPage = () => {
  // State untuk menyimpan data dinamis
  const [semuaGaleri, setSemuaGaleri] = useState([]);
  const [pengaturan, setPengaturan] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk lightbox dan paginasi
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Menampilkan 6 foto per halaman

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // useEffect untuk mengambil semua data dari API saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [galeriData, pengaturanData] = await Promise.all([
          galeriApi.getAll(),
          pengaturanHalamanApi.getAll(),
        ]);

        setSemuaGaleri(galeriData);
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
  const currentItems = semuaGaleri.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(semuaGaleri.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
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
          <Camera size={48} className="mx-auto mb-4 text-blue-400" />
          <h1 className="text-4xl md:text-5xl font-extrabold">
            {pengaturan.galeri_judul || "Galeri Kegiatan"}
          </h1>
          <p className="text-lg mt-4 text-gray-300">
            {pengaturan.galeri_subjudul ||
              "Dokumentasi momen dan aktivitas di Kelurahan Padarni."}
          </p>
        </div>
      </section>

      {/* Section Konten Galeri Dinamis */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {currentItems.map((item) => (
              <div
                key={item.id}
                className="group relative cursor-pointer overflow-hidden rounded-lg shadow-lg"
                onClick={() =>
                  setSelectedImage(`${backendUrl}/images/${item.gambar_url}`)
                }
              >
                <img
                  src={`${backendUrl}/images/${item.gambar_url}`}
                  alt={item.deskripsi}
                  className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold text-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    {item.kategori}
                  </h3>
                  <p className="text-gray-200 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                    {item.deskripsi}
                  </p>
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

      {/* Lightbox / Modal untuk menampilkan gambar yang dipilih */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 animate-fade-in-down"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Tampilan Penuh"
              className="w-auto h-auto max-w-full max-h-[90vh] rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-4 -right-4 bg-white text-gray-800 rounded-full p-2 hover:bg-gray-200"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GaleriPage;
