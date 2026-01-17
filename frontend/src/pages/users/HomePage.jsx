import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  Megaphone,
  Newspaper,
  ShoppingBasket,
} from "lucide-react";

// Impor semua file API yang kita butuhkan
import pengaturanHalamanApi from "../../api/pengaturanHalamanApi";
import beritaApi from "../../api/beritaApi";
import pengumumanApi from "../../api/pengumumanApi";
import potensiDaerahApi from "../../api/potensiDaerahApi";

const HomePage = () => {
  // State untuk menyimpan data dinamis
  const [pengaturan, setPengaturan] = useState({});
  const [beritaTerbaru, setBeritaTerbaru] = useState([]);
  const [pengumumanTerbaru, setPengumumanTerbaru] = useState([]);
  const [potensiLokal, setPotensiLokal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // useEffect untuk mengambil semua data dari API saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mengambil semua data secara bersamaan untuk performa lebih baik
        const [pengaturanData, beritaData, pengumumanData, potensiData] =
          await Promise.all([
            pengaturanHalamanApi.getAll(),
            beritaApi.getAll(),
            pengumumanApi.getAll(),
            potensiDaerahApi.getAll(),
          ]);

        setPengaturan(pengaturanData);
        // Ambil 3 berita terbaru
        setBeritaTerbaru(beritaData.slice(0, 3));
        // Ambil 2 pengumuman terbaru
        setPengumumanTerbaru(pengumumanData.slice(0, 2));
        // Ambil 3 potensi lokal
        setPotensiLokal(potensiData.slice(0, 3));
      } catch (err) {
        setError("Gagal memuat data dari server. Silakan coba lagi nanti.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Array kosong berarti efek ini hanya berjalan sekali

  // Data statis untuk layanan, karena fiturnya belum kita buat
  const layananUnggulan = [
    {
      id: 1,
      nama: "Surat Domisili",
      icon: <FileText className="w-8 h-8 text-blue-600" />,
    },
    {
      id: 2,
      nama: "Suarat Keterangan Tidak Mampu",
      icon: <FileText className="w-8 h-8 text-blue-600" />,
    },
    {
      id: 3,
      nama: "Surat Keterangan Orang Papua",
      icon: <FileText className="w-8 h-8 text-blue-600" />,
    },
    {
      id: 4,
      nama: "Layanan Lainnya",
      icon: <ArrowRight className="w-8 h-8 text-blue-600" />,
    },
  ];

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
      {/* Hero Section Dinamis */}
      <section
        className="h-[70vh] bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${pengaturan.home_bg_image})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-2xl text-white">
            <h1
              className="text-4xl md:text-6xl font-extrabold leading-tight"
              dangerouslySetInnerHTML={{ __html: pengaturan.home_judul }}
            ></h1>
            <p className="text-lg md:text-xl mt-4 text-gray-200">
              {pengaturan.home_subjudul}
            </p>
            <Link
              to="/pengajuan-surat"
              className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-full mt-8 hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
            >
              Jelajahi Layanan
            </Link>
          </div>
        </div>
      </section>

      {/* Section Layanan Unggulan (tetap statis untuk saat ini) */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800">
              Pelayanan Publik Unggulan
            </h2>
            <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
              Akses layanan administrasi paling populer langsung dari sini.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {layananUnggulan.map((layanan) => (
              <Link
                to="/pengajuan-surat"
                key={layanan.id}
                className="bg-white p-6 rounded-lg shadow-lg text-center group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-t-4 border-transparent hover:border-blue-500"
              >
                <div className="flex justify-center items-center h-16 w-16 bg-blue-100 rounded-full mx-auto mb-4 group-hover:bg-blue-500 transition-colors duration-300">
                  {React.cloneElement(layanan.icon, {
                    className:
                      "w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300",
                  })}
                </div>
                <p className="font-bold text-lg text-gray-800">
                  {layanan.nama}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section Informasi Terkini Dinamis */}
      <section className="bg-white py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800">
              Informasi Terkini
            </h2>
            <p className="text-gray-500 mt-2">
              Ikuti berita dan pengumuman terbaru dari kelurahan.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <div className="flex items-center mb-6">
                <Newspaper className="w-8 h-8 text-blue-600" />
                <h3 className="ml-3 text-2xl font-semibold text-gray-700">
                  Berita Terbaru
                </h3>
              </div>
              <div className="space-y-6">
                {beritaTerbaru.map((item) => (
                  <Link
                    to={`/berita/${item.id}`}
                    key={item.id}
                    className="flex items-start space-x-4 group"
                  >
                    <div className="flex-shrink-0">
                      <p className="text-sm font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-md">
                        {item.kategori}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {item.judul}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(item.tanggal_publikasi).toLocaleDateString(
                          "id-ID",
                          { day: "2-digit", month: "long", year: "numeric" }
                        )}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="lg:col-span-2 bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-6">
                <Megaphone className="w-8 h-8 text-yellow-500" />
                <h3 className="ml-3 text-2xl font-semibold text-gray-700">
                  Pengumuman
                </h3>
              </div>
              <div className="space-y-4">
                {pengumumanTerbaru.map((item) => (
                  <Link
                    to="/pengumuman"
                    key={item.id}
                    className="block p-4 rounded-lg bg-white shadow hover:shadow-md transition-shadow"
                  >
                    <p className="font-semibold text-gray-800 text-sm">
                      {item.judul}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(item.tanggal_publikasi).toLocaleDateString(
                        "id-ID",
                        { day: "2-digit", month: "long", year: "numeric" }
                      )}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Potensi Lokal Dinamis */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <ShoppingBasket className="w-10 h-10 text-green-600 mx-auto" />
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mt-4">
              Potensi Lokal Unggulan
            </h2>
            <p className="text-gray-500 mt-2">
              Jelajahi keunikan kuliner, kerajinan, dan wisata kami.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {potensiLokal.map((item) => (
              <Link
                to="/potensi-daerah"
                key={item.id}
                className="relative rounded-lg overflow-hidden h-80 group shadow-lg"
              >
                <img
                  src={`${backendUrl}/images/${item.gambar_url}`}
                  alt={item.nama_potensi}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h4 className="text-white text-2xl font-bold">
                    {item.nama_potensi}
                  </h4>
                  <div className="mt-2 px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full inline-block backdrop-blur-sm">
                    Lihat Detail
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
