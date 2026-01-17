
import React, { useState, useEffect } from 'react';
import { FileText, Plus, Edit, Trash2, List, X, Save } from 'lucide-react';

const JenisSuratAdmin = () => {
    // --- STATE UTAMA ---
    const [jenisSuratList, setJenisSuratList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // --- STATE MODAL UTAMA (JENIS SURAT) ---
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ id: '', kode_surat: '', nama_surat: '', status_aktif: 'Y' });

    // --- STATE MODAL SYARAT (Persyaratan Dokumen) ---
    const [showSyaratModal, setShowSyaratModal] = useState(false);
    const [selectedSurat, setSelectedSurat] = useState(null); // Surat yang sedang diedit syaratnya
    const [newSyarat, setNewSyarat] = useState({ nama_dokumen: '', wajib: 'Y' });

    // URL API

 const API_URL = `${import.meta.env.VITE_BACKEND_URL}/surat/master/jenis`; 
    // --- 1. FETCH DATA UTAMA ---
    const fetchJenisSurat = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/jenis`);
            const data = await response.json();
            setJenisSuratList(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error:", error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchJenisSurat();
    }, []);

    // --- 2. HANDLERS JENIS SURAT (CRUD UTAMA) ---
    const handleOpenModal = (item = null) => {
        if (item) {
            setIsEditing(true);
            setFormData({ id: item.id, kode_surat: item.kode_surat, nama_surat: item.nama_surat, status_aktif: item.status_aktif || 'Y' });
        } else {
            setIsEditing(false);
            setFormData({ id: '', kode_surat: '', nama_surat: '', status_aktif: 'Y' });
        }
        setShowModal(true);
    };

    const handleMainSubmit = async (e) => {
        e.preventDefault();
        const url = isEditing ? `${API_URL}/jenis/${formData.id}` : `${API_URL}/jenis`;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            fetchJenisSurat();
            setShowModal(false);
        } catch (error) {
            alert("Gagal menyimpan data.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Hapus jenis surat ini?")) {
            await fetch(`${API_URL}/jenis/${id}`, { method: 'DELETE' });
            fetchJenisSurat();
        }
    };

    // --- 3. HANDLERS SYARAT (SUB-DATA) ---
    
    // Buka Modal Kelola Syarat
    const openSyaratModal = (surat) => {
        setSelectedSurat(surat); // Simpan surat yang dipilih ke state
        setNewSyarat({ nama_dokumen: '', wajib: 'Y' }); // Reset form input syarat
        setShowSyaratModal(true);
    };

    // Tambah Syarat Baru
    const handleAddSyarat = async (e) => {
        e.preventDefault();
        if(!newSyarat.nama_dokumen) return;

        try {
            const response = await fetch(`${API_URL}/syarat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_jenis: selectedSurat.id, // ID Surat yg sedang dibuka
                    nama_dokumen: newSyarat.nama_dokumen,
                    wajib: newSyarat.wajib
                })
            });

            if (response.ok) {
                // Refresh data agar syarat baru muncul
                await fetchJenisSurat(); 
                
                // Update tampilan modal secara manual agar langsung terlihat tanpa tutup modal
                // Kita cari data surat terbaru dari server, lalu update selectedSurat
                const resBaru = await fetch(`${API_URL}/jenis`);
                const dataBaru = await resBaru.json();
                const suratTerupdate = dataBaru.find(s => s.id === selectedSurat.id);
                setSelectedSurat(suratTerupdate);
                
                // Reset input
                setNewSyarat({ nama_dokumen: '', wajib: 'Y' });
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Hapus Syarat
    const handleDeleteSyarat = async (id_syarat) => {
        if(!window.confirm("Hapus syarat ini?")) return;

        try {
            const response = await fetch(`${API_URL}/syarat/${id_syarat}`, { method: 'DELETE' });
            if (response.ok) {
                // Refresh data
                await fetchJenisSurat();
                
                // Update tampilan modal
                const resBaru = await fetch(`${API_URL}/jenis`);
                const dataBaru = await resBaru.json();
                const suratTerupdate = dataBaru.find(s => s.id === selectedSurat.id);
                setSelectedSurat(suratTerupdate);
            }
        } catch (error) {
            alert("Gagal menghapus syarat.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                            <FileText className="text-blue-600" /> Master Jenis Surat
                        </h1>
                        <p className="text-gray-500 mt-1">Kelola template & syarat dokumen surat</p>
                    </div>
                    <button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg flex items-center gap-2 shadow-md">
                        <Plus size={20} /> Buat Jenis Baru
                    </button>
                </div>

                {/* Tabel Data */}
                <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
                            <tr>
                                <th className="py-4 px-6 w-16">No</th>
                                <th className="py-4 px-6">Kode</th>
                                <th className="py-4 px-6">Nama Surat</th>
                                <th className="py-4 px-6">Syarat Dokumen</th>
                                <th className="py-4 px-6 text-center">Status</th>
                                <th className="py-4 px-6 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm">
                            {isLoading ? (
                                <tr><td colSpan="6" className="py-8 text-center">Memuat...</td></tr>
                            ) : jenisSuratList.map((item, index) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                    <td className="py-4 px-6">{index + 1}</td>
                                    <td className="py-4 px-6 font-mono font-bold text-blue-600">{item.kode_surat}</td>
                                    <td className="py-4 px-6 font-medium text-gray-800">{item.nama_surat}</td>
                                    <td className="py-4 px-6">
                                        {/* Tampilan Syarat Mini */}
                                        {item.syarat && item.syarat.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {item.syarat.map((s, idx) => (
                                                    <span key={idx} className="bg-gray-100 border px-2 py-1 rounded text-xs">
                                                        {s.nama_dokumen} {s.wajib === 'Y' && <span className="text-red-500">*</span>}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-xs italic">Belum ada syarat</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status_aktif === 'Y' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {item.status_aktif === 'Y' ? 'Aktif' : 'Non-Aktif'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <div className="flex justify-center gap-2">
                                            {/* TOMBOL KELOLA SYARAT */}
                                            <button onClick={() => openSyaratModal(item)} className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200" title="Kelola Syarat">
                                                <List size={16} />
                                            </button>
                                            
                                            <button onClick={() => handleOpenModal(item)} className="p-2 bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200" title="Edit Info">
                                                <Edit size={16} />
                                            </button>
                                            
                                            <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200" title="Hapus">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* --- MODAL 1: FORM JENIS SURAT (Tambah/Edit Nama Surat) --- */}
                {showModal && (
                    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Surat' : 'Surat Baru'}</h2>
                            <form onSubmit={handleMainSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-700">Kode</label>
                                    <input type="text" value={formData.kode_surat} onChange={e => setFormData({...formData, kode_surat: e.target.value})} className="w-full border rounded p-2 uppercase" required />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-700">Nama Surat</label>
                                    <input type="text" value={formData.nama_surat} onChange={e => setFormData({...formData, nama_surat: e.target.value})} className="w-full border rounded p-2" required />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-700">Status</label>
                                    <select value={formData.status_aktif} onChange={e => setFormData({...formData, status_aktif: e.target.value})} className="w-full border rounded p-2">
                                        <option value="Y">Aktif</option>
                                        <option value="T">Non-Aktif</option>
                                    </select>
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
                                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Simpan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* --- MODAL 2: KELOLA SYARAT (Tambah/Hapus Syarat) --- */}
                {showSyaratModal && selectedSurat && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                            <div className="bg-purple-600 p-4 text-white flex justify-between items-center">
                                <h3 className="font-bold">Syarat Dokumen: {selectedSurat.nama_surat}</h3>
                                <button onClick={() => setShowSyaratModal(false)}><X size={20} /></button>
                            </div>
                            
                            <div className="p-6">
                                {/* Form Tambah Syarat Kecil */}
                                <form onSubmit={handleAddSyarat} className="flex gap-2 mb-6 items-end bg-gray-50 p-3 rounded-lg border">
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-gray-500">Nama Dokumen</label>
                                        <input 
                                            type="text" 
                                            placeholder="Contoh: Fotocopy KTP" 
                                            className="w-full border p-2 rounded text-sm"
                                            value={newSyarat.nama_dokumen}
                                            onChange={e => setNewSyarat({...newSyarat, nama_dokumen: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="w-24">
                                        <label className="text-xs font-bold text-gray-500">Wajib?</label>
                                        <select 
                                            className="w-full border p-2 rounded text-sm"
                                            value={newSyarat.wajib}
                                            onChange={e => setNewSyarat({...newSyarat, wajib: e.target.value})}
                                        >
                                            <option value="Y">Ya</option>
                                            <option value="T">Tidak</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded shadow">
                                        <Plus size={20} />
                                    </button>
                                </form>

                                {/* List Syarat yang Sudah Ada */}
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    <h4 className="text-sm font-bold text-gray-700 mb-2">Daftar Syarat Saat Ini:</h4>
                                    
                                    {selectedSurat.syarat && selectedSurat.syarat.length > 0 ? (
                                        selectedSurat.syarat.map((s) => (
                                            <div key={s.id} className="flex justify-between items-center bg-white border p-3 rounded-lg shadow-sm">
                                                <div className="flex items-center gap-2">
                                                    <FileText size={16} className="text-gray-400" />
                                                    <span className="text-sm font-medium">{s.nama_dokumen}</span>
                                                    {s.wajib === 'Y' && <span className="bg-red-100 text-red-600 text-[10px] px-2 rounded-full font-bold">Wajib</span>}
                                                </div>
                                                <button 
                                                    onClick={() => handleDeleteSyarat(s.id)}
                                                    className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-400 text-sm py-4">Belum ada syarat yang ditambahkan.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default JenisSuratAdmin;