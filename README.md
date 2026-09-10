# PINTAR Kukar — beranda pintu

**Pusat Informasi & Layanan Statistik Terpadu** BPS Kabupaten Kutai Kartanegara.
Repositori ini berisi beranda `https://bpskukar.github.io/` — pintu masuk tunggal ke dua
gerbang yang sudah ada:

| Gerbang | Situs | Repositori |
|---|---|---|
| **Angka** — Indikator Strategis Kukar | `/indikator-strategis-bpskukar/` | `indikator-strategis-bpskukar` |
| **Layanan** — Katalog Data & PST (tiket, konsultasi Zoom, asisten, ruang pegawai) | `/katalog-data-bpskukar/` | `katalog-data-bpskukar` |

Karena repositori ini bernama persis `bpskukar.github.io`, GitHub Pages menayangkannya di
akar domain, sehingga kedua situs itu secara alami "berada di bawahnya".

## Isi beranda

- **Pencarian terpadu** — satu kotak untuk angka dan ragam data: hasil kiri dari indikator
  strategis (nilai + tautan ke grafiknya), hasil kanan dari katalog (status ketersediaan +
  tautan ke katalog dengan pencarian terisi), plus tautan *Tanya asisten PST*.
- **Hari ini** — *Angka hari ini* (satu fakta berganti tiap hari dari isi indikator terbit; kirim ke
  WhatsApp, unduh kartu gambar) dan *Terbit baru dari BPS Kukar* + agenda rilis mendatang (dari
  tabel `terbitan` Supabase; cadangan `terbitan-awal.js` katalog).
- **Dua gerbang** — kartu Indikator Strategis (oranye) dan Katalog Data & Layanan (biru).
- **Angka sorotan** — empat angka kunci dari isi terbit yang dikelola pegawai.
- **Layanan cepat** — konsultasi daring, cek tiket, asisten, glosarium, bandingkan kab/kota, ruang pegawai.
- **Pasang di HP** — spanduk pemasangan aplikasi (PWA).
- **Alur "dari angka ke layanan"** — lihat → minta → konsultasi.
- **Tentang & kontak** — alamat, jam layanan, telepon, surel (dibaca dari `config.js` katalog).

## Berkas

```
index.html            beranda (gaya di dalam berkas)
manifest.webmanifest  manifes aplikasi (PWA) — berlaku untuk ketiga situs (scope /)
sw.js                 service worker: jaringan dulu, salinan bila luring; naikkan VERSI tiap ada berkas berubah
luring.html           halaman saat tidak ada sambungan
assets/pintar.js      bilah PINTAR Kukar + tema + tombol Pasang + pendaftaran service worker — IDENTIK dengan dua repositori lain
assets/ikon/          ikon aplikasi (192, 512, maskable, apple-touch-icon)
assets/og-pintar.png  gambar pratinjau WhatsApp
README.md
```

Beranda membaca empat berkas dari situs saudara (satu domain, tanpa salinan):
`/katalog-data-bpskukar/assets/config.js`, `…/katalog.js`, `…/cari.js`, dan
`/indikator-strategis-bpskukar/assets/data.js` + `…/muat.js`. Bila salah satu belum
terpasang, beranda tetap tampil; hanya pencarian atau angka sorotannya yang kosong.

## Mengubah bilah PINTAR

`assets/pintar.js` memuat daftar tautan (`TAUTAN`) dan menu (`MENU`). Setelah diubah,
salin berkas yang sama ke `assets/pintar.js` di repositori indikator dan katalog supaya
ketiganya tetap seragam.

## Lisensi

Kode sumber: MIT. Data statistik milik dan bersumber dari Badan Pusat Statistik.
