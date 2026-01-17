import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import AdminNavbar from "../components/admin/AdminNavbar";

const AdminLayout = () => {
  // State untuk sidebar di desktop (bisa diciutkan)
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] =
    useState(false);
  // State untuk sidebar di mobile (bisa dibuka/ditutup)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const location = useLocation();

  // Fungsi untuk mendapatkan judul halaman dari URL saat ini
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/dashboard")) return "Dashboard";
    if (path.includes("/sktm")) return "Surat Keterangan Tidak Mampu (SKTM)";
    if (path.includes("/surat/pengajuan")) return "Validasi Surat Online";
    if (path.includes("/pegawai")) return "Manajemen Pegawai";
    if (path.includes("/surat/jenis")) return "Master Jenis Surat";
    if (path.includes("/validasi-surat/:id")) return "Detail Validasi Surat";
    if (path.includes("/surat/arsip")) return "Arsip Surat";
    if (path.includes("/berita")) return "Manajemen Berita";
    if (path.includes("/pengumuman")) return "Manajemen Pengumuman";
    if (path.includes("/galeri")) return "Manajemen Galeri";
    if (path.includes("/agenda")) return "Manajemen Agenda";
    if (path.includes("/pejabat")) return "Struktur Organisasi";
    if (path.includes("/potensi-daerah")) return "Potensi Daerah";
    if (path.includes("/dokumen")) return "Download Dokumen";
    if (path.includes("/faq")) return "Manajemen FAQ";
    if (path.includes("/pengaturan-halaman")) return "Pengaturan Tampilan";
    if (path.includes("/sambutan")) return "Kata Sambutan";
    if (path.includes("/about")) return "Tentang Kelurahan";
    if (path.includes("/layanan")) return "Kelola Layanan";
    return "Admin Panel";
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar akan dirender di sini, dengan props yang benar untuk mobile dan desktop */}
      <Sidebar
        isCollapsed={isDesktopSidebarCollapsed}
        toggleSidebar={() =>
          setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)
        }
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Konten Utama */}
      <div
        className={`flex-grow transition-all duration-300 ease-in-out ${
          isDesktopSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        <AdminNavbar
          onMenuClick={() => setIsMobileSidebarOpen(true)} // Ini yang akan membuka sidebar mobile
          pageTitle={getPageTitle()}
        />
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
