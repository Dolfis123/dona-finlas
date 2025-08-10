import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        {/* Outlet akan merender komponen halaman anak (child route) */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
