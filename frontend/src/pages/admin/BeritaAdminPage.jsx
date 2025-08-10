/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import BeritaTable from "../../components/admin/berita/BeritaTable";
import BeritaModal from "../../components/admin/berita/BeritaModal";
import beritaApi from "../../api/beritaApi";
import { Plus, Search, XCircle, CheckCircle, AlertCircle } from "lucide-react";

const BeritaAdminPage = () => {
  const [beritaList, setBeritaList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBerita, setEditingBerita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: "", type: "" });

  // State untuk Pencarian dan Paginasi
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Jumlah item per halaman

  // Fungsi untuk menampilkan notifikasi
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 3000); // Pesan hilang setelah 3 detik
  };

  const fetchBerita = async () => {
    setLoading(true);
    try {
      const data = await beritaApi.getAll();
      setBeritaList(data);
    } catch (error) {
      showNotification("Gagal memuat data berita.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBerita();
  }, []);

  // Logika untuk filter dan paginasi
  const filteredBerita = useMemo(() => {
    return beritaList.filter((berita) =>
      berita.judul.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [beritaList, searchTerm]);

  const paginatedBerita = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBerita.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBerita, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredBerita.length / itemsPerPage);

  const handleOpenAddModal = () => {
    setEditingBerita(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (berita) => {
    setEditingBerita(berita);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBerita(null);
  };

  const handleSave = async (formData) => {
    try {
      if (editingBerita) {
        await beritaApi.update(editingBerita.id, formData);
        showNotification("Berita berhasil diperbarui.", "edit");
      } else {
        await beritaApi.create(formData);
        showNotification("Berita baru berhasil ditambahkan.", "add");
      }
      fetchBerita();
      handleCloseModal();
    } catch (error) {
      showNotification("Gagal menyimpan data.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus berita ini?")) {
      try {
        await beritaApi.delete(id);
        showNotification("Berita berhasil dihapus.", "delete");
        fetchBerita();
      } catch (error) {
        showNotification("Gagal menghapus data.", "error");
      }
    }
  };

  // Komponen untuk notifikasi
  const Notification = () => {
    if (!notification.message) return null;

    const colors = {
      add: "bg-green-100 border-green-500 text-green-700",
      edit: "bg-blue-100 border-blue-500 text-blue-700",
      delete: "bg-red-100 border-red-500 text-red-700",
      error: "bg-red-100 border-red-500 text-red-700",
    };

    const icons = {
      add: <CheckCircle />,
      edit: <AlertCircle />,
      delete: <XCircle />,
      error: <XCircle />,
    };

    return (
      <div
        className={`p-4 border-l-4 rounded-md mb-4 flex items-center ${
          colors[notification.type]
        }`}
        role="alert"
      >
        {icons[notification.type]}
        <p className="ml-3 font-medium">{notification.message}</p>
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Manajemen Berita
        </h2>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Fitur Pencarian */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari berita..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset ke halaman 1 saat mencari
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <button
            onClick={handleOpenAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 flex-shrink-0"
          >
            <Plus size={20} className="mr-2" />
            Tambah
          </button>
        </div>
      </div>

      <Notification />

      {loading ? (
        <p className="text-center">Memuat data...</p>
      ) : (
        <BeritaTable
          beritaList={paginatedBerita}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {isModalOpen && (
        <BeritaModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          berita={editingBerita}
        />
      )}
    </div>
  );
};

export default BeritaAdminPage;
