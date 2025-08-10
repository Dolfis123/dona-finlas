import React from "react";
import { Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const PengumumanTable = ({
  dataList,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg">
      {/* Tampilan Tabel untuk Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Judul
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal Publikasi
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dataList.length > 0 ? (
              dataList.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 max-w-sm">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {item.judul}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.level_penting === "Penting"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.level_penting}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.tanggal_publikasi).toLocaleDateString(
                      "id-ID",
                      { day: "2-digit", month: "long", year: "numeric" }
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(item)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-500">
                  Tidak ada data pengumuman.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Tampilan Kartu untuk Mobile */}
      <div className="md:hidden">
        <div className="px-4 py-2 space-y-4">
          {dataList.length > 0 ? (
            dataList.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-lg shadow border"
              >
                <div className="flex justify-between items-start">
                  <p className="font-bold text-gray-800 flex-1 pr-2">
                    {item.judul}
                  </p>
                  <span
                    className={`flex-shrink-0 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.level_penting === "Penting"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {item.level_penting}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(item.tanggal_publikasi).toLocaleDateString(
                    "id-ID",
                    { day: "2-digit", month: "long", year: "numeric" }
                  )}
                </p>
                <div className="mt-4 flex justify-end space-x-4 border-t pt-3">
                  <button
                    onClick={() => onEdit(item)}
                    className="flex items-center text-sm text-indigo-600 font-medium"
                  >
                    <Edit size={16} className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="flex items-center text-sm text-red-600 font-medium"
                  >
                    <Trash2 size={16} className="mr-1" /> Hapus
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-10 text-gray-500">Tidak ada data.</p>
          )}
        </div>
      </div>

      {/* Komponen Paginasi */}
      {totalPages > 1 && (
        <div className="px-6 py-3 flex items-center justify-between border-t">
          <span className="text-sm text-gray-600">
            Halaman {currentPage} dari {totalPages}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 rounded-md bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1 rounded-md bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PengumumanTable;
