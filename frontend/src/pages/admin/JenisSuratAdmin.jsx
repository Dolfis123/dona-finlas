import React, { useState, useEffect } from 'react';
import { FileText, Plus, Edit, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

const JenisSuratAdmin = () => {
    // --- STATE MANAGEMENT ---
    const [jenisSuratList, setJenisSuratList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Modal & Form State
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        kode_surat: '',
        nama_surat: '',
        status_aktif: 'Y'
    });

    // URL API (Sesuaikan dengan route backend Anda)
    // Asumsi: Anda meletakkan routes surat di /api/surat/jenis
    const API_URL = `${import.meta.env.VITE_BACKEND_URL}/surat/master/jenis`; 

    // --- 1. FETCH DATA (READ) ---
    const fetchJenisSurat = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            
            console.log("Data Jenis Surat:", data); // Debugging
            setJenisSuratList(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Gagal mengambil data jenis surat.");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchJenisSurat();
    }, []);

    // --- 2. HANDLERS ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleOpenModal = (item = null) => {
        if (item) {
            // Mode Edit
            setIsEditing(true);
            setFormData({
                id: item.id,
                kode_surat: item.kode_surat,
                nama_surat: item.nama_surat,
                status_aktif: item.status_aktif || 'Y'
            });
        } else {
            // Mode Tambah
            setIsEditing(false);
            setFormData({ id: '', kode_surat: '', nama_surat: '', status_aktif: 'Y' });
        }
        setShowModal(true);
    };

    // --- 3. SUBMIT (CREATE / UPDATE) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Tentukan URL dan Method
        // Jika backend Anda pakai params ID: /api/surat/jenis/:id
        const url = isEditing ? `${API_URL}/${formData.id}` : API_URL;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                alert(isEditing ? "Jenis Surat berhasil diperbarui!" : "Jenis Surat berhasil dibuat!");
                fetchJenisSurat(); // Refresh Tabel
                setShowModal(false);
            } else {
                console.error("Error Backend:", result);
                alert("Gagal: " + (result.message || "Terjadi kesalahan"));
            }
        } catch (error) {
            console.error(error);
            alert("Error koneksi ke server.");
        }
    };

    // --- 4. DELETE ---
    const handleDelete = async (id) => {
        if (window.confirm("Yakin ingin menghapus jenis surat ini? Data syarat terkait mungkin juga akan hilang.")) {
            try {
                const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    alert("Berhasil dihapus.");
                    fetchJenisSurat();
                } else {
                    alert("Gagal menghapus.");
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                            <FileText className="text-blue-600" />
                            Master Jenis Surat
                        </h1>
                        <p className="text-gray-500 mt-1">Kelola template surat yang tersedia di kelurahan</p>
                    </div>
                    <button 
                        onClick={() => handleOpenModal()}
                        className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Buat Jenis Baru
                    </button>
                </div>

                {/* Tabel */}
                <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                <tr>
                                    <th className="py-4 px-6 font-semibold w-16">No</th>
                                    <th className="py-4 px-6 font-semibold w-32">Kode</th>
                                    <th className="py-4 px-6 font-semibold">Nama Surat</th>
                                    <th className="py-4 px-6 font-semibold">Syarat Dokumen</th>
                                    <th className="py-4 px-6 font-semibold text-center w-32">Status</th>
                                    <th className="py-4 px-6 font-semibold text-center w-40">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {isLoading ? (
                                    <tr><td colSpan="6" className="py-8 text-center text-gray-400">Sedang memuat data...</td></tr>
                                ) : jenisSuratList.length > 0 ? (
                                    jenisSuratList.map((item, index) => (
                                        <tr key={item.id || index} className="border-b border-gray-200 hover:bg-gray-50 transition">
                                            <td className="py-4 px-6">{index + 1}</td>
                                            <td className="py-4 px-6 font-mono font-bold text-blue-600 bg-blue-50 rounded text-center">
                                                {item.kode_surat}
                                            </td>
                                            <td className="py-4 px-6 font-medium text-gray-800 text-base">
                                                {item.nama_surat}
                                            </td>
                                            <td className="py-4 px-6">
                                                {/* Menampilkan Syarat jika ada (Relasi Backend) */}
                                                {item.syarat && item.syarat.length > 0 ? (
                                                    <ul className="list-disc list-inside text-gray-500 space-y-1">
                                                        {item.syarat.map((syarat, idx) => (
                                                            <li key={idx}>
                                                                {syarat.nama_dokumen} 
                                                                {syarat.wajib === 'Y' && <span className="text-red-500 text-xs ml-1">(Wajib)</span>}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <span className="text-gray-400 italic text-xs flex items-center gap-1">
                                                        <AlertCircle size={12} /> Belum ada syarat
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                 {item.status_aktif === 'Y' ? (
                                                    <span className="bg-green-100 text-green-700 py-1 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-1 w-fit mx-auto">
                                                        <CheckCircle size={12} /> Aktif
                                                    </span>
                                                ) : (
                                                    <span className="bg-red-100 text-red-700 py-1 px-3 rounded-full text-xs font-bold w-fit mx-auto">
                                                        Non-Aktif
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <div className="flex item-center justify-center gap-2">
                                                    <button 
                                                        onClick={() => handleOpenModal(item)}
                                                        className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition"
                                                        title="Edit"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="6" className="py-8 text-center text-gray-500">Belum ada data jenis surat.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- MODAL FORM --- */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all scale-100 p-6 relative">
                            
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {isEditing ? 'Edit Jenis Surat' : 'Tambah Jenis Surat Baru'}
                                </h2>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                    X
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kode Surat</label>
                                    <input 
                                        type="text" 
                                        name="kode_surat"
                                        value={formData.kode_surat}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                                        placeholder="Contoh: 470 (SKTM)"
                                        required 
                                    />
                                    <small className="text-gray-400">Kode klasifikasi arsip (Nomor Surat)</small>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Surat</label>
                                    <input 
                                        type="text" 
                                        name="nama_surat"
                                        value={formData.nama_surat}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Contoh: Surat Keterangan Tidak Mampu"
                                        required 
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select 
                                        name="status_aktif"
                                        value={formData.status_aktif}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        <option value="Y">Aktif (Bisa Diajukan)</option>
                                        <option value="T">Tidak Aktif</option>
                                    </select>
                                </div>

                                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JenisSuratAdmin;