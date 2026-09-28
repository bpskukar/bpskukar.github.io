/* ============================================================================
   Angka hari ini — PINTAR Kukar
   Satu fakta per HARI KERJA (Senin–Jumat). Sabtu & Minggu menampilkan fakta
   Jumat. Kumpulan fakta dibangun dari data yang sudah dimuat situs:
   KATALOG (katalog data), KONFIG (jam & alamat PST), GLOSARIUM, DESCAN (Desa
   Cantik), dan IND (indikator strategis). Tidak ada angka yang ditulis tangan
   di sini selain jumlah modul Kelas Statistik Desa (mengikuti kartu gerbang).

   Urutan kumpulan = urutan tayang. Fakta baru diletakkan di depan; fakta
   indikator lama (yang sudah pernah tayang) di belakang, jadi tidak berulang
   sebelum seluruh kumpulan habis. Menambah fakta: tambahkan di bagian yang
   sesuai — ia otomatis masuk giliran.

   EPOCH = Senin 28 September 2026 (hari kerja ke-0). Jangan diubah, karena
   mengubahnya menggeser seluruh giliran.
   ========================================================================== */
window.FAKTA_HARIAN = (function () {
  "use strict";
  var EPOCH_UTC = Date.UTC(2026, 8, 28);           /* Senin */
  var fmt = function (n, dec) { return Number(n || 0).toLocaleString("id-ID", { minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0 }); };

  /* ---------- jadwal: tanggal WITA → nomor hari kerja & tanggal terbit ---------- */
  function jadwal(now) {
    var w = new Date((now || Date.now()) + 8 * 3600e3);                    /* geser ke WITA, baca sebagai UTC */
    var d = Date.UTC(w.getUTCFullYear(), w.getUTCMonth(), w.getUTCDate());
    var dow = new Date(d).getUTCDay(), akhirPekan = false;
    if (dow === 6) { d -= 864e5; akhirPekan = true; }                       /* Sabtu → Jumat */
    else if (dow === 0) { d -= 2 * 864e5; akhirPekan = true; }               /* Minggu → Jumat */
    var hari = Math.round((d - EPOCH_UTC) / 864e5);
    var idx = hari < 0 ? 0 : Math.floor(hari / 7) * 5 + Math.min(hari % 7, 4);
    return { idx: idx, terbit: new Date(d), akhirPekan: akhirPekan };
  }
  function labelTanggal(t) { return t.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }); }

  /* ---------- kumpulan fakta ---------- */
  function bangun(x) {
    var T = x.T, KAT = x.KATALOG, K = x.KONFIG || {}, G = x.GLOSARIUM, S = x.DESCAN, D = x.IND;
    var f = [];
    var F = function (o) { if (o && o.k) f.push(o); };
    var pst = "Sumber: Pelayanan Statistik Terpadu BPS Kabupaten Kutai Kartanegara";
    var booklet = "Sumber: Booklet Indikator Strategis BPS Kabupaten Kutai Kartanegara";

    /* ===== A. Katalog data & layanan PST ===== */
    var rows = KAT && KAT.DATA ? KAT.DATA : [];
    if (rows.length) {
      var n = function (p) { return rows.filter(p).length; };
      var ada = n(function (r) { return r.st === "ada"; }), desa = n(function (r) { return r.lv === "Desa"; }), kec = n(function (r) { return r.lv === "Kecamatan"; }), tidak = n(function (r) { return r.st === "tidak"; });
      F({ k: "Katalog PINTAR Kukar mencatat " + rows.length + " ragam data — " + ada + " di antaranya bisa diunduh langsung tanpa mengajukan permintaan.",
          c: "Cek dulu di katalog sebelum meminta data; sebagian besar sudah terbit dan tinggal diunduh.", s: pst,
          a: [{ t: "Buka katalog", h: T.katalog, u: 1 }] });
      if (desa) F({ k: desa + " ragam data di katalog tersedia sampai tingkat desa, dan " + kec + " sampai tingkat kecamatan.",
          c: "Level wilayah terendah tiap ragam data dinyatakan terbuka — tidak perlu bertanya dulu.", s: pst,
          a: [{ t: "Lihat data tingkat desa", h: T.katalog + "?level=Desa", u: 1 }] });
      if (tidak) F({ k: tidak + " ragam data secara metodologi tidak tersedia di tingkat kabupaten — katalog menjelaskan alasannya, bukan sekadar menolak.",
          c: "Biasanya karena berasal dari survei sampel yang hanya menjamin ketelitian sampai tingkat kabupaten.", s: pst,
          a: [{ t: "Lihat yang tidak tersedia", h: T.katalog + "?status=tidak", u: 1 }, { t: "Apa artinya?", h: T.katalog + "glosarium.html" }] });
      var topik = {}; rows.forEach(function (r) { topik[r.t] = (topik[r.t] || 0) + 1; });
      var urut = Object.keys(topik).sort(function (a, b) { return topik[b] - topik[a]; });
      if (urut.length >= 2) F({ k: "Topik terbanyak di katalog: " + urut[0] + " (" + topik[urut[0]] + " ragam data) dan " + urut[1] + " (" + topik[urut[1]] + ").",
          c: "Seluruhnya ada " + urut.length + " topik, dari kependudukan sampai potensi desa.", s: pst, a: [{ t: "Jelajahi per topik", h: T.katalog, u: 1 }] });
      var tautan = KAT.TAUTAN ? Object.keys(KAT.TAUTAN).length : 0;
      if (tautan) F({ k: "Setiap ragam data di katalog punya tautan langsung ke publikasi atau tabel BPS — " + tautan + " tautan sudah diverifikasi petugas.",
          c: "Klik satu baris di katalog, lalu buka tautannya: langsung ke berkasnya, bukan ke halaman pencarian.", s: pst, a: [{ t: "Buka katalog", h: T.katalog, u: 1 }] });
    }
    F({ k: "Konsultasi statistik dengan pegawai BPS Kukar bisa daring lewat Zoom — pilih jadwal sendiri, paling cepat untuk besok.",
        c: "Tidak perlu datang ke Tenggarong. Isi kebutuhan, data diri, dan jam yang diinginkan; tautan Zoom dikirim sebelum jadwal.", s: pst,
        a: [{ t: "Ajukan konsultasi", h: T.katalog + "konsultasi.html", u: 1 }] });
    F({ k: "Sudah mengajukan permintaan data? Cek statusnya dengan kode tiket dan empat digit terakhir nomor HP — tanpa membuat akun.",
        c: "Kode tiket dikirim saat permintaan dibuat. Perkembangannya bisa dipantau kapan saja.", s: pst,
        a: [{ t: "Cek status permintaan", h: T.katalog + "sahabat.html", u: 1 }] });
    F({ k: "Asisten PST menjawab otomatis dari katalog dan jawaban baku — pertanyaan yang belum terjawab baru diteruskan ke petugas.",
        c: "Coba tanyakan dengan bahasa sehari-hari, misalnya \"berapa orang miskin di Kukar\" atau \"ada data per desa nggak\".", s: pst,
        a: [{ t: "Tanya asisten", h: T.katalog + "?tanya=", u: 1 }] });
    if (G && G.length) F({ k: "Glosarium PINTAR Kukar memuat " + G.length + " istilah statistik dalam bahasa sehari-hari — dari IPM sampai garis kemiskinan.",
        c: "Tiap istilah dijelaskan artinya, cara menghitungnya, dan salah kaprah yang sering terjadi.", s: pst,
        a: [{ t: "Buka glosarium", h: T.katalog + "glosarium.html", u: 1 }] });
    if (K.JAM_LAYANAN) F({ k: "Layanan tatap muka PST BPS Kabupaten Kutai Kartanegara: " + K.JAM_LAYANAN + (K.ALAMAT ? ", di " + K.ALAMAT : "") + ".",
        c: "Seluruh layanan konsultasi dan perpustakaan gratis." + (K.TELEPON ? " Telepon " + K.TELEPON + "." : ""), s: pst,
        a: [{ t: "Layanan PST", h: T.katalog, u: 1 }] });

    /* ===== B. Desa Cantik ===== */
    if (S && S.ringkas) {
      var R = S.ringkas, L = S.linimasa || [], ds = T.descan || "/desa-cantik-bpskukar/";
      F({ k: "Sejak " + R.tahunMulai + ", " + R.totalDesa + " desa dan kelurahan di Kutai Kartanegara dibina menjadi Desa Cinta Statistik.",
          c: "Yang dibina adalah kemampuan perangkat desa mengumpulkan, mengolah, dan memakai datanya sendiri — bukan memasang aplikasi.", s: "Sumber: BPS Kabupaten Kutai Kartanegara, pemberitaan resmi tertaut di halaman Desa Cantik",
          a: [{ t: "Lihat capaian Desa Cantik", h: ds, u: 1 }] });
      var juara = L.filter(function (l) { return l.peringkat; }).map(function (l) { return l.tahun; });
      if (juara.length) F({ k: "Desa binaan Kukar menjadi Desa Cantik terbaik se-Kalimantan Timur " + juara.length + " tahun berturut-turut (" + juara.join(", ") + ").",
          c: R.capaianNasional ? "Capaian nasional tertinggi: " + R.capaianNasional + "." : "", s: "Sumber: pemberitaan resmi, tertaut di lini masa Desa Cantik",
          a: [{ t: "Lini masa pembinaan", h: ds + "#linimasa", u: 1 }] });
      L.forEach(function (l) {
        if (!l.prestasi || !l.desa || !l.desa.length) return;
        var prestasi = l.prestasi.replace(/ · /g, ", "), k;
        if (l.desa.length === 1) k = l.tahun + ": Desa " + l.desa[0].nama + (l.desa[0].kecamatan ? " (Kec. " + l.desa[0].kecamatan + ")" : "") + " — " + prestasi + ".";
        else {
          var kecs = l.desa.map(function (d) { return d.kecamatan; }).filter(function (v, i, a) { return v && a.indexOf(v) === i; });
          var juara = l.desa.filter(function (d) { return d.catatan; })[0] || l.desa[0];
          k = l.tahun + ": " + l.desa.length + " desa dibina" + (kecs.length === 1 ? " di Kecamatan " + kecs[0] : "") + " — " + l.desa.map(function (d) { return d.nama; }).join(", ") + ". " + juara.nama + " " + prestasi.charAt(0).toLowerCase() + prestasi.slice(1) + ".";
        }
        F({ k: k,
            c: l.isi || "", s: "Sumber: " + (l.rujukan && l.rujukan.length ? l.rujukan.length + " pemberitaan resmi, tertaut di lini masa Desa Cantik" : "BPS Kabupaten Kutai Kartanegara"),
            a: [{ t: "Baca selengkapnya", h: ds + "#linimasa", u: 1 }] });
      });
      F({ k: "Kelas Statistik Desa: 15 modul dan 106 soal latihan, terbuka untuk siapa saja tanpa pendaftaran.",
          c: "Dua jalur — Baca Angka (5 modul) untuk siapa pun, dan Statistik Desa (10 modul) yang mengikuti kurikulum pembinaan Desa Cantik.", s: "Sumber: Kelas Statistik Desa, PINTAR Kukar",
          a: [{ t: "Mulai belajar", h: ds + "kelas.html", u: 1 }] });
    }

    /* ===== C. Indikator strategis lanjutan ===== */
    if (D && D.indikator) {
      var by = {}; D.indikator.forEach(function (it) { by[it.id] = it; });
      var v = function (id) { return by[id] ? Number(by[id].value) : NaN; };
      var th = function (it) { var m = String(it && it.abbr || "").match(/20\d\d/); return m ? m[0] : ""; };
      var ind = function (id, k, c, anchor, glos) { if (by[id] && !isNaN(v(id))) F({ k: k, c: c || "", s: booklet, it: by[id], glos: glos || id, anchor: anchor || "#ringkasan", a: [{ t: "Lihat grafiknya", h: T.indikator + (anchor || "#ringkasan"), u: 1 }, { t: "Apa artinya?", h: T.katalog + "glosarium.html#" + (glos || id) }] }); };
      var W = D.wilayah || [], B = D.banding || {}, kukar = W.filter(function (w) { return w.home; })[0];
      var rank = function (kunci, naik) { if (!kukar || !W.length) return null; var s = W.slice().filter(function (w) { return w[kunci] != null; }).sort(function (a, b) { return naik ? a[kunci] - b[kunci] : b[kunci] - a[kunci]; }); var i = s.indexOf(kukar); return i < 0 ? null : { pos: i + 1, dari: s.length }; };
      var rIpm = rank("ipm"), rMiskin = rank("miskin", true);
      var pendudukW = W.map(function (w) { return { w: w, n: (w.laki || 0) + (w.perempuan || 0) }; }).filter(function (o) { return o.n > 0; }).sort(function (a, b) { return b.n - a.n; });
      var rPend = pendudukW.map(function (o) { return o.w; }).indexOf(kukar) + 1;

      if (by.ipm && B.provIpm && rIpm) ind("ipm", "IPM Kukar " + fmt(v("ipm"), 2) + " — peringkat " + rIpm.pos + " dari " + rIpm.dari + " kabupaten/kota di Kalimantan Timur (provinsi: " + fmt(B.provIpm, 2) + ").",
        "IPM mengukur umur panjang, pengetahuan, dan standar hidup layak.", "#manusia");
      if (by.p0 && B.provMiskin && rMiskin) ind("p0", "Persentase penduduk miskin Kukar " + fmt(v("p0"), 2) + "% — " + (v("p0") < B.provMiskin ? "lebih rendah" : "lebih tinggi") + " dari rata-rata Kaltim " + fmt(B.provMiskin, 2) + "%; urutan ke-" + rMiskin.pos + " terendah dari " + rMiskin.dari + " kabupaten/kota.",
        "", "#kemiskinan");
      if (by.penduduk && rPend) ind("penduduk", "Dengan " + fmt(v("penduduk"), 0) + " jiwa, Kukar adalah kabupaten/kota berpenduduk terbanyak ke-" + rPend + " di Kalimantan Timur.", "", "#kependudukan");
      if (by.uhh && B.provUhh) ind("uhh", "Umur harapan hidup Kukar " + fmt(v("uhh"), 2) + " tahun — Kaltim " + fmt(B.provUhh, 2) + " tahun.", "Perkiraan lama hidup bayi yang lahir tahun ini bila pola kematian tidak berubah.", "#manusia");
      if (by.hls && B.provHls) ind("hls", "Harapan lama sekolah anak Kukar " + fmt(v("hls"), 2) + " tahun — Kaltim " + fmt(B.provHls, 2) + " tahun.", "", "#manusia");
      if (by.rls && B.provRls) ind("rls", "Rata-rata lama sekolah penduduk dewasa Kukar " + fmt(v("rls"), 2) + " tahun — Kaltim " + fmt(B.provRls, 2) + " tahun.", "", "#manusia");
      if (by.ppp && B.provPpp) ind("ppp", "Pengeluaran riil per kapita Kukar sekitar Rp" + fmt(v("ppp") / 1000, 1) + " juta per orang per tahun — Kaltim Rp" + fmt(B.provPpp / 1000, 1) + " juta.", "Sudah disesuaikan dengan daya beli, jadi bisa dibandingkan antarwilayah.", "#manusia");
      if (by.gini && B.provGini) ind("gini", "Rasio Gini Kukar " + fmt(v("gini"), 3) + " — Kaltim " + fmt(B.provGini, 3) + ". Semakin mendekati 0, pengeluaran semakin merata.", "", "#kemiskinan");
      if (by.tpt && B.provTpt) ind("tpt", "Tingkat pengangguran terbuka Kukar " + fmt(v("tpt"), 2) + "% — Kaltim " + fmt(B.provTpt, 2) + "%.", "", "#kependudukan");
      if (by.ikg) ind("ikg", "Indeks Ketimpangan Gender Kukar " + fmt(v("ikg"), 3) + (th(by.ikg) ? " (" + th(by.ikg) + ")" : "") + " — semakin kecil, semakin setara capaian perempuan dan laki-laki.", "", "#kemiskinan");
      if (by["pdrb-adhb"]) ind("pdrb-adhb", "PDRB Kukar atas dasar harga berlaku Rp" + fmt(v("pdrb-adhb"), 2) + " miliar" + (th(by["pdrb-adhb"]) ? " (" + th(by["pdrb-adhb"]) + ")" : "") + " — ukuran skala ekonomi daerah.", "Sebagian besar disumbang pertambangan dan penggalian.", "#ekonomi");
      if (by["pdrb-adhk"]) ind("pdrb-adhk", "PDRB Kukar atas dasar harga konstan Rp" + fmt(v("pdrb-adhk"), 2) + " miliar" + (th(by["pdrb-adhk"]) ? " (" + th(by["pdrb-adhk"]) + ")" : "") + " — nilai riil tanpa pengaruh inflasi.", "", "#ekonomi");

      var seri = function (o, kunci, dec, satuan, judul, anchor, glos, catatan, awalan) {
        if (!o || !o.label || !o[kunci] || o[kunci].length < 2) return;
        var a = o[kunci][0], b = o[kunci][o[kunci].length - 1], l0 = String(o.label[0]).replace(/\*/g, ""), l1 = String(o.label[o.label.length - 1]).replace(/\*/g, "");
        var arah = b > a ? "naik" : b < a ? "turun" : "tetap", aw = awalan || "";
        F({ k: judul + " " + arah + " dari " + aw + fmt(a, dec) + satuan + " (" + l0 + ") menjadi " + aw + fmt(b, dec) + satuan + " (" + l1 + ").", c: catatan || "", s: booklet,
            a: [{ t: "Lihat grafiknya", h: T.indikator + anchor, u: 1 }, { t: "Apa artinya?", h: T.katalog + "glosarium.html#" + glos }] });
      };
      seri(D.kemiskinan, "p0", 2, "%", "Persentase penduduk miskin Kukar", "#kemiskinan", "p0", "Lima tahun terakhir, dari Booklet Indikator Strategis.");
      seri(D.ipm, "nilai", 2, "", "IPM Kukar", "#manusia", "ipm", "");
      seri(D.pdrbTahun, "lpe", 2, "%", "Pertumbuhan ekonomi Kukar", "#ekonomi", "lpe", "Tanda * berarti angka sementara.");
      seri(D.kemiskinan, "garis", 0, " per kapita per bulan", "Garis kemiskinan Kukar", "#kemiskinan", "garis-kemiskinan", "Penduduk tergolong miskin bila pengeluaran per kapita per bulan di bawah angka ini.", "Rp");
      if (D.kemiskinan && D.kemiskinan.p1 && D.kemiskinan.p1.length) { var p1 = D.kemiskinan.p1[D.kemiskinan.p1.length - 1], lp = String(D.kemiskinan.label.slice(-1)[0]);
        F({ k: "Indeks kedalaman kemiskinan (P1) Kukar " + fmt(p1, 2) + " (" + lp + ") — semakin kecil, semakin dekat pengeluaran penduduk miskin ke garis kemiskinan.", c: "", s: booklet,
            a: [{ t: "Lihat grafiknya", h: T.indikator + "#kemiskinan", u: 1 }, { t: "Apa artinya?", h: T.katalog + "glosarium.html#p1" }] }); }
      if (D.ipm && D.ipm.komponen && D.ipm.komponen.length) F({ k: "IPM disusun dari " + D.ipm.komponen.length + " komponen: " + D.ipm.komponen.map(function (c) { return c.nama.toLowerCase() + " " + c.nilai + " " + String(c.satuan).replace(/ribu Rp/i, "ribu rupiah"); }).join(", ") + ".",
          c: D.ipm.sub || "", s: booklet, a: [{ t: "Lihat komponennya", h: T.indikator + "#manusia", u: 1 }, { t: "Apa artinya?", h: T.katalog + "glosarium.html#ipm" }] });
      (D.demografiStat || []).forEach(function (s) { F({ k: s.label + " Kukar: " + s.value + ".", c: "", s: booklet, a: [{ t: "Lihat kependudukan", h: T.indikator + "#kependudukan", u: 1 }] }); });
      if (D.generasi && D.generasi.length) { var g = D.generasi.slice().sort(function (a, b) { return b.nilai - a.nilai; })[0];
        F({ k: "Kelompok penduduk terbesar di Kukar adalah " + g.nama + " (" + g.ket.toLowerCase() + "): " + fmt(g.nilai, 1) + "% dari seluruh penduduk.", c: "Komposisi: " + D.generasi.map(function (x) { return x.nama + " " + fmt(x.nilai, 1) + "%"; }).join(", ") + ".", s: booklet,
            a: [{ t: "Lihat kependudukan", h: T.indikator + "#kependudukan", u: 1 }] }); }
      ((D.sorotan || {}).ekonomi || []).forEach(function (s) {
        var ket = String(s.ket || ""), sektor = /tercepat/i.test(s.judul) ? ket.split(" — ")[0] : "";
        F({ k: sektor ? s.judul.replace(/,\s*TW/, " di Kukar TW") + ": " + sektor + " (" + s.nilai + ")." : (/kontribusi/i.test(s.judul) ? "Kontribusi Kukar terhadap PDRB Kaltim: " + s.nilai + "." : s.judul + " Kukar: " + s.nilai + "."),
            c: sektor ? ket.split(" — ").slice(1).join(" — ") : ket, s: booklet, a: [{ t: "Lihat ekonomi", h: T.indikator + "#ekonomi", u: 1 }] }); });

      /* ===== D. Fakta indikator yang sudah pernah tayang — diletakkan terakhir ===== */
      var thk = function (it) { var y = th(it); return y ? " (" + y + ")" : ""; };
      if (by.p0 && v("p0") > 0) ind("p0", fmt(v("p0"), 2) + "% penduduk Kukar tergolong miskin" + thk(by.p0) + " — kira-kira 1 dari " + Math.round(100 / v("p0")) + " orang.", "", "#kemiskinan");
      ind("penduduk", "Penduduk Kutai Kartanegara " + fmt(v("penduduk"), 0) + " jiwa" + (by.penduduk && by.penduduk.tag ? " — " + by.penduduk.tag : "") + ".", "", "#kependudukan");
      ind("tpt", "Dari 100 orang angkatan kerja di Kukar, sekitar " + Math.round(v("tpt")) + " orang menganggur (TPT " + fmt(v("tpt"), 2) + "%)" + thk(by.tpt) + ".", "", "#kependudukan");
      if (by.ipm) ind("ipm", "IPM Kukar " + fmt(v("ipm"), 2) + thk(by.ipm) + " — kategori " + (v("ipm") >= 80 ? "sangat tinggi" : v("ipm") >= 70 ? "tinggi" : v("ipm") >= 60 ? "sedang" : "rendah") + ".", "", "#manusia");
      ind("lpe", "Ekonomi Kukar tumbuh " + fmt(v("lpe"), 2) + "%" + thk(by.lpe) + " — dihitung atas dasar harga konstan.", "", "#ekonomi");
      ind("uhh", "Bayi yang lahir di Kukar diperkirakan hidup " + fmt(v("uhh"), 2) + " tahun.", "", "#manusia");
      if (by.rls) ind("rls", "Orang dewasa Kukar rata-rata bersekolah " + fmt(v("rls"), 2) + " tahun — " + (v("rls") >= 12 ? "setara tamat SMA" : v("rls") >= 9 ? "setara tamat SMP" : "belum tamat SMP") + ".", "", "#manusia");
      ind("hls", "Anak Kukar yang masuk SD sekarang diharapkan bersekolah " + fmt(v("hls"), 2) + " tahun.", "", "#manusia");
      if (by.gini) ind("gini", "Rasio Gini Kukar " + fmt(v("gini"), 3) + " — ketimpangan pengeluaran " + (v("gini") < 0.3 ? "rendah" : v("gini") <= 0.5 ? "sedang" : "tinggi") + ".", "", "#kemiskinan");
      ind("tpak", fmt(v("tpak"), 2) + "% penduduk usia kerja Kukar bekerja atau sedang mencari kerja (TPAK).", "", "#kependudukan");
      ind("pdrb-kapita", "PDRB per kapita Kukar Rp" + fmt(v("pdrb-kapita"), 1) + " juta per tahun — bukan pendapatan per orang.", "", "#ekonomi");
      ind("rentan", fmt(v("rentan"), 2) + "% penduduk Kukar rentan miskin: tidak miskin, tetapi mudah jatuh miskin bila ada guncangan.", "", "#kemiskinan");
      ind("lpp", "Penduduk Kukar bertambah " + fmt(v("lpp"), 2) + "% per tahun — sekitar " + Math.round(v("lpp") * 10) + " orang tiap 1.000 penduduk.", "", "#kependudukan");
      ind("ppp", "Pengeluaran per kapita Kukar (disesuaikan daya beli) sekitar Rp" + fmt(v("ppp") / 1000, 1) + " juta per orang per tahun.", "", "#manusia");
    }
    return f;
  }
  return { bangun: bangun, jadwal: jadwal, labelTanggal: labelTanggal, EPOCH_UTC: EPOCH_UTC };
})();
