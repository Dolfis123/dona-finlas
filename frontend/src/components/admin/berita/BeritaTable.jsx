import React from "react";
import { Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const BeritaTable = ({
  beritaList,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  return (
    <div className="bg-white shadow-md rounded-lg">
      {/* Tampilan Tabel untuk Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gambar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Judul
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Penulis
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {beritaList.length > 0 ? (
              beritaList.map((berita) => (
                <tr key={berita.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {berita.gambar_url ? (
                      <img
                        src={`${backendUrl}/images/${berita.gambar_url}`}
                        alt={berita.judul}
                        className="h-10 w-16 object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">No Image</span>
                    )}
                  </td>
                  <td className="px-6 py-4 max-w-sm">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {berita.judul}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {berita.kategori}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {berita.User?.nama_lengkap || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(berita)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(berita.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  Tidak ada data berita yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Tampilan Kartu untuk Mobile */}
      <div className="md:hidden">
        <div className="px-4 py-2 space-y-4">
          {beritaList.length > 0 ? (
            beritaList.map((berita) => (
              <div
                key={berita.id}
                className="bg-white p-4 rounded-lg shadow border"
              >
                <div className="flex items-start space-x-4">
                  {berita.gambar_url && (
                    <img
                      src={`${backendUrl}/images/${berita.gambar_url}`}
                      alt={berita.judul}
                      className="h-16 w-24 object-cover rounded-md flex-shrink-0"
                    />
                  )}
                  <div className="flex-grow">
                    <p className="font-bold text-gray-800">{berita.judul}</p>
                    <span className="mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {berita.kategori}
                    </span>
                    <p className="text-sm text-gray-500 mt-2">
                      Penulis: {berita.User?.nama_lengkap || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-4 border-t pt-3">
                  <button
                    onClick={() => onEdit(berita)}
                    className="flex items-center text-sm text-indigo-600 font-medium"
                  >
                    <Edit size={16} className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => onDelete(berita.id)}
                    className="flex items-center text-sm text-red-600 font-medium"
                  >
                    <Trash2 size={16} className="mr-1" /> Hapus
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-10 text-gray-500">
              Tidak ada data berita yang ditemukan.
            </p>
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

export default BeritaTable;
