import React, { useState, useEffect } from "react";
// 1. Impor: fungsi API dan semua yang dibutuhkan untuk UI
import { getDashboardData } from "../../api/dashboardAPI"; // Sesuaikan path jika perlu
import { Newspaper, Megaphone, Users, Activity, BarChart3 } from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registrasi komponen Chart.js (wajib)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Komponen kartu statistik (reusable)
const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center transition-transform transform hover:-translate-y-1">
    <div className={`p-3 rounded-full mr-4 ${color}`}>{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

// Komponen utama Dashboard
const DashboardPage = () => {
  // 2. State: untuk menampung data, status loading, dan pesan error
  const [stats, setStats] = useState({
    berita: 0,
    pengumuman: 0,
    pengguna: 0,
  });
  const [aktivitas, setAktivitas] = useState([]);
  const [dataGrafik, setDataGrafik] = useState({
    labels: [],
    datasets: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. useEffect: untuk mengambil data dari API saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Memanggil fungsi dari file API service
        const dataDariApi = await getDashboardData();

        // Mengisi state dengan data yang berhasil didapat
        setStats(dataDariApi.stats);
        setAktivitas(dataDariApi.aktivitas);
        setDataGrafik({
          labels: dataDariApi.grafik.labels,
          datasets: [
            {
              label: "Pengunjung Website",
              data: dataDariApi.grafik.data,
              backgroundColor: "rgba(59, 130, 246, 0.6)",
              borderColor: "rgba(59, 130, 246, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        console.error("Gagal memuat data di komponen Dashboard:", err);
        setError("Tidak dapat memuat data dashboard. Silakan coba lagi nanti.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Dependency array kosong agar efek hanya berjalan sekali

  // 4. Render: Tampilan kondisional berdasarkan state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        Memuat data dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Grid untuk kartu statistik, disesuaikan menjadi 3 kolom */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={<Newspaper size={24} className="text-white" />}
          title="Total Berita"
          value={stats.berita}
          color="bg-blue-500"
        />
        <StatCard
          icon={<Megaphone size={24} className="text-white" />}
          title="Total Pengumuman"
          value={stats.pengumuman}
          color="bg-yellow-500"
        />
        <StatCard
          icon={<Users size={24} className="text-white" />}
          title="Total Pengguna"
          value={stats.pengguna}
          color="bg-indigo-500"
        />
        {/* Kartu "Total Layanan" dihapus karena backend tidak lagi mengirim data ini */}
      </div>

      {/* Konten baru: Grafik dan Aktivitas Terkini */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Grafik Pengunjung */}
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="mr-2" size={20} /> Grafik Pengunjung
          </h3>
          <Bar
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
            }}
            data={dataGrafik}
          />
        </div>

        {/* Aktivitas Terkini */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Activity className="mr-2" size={20} /> Aktivitas Terkini
          </h3>
          <ul className="space-y-4 max-h-80 overflow-y-auto">
            {aktivitas.map((item) => (
              <li key={item.id} className="flex items-start">
                <div className="bg-gray-100 p-2 rounded-full mr-3 mt-1">
                  <Activity size={16} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-700">{item.teks}</p>
                  <p className="text-xs text-gray-400">{item.waktu}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
