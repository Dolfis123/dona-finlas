import React from "react";
import { Edit, Trash2 } from "lucide-react";

const PejabatTable = ({ dataList, onEdit, onDelete }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  return (
    <div className="bg-white shadow-md rounded-lg">
      {/* Tampilan Tabel untuk Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Foto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Lengkap
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jabatan
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.foto_url ? (
                      <img
                        src={`${backendUrl}/images/${item.foto_url}`}
                        alt={item.nama_lengkap}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                        No Pic
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {item.nama_lengkap}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.jabatan}
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
                  Tidak ada data pejabat.
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
                <div className="flex items-center space-x-4">
                  {item.foto_url ? (
                    <img
                      src={`${backendUrl}/images/${item.foto_url}`}
                      alt={item.nama_lengkap}
                      className="h-16 w-16 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 flex-shrink-0">
                      No Pic
                    </div>
                  )}
                  <div className="flex-grow">
                    <p className="font-bold text-gray-800">
                      {item.nama_lengkap}
                    </p>
                    <p className="text-sm text-gray-600">{item.jabatan}</p>
                  </div>
                </div>
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
    </div>
  );
};

export default PejabatTable;
