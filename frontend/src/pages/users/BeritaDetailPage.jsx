import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import beritaApi from "../../api/beritaApi";
import { User, Calendar } from "lucide-react";

const BeritaDetailPage = () => {
  const { id } = useParams();
  const [berita, setBerita] = useState(null);
  const [beritaLainnya, setBeritaLainnya] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      window.scrollTo(0, 0);

      try {
        const [detailData, listData] = await Promise.all([
          beritaApi.getById(id),
          beritaApi.getAll(),
        ]);

        setBerita(detailData);
        setBeritaLainnya(
          listData.filter((item) => item.id !== parseInt(id)).slice(0, 4)
        );
      } catch (err) {
        setError("Gagal memuat berita. Mungkin berita tidak ditemukan.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Memuat berita...
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

  if (!berita) {
    return (
      <div className="flex justify-center items-center h-screen">
        Berita tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* --- BAGIAN HEADER GAMBAR YANG DIDISAIN ULANG --- */}
      <header className="relative h-[60vh] min-h-[400px] w-full">
        {/* Gambar Latar */}
        <img
          src={`${backendUrl}/images/${berita.gambar_url}`}
          alt={berita.judul}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Lapisan Gradien untuk Keterbacaan Teks */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>

        {/* Konten Teks di Atas Gambar */}
        <div className="relative h-full flex flex-col justify-end text-white p-6 sm:p-8 md:p-12">
          <div className="container mx-auto">
            <span className="text-sm font-semibold bg-blue-600 px-3 py-1 rounded-full">
              {berita.kategori}
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold mt-4 leading-tight max-w-4xl">
              {berita.judul}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-200 mt-4">
              <div className="flex items-center">
                <User size={16} className="mr-2" />
                <span>Oleh: {berita.User?.nama_lengkap || "Admin"}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span>
                  {new Date(berita.tanggal_publikasi).toLocaleDateString(
                    "id-ID",
                    { day: "2-digit", month: "long", year: "numeric" }
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- BAGIAN KONTEN UTAMA --- */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Kolom Konten Artikel */}
          <article
            className="lg:col-span-2 prose max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: berita.isi.replace(/\n/g, "<br /><br />"),
            }}
          ></article>

          {/* Kolom Sidebar Berita Lainnya */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">
                  Berita Lainnya
                </h3>
                <div className="space-y-4">
                  {beritaLainnya.map((item) => (
                    <Link
                      to={`/berita/${item.id}`}
                      key={item.id}
                      className="group flex items-start space-x-4"
                    >
                      <img
                        src={`${backendUrl}/images/${item.gambar_url}`}
                        alt={item.judul}
                        className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {item.judul}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(item.tanggal_publikasi).toLocaleDateString(
                            "id-ID"
                          )}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BeritaDetailPage;
