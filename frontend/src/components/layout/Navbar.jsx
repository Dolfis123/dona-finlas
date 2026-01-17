import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";

// Impor gambar logo dari folder assets
import logoManokwari from "../../assets/images/logo.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileAccordion, setOpenMobileAccordion] = useState(null);

  const navRef = useRef(null); // Ref untuk seluruh area navigasi desktop
  const location = useLocation();

  // Efek untuk mendeteksi scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // PERBAIKAN: Efek untuk menutup dropdown saat klik di luar area navigasi
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Efek untuk menonaktifkan scroll body saat menu mobile terbuka
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Beranda", path: "/" },
    {
      name: "Profil",
      dropdown: [
        { name: "Tentang Kami", path: "/about" },
        { name: "Struktur Organisasi", path: "/struktur-organisasi" },
      ],
    },
    {
      name: "Informasi",
      dropdown: [
        { name: "Berita", path: "/berita" },
        { name: "Pengumuman", path: "/pengumuman" },
        { name: "Agenda Kegiatan", path: "/agenda" },
      ],
    },
    { name: "Layanan", path: "/pengajuan-surat" },
    {
      name: "Publikasi",
      dropdown: [
        { name: "Galeri", path: "/galeri" },
        { name: "Potensi Daerah", path: "/potensi-daerah" },
        { name: "Download Dokumen", path: "/download" },
      ],
    },
    { name: "Bantuan", path: "/faq" },
    { name: "Kontak", path: "/kontak" },
  ];

  const isActive = (link) => {
    if (link.dropdown) {
      return link.dropdown.some((child) =>
        location.pathname.startsWith(child.path)
      );
    }
    return location.pathname === link.path;
  };

  const handleDropdownToggle = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const handleMobileAccordionToggle = (accordionName) => {
    setOpenMobileAccordion(
      openMobileAccordion === accordionName ? null : accordionName
    );
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ease-in-out ${
          isScrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-3">
                <img src={logoManokwari} alt="Logo" className="h-10 w-auto" />
                <span
                  className={`font-bold text-xl md:text-2xl ${
                    isScrolled || isMobileMenuOpen
                      ? "text-gray-800"
                      : "text-white"
                  }`}
                >
                  Kelurahan Padarni
                </span>
              </Link>
            </div>

            {/* Menu Desktop */}
            <div className="hidden md:flex items-center space-x-2" ref={navRef}>
              {navLinks.map((link) => (
                <div key={link.name} className="relative">
                  {link.dropdown ? (
                    <button
                      onClick={() => handleDropdownToggle(link.name)}
                      className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                        isActive(link)
                          ? "bg-blue-600 text-white"
                          : isScrolled
                          ? "text-gray-600 hover:bg-gray-100"
                          : "text-white hover:bg-white/10"
                      }`}
                    >
                      {link.name}
                      <ChevronDown
                        size={16}
                        className={`ml-1 transition-transform duration-300 ${
                          openDropdown === link.name ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      to={link.path}
                      className={`block px-4 py-2 rounded-md transition-colors duration-200 ${
                        isActive(link)
                          ? "bg-blue-600 text-white"
                          : isScrolled
                          ? "text-gray-600 hover:bg-gray-100"
                          : "text-white hover:bg-white/10"
                      }`}
                    >
                      {link.name}
                    </Link>
                  )}
                  {link.dropdown && openDropdown === link.name && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-20 origin-top-right animate-fade-in-down">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            location.pathname === item.path
                              ? "font-bold text-blue-600"
                              : "text-gray-700"
                          } hover:bg-gray-100`}
                          onClick={() => setOpenDropdown(null)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Tombol Login & Menu Mobile */}
            <div className="flex items-center">
              <div className="hidden md:block ml-4">
                <Link to="/login">
                  <button className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                    Login
                  </button>
                </Link>
              </div>
              <div className="md:hidden ml-4">
                <button onClick={() => setIsMobileMenuOpen(true)}>
                  <Menu
                    size={28}
                    className={isScrolled ? "text-gray-800" : "text-white"}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Tampilan Menu Mobile */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>

        {/* Panel Menu */}
        <div
          className={`relative h-full w-4/5 max-w-sm bg-white shadow-xl transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-bold text-lg">Menu</h2>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.dropdown ? (
                    <div>
                      <button
                        onClick={() => handleMobileAccordionToggle(link.name)}
                        className="w-full flex justify-between items-center py-2 text-left font-semibold"
                      >
                        <span>{link.name}</span>
                        <ChevronDown
                          size={20}
                          className={`transition-transform ${
                            openMobileAccordion === link.name
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </button>
                      {openMobileAccordion === link.name && (
                        <div className="pl-4 mt-2 space-y-2 border-l-2 border-gray-200">
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.name}
                              to={item.path}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block py-1 text-gray-600 hover:text-blue-600"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-2 font-semibold"
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
            <div className="p-4 border-t">
              <Link to="/login">
                <button className="w-full bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Login
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
