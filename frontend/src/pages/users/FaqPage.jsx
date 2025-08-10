import React, { useState, useEffect } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

// Impor file API yang kita butuhkan
import faqApi from "../../api/faqApi";
import pengaturanHalamanApi from "../../api/pengaturanHalamanApi";

const FaqPage = () => {
  // State untuk menyimpan data dinamis
  const [faqContent, setFaqContent] = useState({}); // Akan menyimpan objek { kategori: [items] }
  const [pengaturan, setPengaturan] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk melacak accordion mana yang sedang terbuka
  const [openAccordion, setOpenAccordion] = useState(null);

  // useEffect untuk mengambil semua data dari API saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [faqData, pengaturanData] = await Promise.all([
          faqApi.getAll(),
          pengaturanHalamanApi.getAll(),
        ]);

        setFaqContent(faqData);
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

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? null : id);
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
          <HelpCircle size={48} className="mx-auto mb-4 text-blue-400" />
          <h1 className="text-4xl md:text-5xl font-extrabold">
            {pengaturan.faq_judul || "Pertanyaan yang Sering Diajukan (FAQ)"}
          </h1>
          <p className="text-lg mt-4 text-gray-300">
            {pengaturan.faq_subjudul ||
              "Temukan jawaban atas pertanyaan umum seputar layanan kami."}
          </p>
        </div>
      </section>

      {/* Section Konten FAQ Dinamis */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {Object.keys(faqContent).map((kategori) => (
            <div key={kategori} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-blue-500">
                {kategori}
              </h2>
              <div className="space-y-4">
                {faqContent[kategori].map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <button
                      onClick={() => toggleAccordion(item.id)}
                      className="w-full flex justify-between items-center p-5 text-left font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      <span>{item.pertanyaan}</span>
                      <ChevronDown
                        size={20}
                        className={`transform transition-transform duration-300 ${
                          openAccordion === item.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`grid transition-all duration-500 ease-in-out ${
                        openAccordion === item.id
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-5 pb-5 text-gray-600 leading-relaxed">
                          {item.jawaban}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FaqPage;
