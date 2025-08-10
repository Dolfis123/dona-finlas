/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import PotensiDaerahTable from "../../components/admin/potensi-daerah/PotensiDaerahTable";
import PotensiDaerahModal from "../../components/admin/potensi-daerah/PotensiDaerahModal";
import potensiDaerahApi from "../../api/potensiDaerahApi";
import { Plus, Search, XCircle, CheckCircle, AlertCircle } from "lucide-react";

const PotensiDaerahAdminPage = () => {
  const [potensiList, setPotensiList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await potensiDaerahApi.getAll();
      setPotensiList(data);
    } catch (error) {
      showNotification("Gagal memuat data potensi daerah.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = useMemo(
    () =>
      potensiList.filter(
        (item) =>
          item.nama_potensi.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.kategori.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [potensiList, searchTerm]
  );

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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

  const handleSave = async (formData) => {
    try {
      if (editingData) {
        await potensiDaerahApi.update(editingData.id, formData);
        showNotification("Data potensi daerah berhasil diperbarui.", "edit");
      } else {
        await potensiDaerahApi.create(formData);
        showNotification(
          "Data potensi daerah baru berhasil ditambahkan.",
          "add"
        );
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      showNotification("Gagal menyimpan data.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        await potensiDaerahApi.delete(id);
        showNotification("Data potensi daerah berhasil dihapus.", "delete");
        fetchData();
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
          Manajemen Potensi Daerah
        </h2>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama/kategori..."
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
        <PotensiDaerahTable
          dataList={paginatedData}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {isModalOpen && (
        <PotensiDaerahModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          data={editingData}
        />
      )}
    </div>
  );
};

export default PotensiDaerahAdminPage;
