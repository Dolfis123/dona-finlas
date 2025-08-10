import React, { useState, useEffect } from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

// Impor file API yang kita butuhkan
import pengaturanHalamanApi from "../../api/pengaturanHalamanApi";

const KontakPage = () => {
  // State untuk menyimpan data dinamis
  const [pengaturan, setPengaturan] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect untuk mengambil semua data dari API saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        const pengaturanData = await pengaturanHalamanApi.getAll();
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
          <Phone size={48} className="mx-auto mb-4 text-blue-400" />
          <h1 className="text-4xl md:text-5xl font-extrabold">
            {pengaturan.kontak_judul || "Hubungi Kami"}
          </h1>
          <p className="text-lg mt-4 text-gray-300">
            {pengaturan.kontak_subjudul ||
              "Kami siap membantu. Silakan hubungi kami melalui informasi di bawah ini."}
          </p>
        </div>
      </section>

      {/* Section Konten Kontak (Statis, karena ini biasanya info tetap) */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 p-3 bg-blue-100 text-blue-600 rounded-full">
                  <MapPin size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    Alamat Kantor
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Jl. Pahlawan No. 123, Padarni
                    <br />
                    Manokwari, Papua Barat, 98312
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 p-3 bg-blue-100 text-blue-600 rounded-full">
                  <Mail size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    Email Resmi
                  </h3>
                  <p className="text-gray-600 mt-1">kontak@padarni.go.id</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 p-3 bg-blue-100 text-blue-600 rounded-full">
                  <Phone size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    Nomor Telepon
                  </h3>
                  <p className="text-gray-600 mt-1">(0986) 123-456</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 p-3 bg-blue-100 text-blue-600 rounded-full">
                  <Clock size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    Jam Pelayanan
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Senin - Jumat: 08:00 - 15:00 WIT
                  </p>
                  <p className="text-gray-600">Sabtu & Minggu: Tutup</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-gray-50 p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Kirim Pesan
              </h2>
              <form action="#" method="POST" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="nama"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="nama"
                      id="nama"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="subjek"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Subjek Pesan
                  </label>
                  <input
                    type="text"
                    name="subjek"
                    id="subjek"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="pesan"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Isi Pesan
                  </label>
                  <textarea
                    name="pesan"
                    id="pesan"
                    rows="5"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Kirim Pesan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Section Peta Lokasi */}
      <section className="w-full h-[450px] bg-gray-200">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31913.17192866898!2d134.04495584999998!3d-0.87122795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d540b6b23d435af%3A0x49182f735a5195ca!2sManokwari%2C%20West%20Manokwari%2C%20Manokwari%20Regency%2C%20West%20Papua!5e0!3m2!1sen!2sid!4v1723206533045!5m2!1sen!2sid"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Peta Lokasi Kelurahan Padarni"
        ></iframe>
      </section>
    </div>
  );
};

export default KontakPage;
