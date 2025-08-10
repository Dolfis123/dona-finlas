import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, ArrowLeft, ArrowRight } from "lucide-react";

// Impor file API yang kita butuhkan
import agendaApi from "../../api/agendaApi";
import pengaturanHalamanApi from "../../api/pengaturanHalamanApi";

const AgendaPage = () => {
  // State untuk menyimpan data dinamis
  const [semuaAgenda, setSemuaAgenda] = useState([]);
  const [pengaturan, setPengaturan] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Menampilkan 3 agenda per halaman

  // useEffect untuk mengambil semua data dari API saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agendaData, pengaturanData] = await Promise.all([
          agendaApi.getAll(),
          pengaturanHalamanApi.getAll(),
        ]);

        setSemuaAgenda(agendaData);
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
  const currentItems = semuaAgenda.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(semuaAgenda.length / itemsPerPage);

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
          <Calendar size={48} className="mx-auto mb-4 text-blue-400" />
          <h1 className="text-4xl md:text-5xl font-extrabold">
            {pengaturan.agenda_judul || "Agenda Kegiatan"}
          </h1>
          <p className="text-lg mt-4 text-gray-300">
            {pengaturan.agenda_subjudul ||
              "Jadwal acara dan kegiatan yang akan datang di Kelurahan Padarni."}
          </p>
        </div>
      </section>

      {/* Section Linimasa Agenda Dinamis */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="relative">
            <div className="absolute left-1/2 w-0.5 h-full bg-gray-300 -translate-x-1/2"></div>
            <div className="space-y-12">
              {currentItems.map((item, index) => (
                <div
                  key={item.id}
                  className="relative flex items-center"
                  style={{
                    flexDirection: index % 2 === 0 ? "row" : "row-reverse",
                  }}
                >
                  <div className="w-1/2 px-6">
                    <div
                      className={`bg-white p-6 rounded-lg shadow-xl border-t-4 ${
                        index % 2 === 0 ? "border-blue-500" : "border-green-500"
                      }`}
                    >
                      <h3 className="text-xl font-bold text-gray-800">
                        {item.nama_kegiatan}
                      </h3>
                      <p className="text-gray-600 mt-2">{item.deskripsi}</p>
                      <div className="mt-4 space-y-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2" />
                          <span>
                            {new Date(item.tanggal_kegiatan).toLocaleDateString(
                              "id-ID",
                              { day: "2-digit", month: "long", year: "numeric" }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock size={16} className="mr-2" />
                          <span>{item.waktu}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin size={16} className="mr-2" />
                          <span>{item.lokasi}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full ${
                      index % 2 === 0 ? "bg-blue-500" : "bg-green-500"
                    } border-4 border-white`}
                  ></div>
                </div>
              ))}
            </div>
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

export default AgendaPage;
