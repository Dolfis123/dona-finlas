const { ArsipSurat, Pegawai } = require("../models");
const fs = require("fs-extra");
const path = require("path");
const handlebars = require("handlebars");
const puppeteer = require("puppeteer");
const moment = require("moment");

// Set locale bahasa Indonesia untuk format tanggal (contoh: 12 Januari 2026)
moment.locale("id");

exports.cetakSuratPDF = async (req, res) => {
  try {
    const { id_arsip } = req.params;

    // 1. AMBIL DATA DARI DATABASE
    // Kita butuh data arsip surat beserta data pegawai yang tanda tangan
    const dataArsip = await ArsipSurat.findOne({
      where: { id_arsip },
      include: [
        {
          model: Pegawai,
          as: "pegawai_ttd", // Sesuai alias di models/index.js
        },
      ],
    });

    if (!dataArsip) {
      return res.status(404).json({ message: "Arsip surat tidak ditemukan." });
    }

    // 2. PERSIAPAN DATA JSON
    // Data detail form tersimpan dalam format JSON di database
    // Sequelize biasanya otomatis mengubah JSON menjadi Object, tapi kita jaga-jaga
    let detail = dataArsip.data_form_final || {};
    if (typeof detail === "string") {
      try {
        detail = JSON.parse(detail);
      } catch (e) {
        detail = {};
      }
    }

    // 3. LOGIKA PEMILIHAN TEMPLATE HTML
    // Kita cek 'jenis_surat_snapshot' untuk menentukan pakai template mana
    const jenisSuratUpper = (dataArsip.jenis_surat_snapshot || "").toUpperCase();
    
    let templateFile = ""; // Nama file HTML
    let dataToRender = {}; // Data yang akan dimasukkan ke {{variable}}

    // Data Umum (Header & Footer yang mirip)
    const commonData = {
      no_surat: dataArsip.no_surat_manual,
      tahun: moment(dataArsip.tgl_surat).format("YYYY"),
      tgl_surat_format: moment(dataArsip.tgl_surat).format("DD MMMM YYYY"),
      
      // Data Pejabat TTD
      nama_pejabat: dataArsip.pegawai_ttd ? dataArsip.pegawai_ttd.nama_lengkap : "Pejabat",
      nip_pejabat: dataArsip.pegawai_ttd ? dataArsip.pegawai_ttd.nip : "-",
      jabatan_pejabat: dataArsip.pegawai_ttd ? dataArsip.pegawai_ttd.jabatan : "LURAH",
    };

    // --- LOGIKA PERCABANGAN ---

    if (jenisSuratUpper.includes("TIDAK MAMPU") || jenisSuratUpper.includes("SKTM")) {
      // === KASUS 1: SURAT KETERANGAN TIDAK MAMPU (SKTM) ===
      templateFile = "surat_sktm.html";
      
      dataToRender = {
        ...commonData,
        // Data Orang Tua (Diambil dari Form JSON)
        nama_ortu: detail.nama_ortu || "-",
        ttl_ortu: detail.ttl_ortu || "-", 
        jk_ortu: detail.jk_ortu || "-",
        umur_ortu: detail.umur_ortu || "-",
        pekerjaan_ortu: detail.pekerjaan_ortu || "-",
        // Format uang (Rp 1.000.000)
        penghasilan_ortu: detail.penghasilan_ortu 
          ? new Intl.NumberFormat("id-ID").format(detail.penghasilan_ortu) 
          : "-",
        alamat: detail.alamat_ortu || detail.alamat_asal || "-", // Coba cari alamat ortu, kalau null pakai alamat asal

        // Data Mahasiswa (Anak)
        nama_mhs: dataArsip.nama_lengkap, // Nama mahasiswa adalah nama pemohon (dari akun/NIK)
        nim_mhs: detail.nim || "-",
        fakultas: detail.fakultas || "-",
        prodi: detail.prodi || "-",
        
        keperluan: detail.keperluan || "Melengkapi Berkas Beasiswa"
      };

    } else {
      // === KASUS 2: SURAT DOMISILI (Dan Default) ===
      // Jika surat domisili atau jenis lain, kita pakai format standar domisili
      templateFile = "surat_domisili.html";

      dataToRender = {
        ...commonData,
        nama_lengkap: dataArsip.nama_lengkap,
        // Gabungkan Tempat & Tanggal Lahir jika terpisah di JSON
        ttl: detail.ttl || (detail.tempat_lahir ? `${detail.tempat_lahir}, ${detail.tgl_lahir}` : "-"),
        jk: detail.jk || "-",
        agama: detail.agama || "-",
        pekerjaan: detail.pekerjaan || "-",
        alamat: detail.alamat_asal || "-",
        rt_rw: detail.rt_rw || "-",
        nik: dataArsip.nik,
        
        keperluan: detail.keperluan || "Administrasi Kependudukan"
      };
    }

    // 4. BACA TEMPLATE HTML
    const templatePath = path.join(__dirname, `../templates/${templateFile}`);
    
    // Cek apakah file template ada
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template HTML tidak ditemukan: ${templateFile}. Pastikan file ada di folder src/templates/`);
    }

    const templateHtml = await fs.readFile(templatePath, "utf-8");

    // 5. COMPILE DENGAN HANDLEBARS
    const template = handlebars.compile(templateHtml);
    const finalHtml = template(dataToRender);

    // 6. GENERATE PDF DENGAN PUPPETEER
    // Menggunakan headless: 'new' untuk versi Puppeteer terbaru
    const browser = await puppeteer.launch({ 
      headless: "new", 
      args: ["--no-sandbox", "--disable-setuid-sandbox"] 
    });
    
    const page = await browser.newPage();
    
    // Set konten HTML ke halaman virtual browser
    await page.setContent(finalHtml, { waitUntil: "networkidle0" });

    // Cetak PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true, // Agar background/garis tebal tercetak
      margin: {
        top: "1cm",
        right: "2cm", // Margin kanan agak besar sedikit
        bottom: "1cm",
        left: "2.5cm", // Margin kiri besar untuk jilid/holes
      },
    });

    await browser.close();

    // 7. KIRIM RESPON KE CLIENT (BROWSER)
    const namaFile = `${jenisSuratUpper.replace(/\s/g, "_")}-${dataArsip.nik}.pdf`;
    
    res.set({
      "Content-Type": "application/pdf",
      "Content-Length": pdfBuffer.length,
      // 'inline' berarti buka di tab baru. Kalau mau auto-download ganti jadi 'attachment'
      "Content-Disposition": `inline; filename="${namaFile}"`,
    });

    res.send(pdfBuffer);

  } catch (error) {
    console.error("Error Cetak PDF:", error);
    res.status(500).json({ 
      message: "Gagal mencetak surat.", 
      error: error.message 
    });
  }
};