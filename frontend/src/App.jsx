import React from "react";
import { Routes, Route } from "react-router-dom";

// Impor Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// Impor Halaman Pengguna (Users)
import HomePage from "./pages/users/HomePage";
import AboutPage from "./pages/users/AboutPage";
import BeritaPage from "./pages/users/BeritaPage";
import PengumumanPage from "./pages/users/PengumumanPage";
import PelayananPage from "./pages/users/PelayananPage";
import GaleriPage from "./pages/users/GaleriPage";
import StrukturOrganisasiPage from "./pages/users/StrukturOrganisasiPage";
// Impor Halaman Admin
import DashboardPage from "./pages/admin/DashboardPage";
import BeritaAdminPage from "./pages/admin/BeritaAdminPage"; // Impor halaman admin untuk berita
import PengumumanAdminPage from "./pages/admin/PengumumanAdminPage"; // Impor halaman admin untuk
import GaleriAdminPage from "./pages/admin/GaleriAdminPage"; // Impor halaman admin untuk galeri
import AgendaAdminPage from "./pages/admin/AgendaAdminPage"; // Impor halaman admin untuk agenda
import PejabatAdminPage from "./pages/admin/PejabatAdminPage"; // Impor halaman admin untuk pejabat
import PotensiDaerahAdminPage from "./pages/admin/PotensiDaerahAdminPage"; // Impor halaman admin untuk
import DokumenAdminPage from "./pages/admin/DokumenAdminPage"; // Impor halaman admin untuk dokumen
import FaqAdminPage from "./pages/admin/FaqAdminPage"; // Impor halaman admin untuk FAQ
import PengaturanHalamanAdminPage from "./pages/admin/PengaturanHalamanAdminPage"; // Impor halaman admin untuk pengaturan
import AboutAdminPage from "./pages/admin/AboutAdminPage";
import SambutanAdminPage from "./pages/admin/SambutanAdminPage"; // <-- Impor halaman
import BeritaDetailPage from "./pages/users/BeritaDetailPage"; // <-- Impor halaman baru

// Placeholder untuk halaman admin lainnya
// const KelolaBeritaPage = () => (
//   <div className="text-xl">Halaman Kelola Berita</div>
// );

const KelolaLayananPage = () => (
  <div className="text-xl">Halaman Kelola Layanan</div>
);
const PengaturanPage = () => <div className="text-xl">Halaman Pengaturan</div>;

// Impor Halaman Auth
import LoginPage from "./pages/auth/LoginPage";
import KontakPage from "./pages/users/KontakPage";
import AgendaPage from "./pages/users/AgendaPage";
import PotensiDaerahPage from "./pages/users/PotensiDaerahPage";
import DownloadDokumenPage from "./pages/users/DownloadDokumenPage";
import FaqPage from "./pages/users/FaqPage";

function App() {
  return (
    <Routes>
      {/* --- RUTE UNTUK PENGGUNA UMUM (dibungkus MainLayout) --- */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/struktur-organisasi"
          element={<StrukturOrganisasiPage />}
        />
        <Route path="/galeri" element={<GaleriPage />} />
        <Route path="/potensi-daerah" element={<PotensiDaerahPage />} />
        <Route path="/download" element={<DownloadDokumenPage />} />
        <Route path="/faq" element={<FaqPage />} />

        {/* Halaman lainnya */}
        <Route path="/berita" element={<BeritaPage />} />
        <Route path="/berita/:id" element={<BeritaDetailPage />} />
        <Route path="/pengumuman" element={<PengumumanPage />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/pelayanan" element={<PelayananPage />} />
        <Route path="/kontak" element={<KontakPage />} />
      </Route>

      {/* --- RUTE UNTUK ADMIN (dibungkus AdminLayout) --- */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* Perhatikan path di sini tidak menggunakan "/" di depan */}
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="berita" element={<BeritaAdminPage />} />
        <Route path="pengumuman" element={<PengumumanAdminPage />} />
        <Route path="galeri" element={<GaleriAdminPage />} />
        <Route path="agenda" element={<AgendaAdminPage />} />
        <Route path="about" element={<AboutAdminPage />} />
        <Route path="sambutan" element={<SambutanAdminPage />} />{" "}
        {/* <-- RUTE BARU */}
        <Route path="pejabat" element={<PejabatAdminPage />} />
        <Route path="potensi-daerah" element={<PotensiDaerahAdminPage />} />
        <Route path="dokumen" element={<DokumenAdminPage />} />
        <Route path="faq" element={<FaqAdminPage />} />
        <Route
          path="pengaturan-halaman"
          element={<PengaturanHalamanAdminPage />}
        />
        {/* Tambahkan rute lainnya sesuai kebutuhan */}
        <Route path="layanan" element={<KelolaLayananPage />} />
        <Route path="pengaturan" element={<PengaturanPage />} />
      </Route>

      {/* --- RUTE TANPA LAYOUT (contoh: Halaman Login) --- */}
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
