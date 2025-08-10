import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // Pastikan file CSS global (untuk Tailwind) diimpor di sini
import { BrowserRouter } from "react-router-dom";

// 1. Dapatkan elemen root dari index.html
const rootElement = document.getElementById("root");

// 2. Buat root untuk rendering React
const root = ReactDOM.createRoot(rootElement);

// 3. Render aplikasi ke dalam root
root.render(
  // <React.StrictMode> membantu menemukan potensi masalah dalam aplikasi
  <React.StrictMode>
    {/* <BrowserRouter> membungkus seluruh aplikasi Anda, 
      memungkinkan penggunaan komponen seperti <Routes> dan <Link> di dalamnya.
    */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
