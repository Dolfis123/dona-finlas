import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import beritaApi from "../../api/beritaApi";
import { User, Calendar, Tag, ArrowLeft } from "lucide-react";

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
      window.scrollTo({ top: 0, behavior: 'smooth' });

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
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-blue-600 rounded-full animate-bounce"></div>
          <p className="mt-4 text-slate-500 font-medium">Memuat artikel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-50 text-slate-800">
        <p className="text-xl font-bold text-red-500 mb-4">{error}</p>
        <Link to="/" className="text-blue-600 hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Kembali ke Beranda
        </Link>
      </div>
    );
  }

  if (!berita) return null;

  return (
    <div className="bg-slate-50 min-h-screen pb-16 font-sans">
      {/* --- BAGIAN HEADER EDITORIAL (TEKS DI ATAS GAMBAR) --- */}
      <div className="bg-white pt-12 pb-8 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          {/* Kategori */}
          <div className="flex justify-center items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-blue-50 text-blue-700">
              <Tag size={14} />
              {berita.kategori}
            </span>
          </div>

          {/* Judul */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-8">
            {berita.judul}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                <User size={16} />
              </div>
              <span>{berita.User?.nama_lengkap || "Admin Kelurahan"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-slate-400" />
              <span>
                {new Date(berita.tanggal_publikasi).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- KONTEN UTAMA --- */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        
        {/* Gambar Hero (Terpisah dari teks, bebas tumpang tindih) */}
        <div className="w-full h-[40vh] sm:h-[50vh] md:h-[60vh] mb-12 rounded-2xl overflow-hidden shadow-xl border-4 border-white relative z-10 bg-gray-100">
          <img
            src={`${backendUrl}/images/${berita.gambar_url}`}
            alt={berita.judul}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Kolom Kiri: Artikel */}
          <article className="lg:col-span-8">
            <div 
              className="prose prose-lg max-w-none text-slate-700 leading-loose font-serif
                         prose-p:mb-6 prose-headings:font-bold prose-headings:text-slate-900
                         prose-a:text-blue-600 prose-img:rounded-xl"
              dangerouslySetInnerHTML={{
                __html: berita.isi.replace(/\n/g, "<br />"),
              }}
            />
          </article>

          {/* Kolom Kanan: Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Berita Terkini
                  </h3>
                </div>
                
                <div className="space-y-6">
                  {beritaLainnya.map((item) => (
                    <Link
                      to={`/berita/${item.id}`}
                      key={item.id}
                      className="group flex items-start gap-4 hover:bg-slate-50 p-2 -mx-2 rounded-xl transition-colors"
                    >
                      <img
                        src={`${backendUrl}/images/${item.gambar_url}`}
                        alt={item.judul}
                        className="w-24 h-24 object-cover rounded-lg shadow-sm border border-slate-100 flex-shrink-0 group-hover:shadow-md transition-shadow"
                      />
                      <div className="flex flex-col justify-center h-24">
                        <h4 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {item.judul}
                        </h4>
                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(item.tanggal_publikasi).toLocaleDateString("id-ID", {
                            day: "numeric", month: "short", year: "numeric"
                          })}
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