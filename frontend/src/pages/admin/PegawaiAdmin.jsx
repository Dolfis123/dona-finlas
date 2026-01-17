// import React, { useState, useEffect } from 'react';

// const PegawaiAdmin = () => {
//     // --- STATE & LOGIC (Sama seperti sebelumnya) ---
//     const [pegawaiList, setPegawaiList] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [showModal, setShowModal] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);
//     const [formData, setFormData] = useState({
//         id: '',
//         nip: '',
//         nama_lengkap: '',
//         jabatan: '',
//         status_aktif: 'Y'
//     });

//     const API_URL = 'http://localhost:8000/api/pegawai'; // Sesuaikan Port Backend

//     // Fetch Data
//     const fetchPegawai = async () => {
//         setIsLoading(true);
//         try {
//             const response = await fetch(API_URL);
//             const data = await response.json();
//             setPegawaiList(Array.isArray(data) ? data : []);
//         } catch (error) {
//             console.error("Error:", error);
//         }
//         setIsLoading(false);
//     };

//     useEffect(() => {
//         fetchPegawai();
//     }, []);

//     // Handlers
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleOpenModal = (pegawai = null) => {
//         if (pegawai) {
//             setIsEditing(true);
//             setFormData({ ...pegawai });
//         } else {
//             setIsEditing(false);
//             setFormData({ id: '', nip: '', nama_lengkap: '', jabatan: '', status_aktif: 'Y' });
//         }
//         setShowModal(true);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const url = isEditing ? `${API_URL}/${formData.id}` : API_URL;
//         const method = isEditing ? 'PUT' : 'POST';

//         try {
//             const response = await fetch(url, {
//                 method: method,
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(formData)
//             });

//             if (response.ok) {
//                 alert(isEditing ? "Berhasil diperbarui!" : "Berhasil ditambahkan!");
//                 fetchPegawai();
//                 setShowModal(false);
//             } else {
//                 alert("Gagal menyimpan data.");
//             }
//         } catch (error) {
//             alert("Error server.");
//         }
//     };

//     const handleDelete = async (id) => {
//         if (window.confirm("Hapus pegawai ini?")) {
//             try {
//                 const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
//                 if (response.ok) fetchPegawai();
//             } catch (error) {
//                 console.error(error);
//             }
//         }
//     };

//     // --- TAMPILAN TAILWIND CSS ---
//     return (
//         <div className="min-h-screen bg-gray-50 p-8">
//             <div className="max-w-6xl mx-auto">
                
//                 {/* Header Section */}
//                 <div className="flex flex-col md:flex-row justify-between items-center mb-6">
//                     <div>
//                         <h1 className="text-3xl font-bold text-gray-800">Manajemen Pegawai</h1>
//                         <p className="text-gray-500 mt-1">Kelola data pejabat penanda tangan surat</p>
//                     </div>
//                     <button 
//                         onClick={() => handleOpenModal()}
//                         className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 flex items-center gap-2"
//                     >
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                         </svg>
//                         Tambah Pegawai
//                     </button>
//                 </div>

//                 {/* Table Section */}
//                 <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
//                     <div className="overflow-x-auto">
//                         <table className="w-full text-left border-collapse">
//                             <thead>
//                                 <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
//                                     <th className="py-4 px-6 font-semibold">No</th>
//                                     <th className="py-4 px-6 font-semibold">NIP</th>
//                                     <th className="py-4 px-6 font-semibold">Nama Lengkap</th>
//                                     <th className="py-4 px-6 font-semibold">Jabatan</th>
//                                     <th className="py-4 px-6 font-semibold text-center">Status</th>
//                                     <th className="py-4 px-6 font-semibold text-center">Aksi</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="text-gray-600 text-sm font-light">
//                                 {isLoading ? (
//                                     <tr><td colSpan="6" className="py-8 text-center text-gray-400">Memuat data...</td></tr>
//                                 ) : pegawaiList.length > 0 ? (
//                                     pegawaiList.map((item, index) => (
//                                         <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition duration-150">
//                                             <td className="py-4 px-6">{index + 1}</td>
//                                             <td className="py-4 px-6 font-mono text-gray-500">{item.nip}</td>
//                                             <td className="py-4 px-6 font-medium text-gray-800">{item.nama_lengkap}</td>
//                                             <td className="py-4 px-6">{item.jabatan}</td>
//                                             <td className="py-4 px-6 text-center">
//                                                 {item.status_aktif === 'Y' ? (
//                                                     <span className="bg-green-100 text-green-700 py-1 px-3 rounded-full text-xs font-bold">
//                                                         Aktif
//                                                     </span>
//                                                 ) : (
//                                                     <span className="bg-red-100 text-red-700 py-1 px-3 rounded-full text-xs font-bold">
//                                                         Non-Aktif
//                                                     </span>
//                                                 )}
//                                             </td>
//                                             <td className="py-4 px-6 text-center">
//                                                 <div className="flex item-center justify-center gap-2">
//                                                     <button 
//                                                         onClick={() => handleOpenModal(item)}
//                                                         className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 flex items-center justify-center transition"
//                                                         title="Edit"
//                                                     >
//                                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
//                                                         </svg>
//                                                     </button>
//                                                     <button 
//                                                         onClick={() => handleDelete(item.id)}
//                                                         className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition"
//                                                         title="Hapus"
//                                                     >
//                                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                                                         </svg>
//                                                     </button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr><td colSpan="6" className="py-8 text-center text-gray-500">Belum ada data pegawai.</td></tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>

//                 {/* --- MODAL OVERLAY (TAILWIND) --- */}
//                 {showModal && (
//                     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
//                         <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all scale-100 p-6 relative">
                            
//                             {/* Modal Header */}
//                             <div className="flex justify-between items-center mb-6">
//                                 <h2 className="text-xl font-bold text-gray-800">
//                                     {isEditing ? 'Edit Pegawai' : 'Tambah Pegawai Baru'}
//                                 </h2>
//                                 <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition">
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                     </svg>
//                                 </button>
//                             </div>

//                             {/* Modal Form */}
//                             <form onSubmit={handleSubmit} className="space-y-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">NIP</label>
//                                     <input 
//                                         type="number" 
//                                         name="nip"
//                                         value={formData.nip}
//                                         onChange={handleInputChange}
//                                         className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//                                         placeholder="1983xxxxx"
//                                         required 
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
//                                     <input 
//                                         type="text" 
//                                         name="nama_lengkap"
//                                         value={formData.nama_lengkap}
//                                         onChange={handleInputChange}
//                                         className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//                                         placeholder="Nama beserta gelar"
//                                         required 
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
//                                     <input 
//                                         type="text" 
//                                         name="jabatan"
//                                         value={formData.jabatan}
//                                         onChange={handleInputChange}
//                                         className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//                                         placeholder="Contoh: KASI PEMERINTAHAN"
//                                         required 
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                                     <select 
//                                         name="status_aktif"
//                                         value={formData.status_aktif}
//                                         onChange={handleInputChange}
//                                         className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
//                                     >
//                                         <option value="Y">Aktif</option>
//                                         <option value="T">Tidak Aktif</option>
//                                     </select>
//                                 </div>

//                                 {/* Modal Footer */}
//                                 <div className="flex justify-end gap-3 mt-6">
//                                     <button 
//                                         type="button" 
//                                         onClick={() => setShowModal(false)}
//                                         className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
//                                     >
//                                         Batal
//                                     </button>
//                                     <button 
//                                         type="submit" 
//                                         className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md transition"
//                                     >
//                                         Simpan Data
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default PegawaiAdmin;