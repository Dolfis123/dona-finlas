import React, { useState, useEffect, useRef } from "react";
import api from "../../utils/api";
import html2pdf from "html2pdf.js"; // Import library PDF
import { Download, CheckCircle, RefreshCw, AlertCircle } from "lucide-react"; // Import Icon

const PengajuanSurat = () => {
  const [jenisSuratList, setJenisSuratList] = useState([]);
  const [selectedJenis, setSelectedJenis] = useState("");
  
  // State Data Diri
  const [identitas, setIdentitas] = useState({
    nik: "", 
    nama_lengkap: "", 
    no_hp: ""
  });

  // State Data Form Tambahan
  const [dataDinamis, setDataDinamis] = useState({});
  
  // State Sukses & Loading
  const [tiketSukses, setTiketSukses] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ref untuk area tiket yang akan di-download
  const tiketRef = useRef();

  useEffect(() => {
    // 1. Ambil Jenis Surat
    api.get("/surat/master/jenis").then((res) => setJenisSuratList(res.data));

    // 2. CEK LOCAL STORAGE (Agar data tidak hilang saat refresh)
    const savedTicket = localStorage.getItem("tiket_terakhir");
    if (savedTicket) {
      setTiketSukses(savedTicket);
    }
  }, []);

  const handleDinamisChange = (e) => {
    const { name, value } = e.target;
    setDataDinamis((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        id_jenis: selectedJenis,
        nik: identitas.nik,
        nama_lengkap: identitas.nama_lengkap,
        no_hp: identitas.no_hp,
        data_form_json: dataDinamis, 
        data_berkas_json: {} 
      };

      const res = await api.post("/surat/ajukan", payload);
      
      // Simpan tiket ke state DAN LocalStorage
      const tiketBaru = res.data.ticket;
      setTiketSukses(tiketBaru);
      localStorage.setItem("tiket_terakhir", tiketBaru); // <-- KUNCI ANTI REFRESH
      
    } catch (error) {
      alert("Gagal mengirim pengajuan. Pastikan semua data terisi.");
      console.error(error);
    } finally {
        setLoading(false);
    }
  };

  // --- FUNGSI RESET (BUAT SURAT BARU) ---
  const handleReset = () => {
    // Hapus dari penyimpanan saat user ingin buat baru
    localStorage.removeItem("tiket_terakhir");
    setTiketSukses(null);
    setSelectedJenis("");
    setDataDinamis({});
    setIdentitas({ nik: "", nama_lengkap: "", no_hp: "" });
    window.scrollTo(0, 0);
  };

  // --- FUNGSI DOWNLOAD BUKTI PENDAFTARAN ---
  const handleDownloadTiket = () => {
    const element = tiketRef.current;
    const opt = {
      margin:       0,
      filename:     `TIKET_LAYANAN_${tiketSukses}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a6', orientation: 'portrait' } // Ukuran kecil (A6) seperti struk
    };
    html2pdf().set(opt).from(element).save();
  };

  // --- LOGIC RENDER FORM ---
  const renderFormDinamis = () => {
    const surat = jenisSuratList.find(j => j.id_jenis === parseInt(selectedJenis));
    if (!surat) return null;

    const namaSurat = surat.nama_surat.toUpperCase();
    const kodeSurat = surat.kode_surat ? surat.kode_surat.toUpperCase() : "";

    // 1. SKTM
    if (kodeSurat === "SKTM" || namaSurat.includes("MAMPU")) {
      return (
        <div className="space-y-4 border-l-4 border-yellow-400 pl-4 bg-yellow-50 p-4 rounded shadow-sm">
          <h3 className="font-bold text-lg text-yellow-800 border-b border-yellow-200 pb-2">A. Data Orang Tua / Wali</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input name="nama_ortu" placeholder="Nama Lengkap Orang Tua" className="input-field" onChange={handleDinamisChange} required />
            <input name="ttl_ortu" placeholder="Tempat, Tgl Lahir" className="input-field" onChange={handleDinamisChange} required />
            <select name="jk_ortu" className="input-field" onChange={handleDinamisChange} required>
              <option value="">-- Jenis Kelamin Ortu --</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
            <input name="umur_ortu" type="number" placeholder="Umur (Tahun)" className="input-field" onChange={handleDinamisChange} required />
            <input name="pekerjaan_ortu" placeholder="Pekerjaan Orang Tua" className="input-field" onChange={handleDinamisChange} required />
            <input name="penghasilan_ortu" type="number" placeholder="Penghasilan (Angka)" className="input-field" onChange={handleDinamisChange} required />
          </div>
          <textarea name="alamat_ortu" placeholder="Alamat Lengkap Orang Tua" className="input-field" rows="2" onChange={handleDinamisChange} required ></textarea>

          <h3 className="font-bold text-lg text-yellow-800 border-b border-yellow-200 pb-2 mt-4">B. Data Mahasiswa</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input name="nim" placeholder="NIM" className="input-field" onChange={handleDinamisChange} required />
            <input name="kampus" placeholder="Nama Kampus" className="input-field" onChange={handleDinamisChange} required />
            <input name="fakultas" placeholder="Fakultas" className="input-field" onChange={handleDinamisChange} required />
            <input name="prodi" placeholder="Program Studi" className="input-field" onChange={handleDinamisChange} required />
            <input name="keperluan" placeholder="Keperluan" className="input-field md:col-span-2" onChange={handleDinamisChange} required />
          </div>
        </div>
      );
    } 
    
    // 2. DOMISILI
    if (kodeSurat === "DOM" || namaSurat.includes("DOMISILI")) {
      return (
        <div className="space-y-4 border-l-4 border-blue-400 pl-4 bg-blue-50 p-4 rounded shadow-sm">
          <h3 className="font-bold text-lg text-blue-800 border-b border-blue-200 pb-2">Detail Data Domisili</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input name="ttl" placeholder="Tempat, Tgl Lahir" className="input-field" onChange={handleDinamisChange} required />
            <select name="jk" className="input-field" onChange={handleDinamisChange} required>
              <option value="">-- Jenis Kelamin --</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
            <select name="agama" className="input-field" onChange={handleDinamisChange} required>
              <option value="">-- Pilih Agama --</option>
              <option value="Kristen Protestan">Kristen Protestan</option>
              <option value="Kristen Katolik">Kristen Katolik</option>
              <option value="Islam">Islam</option>
              <option value="Hindu">Hindu</option>
              <option value="Buddha">Buddha</option>
              <option value="Konghucu">Konghucu</option>
            </select>
            <input name="pekerjaan" placeholder="Pekerjaan Saat Ini" className="input-field" onChange={handleDinamisChange} required />
            <input name="rt_rw" placeholder="RT / RW" className="input-field" onChange={handleDinamisChange} required />
          </div>
          <textarea name="alamat_asal" placeholder="Alamat Lengkap" className="input-field" rows="2" onChange={handleDinamisChange} required ></textarea>
          <input name="keperluan" placeholder="Keperluan" className="input-field w-full" onChange={handleDinamisChange} required />
        </div>
      );
    }

    // 3. OAP
    if (kodeSurat.includes("OAP") || namaSurat.includes("PAPUA")) {
        return (
          <div className="space-y-4 border-l-4 border-green-500 pl-4 bg-green-50 p-4 rounded shadow-sm">
            <h3 className="font-bold text-lg text-green-800 border-b border-green-200 pb-2">A. Data Pribadi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input name="ttl" placeholder="Tempat, Tgl Lahir" className="input-field" onChange={handleDinamisChange} required />
                <select name="jk" className="input-field" onChange={handleDinamisChange} required>
                    <option value="">-- Jenis Kelamin --</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                </select>
                <select name="agama" className="input-field" onChange={handleDinamisChange} required>
                    <option value="">-- Pilih Agama --</option>
                    <option value="Kristen Protestan">Kristen Protestan</option>
                    <option value="Kristen Katolik">Kristen Katolik</option>
                    <option value="Islam">Islam</option>
                </select>
                <input name="pekerjaan" placeholder="Pekerjaan" className="input-field" onChange={handleDinamisChange} required />
                <input name="alamat_asal" placeholder="Alamat Sesuai KTP" className="input-field" onChange={handleDinamisChange} required />
                <input name="rt_rw" placeholder="RT / RW" className="input-field" onChange={handleDinamisChange} required />
            </div>
  
            <h3 className="font-bold text-lg text-green-800 border-b border-green-200 pb-2 mt-4">B. Data Ayah</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input name="nama_ayah" placeholder="Nama Lengkap Ayah" className="input-field" onChange={handleDinamisChange} required />
                <input name="ttl_ayah" placeholder="Tempat, Tgl Lahir Ayah" className="input-field" onChange={handleDinamisChange} required />
                <input name="nik_ayah" placeholder="NIK Ayah" className="input-field" onChange={handleDinamisChange} required />
                <input name="pekerjaan_ayah" placeholder="Pekerjaan Ayah" className="input-field" onChange={handleDinamisChange} required />
                <input name="alamat_ayah" placeholder="Alamat Ayah" className="input-field md:col-span-2" onChange={handleDinamisChange} required />
            </div>

            <h3 className="font-bold text-lg text-green-800 border-b border-green-200 pb-2 mt-4">C. Data Ibu</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input name="nama_ibu" placeholder="Nama Lengkap Ibu" className="input-field" onChange={handleDinamisChange} required />
                <input name="ttl_ibu" placeholder="Tempat, Tgl Lahir Ibu" className="input-field" onChange={handleDinamisChange} required />
                <input name="nik_ibu" placeholder="NIK Ibu" className="input-field" onChange={handleDinamisChange} required />
                <input name="pekerjaan_ibu" placeholder="Pekerjaan Ibu" className="input-field" onChange={handleDinamisChange} required />
                <input name="alamat_ibu" placeholder="Alamat Ibu" className="input-field md:col-span-2" onChange={handleDinamisChange} required />
            </div>
          </div>
        );
      }

    return <div className="text-gray-500 italic p-4 bg-gray-50 rounded">Formulir khusus belum tersedia.</div>;
  };

  // --- TAMPILAN SUKSES (DENGAN DOWNLOAD) ---
  if (tiketSukses) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-10">
        
        {/* CARD BUKTI PENDAFTARAN (UNTUK DITAMPILKAN DAN DIDOWNLOAD) */}
        <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full border-t-8 border-blue-600">
          
          {/* AREA INI YANG AKAN DI-PRINT KE PDF */}
          <div ref={tiketRef} className="p-4 border-2 border-dashed border-gray-200 rounded mb-4 bg-blue-50">
            <div className="flex justify-center mb-2">
                <CheckCircle className="text-green-500 w-12 h-12" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 uppercase">Bukti Pendaftaran</h2>
            <p className="text-xs text-gray-500 mb-4">Kelurahan Amban - Layanan Surat Online</p>
            
            <div className="text-left bg-white p-3 rounded shadow-sm mb-4">
                <p className="text-xs text-gray-500">Kode Tiket:</p>
                <p className="text-2xl font-mono font-bold text-blue-600 tracking-wider mb-2">{tiketSukses}</p>
                <hr className="my-2"/>
                <p className="text-xs text-gray-500">Status:</p>
                <p className="font-bold text-yellow-600 text-sm">PENDING (Menunggu Validasi)</p>
                <p className="text-xs text-gray-500 mt-2">Tanggal:</p>
                <p className="font-bold text-gray-700 text-sm">{new Date().toLocaleDateString('id-ID')}</p>
            </div>

            <div className="text-xs text-gray-600 text-center italic">
              *Simpan bukti ini untuk pengambilan surat di kantor kelurahan.
            </div>
          </div>
          {/* AKHIR AREA PRINT */}

          <div className="flex flex-col gap-3">
             <button 
                onClick={handleDownloadTiket}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold shadow-md"
              >
                <Download size={20} /> Simpan Bukti (PDF)
              </button>

              <button 
                onClick={handleReset} 
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                <RefreshCw size={18} /> Buat Surat Baru
              </button>
          </div>

          <div className="mt-6 flex items-start gap-2 text-xs text-left text-gray-500 bg-yellow-50 p-3 rounded border border-yellow-200">
            <AlertCircle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
            <p>
                <strong>Catatan:</strong> Jika halaman ini tertutup atau di-refresh, tiket Anda tetap tersimpan di browser ini sampai Anda menekan tombol "Buat Surat Baru".
            </p>
          </div>

        </div>
      </div>
    );
  }

  // --- TAMPILAN UTAMA (FORM) ---
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Layanan Surat Online</h1>
        <p className="text-gray-500 mt-2">Kelurahan Amban - Cepat, Mudah, Transparan.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-6 md:p-8 space-y-6 border border-gray-100">
        
        {/* PILIH SURAT */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <label className="block text-sm font-bold text-blue-800 mb-2">Pilih Jenis Layanan</label>
          <select 
            className="w-full border border-blue-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            onChange={(e) => {
              setSelectedJenis(e.target.value);
              setDataDinamis({}); 
            }}
            value={selectedJenis}
            required
          >
            <option value="">-- Klik untuk memilih --</option>
            {jenisSuratList.map((j) => (
              <option key={j.id_jenis} value={j.id_jenis}>{j.nama_surat}</option>
            ))}
          </select>
        </div>

        {/* DATA PEMOHON */}
        <div>
          <h3 className="text-lg font-bold text-gray-700 border-b pb-2 mb-4">Data Pemohon</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NIK Pemohon</label>
              <input 
                required
                placeholder="16 Digit Angka"
                className="input-field" 
                value={identitas.nik}
                onChange={(e) => setIdentitas({...identitas, nik: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input 
                required
                placeholder="Sesuai KTP"
                className="input-field" 
                value={identitas.nama_lengkap}
                onChange={(e) => setIdentitas({...identitas, nama_lengkap: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp (Aktif)</label>
              <input 
                required
                type="number"
                placeholder="Contoh: 08123456789"
                className="input-field" 
                value={identitas.no_hp}
                onChange={(e) => setIdentitas({...identitas, no_hp: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* FORM DINAMIS */}
        {renderFormDinamis()}

        <button 
          type="submit" 
          disabled={!selectedJenis || loading}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition transform hover:-translate-y-1 ${
            selectedJenis && !loading
            ? "bg-blue-600 text-white hover:bg-blue-700" 
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {loading ? "Sedang Mengirim..." : "KIRIM PENGAJUAN SEKARANG"}
        </button>
      </form>
      
      <style jsx>{`
        .input-field {
            width: 100%;
            border: 1px solid #e2e8f0;
            padding: 0.75rem;
            border-radius: 0.5rem;
            transition: all 0.2s;
        }
        .input-field:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }
      `}</style>
    </div>
  );
};

export default PengajuanSurat;