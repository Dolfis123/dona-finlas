import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const DokumenModal = ({ isOpen, onClose, onSave, data }) => {
  const [namaDokumen, setNamaDokumen] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState(""); // State untuk pesan error

  // Batas ukuran file dalam MB
  const DOC_MAX_SIZE_MB = 10;
  const DOC_MAX_SIZE_BYTES = DOC_MAX_SIZE_MB * 1024 * 1024;

  useEffect(() => {
    if (data) {
      setNamaDokumen(data.nama_dokumen);
      setDeskripsi(data.deskripsi || "");
      setFileName(data.file_url);
    } else {
      setNamaDokumen("");
      setDeskripsi("");
      setFile(null);
      setFileName("");
    }
    setError(""); // Reset error setiap kali modal dibuka
  }, [data, isOpen]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validasi ukuran file
      if (selectedFile.size > DOC_MAX_SIZE_BYTES) {
        setError(`Ukuran file terlalu besar. Maksimal ${DOC_MAX_SIZE_MB} MB.`);
        e.target.value = null; // Hapus file dari input
        return;
      }

      setError(""); // Hapus pesan error jika valid
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nama_dokumen", namaDokumen);
    formData.append("deskripsi", deskripsi);
    if (file) {
      formData.append("dokumen", file);
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">
            {data ? "Edit Dokumen" : "Tambah Dokumen"}
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
                Nama Dokumen
              </label>
              <input
                type="text"
                value={namaDokumen}
                onChange={(e) => setNamaDokumen(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Deskripsi (Opsional)
              </label>
              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                File Dokumen (PDF/DOCX)
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ukuran file maksimal: {DOC_MAX_SIZE_MB} MB.
              </p>
              {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
              {fileName && (
                <p className="text-xs text-gray-500 mt-2">
                  File saat ini: {fileName}
                </p>
              )}
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

export default DokumenModal;
