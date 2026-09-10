/* ============================================================================
   PINTAR Kukar — service worker (repositori bpskukar.github.io, jalur /sw.js)
   Melayani ketiga situs karena satu domain: beranda, indikator, katalog.

   Aturan:
   • Berkas situs sendiri: coba jaringan dulu (maks 4 detik), simpan salinan;
     bila gagal/lambat → salinan tersimpan; bila belum ada → halaman luring.
   • Pustaka dari CDN & font: pakai salinan dulu, perbarui di belakang layar.
   • Supabase / Web API: tidak pernah disimpan (data langsung, ada sesi).
   Nomor VERSI diubah tiap terbit agar salinan lama dibersihkan.
   ========================================================================== */
var VERSI = "pintar-2026-09-10b";
var LURING = "/luring.html";
var AWAL = [
  "/", "/index.html", LURING, "/manifest.webmanifest", "/assets/pintar.js",
  "/assets/ikon/ikon-192.png", "/assets/ikon/ikon-512.png",
  "/indikator-strategis-bpskukar/", "/indikator-strategis-bpskukar/index.html",
  "/indikator-strategis-bpskukar/assets/app.js", "/indikator-strategis-bpskukar/assets/data.js",
  "/indikator-strategis-bpskukar/assets/muat.js", "/indikator-strategis-bpskukar/assets/style.css",
  "/katalog-data-bpskukar/", "/katalog-data-bpskukar/index.html",
  "/katalog-data-bpskukar/konsultasi.html", "/katalog-data-bpskukar/sahabat.html", "/katalog-data-bpskukar/glosarium.html",
  "/katalog-data-bpskukar/assets/theme.css", "/katalog-data-bpskukar/assets/config.js",
  "/katalog-data-bpskukar/assets/app.js", "/katalog-data-bpskukar/assets/katalog.js",
  "/katalog-data-bpskukar/assets/cari.js", "/katalog-data-bpskukar/assets/chat.js",
  "/katalog-data-bpskukar/assets/pengetahuan.js", "/katalog-data-bpskukar/assets/glosarium.js", "/katalog-data-bpskukar/assets/terbitan-awal.js",
  "/indikator-strategis-bpskukar/assets/kartu.js",
  "/katalog-data-bpskukar/assets/konsultasi.js", "/katalog-data-bpskukar/assets/sahabat.js"
];
var CDN = /^(https:\/\/cdn\.jsdelivr\.net|https:\/\/cdnjs\.cloudflare\.com|https:\/\/fonts\.googleapis\.com|https:\/\/fonts\.gstatic\.com)\//;
var JANGAN = /supabase\.co|webapi\.bps\.go\.id|wa\.me|api\.whatsapp\.com/;

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSI).then(function (c) {
    /* satu per satu supaya berkas yang belum ada (situs belum terpasang) tidak menggagalkan pemasangan */
    return Promise.all(AWAL.map(function (u) { return c.add(u).catch(function () {}); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== VERSI; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function denganBatas(janji, ms) {
  return new Promise(function (res, rej) {
    var t = setTimeout(function () { rej(new Error("lambat")); }, ms);
    janji.then(function (r) { clearTimeout(t); res(r); }, function (er) { clearTimeout(t); rej(er); });
  });
}

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = req.url;
  if (JANGAN.test(url)) return;                         /* data langsung: biarkan */
  var sendiri = url.indexOf(self.location.origin) === 0;

  if (sendiri) {
    /* jaringan dulu, salinan bila gagal; halaman luring bila navigasi tanpa salinan */
    e.respondWith(
      denganBatas(fetch(req), 4000).then(function (r) {
        if (r && r.ok) { var salin = r.clone(); caches.open(VERSI).then(function (c) { c.put(req, salin); }); }
        return r;
      }).catch(function () {
        return caches.match(req, { ignoreSearch: true }).then(function (c) {
          if (c) return c;
          if (req.mode === "navigate") return caches.match(LURING);
          return Response.error();
        });
      })
    );
    return;
  }
  if (CDN.test(url)) {
    /* salinan dulu, perbarui di belakang */
    e.respondWith(caches.open(VERSI).then(function (c) {
      return c.match(req).then(function (ada) {
        var segar = fetch(req).then(function (r) { if (r && (r.ok || r.type === "opaque")) c.put(req, r.clone()); return r; }).catch(function () { return ada; });
        return ada || segar;
      });
    }));
  }
});

self.addEventListener("message", function (e) {
  if (e.data === "lewati") self.skipWaiting();
});
