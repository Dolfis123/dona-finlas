import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const FaqModal = ({ isOpen, onClose, onSave, data }) => {
  const [pertanyaan, setPertanyaan] = useState("");
  const [jawaban, setJawaban] = useState("");
  const [kategori, setKategori] = useState("");

  useEffect(() => {
    if (data) {
      setPertanyaan(data.pertanyaan);
      setJawaban(data.jawaban);
      setKategori(data.kategori);
    } else {
      setPertanyaan("");
      setJawaban("");
      setKategori("");
    }
  }, [data, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ pertanyaan, jawaban, kategori });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">
            {data ? "Edit FAQ" : "Tambah FAQ"}
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
                Kategori
              </label>
              <input
                type="text"
                value={kategori}
                placeholder="Contoh: Pelayanan Umum"
                onChange={(e) => setKategori(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Pertanyaan
              </label>
              <textarea
                value={pertanyaan}
                onChange={(e) => setPertanyaan(e.target.value)}
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Jawaban
              </label>
              <textarea
                value={jawaban}
                onChange={(e) => setJawaban(e.target.value)}
                rows="5"
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

export default FaqModal;
