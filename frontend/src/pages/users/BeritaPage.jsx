import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Newspaper, ArrowRight, ArrowLeft } from "lucide-react";

// Impor file API yang kita butuhkan
import beritaApi from "../../api/beritaApi";
import pengaturanHalamanApi from "../../api/pengaturanHalamanApi";

const BeritaPage = () => {
  // State untuk menyimpan data dinamis
  const [semuaBerita, setSemuaBerita] = useState([]);
  const [pengaturan, setPengaturan] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // useEffect untuk mengambil semua data dari API saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [beritaData, pengaturanData] = await Promise.all([
          beritaApi.getAll(),
          pengaturanHalamanApi.getAll(),
        ]);

        setSemuaBerita(beritaData);
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
  const currentItems = semuaBerita.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(semuaBerita.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // Fungsi untuk memotong teks isi berita menjadi kutipan pendek
  const createSnippet = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, text.lastIndexOf(" ", maxLength)) + "...";
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
          <Newspaper size={48} className="mx-auto mb-4 text-blue-400" />
          <h1 className="text-4xl md:text-5xl font-extrabold">
            {pengaturan.berita_judul || "Berita Kelurahan"}
          </h1>
          <p className="text-lg mt-4 text-gray-300">
            {pengaturan.berita_subjudul ||
              "Informasi dan kegiatan terkini dari Kelurahan Padarni."}
          </p>
        </div>
      </section>

      {/* Section Konten Berita Dinamis */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {currentItems.map((berita) => (
              <div
                key={berita.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-2 transition-transform duration-300"
              >
                <img
                  src={`${backendUrl}/api/images/${berita.gambar_url}`}
                  alt={berita.judul}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full self-start">
                    {berita.kategori}
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-gray-800 flex-grow">
                    {berita.judul}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(berita.tanggal_publikasi).toLocaleDateString(
                      "id-ID",
                      { day: "2-digit", month: "long", year: "numeric" }
                    )}
                  </p>
                  <p className="text-gray-600 mt-4">
                    {createSnippet(berita.isi)}
                  </p>
                  <Link
                    to={`/berita/${berita.id}`} // Tautan ke halaman detail
                    className="inline-flex items-center mt-6 font-semibold text-blue-600 hover:text-blue-800 self-start"
                  >
                    Baca Selengkapnya
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
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

export default BeritaPage;
