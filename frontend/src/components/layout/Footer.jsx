import React from "react";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import logoManokwari from "../../assets/images/logo.png";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Kolom Tentang */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <img src={logoManokwari} alt="Logo" className="h-10 w-auto" />
              <h3 className="ml-3 text-xl font-bold">Kelurahan Padarni</h3>
            </div>
            <p className="text-gray-400">
              Melayani masyarakat dengan sepenuh hati melalui inovasi digital
              untuk kemudahan dan transparansi.
            </p>
          </div>

          {/* Kolom Tautan Cepat */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link to="/berita" className="text-gray-400 hover:text-white">
                  Berita
                </Link>
              </li>
              <li>
                <Link
                  to="/pelayanan"
                  className="text-gray-400 hover:text-white"
                >
                  Layanan
                </Link>
              </li>
              <li>
                <Link
                  to="/struktur-organisasi"
                  className="text-gray-400 hover:text-white"
                >
                  Struktur Organisasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom Kontak & Sosial Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hubungi Kami</h3>
            <p className="text-gray-400">
              Jl. Pahlawan No. 123, Manokwari, Papua Barat
            </p>
            <p className="text-gray-400">Email: kontak@padarni.go.id</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-900 py-4">
        <p className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Kelurahan Padarni. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
