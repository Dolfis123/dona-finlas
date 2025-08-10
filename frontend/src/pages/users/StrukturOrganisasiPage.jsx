import React, { useState, useEffect } from "react";
import { Network } from "lucide-react";
import pejabatApi from "../../api/pejabatApi";
import pengaturanHalamanApi from "../../api/pengaturanHalamanApi";

// Komponen kecil untuk menampilkan kartu profil
const ProfileCard = ({ nama, jabatan, foto }) => (
  <div className="bg-white p-4 rounded-lg shadow-lg text-center w-48 mx-auto">
    <img
      src={foto || "https://placehold.co/150x200/e2e8f0/334155?text=Foto"}
      alt={nama}
      className="w-24 h-32 mx-auto rounded-md object-cover mb-3"
    />
    <h4 className="font-bold text-sm text-gray-800">{nama}</h4>
    <p className="text-xs text-blue-600 font-semibold">{jabatan}</p>
  </div>
);

const StrukturOrganisasiPage = () => {
  // State untuk menyimpan data dinamis
  const [lurah, setLurah] = useState(null);
  const [sekretaris, setSekretaris] = useState(null);
  const [kasiList, setKasiList] = useState([]);
  const [pengaturan, setPengaturan] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pejabatData, pengaturanData] = await Promise.all([
          pejabatApi.getAll(),
          pengaturanHalamanApi.getAll(),
        ]);

        // Memproses dan memisahkan data pejabat berdasarkan jabatan
        setLurah(pejabatData.find((p) => p.jabatan.toLowerCase() === "lurah"));
        setSekretaris(
          pejabatData.find((p) =>
            p.jabatan.toLowerCase().includes("sekretaris")
          )
        );
        setKasiList(
          pejabatData.filter((p) => p.jabatan.toLowerCase().startsWith("kasi"))
        );

        setPengaturan(pengaturanData);
      } catch (err) {
        setError("Gagal memuat data dari server.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        Memuat halaman...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex justify-center items-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Section Header Dinamis */}
      <section className="bg-gray-800 text-white pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <Network size={48} className="mx-auto mb-4 text-blue-400" />
          <h1 className="text-4xl md:text-5xl font-extrabold">
            {pengaturan.struktur_judul || "Struktur Organisasi"}
          </h1>
          <p className="text-lg mt-4 text-gray-300">
            {pengaturan.struktur_subjudul ||
              "Hierarki Pemerintahan Kelurahan Padarni."}
          </p>
        </div>
      </section>

      {/* Section Bagan Organisasi Dinamis */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          {/* Lurah */}
          {lurah && (
            <div className="flex justify-center">
              <ProfileCard
                nama={lurah.nama_lengkap}
                jabatan={lurah.jabatan}
                foto={
                  lurah.foto_url
                    ? `${backendUrl}/api/images/${lurah.foto_url}`
                    : undefined
                }
              />
            </div>
          )}

          {/* Garis vertikal ke bawah */}
          {lurah && sekretaris && (
            <div className="flex justify-center">
              <div className="w-0.5 h-12 bg-gray-300"></div>
            </div>
          )}

          {/* Sekretaris */}
          {sekretaris && (
            <div className="flex justify-center">
              <ProfileCard
                nama={sekretaris.nama_lengkap}
                jabatan={sekretaris.jabatan}
                foto={
                  sekretaris.foto_url
                    ? `${backendUrl}/api/images/${sekretaris.foto_url}`
                    : undefined
                }
              />
            </div>
          )}

          {/* Garis ke bawah dan menyebar */}
          {sekretaris && kasiList.length > 0 && (
            <div className="flex justify-center relative">
              <div className="w-0.5 h-12 bg-gray-300"></div>
              <div className="hidden md:block absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 lg:w-1/2 h-0.5 bg-gray-300"></div>
            </div>
          )}

          {/* Para Kasi (Kepala Seksi) */}
          {kasiList.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-y-0 md:gap-x-8 mt-12 md:mt-0">
              {kasiList.map((kasi) => (
                <div
                  key={kasi.id}
                  className="relative flex flex-col items-center"
                >
                  <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-gray-300 -translate-y-full"></div>
                  <ProfileCard
                    nama={kasi.nama_lengkap}
                    jabatan={kasi.jabatan}
                    foto={
                      kasi.foto_url
                        ? `${backendUrl}/api/images/${kasi.foto_url}`
                        : undefined
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default StrukturOrganisasiPage;
