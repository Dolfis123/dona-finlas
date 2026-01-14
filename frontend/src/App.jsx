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
import KontakPage from "./pages/users/KontakPage";
import AgendaPage from "./pages/users/AgendaPage";
import PotensiDaerahPage from "./pages/users/PotensiDaerahPage";
import DownloadDokumenPage from "./pages/users/DownloadDokumenPage";
import FaqPage from "./pages/users/FaqPage";
import BeritaDetailPage from "./pages/users/BeritaDetailPage";
// Impor Halaman Surat Public
import PengajuanSurat from "./pages/public/PengajuanSurat"; 

// Impor Halaman Admin
import DashboardPage from "./pages/admin/DashboardPage";
import BeritaAdminPage from "./pages/admin/BeritaAdminPage";
import PengumumanAdminPage from "./pages/admin/PengumumanAdminPage";
import GaleriAdminPage from "./pages/admin/GaleriAdminPage";
import AgendaAdminPage from "./pages/admin/AgendaAdminPage";
import PejabatAdminPage from "./pages/admin/PejabatAdminPage";
import PotensiDaerahAdminPage from "./pages/admin/PotensiDaerahAdminPage";
import DokumenAdminPage from "./pages/admin/DokumenAdminPage";
import FaqAdminPage from "./pages/admin/FaqAdminPage";
import PengaturanHalamanAdminPage from "./pages/admin/PengaturanHalamanAdminPage";
import AboutAdminPage from "./pages/admin/AboutAdminPage";
import SambutanAdminPage from "./pages/admin/SambutanAdminPage";
// Impor Halaman Surat Admin
import ValidasiSurat from "./pages/admin/ValidasiSurat"; // Pastikan path import ini benar
import DetailValidasi from "./pages/admin/DetailValidasi";
// Impor Halaman Auth
import LoginPage from "./pages/auth/LoginPage";
import ArsipSurat from "./pages/admin/ArsipSurat";
//IMPOR HALAMAN CETAK
import SktmSurat from "./pages/admin/surat/SktmSurat";
// ... import DomisiliSurat
import DomisiliSurat from "./pages/admin/surat/DomisiliSurat";

// ... import halaman oapSurat
import OapSurat from "./pages/admin/surat/OapSurat";
// Placeholder
const KelolaLayananPage = () => <div className="text-xl">Halaman Kelola Layanan</div>;
const PengaturanPage = () => <div className="text-xl">Halaman Pengaturan</div>;

function App() {
  return (
    <Routes>
      {/* --- RUTE UNTUK PENGGUNA UMUM (MainLayout) --- */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />

        
        {/* ✅ BENAR: Pengajuan Surat bisa diakses publik */}
        <Route path="/pengajuan-surat" element={<PengajuanSurat />} /> 
        
        <Route path="/about" element={<AboutPage />} />
        <Route path="/struktur-organisasi" element={<StrukturOrganisasiPage />} />
        <Route path="/galeri" element={<GaleriPage />} />
        <Route path="/potensi-daerah" element={<PotensiDaerahPage />} />
        <Route path="/download" element={<DownloadDokumenPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/berita" element={<BeritaPage />} />
        <Route path="/berita/:id" element={<BeritaDetailPage />} />
        <Route path="/pengumuman" element={<PengumumanPage />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/pelayanan" element={<PelayananPage />} />
        <Route path="/kontak" element={<KontakPage />} />
      </Route>

      {/* --- RUTE UNTUK ADMIN (AdminLayout) --- */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<DashboardPage />} />
        
        {/* ✅ PERBAIKAN: Validasi Surat dipindah ke sini (Area Admin) */}
        {/* URL nanti menjadi: http://localhost:5173/admin/validasi-surat */}
        <Route path="validasi-surat" element={<ValidasiSurat />} />
        <Route path="validasi-surat/:id" element={<DetailValidasi />} />
        <Route path="arsip-surat" element={<ArsipSurat />} />


        <Route path="berita" element={<BeritaAdminPage />} />
        <Route path="pengumuman" element={<PengumumanAdminPage />} />
        <Route path="galeri" element={<GaleriAdminPage />} />
        <Route path="agenda" element={<AgendaAdminPage />} />
        <Route path="about" element={<AboutAdminPage />} />
        <Route path="sambutan" element={<SambutanAdminPage />} />
        <Route path="pejabat" element={<PejabatAdminPage />} />
        <Route path="potensi-daerah" element={<PotensiDaerahAdminPage />} />
        <Route path="dokumen" element={<DokumenAdminPage />} />
        <Route path="faq" element={<FaqAdminPage />} />
        <Route path="pengaturan-halaman" element={<PengaturanHalamanAdminPage />} />
        <Route path="layanan" element={<KelolaLayananPage />} />
        <Route path="pengaturan" element={<PengaturanPage />} />
      </Route>
{/* --- RUTE KHUSUS CETAK (Tanpa Layout) --- */}
      {/* ✅ Ini rute baru agar halaman cetak bersih full screen */}
      <Route path="/cetak/sktm/:id" element={<SktmSurat />} />
      {/* RUTE BARU: CETAK DOMISILI */}
      <Route path="/cetak/domisili/:id" element={<DomisiliSurat />} />
      {/* RUTE BARU: CETAK OAP */}
      <Route path="/cetak/oap/:id" element={<OapSurat />} />
      {/* --- RUTE TANPA LAYOUT --- */}
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;