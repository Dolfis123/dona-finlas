import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  Megaphone,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users,
  Camera,
  Calendar,
  Leaf,
  Download,
  HelpCircle,
  ChevronDown,
  X,
  Briefcase, // Icon baru untuk Pegawai
  Mail,      // Icon baru untuk Surat
} from "lucide-react";
import logoManokwari from "../../assets/images/logo.png";

const Sidebar = ({
  isCollapsed,
  toggleSidebar,
  isMobileOpen,
  onMobileClose,
}) => {
  const location = useLocation();
  const [openAccordion, setOpenAccordion] = useState("");

  // --- STRUKTUR MENU TERBARU ---
  const navLinks = [
    {
      text: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      text: "Layanan Surat", // --- MENU BARU: SURAT ---
      icon: <Mail size={20} />,
      children: [
        { text: "Pengajuan Masuk", path: "/admin/surat/pengajuan" },
        { text: "Arsip Surat", path: "/admin/surat/arsip" },
        { text: "Master Jenis Surat", path: "/admin/surat/jenis" },
      ],
    },
    {
      text: "Kepegawaian", // --- MENU BARU: PEGAWAI ---
      icon: <Briefcase size={20} />,
      children: [
        { text: "Data Pegawai", path: "/admin/pegawai" }, // <-- Ini link ke halaman PegawaiAdmin
        { text: "Struktur Organisasi", path: "/admin/pejabat" }, // Data Pejabat Publik (Frontend)
      ],
    },
    {
      text: "Manajemen Konten",
      icon: <Newspaper size={20} />,
      children: [
        { text: "Kelola Berita", path: "/admin/berita" },
        { text: "Kelola Pengumuman", path: "/admin/pengumuman" },
        { text: "Kelola Galeri", path: "/admin/galeri" },
        { text: "Kelola Agenda", path: "/admin/agenda" },
      ],
    },
    {
      text: "Manajemen Halaman",
      icon: <FileText size={20} />,
      children: [
        { text: "Halaman Tentang Kami", path: "/admin/about" },
        { text: "Sambutan Lurah", path: "/admin/sambutan" },
        { text: "Potensi Daerah", path: "/admin/potensi-daerah" },
        { text: "Download Dokumen", path: "/admin/dokumen" },
        { text: "FAQ", path: "/admin/faq" },
      ],
    },
    {
      text: "Pengaturan Tampilan",
      path: "/admin/pengaturan-halaman",
      icon: <Settings size={20} />,
    },
  ];

  const isActive = (path) => location.pathname === path;
  
  // Fungsi cek aktif diperbaiki agar highlight induk tetap menyala saat anak aktif
  const isAccordionActive = (children) =>
    children.some((child) => location.pathname === child.path);
    
  const handleAccordionToggle = (text) =>
    setOpenAccordion(openAccordion === text ? "" : text);

  // Konten Sidebar
  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Header Sidebar */}
      <div className="flex items-center justify-between h-20 border-b border-gray-700 px-4 flex-shrink-0">
        <div className="flex items-center">
          <img
            src={logoManokwari}
            alt="Logo"
            className="h-10 w-auto flex-shrink-0"
          />
          {(!isCollapsed || isMobile) && (
            <h1 className="ml-3 text-lg font-bold whitespace-nowrap leading-tight">
              Admin Panel<br/>
              <span className="text-xs font-normal text-gray-400">Kelurahan Amban</span>
            </h1>
          )}
        </div>
        {isMobile && (
          <button
            onClick={onMobileClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        )}
      </div>

      {/* Navigasi Menu */}
      <nav className="flex-grow px-2 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600">
        <ul>
          {navLinks.map((link) => (
            <li key={link.text} className="mb-2">
              {link.children ? (
                // --- MENU DROPDOWN (ACCORDION) ---
                <>
                  <button
                    onClick={() => handleAccordionToggle(link.text)}
                    className={`flex items-center justify-between w-full py-3 px-3 rounded-lg transition-colors duration-200 ${
                      isAccordionActive(link.children)
                        ? "bg-gray-700 text-white" // Highlight induk jika anak aktif
                        : "text-gray-400 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center">
                      {link.icon}
                      {(!isCollapsed || isMobile) && (
                        <span className="ml-4 font-medium text-sm">{link.text}</span>
                      )}
                    </div>
                    {(!isCollapsed || isMobile) && (
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          openAccordion === link.text ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                  
                  {/* List Anak Menu */}
                  {(!isCollapsed || isMobile) &&
                    openAccordion === link.text && (
                      <ul className="pl-4 mt-1 space-y-1 bg-gray-900/50 rounded-lg py-2">
                        {link.children.map((child) => (
                          <li key={child.text}>
                            <Link
                              to={child.path}
                              onClick={onMobileClose}
                              className={`flex items-center py-2 px-3 rounded-md text-sm transition-colors duration-200 ${
                                isActive(child.path)
                                  ? "bg-blue-600 text-white shadow-md"
                                  : "text-gray-400 hover:text-white hover:bg-gray-700"
                              }`}
                            >
                              {/* Dot kecil untuk indikator sub-menu */}
                              <span className={`w-1.5 h-1.5 rounded-full mr-3 ${isActive(child.path) ? 'bg-white' : 'bg-gray-500'}`}></span>
                              {child.text}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                </>
              ) : (
                // --- MENU TUNGGAL (LINK BIASA) ---
                <Link
                  to={link.path}
                  onClick={onMobileClose}
                  className={`flex items-center py-3 px-3 rounded-lg transition-colors duration-200 ${
                    isCollapsed && !isMobile ? "justify-center" : ""
                  } ${
                    isActive(link.path)
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-400 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {link.icon}
                  {(!isCollapsed || isMobile) && (
                    <span className="ml-4 font-medium text-sm">{link.text}</span>
                  )}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer Sidebar (Logout & Toggle) */}
      <div className="px-2 py-4 border-t border-gray-700 flex-shrink-0 bg-gray-900/30">
        <button
          onClick={toggleSidebar}
          className={`hidden lg:flex items-center w-full py-3 px-3 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!isCollapsed && <span className="ml-4 font-medium text-sm">Ciutkan Menu</span>}
        </button>
        <Link
          to="/logout"
          className={`flex items-center w-full mt-2 py-3 px-3 rounded-lg text-gray-400 hover:bg-red-600 hover:text-white transition-colors duration-200 ${
            isCollapsed && !isMobile ? "justify-center" : ""
          }`}
        >
          <LogOut size={20} />
          {(!isCollapsed || isMobile) && (
            <span className="ml-4 font-medium text-sm">Keluar</span>
          )}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar untuk Desktop */}
      <aside
        className={`hidden lg:flex h-screen bg-gray-800 text-white flex-col fixed z-40 transition-all duration-300 ease-in-out border-r border-gray-700 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Sidebar untuk Mobile */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onMobileClose}
        ></div>
        <aside
          className={`relative h-full w-64 bg-gray-800 text-white flex flex-col transition-transform duration-300 ease-in-out shadow-2xl ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent isMobile={true} />
        </aside>
      </div>
    </>
  );
};

export default Sidebar;