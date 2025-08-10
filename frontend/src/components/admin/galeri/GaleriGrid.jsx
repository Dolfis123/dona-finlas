import React from "react";
import { Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const GaleriGrid = ({
  dataList,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {dataList.length > 0 ? (
          dataList.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square bg-gray-100 rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={`${backendUrl}/images/${item.gambar_url}`}
                alt={item.deskripsi}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                <button
                  onClick={() => onEdit(item)}
                  className="p-2 bg-white/80 rounded-full text-indigo-600 hover:bg-white"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-2 bg-white/80 rounded-full text-red-600 hover:bg-white"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white text-xs truncate">{item.deskripsi}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            Tidak ada item galeri yang ditemukan.
          </div>
        )}
      </div>

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

export default GaleriGrid;
