import React from "react";
import { Newspaper, Megaphone, FileText, Users } from "lucide-react";

// Komponen kecil untuk kartu statistik
const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    <div className={`p-3 rounded-full mr-4 ${color}`}>{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const DashboardPage = () => {
  return (
    <div>
      {/* Grid untuk kartu statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Newspaper size={24} className="text-white" />}
          title="Total Berita"
          value="6"
          color="bg-blue-500"
        />
        <StatCard
          icon={<Megaphone size={24} className="text-white" />}
          title="Total Pengumuman"
          value="6"
          color="bg-yellow-500"
        />
        <StatCard
          icon={<FileText size={24} className="text-white" />}
          title="Total Layanan"
          value="7"
          color="bg-green-500"
        />
        <StatCard
          icon={<Users size={24} className="text-white" />}
          title="Total Pengguna"
          value="120"
          color="bg-indigo-500"
        />
      </div>

      {/* Konten lainnya bisa ditambahkan di sini */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800">
          Aktivitas Terkini
        </h3>
        <p className="mt-2 text-gray-600">
          Area ini dapat digunakan untuk menampilkan log aktivitas, berita yang
          baru ditambahkan, atau grafik pengunjung website.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
