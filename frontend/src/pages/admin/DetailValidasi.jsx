import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { ArrowLeft, Save, CheckCircle, Printer, X, Pencil, AlertCircle } from "lucide-react";

const DetailValidasi = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // --- STATE UNTUK ERROR HANDLING ---
  const [errors, setErrors] = useState({});

  // State untuk Finalisasi
  const [pegawaiList, setPegawaiList] = useState([]);
  const [showFinalModal, setShowFinalModal] = useState(false);
  const [finalData, setFinalData] = useState({
    no_surat_manual: "",
    id_pegawai_ttd: "",
    tgl_surat: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchDetail();
    fetchPegawai();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const res = await api.get(`/surat/pengajuan/${id}`);
      setData(res.data);
    } catch (error) {
      alert("Gagal memuat data");
      navigate("/admin/validasi-surat");
    } finally {
      setLoading(false);
    }
  };

  const fetchPegawai = async () => {
    const res = await api.get("/surat/master/pegawai");
    setPegawaiList(res.data);
  };

  // --- LOGIC EDIT DATA (SMART VALIDATION) ---
  const handleInputChange = (e, parentField = null) => {
    let { name, value } = e.target;
    let newErrors = { ...errors };

    // 1. SMART VALIDATION UNTUK INPUT NIK
    // Cek apakah nama field adalah 'nik' atau mengandung kata 'nik' (untuk data JSON)
    if (name.toLowerCase().includes("nik")) {
      // Hapus semua karakter selain angka
      value = value.replace(/\D/g, "");
      // Batasi maksimal 16 digit
      if (value.length > 16) value = value.slice(0, 16);
      
      // Beri error jika tidak tepat 16 digit
      if (value.length > 0 && value.length < 16) {
        newErrors[name] = "NIK wajib 16 digit angka!";
      } else {
        delete newErrors[name];
      }
    }

    // 2. SMART VALIDATION UNTUK NAMA (Auto Uppercase standar dokumen resmi)
    if (name.toLowerCase().includes("nama")) {
      value = value.toUpperCase();
    }

    setErrors(newErrors);

    if (parentField === "json") {
      setData((prev) => ({
        ...prev,
        data_form_json: {
          ...prev.data_form_json,
          [name]: value,
        },
      }));
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveEdit = async () => {
    // Trim spaces sebelum disimpan (Mencegah spasi berlebih di awal/akhir)
    const payload = {
      nik: data.nik?.trim(),
      nama_lengkap: data.nama_lengkap?.trim(),
      data_form_json: data.data_form_json,
    };

    try {
      await api.put(`/surat/update/${id}`, payload);
      alert("Perubahan berhasil disimpan!");
      setIsEditing(false);
    } catch (error) {
      alert("Gagal menyimpan perubahan");
    }
  };

  // --- Pengecekan Apakah Form Valid (Untuk Disable Tombol Simpan) ---
  const isFormValid = 
    Object.keys(errors).length === 0 && // Tidak ada error
    data?.nik?.length === 16 &&         // NIK utama harus 16 digit
    data?.nama_lengkap?.trim() !== "";  // Nama tidak boleh kosong

  // --- LOGIC FINALISASI ---
  const handleFinalize = async (e) => {
    e.preventDefault();
    if (!confirm("Data sudah benar? Lanjutkan arsip?")) return;

    try {
      const payload = {
        id_pengajuan: id,
        ...finalData
      };
      
      const res = await api.post("/surat/finalize", payload);
      alert("Sukses! Surat diterbitkan.");
      
      const idArsip = res.data.data_arsip.id_arsip;
      const jenis = data.detail_jenis?.nama_surat?.toUpperCase() || "";
      let urlCetak = `/cetak/sktm/${idArsip}`;
      if (jenis.includes("DOMISILI")) urlCetak = `/cetak/domisili/${idArsip}`;
      if (jenis.includes("PAPUA")) urlCetak = `/cetak/oap/${idArsip}`;

      window.open(urlCetak, "_blank");
      navigate("/admin/validasi-surat");

    } catch (error) {
      alert(error.response?.data?.message || "Gagal memproses");
    }
  };

  if (loading) return <div className="p-8 text-center">Memuat data...</div>;
  if (!data) return <div className="p-8 text-center">Data tidak ditemukan</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate("/admin/validasi-surat")} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft size={20} /> Kembali
        </button>
        <div className="text-right">
            <h1 className="text-2xl font-bold text-gray-800">Detail Pengajuan</h1>
            <p className="text-sm text-blue-600 font-mono font-bold">{data.kode_tiket}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KOLOM KIRI: FORM DATA */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-lg font-bold text-gray-700">Data Surat ({data.detail_jenis?.nama_surat})</h2>
                {!isEditing ? (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-1 text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded hover:bg-yellow-200 transition"
                    >
                        <Pencil size={14}/> Edit Data
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button onClick={() => setIsEditing(false)} className="text-sm text-gray-500 hover:text-gray-700">Batal</button>
                        <button 
                            onClick={handleSaveEdit} 
                            disabled={!isFormValid} // Tombol mati jika tidak valid
                            className={`flex items-center gap-1 text-sm px-3 py-1 rounded transition ${
                              isFormValid ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                            <Save size={14}/> Simpan
                        </button>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                {/* DATA UTAMA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase">NIK</label>
                        {isEditing ? (
                            <div>
                              <input 
                                name="nik" 
                                value={data.nik} 
                                onChange={handleInputChange} 
                                className={`w-full border p-2 rounded focus:outline-none focus:ring-2 ${errors.nik ? "border-red-500 focus:ring-red-200" : "focus:ring-blue-200"}`} 
                                placeholder="Masukkan 16 digit NIK"
                              />
                              {/* Pesan Error Muncul di bawah input */}
                              {errors.nik && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.nik}</p>}
                              <p className="text-gray-400 text-xs mt-1 text-right">{data.nik?.length || 0}/16</p>
                            </div>
                        ) : (
                            <div className="text-gray-800 font-medium">{data.nik}</div>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase">Nama Lengkap</label>
                        {isEditing ? (
                            <input 
                              name="nama_lengkap" 
                              value={data.nama_lengkap} 
                              onChange={handleInputChange} 
                              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-200" 
                            />
                        ) : (
                            <div className="text-gray-800 font-medium">{data.nama_lengkap}</div>
                        )}
                    </div>
                </div>

                <hr className="my-2"/>

                {/* DATA DINAMIS (JSON) */}
                <div className="space-y-3">
                    <p className="text-sm font-bold text-blue-800 bg-blue-50 p-2 rounded">Isi Formulir Surat:</p>
                    
                    {Object.keys(data.data_form_json).map((key) => (
                        <div key={key}>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                {key.replace(/_/g, " ")} 
                            </label>
                            {isEditing ? (
                                <div>
                                  <input 
                                      name={key} 
                                      value={data.data_form_json[key]} 
                                      onChange={(e) => handleInputChange(e, "json")} 
                                      className={`w-full border p-2 rounded focus:outline-none focus:ring-2 bg-gray-50 ${errors[key] ? "border-red-500 focus:ring-red-200" : "focus:ring-blue-200"}`} 
                                  />
                                  {errors[key] && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors[key]}</p>}
                                </div>
                            ) : (
                                <div className="p-2 bg-gray-50 rounded border border-gray-100 text-gray-800">
                                    {data.data_form_json[key]}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* KOLOM KANAN: AKSI */}
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6 border-t-4 border-green-500">
                <h3 className="font-bold text-gray-800 mb-2">Tindakan</h3>
                <p className="text-sm text-gray-500 mb-4">Jika data di sebelah kiri sudah valid, silakan proses surat ini.</p>
                
                {/* Tombol Terbitkan dimatikan jika Admin sedang dalam mode Edit tapi belum disimpan */}
                <button 
                    onClick={() => setShowFinalModal(true)}
                    disabled={isEditing}
                    className={`w-full py-3 text-white rounded-lg font-bold flex justify-center items-center gap-2 shadow-lg transition ${
                      isEditing ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 transform hover:-translate-y-1"
                    }`}
                >
                    <CheckCircle size={20} /> {isEditing ? "Simpan Perubahan Dulu" : "Validasi & Terbitkan"}
                </button>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="font-bold text-gray-800 mb-2 text-sm">Info Pengajuan</h3>
                <ul className="text-sm text-gray-500 space-y-2">
                    <li className="flex justify-between">
                        <span>Tanggal Masuk:</span>
                        <span className="font-medium">{new Date(data.created_at).toLocaleDateString('id-ID')}</span>
                    </li>
                    <li className="flex justify-between">
                        <span>No. HP:</span>
                        <span className="font-medium">{data.no_hp}</span>
                    </li>
                </ul>
            </div>
        </div>
      </div>

      {/* --- MODAL FINALISASI --- */}
      {showFinalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in-down">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h3 className="text-lg font-bold text-gray-800">Finalisasi Surat</h3>
                    <button onClick={() => setShowFinalModal(false)} className="text-gray-400 hover:text-red-500 transition"><X/></button>
                </div>
                
                <form onSubmit={handleFinalize} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nomor Surat (Manual)</label>
                        {/* Contoh penggunaan uppercase otomatis pada Nomor Surat agar rapi */}
                        <input 
                            required 
                            placeholder="Contoh: 470 / 021 / 2026"
                            className="w-full border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-500 uppercase"
                            value={finalData.no_surat_manual}
                            onChange={(e) => setFinalData({...finalData, no_surat_manual: e.target.value.toUpperCase()})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tanggal Surat</label>
                        <input 
                            type="date"
                            required 
                            className="w-full border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={finalData.tgl_surat}
                            onChange={(e) => setFinalData({...finalData, tgl_surat: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Pejabat Penandatangan</label>
                        <select 
                            required 
                            className="w-full border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={finalData.id_pegawai_ttd}
                            onChange={(e) => setFinalData({...finalData, id_pegawai_ttd: e.target.value})}
                        >
                            <option value="">-- Pilih Pejabat --</option>
                            {pegawaiList.map(p => (
                                <option key={p.id_pegawai} value={p.id_pegawai}>{p.nama_lengkap} ({p.jabatan})</option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 mt-4 transition">
                        Simpan & Cetak
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default DetailValidasi;