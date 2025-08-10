import React from "react";
import { Bell, UserCircle, Menu } from "lucide-react";

const AdminNavbar = ({ onMenuClick, pageTitle }) => {
  return (
    <header className="h-20 bg-white shadow-sm flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
      <div className="flex items-center">
        {/* Tombol Hamburger ini hanya muncul di layar kecil (lg:hidden) */}
        <button
          onClick={onMenuClick}
          className="text-gray-600 hover:text-blue-600 lg:hidden mr-4"
        >
          <Menu size={24} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {pageTitle || "Dashboard"}
          </h2>
        </div>
      </div>
      <div className="flex items-center space-x-3 sm:space-x-6">
        <button className="relative text-gray-600 hover:text-blue-600">
          <Bell size={24} />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center space-x-3">
          <UserCircle size={32} className="text-gray-600" />
          <div className="hidden sm:block">
            <p className="font-semibold text-sm text-gray-800">Admin Dona</p>
            <p className="text-xs text-gray-500">Super Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
