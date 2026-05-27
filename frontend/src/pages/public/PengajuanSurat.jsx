import React, { useState, useEffect, useRef } from "react";
import api from "../../utils/api";
import html2pdf from "html2pdf.js";
import {
  Download,
  CheckCircle,
  RefreshCw,
  AlertCircle,
  User,
  CreditCard,
  Phone,
  FileText,
} from "lucide-react";

const PengajuanSurat = () => {
  const [jenisSuratList, setJenisSuratList] = useState([]);
  const [selectedJenis, setSelectedJenis] = useState("");
  const [hasilStatus, setHasilStatus] = useState(null);
  // State Data Diri
  const [identitas, setIdentitas] = useState({
    nik: "",
    nama_lengkap: "",
    no_hp: "",
  });

  // State Data Form Tambahan
  const [dataDinamis, setDataDinamis] = useState({});

  // State Validasi & UI
  const [errors, setErrors] = useState({});
  const [tiketSukses, setTiketSukses] = useState(null);
  const [loading, setLoading] = useState(false);

  const tiketRef = useRef();
  const jalankanCekStatus = async (kodeTiket) => {
    try {
      const res = await api.get(`/surat/status/${kodeTiket}`);
      setHasilStatus(res.data); // Menyimpan objek { status, keterangan, nama_lengkap, dll }
    } catch (error) {
      alert("Tiket tidak ditemukan!");
    }
  };
useEffect(() => {
    api
      .get("/surat/master/jenis")
      .then((res) => setJenisSuratList(res.data))
      .catch((err) => console.error("Gagal ambil jenis surat"));

    const savedTicket = localStorage.getItem("tiket_terakhir");
    if (savedTicket) {
      setTiketSukses(savedTicket);
      // 👇 TAMBAHKAN BARIS INI: Tarik status terbaru saat halaman di-refresh
      jalankanCekStatus(savedTicket); 
    }
  }, []);

  // --- SMART HANDLER UTAMA ---
  const handleNikChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Hapus non-angka mutlak
    if (value.length <= 16) {
      setIdentitas({ ...identitas, nik: value });
      if (value.length > 0 && value.length < 16) {
        setErrors((prev) => ({
          ...prev,
          nik: "NIK harus tepat 16 digit angka",
        }));
      } else {
        setErrors((prev) => ({ ...prev, nik: null }));
      }
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Hanya angka
    if (value.length <= 14) {
      // Nomor baru bisa sampai 14 digit
      setIdentitas({ ...identitas, no_hp: value });
      if (value.length > 0 && value.length < 10) {
        setErrors((prev) => ({
          ...prev,
          no_hp: "Nomor HP tidak valid (minimal 10 digit)",
        }));
      } else {
        setErrors((prev) => ({ ...prev, no_hp: null }));
      }
    }
  };

  const handleDinamisChange = (e) => {
    let { name, value } = e.target;

    // Smart Format berdasarkan nama field
    if (name.toLowerCase().includes("nik")) {
      value = value.replace(/\D/g, "").slice(0, 16); // Wajib angka, max 16
    } else if (
      name.toLowerCase().includes("nama") ||
      name.toLowerCase().includes("kampus") ||
      name.toLowerCase().includes("prodi")
    ) {
      value = value.toUpperCase(); // Wajib huruf kapital
    } else if (
      name.toLowerCase().includes("umur") ||
      name.toLowerCase().includes("penghasilan")
    ) {
      value = value.replace(/\D/g, ""); // Wajib angka mutlak (mencegah user mengetik 'Rp' atau titik)
    }

    setDataDinamis((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi Akhir Ekstra
    if (identitas.nik.length !== 16) {
      alert("Mohon periksa kembali, NIK harus tepat 16 digit!");
      return;
    }
    if (identitas.no_hp.length < 10) {
      alert("Mohon periksa kembali, Nomor HP tidak valid!");
      return;
    }

    setLoading(true);
    try {
      // Auto-Trim: Membersihkan spasi nyasar di awal/akhir input
      const payload = {
        id_jenis: selectedJenis,
        nik: identitas.nik.trim(),
        nama_lengkap: identitas.nama_lengkap.trim().toUpperCase(),
        no_hp: identitas.no_hp.trim(),
        data_form_json: dataDinamis, // Idealnya ini juga dilooping untuk di-trim jika perlu
        data_berkas_json: {},
      };

      const res = await api.post("/surat/ajukan", payload);
      const tiketBaru = res.data.ticket;
      setTiketSukses(tiketBaru);
      localStorage.setItem("tiket_terakhir", tiketBaru);
      jalankanCekStatus(tiketBaru);
      window.scrollTo(0, 0);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Gagal mengirim pengajuan. Periksa kembali koneksi anda.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Buat pengajuan baru? Tiket saat ini akan terhapus dari tampilan.",
      )
    ) {
      localStorage.removeItem("tiket_terakhir");
      setTiketSukses(null);
      setSelectedJenis("");
      setDataDinamis({});
      setIdentitas({ nik: "", nama_lengkap: "", no_hp: "" });
      setErrors({});
      window.scrollTo(0, 0);
    }
  };

  const handleDownloadTiket = () => {
    const element = tiketRef.current;
    const opt = {
      margin: 10,
      filename: `TIKET_${tiketSukses}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a6", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  const renderFormDinamis = () => {
    const surat = jenisSuratList.find(
      (j) => j.id_jenis === parseInt(selectedJenis),
    );
    if (!surat) return null;

    const kodeSurat = (surat.kode_surat || "").toUpperCase();
    const namaSurat = (surat.nama_surat || "").toUpperCase();

    // TEMPLATE SKTM
    if (kodeSurat === "SKTM" || namaSurat.includes("MAMPU")) {
      return (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* DATA ORANG TUA / WALI */}
          <div className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
            <h3 className="flex items-center gap-2 font-bold text-amber-900 mb-4">
              <User size={18} /> Data Orang Tua / Wali
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="nama_ortu"
                value={dataDinamis.nama_ortu || ""}
                placeholder="Nama Lengkap Ortu"
                className="input-field"
                onChange={handleDinamisChange}
                required
              />

              {/* 1. TAMBAHKAN INPUT TTL ORANG TUA */}
              <input
                name="ttl_ortu"
                value={dataDinamis.ttl_ortu || ""}
                placeholder="Tempat, Tanggal Lahir Ortu (Contoh: Manokwari, 12 April 1975)"
                className="input-field"
                onChange={handleDinamisChange}
                required
              />

              {/* 2. TAMBAHKAN DROPDOWN JENIS KELAMIN ORANG TUA */}
              <select
                name="jk_ortu"
                value={dataDinamis.jk_ortu || ""}
                className="input-field"
                onChange={handleDinamisChange}
                required
              >
                <option value="">-- Pilih Jenis Kelamin Ortu --</option>
                <option value="LAKI-LAKI">LAKI-LAKI</option>
                <option value="PEREMPUAN">PEREMPUAN</option>
              </select>

              <input
                name="umur_ortu"
                type="text"
                value={dataDinamis.umur_ortu || ""}
                placeholder="Umur Ortu (Tahun)"
                className="input-field"
                onChange={handleDinamisChange}
                required
              />
              <input
                name="pekerjaan_ortu"
                value={dataDinamis.pekerjaan_ortu || ""}
                placeholder="Pekerjaan Ortu"
                className="input-field uppercase"
                onChange={(e) =>
                  handleDinamisChange({
                    target: {
                      name: e.target.name,
                      value: e.target.value.toUpperCase(),
                    },
                  })
                }
                required
              />
              <input
                name="penghasilan_ortu"
                type="text"
                value={dataDinamis.penghasilan_ortu || ""}
                placeholder="Penghasilan Bulanan (Hanya Angka)"
                className="input-field"
                onChange={handleDinamisChange}
                required
              />
              <textarea
                name="alamat_ortu"
                value={dataDinamis.alamat_ortu || ""}
                placeholder="Alamat Lengkap Ortu"
                className="input-field md:col-span-2"
                rows="2"
                onChange={handleDinamisChange}
                required
              />
            </div>
          </div>

          {/* DATA PENDIDIKAN / MAHASISWA */}
          <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
            <h3 className="flex items-center gap-2 font-bold text-blue-900 mb-4">
              <FileText size={18} /> Data Pendidikan / Mahasiswa
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="kampus"
                value={dataDinamis.kampus || ""}
                placeholder="Nama Perguruan Tinggi"
                className="input-field"
                onChange={handleDinamisChange}
                required
              />
              <input
                name="nim"
                value={dataDinamis.nim || ""}
                placeholder="NIM / No. Induk Mahasiswa"
                className="input-field uppercase"
                onChange={(e) =>
                  handleDinamisChange({
                    target: {
                      name: e.target.name,
                      value: e.target.value.toUpperCase(),
                    },
                  })
                }
                required
              />

              {/* 3. TAMBAHKAN INPUT FAKULTAS MAHASISWA */}
              <input
                name="fakultas"
                value={dataDinamis.fakultas || ""}
                placeholder="Fakultas (Contoh: FAKULTAS TEKNIK)"
                className="input-field"
                onChange={handleDinamisChange}
                required
              />

              <input
                name="prodi"
                value={dataDinamis.prodi || ""}
                placeholder="Program Studi"
                className="input-field"
                onChange={handleDinamisChange}
                required
              />
              <input
                name="keperluan"
                value={dataDinamis.keperluan || ""}
                placeholder="Tujuan Penggunaan Surat"
                className="input-field"
                onChange={handleDinamisChange}
                required
              />
            </div>
          </div>
        </div>
      );
    }

    // Default Fallback
    return (
      <div className="p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-center">
        <p className="text-gray-500 italic">
          Silahkan isi data utama di atas. Petugas akan menghubungi Anda via
          WhatsApp jika dibutuhkan data tambahan.
        </p>
      </div>
    );
  };

  // --- VIEW: SUKSES ---
  if (tiketSukses) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        {/* ... (KODE VIEW SUKSES TETAP SAMA SEPERTI SEBELUMNYA) ... */}
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div ref={tiketRef} className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="text-green-600 w-12 h-12" />
            </div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">
              PENGAJUAN BERHASIL
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Kelurahan Amban - Papua Barat
            </p>

            <div className="my-8 py-6 px-4 bg-slate-900 rounded-2xl text-white relative">
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-gray-50 rounded-r-full"></div>
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-gray-50 rounded-l-full"></div>
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">
                Kode Tiket Anda
              </p>
              <p className="text-4xl font-mono font-black text-blue-400">
                {tiketSukses}
              </p>
            </div>

            {hasilStatus && (
              <div className="bg-white p-6 rounded-2xl shadow border mt-4">
                <p className="text-sm text-gray-500">
                  Nama Pemohon: <b>{hasilStatus.nama_lengkap}</b>
                </p>
                <p className="text-sm text-gray-500">
                  Jenis Surat: <b>{hasilStatus.jenis_surat}</b>
                </p>

                <div className="flex justify-between items-center my-4 p-3 bg-slate-50 rounded-xl">
                  <span className="text-gray-600 text-sm font-medium">
                    Status Pengajuan:
                  </span>

                  {/* KUNCI DINAMIS DI SINI 👇 */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase ${
                      hasilStatus.status.includes("SELESAI")
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700 animate-pulse"
                    }`}
                  >
                    {hasilStatus.status}
                  </span>
                </div>

                {/* Keterangan dinamis dari server (sangat informatif untuk warga) */}
                <p className="text-xs text-gray-500 border-t pt-2 italic">
                  {hasilStatus.keterangan}
                </p>
              </div>
            )}
          </div>

          <div className="p-6 bg-gray-100 flex flex-col gap-3">
            <button
              onClick={handleDownloadTiket}
              className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition active:scale-95 shadow-lg shadow-blue-200"
            >
              <Download size={20} /> Simpan Bukti PDF
            </button>
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 py-3 text-gray-500 font-medium hover:text-gray-800 transition"
            >
              <RefreshCw size={18} /> Buat Pengajuan Lain
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: FORM UTAMA ---
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block p-3 bg-blue-600 rounded-2xl mb-4 shadow-xl shadow-blue-200">
            <FileText className="text-white w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">
            E-Surat Kelurahan
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Lengkapi formulir di bawah untuk pengajuan surat online
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-white p-6 md:p-10 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100"
        >
          {/* SEKSI 1: JENIS LAYANAN */}
          <section>
            <label className="flex items-center gap-2 text-sm font-black text-slate-700 uppercase tracking-wider mb-4">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">
                1
              </span>
              Pilih Jenis Layanan
            </label>
            <select
              className={`w-full p-4 rounded-xl border-2 transition-all outline-none appearance-none bg-no-repeat bg-[right_1rem_center] ${selectedJenis ? "border-blue-500 bg-blue-50/30" : "border-slate-200 focus:border-blue-500"}`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundSize: "1.5rem",
              }}
              onChange={(e) => {
                setSelectedJenis(e.target.value);
                setDataDinamis({});
              }}
              value={selectedJenis}
              required
            >
              <option value="">-- Pilih Jenis Surat --</option>
              {jenisSuratList.map((j) => (
                <option key={j.id_jenis} value={j.id_jenis}>
                  {j.nama_surat}
                </option>
              ))}
            </select>
          </section>

          {/* SEKSI 2: IDENTITAS */}
          <section className="pt-6 border-t border-slate-100">
            <label className="flex items-center gap-2 text-sm font-black text-slate-700 uppercase tracking-wider mb-4">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">
                2
              </span>
              Informasi Pemohon (Sesuai KTP)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <CreditCard size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="NIK (16 Digit Angka)"
                  className={`input-with-icon ${errors.nik ? "border-red-500 focus:ring-red-200" : "border-slate-200 focus:ring-blue-100"}`}
                  value={identitas.nik}
                  onChange={handleNikChange}
                />
                <span
                  className={`text-[10px] absolute right-4 top-1/2 -translate-y-1/2 font-bold ${identitas.nik.length === 16 ? "text-green-500" : "text-slate-400"}`}
                >
                  {identitas.nik.length}/16
                </span>
                {/* Peringatan Error Visual */}
                {errors.nik && (
                  <p className="text-red-500 text-xs mt-1 px-2 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.nik}
                  </p>
                )}
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap"
                  className="input-with-icon border-slate-200 focus:ring-blue-100"
                  value={identitas.nama_lengkap}
                  onChange={(e) =>
                    setIdentitas({
                      ...identitas,
                      nama_lengkap: e.target.value.toUpperCase(),
                    })
                  }
                />
              </div>

              <div className="md:col-span-2 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Phone size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Nomor WhatsApp (Aktif)"
                  className={`input-with-icon ${errors.no_hp ? "border-red-500 focus:ring-red-200" : "border-slate-200 focus:ring-blue-100"}`}
                  value={identitas.no_hp}
                  onChange={handlePhoneChange}
                />
                {errors.no_hp && (
                  <p className="text-red-500 text-xs mt-1 px-2 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.no_hp}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* SEKSI 3: DINAMIS */}
          {selectedJenis && (
            <section className="pt-6 border-t border-slate-100">
              <label className="flex items-center gap-2 text-sm font-black text-slate-700 uppercase tracking-wider mb-4">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">
                  3
                </span>
                Data Tambahan Khusus
              </label>
              {renderFormDinamis()}
            </section>
          )}

          <button
            type="submit"
            disabled={
              !selectedJenis ||
              loading ||
              identitas.nik.length !== 16 ||
              Object.values(errors).some((e) => e !== null)
            }
            className={`w-full py-5 rounded-2xl font-black text-xl shadow-2xl transition-all transform active:scale-95 flex justify-center items-center gap-3 ${
              selectedJenis &&
              !loading &&
              identitas.nik.length === 16 &&
              !Object.values(errors).some((e) => e !== null)
                ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:shadow-blue-300"
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            {loading ? (
              <RefreshCw className="animate-spin" />
            ) : (
              "KIRIM PENGAJUAN"
            )}
          </button>
        </form>

        <p className="text-center text-slate-400 text-xs mt-8 font-medium">
          Sistem Informasi Layanan Surat Elektronik v2.0 <br /> Kelurahan Amban,
          Distrik Manokwari Barat.
        </p>
      </div>

      <style jsx>{`
        .input-with-icon {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border-width: 2px;
          border-radius: 0.9rem;
          outline: none;
          transition: all 0.2s;
          font-weight: 500;
        }
        .input-with-icon:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
        .input-field {
          width: 100%;
          border: 2px solid #e2e8f0;
          padding: 0.8rem;
          border-radius: 0.75rem;
          outline: none;
          transition: all 0.2s;
          font-size: 0.95rem;
        }
        .input-field:focus {
          border-color: #3b82f6;
          background: white;
        }
      `}</style>
    </div>
  );
};

export default PengajuanSurat;
