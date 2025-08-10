import React, { useState, useEffect } from "react";
import { Landmark, Target, CheckCircle } from "lucide-react";

// Impor file API yang kita butuhkan
import aboutApi from "../../api/aboutApi";
import sambutanApi from "../../api/sambutanApi";
import pengaturanHalamanApi from "../../api/pengaturanHalamanApi";

const AboutPage = () => {
  // State untuk menyimpan semua data dinamis
  const [aboutContent, setAboutContent] = useState({});
  const [sambutanContent, setSambutanContent] = useState({});
  const [pengaturan, setPengaturan] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // useEffect untuk mengambil semua data dari API saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mengambil semua data secara bersamaan untuk performa lebih baik
        const [aboutData, sambutanData, pengaturanData] = await Promise.all([
          aboutApi.get(),
          sambutanApi.get(),
          pengaturanHalamanApi.getAll(),
        ]);

        setAboutContent(aboutData);
        setSambutanContent(sambutanData);
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
    <div className="bg-white">
      {/* Section Header Dinamis */}
      <section className="bg-gray-800 text-white pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <Landmark size={48} className="mx-auto mb-4 text-blue-400" />
          <h1 className="text-4xl md:text-5xl font-extrabold">
            {pengaturan.about_judul || "Tentang Kelurahan Padarni"}
          </h1>
          <p className="text-lg mt-4 text-gray-300 max-w-3xl mx-auto">
            {pengaturan.about_subjudul ||
              "Mengenal lebih dekat sejarah, kepemimpinan, visi, dan misi kami dalam melayani masyarakat."}
          </p>
        </div>
      </section>

      {/* Section Sambutan Kepala Kelurahan Dinamis */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-shrink-0 lg:order-last">
              <img
                src={
                  sambutanContent.foto_url
                    ? `${backendUrl}/api/images/${sambutanContent.foto_url}`
                    : "https://placehold.co/300x400/e2e8f0/334155?text=Foto+Lurah"
                }
                alt={sambutanContent.nama_lurah || "Kepala Kelurahan"}
                className="w-64 h-80 lg:w-72 lg:h-96 object-cover rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="text-gray-600 text-lg leading-relaxed max-w-2xl text-center lg:text-left">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                Sambutan Kepala Kelurahan
              </h2>
              {/* Menggunakan dangerouslySetInnerHTML untuk merender baris baru dari database */}
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    sambutanContent.isi_sambutan?.replace(
                      /\n/g,
                      "<br /><br />"
                    ) || "",
                }}
              ></div>
              <p className="font-semibold text-gray-800 mt-6">
                {sambutanContent.nama_lurah || "Nama Kepala Lurah"}
              </p>
              <p className="text-sm text-gray-500">
                {sambutanContent.jabatan_lurah || "Kepala Kelurahan Padarni"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Sejarah Dinamis */}
      <section id="sejarah" className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800">
              Sejarah Singkat
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
          </div>
          <div
            className="max-w-4xl mx-auto text-gray-600 text-lg leading-relaxed text-center"
            dangerouslySetInnerHTML={{
              __html:
                aboutContent.sejarah?.replace(/\n/g, "<br /><br />") || "",
            }}
          ></div>
        </div>
      </section>

      {/* Section Visi & Misi Dinamis */}
      <section id="visi-misi" className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800">
              Visi & Misi
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-blue-600">
              <div className="flex items-center mb-4">
                <Target size={40} className="text-blue-600 mr-4" />
                <h3 className="text-2xl font-bold text-gray-900">Visi</h3>
              </div>
              <p className="text-gray-600 text-lg italic">
                {aboutContent.visi || ""}
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-green-600">
              <div className="flex items-center mb-4">
                <CheckCircle size={40} className="text-green-600 mr-4" />
                <h3 className="text-2xl font-bold text-gray-900">Misi</h3>
              </div>
              <ul className="space-y-3 text-gray-600 text-lg">
                {aboutContent.misi?.split("\n").map(
                  (misi, index) =>
                    misi && (
                      <li key={index} className="flex items-start">
                        <CheckCircle
                          size={20}
                          className="text-green-500 mr-3 mt-1 flex-shrink-0"
                        />
                        <span>{misi}</span>
                      </li>
                    )
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
