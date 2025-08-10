import React, { useState, useEffect } from "react";
import { Megaphone, ArrowLeft, ArrowRight } from "lucide-react";

// Impor file API yang kita butuhkan
import pengumumanApi from "../../api/pengumumanApi";
import pengaturanHalamanApi from "../../api/pengaturanHalamanApi";

const PengumumanPage = () => {
  // State untuk menyimpan data dinamis
  const [semuaPengumuman, setSemuaPengumuman] = useState([]);
  const [pengaturan, setPengaturan] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // useEffect untuk mengambil semua data dari API saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pengumumanData, pengaturanData] = await Promise.all([
          pengumumanApi.getAll(),
          pengaturanHalamanApi.getAll(),
        ]);

        setSemuaPengumuman(pengumumanData);
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
  const currentItems = semuaPengumuman.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(semuaPengumuman.length / itemsPerPage);

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
          <Megaphone size={48} className="mx-auto mb-4 text-yellow-400" />
          <h1 className="text-4xl md:text-5xl font-extrabold">
            {pengaturan.pengumuman_judul || "Pengumuman Resmi"}
          </h1>
          <p className="text-lg mt-4 text-gray-300">
            {pengaturan.pengumuman_subjudul ||
              "Informasi penting dan pemberitahuan dari Pemerintah Kelurahan Padarni."}
          </p>
        </div>
      </section>

      {/* Section Konten Pengumuman Dinamis */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="space-y-6">
            {currentItems.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-lg shadow-md border-l-4"
                style={{
                  borderColor:
                    item.level_penting === "Penting" ? "#ef4444" : "#22c55e",
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {item.judul}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(item.tanggal_publikasi).toLocaleDateString(
                        "id-ID",
                        { day: "2-digit", month: "long", year: "numeric" }
                      )}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full text-white ${
                      item.level_penting === "Penting"
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                  >
                    {item.level_penting}
                  </span>
                </div>
                <p className="text-gray-700 mt-4">{item.isi}</p>
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

export default PengumumanPage;
