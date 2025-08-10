import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const AgendaModal = ({ isOpen, onClose, onSave, data }) => {
  const [namaKegiatan, setNamaKegiatan] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggalKegiatan, setTanggalKegiatan] = useState("");
  const [waktu, setWaktu] = useState("");
  const [lokasi, setLokasi] = useState("");

  useEffect(() => {
    if (data) {
      setNamaKegiatan(data.nama_kegiatan);
      setDeskripsi(data.deskripsi);
      // Format tanggal YYYY-MM-DD untuk input type="date"
      setTanggalKegiatan(data.tanggal_kegiatan.split("T")[0]);
      setWaktu(data.waktu);
      setLokasi(data.lokasi);
    } else {
      setNamaKegiatan("");
      setDeskripsi("");
      setTanggalKegiatan("");
      setWaktu("");
      setLokasi("");
    }
  }, [data, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      nama_kegiatan: namaKegiatan,
      deskripsi,
      tanggal_kegiatan: tanggalKegiatan,
      waktu,
      lokasi,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">
            {data ? "Edit Agenda" : "Tambah Agenda"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nama Kegiatan
              </label>
              <input
                type="text"
                value={namaKegiatan}
                onChange={(e) => setNamaKegiatan(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tanggal
                </label>
                <input
                  type="date"
                  value={tanggalKegiatan}
                  onChange={(e) => setTanggalKegiatan(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Waktu
                </label>
                <input
                  type="text"
                  value={waktu}
                  onChange={(e) => setWaktu(e.target.value)}
                  placeholder="Contoh: 08:00 - Selesai"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Lokasi
              </label>
              <input
                type="text"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Deskripsi
              </label>
              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                rows="4"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              ></textarea>
            </div>
          </div>
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

export default AgendaModal;
