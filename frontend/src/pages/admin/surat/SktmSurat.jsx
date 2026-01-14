import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../utils/api';
import html2pdf from 'html2pdf.js';
import './SktmSurat.css';
import logoMkw from './assets/logi-mkw.png';
import { Printer, Download } from 'lucide-react';

const SktmSurat = () => {
  const { id } = useParams();
  const [surat, setSurat] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Ref HANYA untuk kertas surat
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

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const element = suratRef.current;
    const namaFile = `SKTM_${surat?.nama_lengkap || 'Warga'}.pdf`;

    const opt = {
      margin:       0, // Margin 0 karena CSS .page sudah punya padding
      filename:     namaFile,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  // ... (Helper formatTgl, formatRupiah, valOrDots SAMA SEPERTI SEBELUMNYA) ...
  const formatTgl = (val) => val ? new Date(val).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }) : ".............................";
  const formatRupiah = (val) => val ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val) : "Rp .....................";
  const valOrDots = (val) => val ? val : "......................................................";

  if (loading) return <div>Loading...</div>;
  if (!surat) return <div>Data tidak ditemukan</div>;

  const { detail, pegawai_ttd } = surat; 

  return (
    // Gunakan class container-surat untuk background abu-abu
    <div className="container-surat">
      
      {/* Tombol dengan class 'no-print' agar hilang saat dicetak */}
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

      {/* Area Kertas Putih (Ref dipasang di sini) */}
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

        {/* ISI SURAT */}
        <div className="judul-container">
          <div className="judul-surat">SURAT KETERANGAN TIDAK MAMPU</div>
          <div className="nomor-surat">Nomor: {surat.no_surat_manual}</div>
        </div>

        <div className="content">
          <p>Yang bertanda tangan dibawah ini, Kepala Kelurahan Amban Distrik Manokwari Barat Menerangkan bahwa :</p>
          <table className="data-table">
            <tbody>
              <tr><td className="col-label">NAMA</td><td className="col-sep">:</td><td className="col-val">{valOrDots(detail.nama_ortu || detail.nama_ayah)}</td></tr>
              <tr><td className="col-label">TEMPAT TANGGAL LAHIR</td><td className="col-sep">:</td><td className="col-val">{valOrDots(detail.ttl_ortu)}</td></tr>
              <tr><td className="col-label">JENIS KELAMIN</td><td className="col-sep">:</td><td className="col-val">{valOrDots(detail.jk_ortu)}</td></tr>
              <tr><td className="col-label">UMUR</td><td className="col-sep">:</td><td className="col-val">{detail.umur_ortu ? detail.umur_ortu + " Tahun" : ".......... Tahun"}</td></tr>
              <tr><td className="col-label">PEKERJAAN</td><td className="col-sep">:</td><td className="col-val">{valOrDots(detail.pekerjaan_ortu)}</td></tr>
              <tr><td className="col-label">PENGHASILAN</td><td className="col-sep">:</td><td className="col-val">{formatRupiah(detail.penghasilan_ortu)}</td></tr>
              <tr><td className="col-label">ALAMAT</td><td className="col-sep">:</td><td className="col-val">{valOrDots(detail.alamat_ortu || detail.alamat_asal)}</td></tr>
            </tbody>
          </table>

          <p style={{ fontWeight: 'bold', margin: '10px 0' }}>Orang Tua dari:</p>

          <table className="data-table">
            <tbody>
              <tr><td className="col-label">NAMA</td><td className="col-sep">:</td><td className="col-val uppercase">{surat.nama_lengkap}</td></tr>
              <tr><td className="col-label">NIM/NIK</td><td className="col-sep">:</td><td className="col-val">{detail.nim || surat.nik}</td></tr>
              <tr><td className="col-label">FAKULTAS</td><td className="col-sep">:</td><td className="col-val">{valOrDots(detail.fakultas)}</td></tr>
              <tr><td className="col-label">PROGRAM STUDI</td><td className="col-sep">:</td><td className="col-val">{valOrDots(detail.prodi || detail.program_studi)}</td></tr>
            </tbody>
          </table>
          
          <p style={{marginTop: '15px'}}>
            Pada: <b>"{detail.kampus || "UNIVERSITAS PAPUA"}"</b> yang keadaan ekonominya lemah. Dikarenakan <b>Orang Tua Tidak Mampu.</b>
          </p>
          <p>Untuk Pengurusan: <b>{detail.keperluan || "Melengkapi Berkas ........................."}</b></p>
          <p>Demikian surat keterangan ini, dan tidak dipergunakan untuk kepentingan lainnya.</p>
        </div>

        <div className="ttd-container">
          <div className="ttd-box">
            <p>Manokwari, {formatTgl(surat.tgl_surat)}</p>
            <p style={{ fontWeight: 'bold' }}>AN. LURAH AMBAN  DISTRIK  MANOKWARI  BARAT <br />{pegawai_ttd?.jabatan || "KEPALA KELURAHAN"}</p>
            <div style={{ height: '20px' }}></div> 
            <div className="ttd-nama">{pegawai_ttd?.nama_lengkap || "...................................."}</div>
            <p>NIP. {pegawai_ttd?.nip || "...................................."}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SktmSurat;