import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const PengumumanModal = ({ isOpen, onClose, onSave, data }) => {
  // State untuk setiap input di dalam form
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [levelPenting, setLevelPenting] = useState("Informasi");

  // useEffect untuk mengisi form saat mode edit, atau mengosongkannya saat mode tambah
  useEffect(() => {
    if (data) {
      // Mode Edit: Isi form dengan data yang ada
      setJudul(data.judul);
      setIsi(data.isi);
      setLevelPenting(data.level_penting);
    } else {
      // Mode Tambah: Reset form ke kondisi awal
      setJudul("");
      setIsi("");
      setLevelPenting("Informasi");
    }
  }, [data, isOpen]);

  // Fungsi yang dijalankan saat tombol "Simpan" diklik
  const handleSubmit = (e) => {
    e.preventDefault();
    // Mengemas data dari state menjadi satu objek untuk dikirim ke parent component
    onSave({ judul, isi, level_penting: levelPenting });
  };

  // Jangan render apapun jika modal tidak terbuka
  if (!isOpen) return null;

  return (
    // Latar belakang gelap (backdrop)
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      {/* Panel Modal */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col animate-fade-in-down">
        {/* Header Modal */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">
            {data ? "Edit Pengumuman" : "Tambah Pengumuman Baru"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Konten Form yang bisa di-scroll */}
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Judul Pengumuman
              </label>
              <input
                type="text"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Level Penting
              </label>
              <select
                value={levelPenting}
                onChange={(e) => setLevelPenting(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
              >
                <option>Informasi</option>
                <option>Penting</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Isi Pengumuman
              </label>
              <textarea
                value={isi}
                onChange={(e) => setIsi(e.target.value)}
                rows="6"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              ></textarea>
            </div>
          </div>

          {/* Footer Modal dengan tombol aksi */}
          <div className="p-4 flex justify-end space-x-3 border-t bg-gray-50 rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PengumumanModal;
