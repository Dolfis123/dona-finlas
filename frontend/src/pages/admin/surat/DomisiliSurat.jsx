import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../utils/api'; // Sesuaikan path
import html2pdf from 'html2pdf.js';
import './SktmSurat.css'; // Kita gunakan CSS yang sama agar hemat file
import logoMkw from './assets/logi-mkw.png'; // Sesuaikan path logo
import { Printer, Download } from 'lucide-react';

const DomisiliSurat = () => {
  const { id } = useParams();
  const [surat, setSurat] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Ref untuk area kertas
  const suratRef = useRef();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/surat/arsip/${id}`);
        setSurat(res.data);
      } catch (error) {
        console.error("Gagal ambil detail:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  // --- FUNGSI PRINT ---
  const handlePrint = () => {
    window.print();
  };

  // --- FUNGSI UNDUH PDF ---
  const handleDownloadPDF = () => {
    const element = suratRef.current;
    const namaFile = `DOMISILI_${surat?.nama_lengkap || 'Warga'}.pdf`;

    const opt = {
      margin:       0,
      filename:     namaFile,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  // Helper Formatter
  const formatTgl = (val) => val ? new Date(val).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }) : ".............................";
  const valOrDots = (val) => val ? val : "......................................................";

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (!surat) return <div className="text-center p-10">Data tidak ditemukan</div>;

  const { detail, pegawai_ttd } = surat; 

  return (
    <div className="container-surat">
      
      {/* TOMBOL AKSI (Hilang saat print) */}
      <div className="no-print flex gap-4 mb-6">
        <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white text-gray-800 px-5 py-2 rounded shadow hover:bg-gray-100 font-bold"
        >
            <Printer size={18} /> Cetak (Browser)
        </button>
        <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded shadow hover:bg-blue-700 font-bold"
        >
            <Download size={18} /> Unduh File PDF
        </button>
      </div>

      {/* HALAMAN KERTAS */}
      <div className="page" ref={suratRef}>
        
        {/* KOP SURAT */}
        <div className="header-container">
          <div className="header-top">
            <div className="logo-box"><img src={logoMkw} alt="Logo" /></div>
            <div className="text-header">
              <h3>PEMERINTAH KABUPATEN MANOKWARI</h3>
              <h2>DISTRIK MANOKWARI BARAT</h2>
              <h1>KELURAHAN AMBAN</h1>
            </div>
          </div>
          <div className="alamat-bar">
            <span>JL Gunung Salju. Amban</span>
            <span>Kode Pos : 98314</span>
          </div>
          <div className="garis-kop"></div>
        </div>

        {/* JUDUL SURAT DOMISILI */}
        <div className="judul-container">
          <div className="judul-surat">SURAT KETERANGAN DOMISILI</div>
          <div className="nomor-surat">Nomor: {surat.no_surat_manual || "470 / ....... / Kel-Amb / 2026"}</div>
        </div>

        {/* ISI SURAT */}
        <div className="content">
          <p>Yang bertanda tangan dibawah ini, Kepala Kelurahan Amban Distrik Manokwari Barat, dengan ini menerangkan bahwa:</p>
          
          <table className="data-table">
            <tbody>
              <tr>
                <td className="col-label">NAMA LENGKAP</td>
                <td className="col-sep">:</td>
                <td className="col-val uppercase">{surat.nama_lengkap}</td>
              </tr>
              <tr>
                <td className="col-label">NIK</td>
                <td className="col-sep">:</td>
                <td className="col-val">{surat.nik}</td>
              </tr>
              <tr>
                <td className="col-label">TEMPAT/TGL LAHIR</td>
                <td className="col-sep">:</td>
                {/* Mengambil dari detail.ttl (sesuai form pengajuan domisili) */}
                <td className="col-val">{valOrDots(detail.ttl)}</td>
              </tr>
              <tr>
                <td className="col-label">JENIS KELAMIN</td>
                <td className="col-sep">:</td>
                <td className="col-val">{valOrDots(detail.jk)}</td>
              </tr>
              <tr>
                <td className="col-label">AGAMA</td>
                <td className="col-sep">:</td>
                <td className="col-val">{valOrDots(detail.agama)}</td>
              </tr>
              <tr>
                <td className="col-label">PEKERJAAN</td>
                <td className="col-sep">:</td>
                <td className="col-val">{valOrDots(detail.pekerjaan)}</td>
              </tr>
              <tr>
                <td className="col-label">ALAMAT</td>
                <td className="col-sep">:</td>
                <td className="col-val">
                    {valOrDots(detail.alamat_asal)} 
                    {detail.rt_rw ? ` (RT/RW: ${detail.rt_rw})` : ""}
                </td>
              </tr>
            </tbody>
          </table>

          <p style={{ marginTop: '20px', textAlign: 'justify' }}>
            Benar nama tersebut diatas adalah warga yang berdomisili / bertempat tinggal di Kelurahan Amban, 
            Distrik Manokwari Barat, Kabupaten Manokwari.
          </p>
          
          <p style={{ marginTop: '10px', textAlign: 'justify' }}>
            Surat Keterangan ini diberikan kepada yang bersangkutan untuk keperluan: <br/>
            <b>"{detail.keperluan || "......................................................................"}"</b>
          </p>

          <p style={{ marginTop: '10px' }}>
            Demikian surat keterangan ini dibuat dengan sebenarnya, untuk dapat dipergunakan sebagaimana mestinya.
          </p>
        </div>

        {/* TANDA TANGAN */}
        <div className="ttd-container">
          <div className="ttd-box">
            <p>Manokwari, {formatTgl(surat.tgl_surat)}</p>
            <p style={{ fontWeight: 'bold' }}>
                AN. LURAH AMBAN DISTRIK MANOKWARI BARAT<br />
                {pegawai_ttd?.jabatan || "KEPALA KELURAHAN"}
            </p>
            
            <div style={{ height: '40px' }}></div> 

            <div className="ttd-nama">{pegawai_ttd?.nama_lengkap || "...................................."}</div>
            <p>NIP. {pegawai_ttd?.nip || "...................................."}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DomisiliSurat;