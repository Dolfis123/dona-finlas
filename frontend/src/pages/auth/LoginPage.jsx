import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import authApi from "../../api/authApi"; // <-- Impor authApi

const loginImageUrl =
  "https://images.unsplash.com/photo-1529503260202-4cb2b1677f0a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const LoginPage = () => {
  // --- STATE BARU UNTUK MENGELOLA FORM ---
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook untuk mengarahkan pengguna

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // --- FUNGSI UNTUK MENANGANI PROSES LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault(); // Mencegah form dari refresh halaman
    setLoading(true);
    setError("");

    try {
      const data = await authApi.login(username, password);

      // Jika berhasil, simpan token ke localStorage
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        // Arahkan pengguna ke halaman dashboard admin
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Kolom Kiri: Gambar */}
      <div
        className="hidden lg:block w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${loginImageUrl})` }}
      >
        <div className="w-full h-full bg-gray-900 bg-opacity-50 flex flex-col justify-between p-12 text-white">
          <div>
            <h2 className="text-3xl font-bold">Kelurahan Padarni</h2>
            <p className="mt-2">Kabupaten Manokwari</p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold">
              Pelayanan Digital di Ujung Jari Anda.
            </h3>
            <p className="mt-2 text-gray-300">
              Masuk untuk mengakses semua layanan online yang kami sediakan
              untuk kemudahan warga.
            </p>
          </div>
        </div>
      </div>

      {/* Kolom Kanan: Form Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <LogIn className="mx-auto h-12 w-12 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800 mt-4">
              Login Akun Admin
            </h1>
            <p className="text-gray-500 mt-2">
              Selamat datang kembali! Silakan masukkan data Anda.
            </p>
          </div>

          {/* --- FORM DIHUBUNGKAN DENGAN FUNGSI handleLogin --- */}
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Input Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username} // Hubungkan dengan state
                  onChange={(e) => setUsername(e.target.value)} // Perbarui state
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Masukkan username Anda"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  id="password"
                  name="password"
                  type={passwordVisible ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password} // Hubungkan dengan state
                  onChange={(e) => setPassword(e.target.value)} // Perbarui state
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                >
                  {passwordVisible ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {/* --- MENAMPILKAN PESAN ERROR --- */}
            {error && (
              <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">
                {error}
              </p>
            )}

            {/* ... (checkbox dan lupa password) ... */}

            <div>
              <button
                type="submit"
                disabled={loading} // Tombol dinonaktifkan saat loading
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
              >
                {loading ? "Memproses..." : "Login"}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Kembali ke halaman utama?{" "}
            <Link
              to="/"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
