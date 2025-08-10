/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import PejabatTable from "../../components/admin/pejabat/PejabatTable";
import PejabatModal from "../../components/admin/pejabat/PejabatModal";
import pejabatApi from "../../api/pejabatApi";
import { Plus, Search, XCircle, CheckCircle, AlertCircle } from "lucide-react";

const PejabatAdminPage = () => {
  const [pejabatList, setPejabatList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [searchTerm, setSearchTerm] = useState("");

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await pejabatApi.getAll();
      setPejabatList(data);
    } catch (error) {
      showNotification("Gagal memuat data pejabat.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = useMemo(
    () =>
      pejabatList.filter(
        (item) =>
          item.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.jabatan.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [pejabatList, searchTerm]
  );

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
        await pejabatApi.update(editingData.id, formData);
        showNotification("Data pejabat berhasil diperbarui.", "edit");
      } else {
        await pejabatApi.create(formData);
        showNotification("Data pejabat baru berhasil ditambahkan.", "add");
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      showNotification("Gagal menyimpan data.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data pejabat ini?")) {
      try {
        await pejabatApi.delete(id);
        showNotification("Data pejabat berhasil dihapus.", "delete");
        fetchData();
      } catch (error) {
        showNotification("Gagal menghapus data.", "error");
      }
    }
  };

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
          Manajemen Struktur Organisasi
        </h2>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama/jabatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
        <PejabatTable
          dataList={filteredData}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      )}

      {isModalOpen && (
        <PejabatModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          data={editingData}
        />
      )}
    </div>
  );
};

export default PejabatAdminPage;
