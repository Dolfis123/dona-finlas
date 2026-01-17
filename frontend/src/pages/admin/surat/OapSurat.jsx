import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../utils/api'; 
import html2pdf from 'html2pdf.js';
import './SktmSurat.css'; // Gunakan CSS yang sama agar konsisten
import logoMkw from './assets/logi-mkw.png';
import { Printer, Download } from 'lucide-react';

const OapSurat = () => {
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

  // --- PRINT & DOWNLOAD ---
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const element = suratRef.current;
    const namaFile = `OAP_${surat?.nama_lengkap || 'Warga'}.pdf`;

    const opt = {
      margin:       0,
      filename:     namaFile,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  // Helper
  const formatTgl = (val) => val ? new Date(val).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }) : ".............................";
  const valOrDots = (val) => val ? val : "......................................................";

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (!surat) return <div className="text-center p-10">Data tidak ditemukan</div>;

  const { detail, pegawai_ttd } = surat; 

  return (
    <div className="container-surat">
      
      {/* TOMBOL AKSI */}
      <div className="no-print flex gap-4 mb-6">
        <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white text-gray-800 px-5 py-2 rounded shadow hover:bg-gray-100 font-bold"
        >
            <Printer size={18} /> Cetak (Browser)
        </button>
        {/* <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded shadow hover:bg-blue-700 font-bold"
        >
            <Download size={18} /> Unduh File PDF
        </button> */}
      </div>

      {/* KERTAS SURAT */}
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
            <span>JL. Gunung Salju. Amban</span>
            <span>Kode Pos: 98314</span>
          </div>
          <div className="garis-kop"></div>
        </div>

        {/* JUDUL */}
        <div className="judul-container">
          <div className="judul-surat">SURAT KETERANGAN ASLI PAPUA</div>
          <div className="nomor-surat">NOMOR: {surat.no_surat_manual || "660 / ....... / 2026"}</div>
        </div>

        {/* ISI */}
        <div className="content">
          <p>Yang bertandatangan di bawah ini, Kepala Kelurahan Amban Distrik Manokwari Barat. Menerangkan Dengan sesungguhnya :</p>
          
          {/* DATA PEMOHON */}
          <table className="data-table">
            <tbody>
              <tr>
                <td className="col-label">Nama</td>
                <td className="col-sep">:</td>
                <td className="col-val uppercase">{surat.nama_lengkap}</td>
              </tr>
              <tr>
                <td className="col-label">Tempat Tgl Lahir</td>
                <td className="col-sep">:</td>
                <td className="col-val">{valOrDots(detail.ttl)}</td>
              </tr>
              <tr>
                <td className="col-label">Jenis Kelamin</td>
                <td className="col-sep">:</td>
                <td className="col-val">{valOrDots(detail.jk)}</td>
              </tr>
              <tr>
                <td className="col-label">Agama</td>
                <td className="col-sep">:</td>
                <td className="col-val">{valOrDots(detail.agama)}</td>
              </tr>
              <tr>
                <td className="col-label">Pekerjaan</td>
                <td className="col-sep">:</td>
                <td className="col-val">{valOrDots(detail.pekerjaan)}</td>
              </tr>
              <tr>
                <td className="col-label">Alamat Sesuai KTP</td>
                <td className="col-sep">:</td>
                <td className="col-val">{valOrDots(detail.alamat_asal)}</td>
              </tr>
              <tr>
                <td className="col-label">RT/RW</td>
                <td className="col-sep">:</td>
                <td className="col-val">{valOrDots(detail.rt_rw)}</td>
              </tr>
            </tbody>
          </table>

          <p style={{ textIndent: '40px', marginTop: '10px', marginBottom: '10px' }}>
             Adalah warga kami yang berdomisili di Kelurahan Amban, Distrik Manokwari Barat. Dan yang bersangkutan diatas adalah <b>Benar - Benar Orang Asli Papua</b> dari :
          </p>

          {/* DATA ORANG TUA */}
          <table className="data-table">
            <tbody>
              {/* --- AYAH --- */}
              <tr>
                <td colSpan="3" style={{ fontWeight: 'bold', paddingTop: '10px', paddingBottom: '2px', textDecoration: 'underline' }}>
                    DATA AYAH
                </td>
              </tr>
              <tr>
                <td className="col-label">Nama Ayah</td>
                <td className="col-sep">:</td>
                <td className="col-val uppercase">{valOrDots(detail.nama_ayah)}</td>
              </tr>
              <tr>
                <td className="col-label">Tempat Tgl Lahir</td>
                <td className="col-sep">:</td>
                <td className="col-val">{valOrDots(detail.ttl_ayah)}</td>
              </tr>
              <tr>
                <td className="col-label">NIK</td>
                <td className="col-sep">:</td>
                <td className="col-val">{valOrDots(detail.nik_ayah)}</td>
              </tr>
              <tr>
                <td className="col-label">Pekerjaan</td>
                <td className="col-sep">:</td>
                <td className="col-val">{valOrDots(detail.pekerjaan_ayah)}</td>
              </tr>
              <tr>
                <td className="col-label">Alamat</td>
                <td className="col-sep">:</td>
                <td className="col-val">{valOrDots(detail.alamat_ayah)}</td>
              </tr>

              {/* --- IBU --- */}
              <tr>
                <td colSpan="3" style={{ fontWeight: 'bold', paddingTop: '15px', paddingBottom: '2px', textDecoration: 'underline' }}>
                    DATA IBU
                </td>
              </tr>
              <tr>
                <td className="col-label">Nama Ibu</td>
                <td className="col-sep">:</td>
                <td className="col-val uppercase">{valOrDots(detail.nama_ibu)}</td>
              </tr>
              <tr>
                <td className="col-label">Tanggal Lahir</td>
                <td className="col-sep">:</td>
                <td className="col-val">{valOrDots(detail.ttl_ibu)}</td>
              </tr>
              <tr>
                <td className="col-label">NIK</td>
                <td className="col-sep">:</td>
                <td className="col-val">{valOrDots(detail.nik_ibu)}</td>
              </tr>
              <tr>
                <td className="col-label">Pekerjaan</td>
                <td className="col-sep">:</td>
                <td className="col-val">{valOrDots(detail.pekerjaan_ibu)}</td>
              </tr>
              <tr>
                <td className="col-label">Alamat</td>
                <td className="col-sep">:</td>
                <td className="col-val">{valOrDots(detail.alamat_ibu)}</td>
              </tr>
            </tbody>
          </table>

          <p style={{ textIndent: '40px', marginTop: '15px' }}>
              Demikian Surat Keterangan ini dibuat supaya digunakan sebagaimana mestinya.
          </p>
        </div>

        {/* TANDA TANGAN */}
        <div className="ttd-container">
          <div className="ttd-box">
            <div style={{ marginBottom: '5px' }}>Manokwari, {formatTgl(surat.tgl_surat)}</div>
            <div style={{ fontWeight: 'bold', marginBottom: '80px', textTransform: 'uppercase' }}>
               AN. LURAH AMBAN <br/> DISTRIK MANOKWARI BARAT<br />
               {pegawai_ttd?.jabatan || "KEPALA KELURAHAN"}
            </div>
            <div style={{ textDecoration: 'underline', fontWeight: 'bold', textTransform: 'uppercase' }}>
               {pegawai_ttd?.nama_lengkap || "...................................."}
            </div>
            <div style={{ fontWeight: 'normal' }}>
               NIP. {pegawai_ttd?.nip || "...................................."}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OapSurat;