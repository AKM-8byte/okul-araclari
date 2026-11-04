// Okul Araçları — service worker
// Yeni araç/dosya eklenince PRECACHE listesine ekleyin ve VERSION değerini artırın.
const VERSION = 'oa-v1';
const PRECACHE = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "araclar/belirli-gunler.html",
  "araclar/ders-programi.html",
  "araclar/duyuru.html",
  "araclar/grup.html",
  "araclar/katilim.html",
  "araclar/nobet.html",
  "araclar/not-cizelgesi.html",
  "araclar/not-hesapla.html",
  "araclar/resmi-yazi.html",
  "araclar/secici.html",
  "araclar/sertifika.html",
  "araclar/sinav-plani.html",
  "araclar/sinav-puan.html",
  "araclar/siniflar.html",
  "araclar/sira.html",
  "araclar/tutanak.html",
  "araclar/yillik-plan.html",
  "araclar/yoklama.html",
  "araclar/zamanlayici.html",
  "assets/common.js",
  "assets/style.css",
  "assets/belirli-gunler.js",
  "assets/fonts.css",
  "assets/fonts/nunito-latin-ext.woff2",
  "assets/fonts/nunito-latin.woff2",
  "assets/vendor/qrcode.min.js",
  "assets/vendor/xlsx.full.min.js",
  "assets/icons/apple-touch-icon.png",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",
  "assets/icons/maskable-512.png"
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Önce önbellek, arka planda güncelle (yeni sürüm bir sonraki açılışta gelir).
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || !/^https?:/.test(req.url)) return;
  e.respondWith(
    caches.open(VERSION).then(async cache => {
      const hit = await cache.match(req, { ignoreSearch: true });
      const net = fetch(req).then(res => {
        if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
        return res;
      }).catch(() => null);
      if (hit) { e.waitUntil(net); return hit; }
      const res = await net;
      if (res) return res;
      if (req.mode === 'navigate') return (await cache.match('index.html')) || Response.error();
      return Response.error();
    })
  );
});
