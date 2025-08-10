/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import GaleriGrid from "../../components/admin/galeri/GaleriGrid";
import GaleriModal from "../../components/admin/galeri/GaleriModal";
import galeriApi from "../../api/galeriApi";
import { Plus, Search, XCircle, CheckCircle, AlertCircle } from "lucide-react";

const GaleriAdminPage = () => {
  const [galeriList, setGaleriList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Menampilkan 8 gambar per halaman

  // Fungsi untuk menampilkan notifikasi selama 3 detik
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 3000);
  };

  // Fungsi untuk mengambil data dari backend
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await galeriApi.getAll();
      setGaleriList(data);
    } catch (error) {
      showNotification("Gagal memuat data galeri.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Mengambil data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchData();
  }, []);

  // Logika untuk memfilter data berdasarkan pencarian
  const filteredData = useMemo(
    () =>
      galeriList.filter(
        (item) =>
          item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.kategori.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [galeriList, searchTerm]
  );

  // Logika untuk membagi data yang sudah difilter ke dalam halaman
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Handler untuk membuka dan menutup modal
  const handleOpenAddModal = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (data) => {
    setEditingData(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingData(null);
  };

  // Handler untuk menyimpan data (baik tambah maupun edit)
  const handleSave = async (formData) => {
    try {
      if (editingData) {
        await galeriApi.update(editingData.id, formData);
        showNotification("Item galeri berhasil diperbarui.", "edit");
      } else {
        await galeriApi.create(formData);
        showNotification("Item galeri baru berhasil ditambahkan.", "add");
      }
      fetchData(); // Muat ulang data setelah berhasil
      handleCloseModal();
    } catch (error) {
      showNotification("Gagal menyimpan data.", "error");
    }
  };

  // Handler untuk menghapus data
  const handleDelete = async (id) => {
    if (
      window.confirm("Apakah Anda yakin ingin menghapus item ini dari galeri?")
    ) {
      try {
        await galeriApi.delete(id);
        showNotification("Item galeri berhasil dihapus.", "delete");
        fetchData(); // Muat ulang data setelah berhasil
      } catch (error) {
        showNotification("Gagal menghapus data.", "error");
      }
    }
  };

  // Komponen Notifikasi
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
          Manajemen Galeri
        </h2>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari deskripsi/kategori..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <button
            onClick={handleOpenAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 flex-shrink-0"
          >
            <Plus size={20} className="mr-2" /> Tambah
          </button>
        </div>
      </div>

      <Notification />

      {loading ? (
        <p className="text-center">Memuat data...</p>
      ) : (
        <GaleriGrid
          dataList={paginatedData}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {isModalOpen && (
        <GaleriModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          data={editingData}
        />
      )}
    </div>
  );
};

export default GaleriAdminPage;
