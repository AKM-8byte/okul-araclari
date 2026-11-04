// Belirli gün ve haftalar — Belirli Gün ve Haftalar Takvimi ile Yıllık Plan Oluşturucu ortak kullanır.
// Kurallar: g = tek gün [ay, gün] · a = aralık [ay, gün, ay, gün] · n = ayın k. haftanın-günü [ay, gün(0=Paz), k(-1=son)] (+ s: süre gün)
//           i = verilen günü içine alan hafta [ay, gün] · ilk = okulların açıldığı hafta
(function () {
  const LIST = [
    { id: 'ilkogretim', ad: 'İlköğretim Haftası', ic: '🏫', cat: 'hafta', r: { ilk: 1 }, d: 'Eğitim-öğretim yılının ilk haftası.' },
    { id: '15temmuz', ad: '15 Temmuz Demokrasi ve Millî Birlik Günü (anma)', ic: '🇹🇷', cat: 'anma', r: { ilk: 1 }, d: 'Okulların açıldığı ilk hafta şehitlerimiz anılır.' },
    { id: 'gaziler', ad: 'Gaziler Günü', ic: '🎖️', cat: 'gun', r: { g: [9, 19] }, d: 'Gazilerimize minnetle.' },
    { id: 'hayvan', ad: 'Hayvanları Koruma Günü', ic: '🐾', cat: 'gun', r: { g: [10, 4] }, d: 'Tüm canlılara sevgi ve saygı.' },
    { id: 'gida', ad: 'Dünya Gıda Günü', ic: '🍎', cat: 'gun', r: { g: [10, 16] }, d: 'Sağlıklı beslenme ve israfı önleme.' },
    { id: 'bm', ad: 'Birleşmiş Milletler Günü', ic: '🌐', cat: 'gun', r: { g: [10, 24] }, d: 'Barış ve iş birliği.' },
    { id: 'cumhuriyet', ad: 'Cumhuriyet Bayramı', ic: '🇹🇷', cat: 'bayram', r: { g: [10, 29] }, d: 'Cumhuriyetimizin kuruluş yıl dönümü.', tpl: 'cumhuriyet' },
    { id: 'kizilay', ad: 'Kızılay Haftası', ic: '❤️', cat: 'hafta', r: { a: [10, 29, 11, 4] }, d: 'Yardımlaşma ve dayanışma.' },
    { id: 'losemi', ad: 'Lösemili Çocuklar Haftası', ic: '🎗️', cat: 'hafta', r: { a: [11, 2, 11, 8] }, d: 'Lösemili çocuklarımıza destek.' },
    { id: 'organ', ad: 'Organ Bağışı ve Nakli Haftası', ic: '💚', cat: 'hafta', r: { a: [11, 3, 11, 9] }, d: 'Organ bağışı hayat kurtarır.' },
    { id: 'ataturk', ad: 'Atatürk Haftası', ic: '🇹🇷', cat: 'anma', r: { a: [11, 10, 11, 16] }, d: 'Ulu Önder Gazi Mustafa Kemal Atatürk\'ü saygı ve özlemle anıyoruz.', tpl: 'anma' },
    { id: 'afet', ad: 'Afet Eğitimi Hazırlık Günü', ic: '🚨', cat: 'gun', r: { g: [11, 12] }, d: 'Afetlere hazırlıklı olalım.' },
    { id: 'cocukhak', ad: 'Dünya Çocuk Hakları Günü', ic: '🧒', cat: 'gun', r: { g: [11, 20] }, d: 'Her çocuğun hakları vardır.' },
    { id: 'agizdis', ad: 'Ağız ve Diş Sağlığı Haftası', ic: '🦷', cat: 'hafta', r: { a: [11, 21, 11, 27] }, d: 'Dişlerimizi günde iki kez fırçalayalım.' },
    { id: 'ogretmen', ad: 'Öğretmenler Günü', ic: '🍎', cat: 'gun', r: { g: [11, 24] }, d: 'Tüm öğretmenlerimizin günü kutlu olsun.', tpl: 'ogretmen' },
    { id: 'engelli', ad: 'Dünya Engelliler Günü', ic: '♿', cat: 'gun', r: { g: [12, 3] }, d: 'Engelleri birlikte aşalım.' },
    { id: 'insanhak', ad: 'İnsan Hakları ve Demokrasi Haftası', ic: '⚖️', cat: 'hafta', r: { i: [12, 10] }, d: '10 Aralık\'ı içine alan hafta.' },
    { id: 'tutum', ad: 'Tutum, Yatırım ve Türk Malları Haftası', ic: '💰', cat: 'hafta', r: { a: [12, 12, 12, 18] }, d: 'Tasarruf ve yerli üretim.' },
    { id: 'enerji', ad: 'Enerji Tasarrufu Haftası', ic: '💡', cat: 'hafta', r: { n: [1, 1, 2], s: 7 }, d: 'Enerjiyi verimli kullanalım.' },
    { id: 'sivil', ad: 'Sivil Savunma Günü', ic: '🚨', cat: 'gun', r: { g: [2, 28] }, d: 'Afet ve acil durumlara hazırlık.' },
    { id: 'yesilay', ad: 'Yeşilay Haftası', ic: '💚', cat: 'hafta', r: { a: [3, 1, 3, 7] }, d: 'Bağımlılıklara karşı birlikteyiz.' },
    { id: 'deprem', ad: 'Deprem Haftası', ic: '🏚️', cat: 'hafta', r: { a: [3, 1, 3, 7] }, d: 'Depreme hazırlık ve tatbikat.' },
    { id: 'kadinlar', ad: 'Dünya Kadınlar Günü', ic: '🌷', cat: 'gun', r: { g: [3, 8] }, d: 'Tüm kadınların günü kutlu olsun.' },
    { id: 'bilim', ad: 'Bilim ve Teknoloji Haftası', ic: '🔬', cat: 'hafta', r: { a: [3, 8, 3, 14] }, d: 'Merak et, keşfet, üret.' },
    { id: 'istiklal', ad: 'İstiklal Marşı\'nın Kabulü ve Mehmet Akif Ersoy\'u Anma Günü', ic: '🇹🇷', cat: 'anma', r: { g: [3, 12] }, d: 'Millî marşımızın kabulünün yıl dönümü.' },
    { id: 'tuketici', ad: 'Tüketici Hakları Haftası', ic: '🛒', cat: 'hafta', r: { a: [3, 15, 3, 21] }, d: 'Bilinçli tüketici olalım.' },
    { id: 'sehitler', ad: 'Şehitler Günü', ic: '🇹🇷', cat: 'anma', r: { g: [3, 18] }, d: 'Çanakkale Zaferi\'nin yıl dönümü; şehitlerimizi rahmetle anıyoruz.', tpl: 'anma' },
    { id: 'yaslilar', ad: 'Yaşlılar Haftası', ic: '👵', cat: 'hafta', r: { a: [3, 18, 3, 24] }, d: 'Büyüklerimize saygı.' },
    { id: 'orman', ad: 'Orman Haftası', ic: '🌳', cat: 'hafta', r: { a: [3, 21, 3, 26] }, d: 'Ağaç dikelim, ormanlarımızı koruyalım.' },
    { id: 'su', ad: 'Dünya Su Günü', ic: '💧', cat: 'gun', r: { g: [3, 22] }, d: 'Suyu tasarruflu kullanalım.' },
    { id: 'tiyatro', ad: 'Dünya Tiyatrolar Günü', ic: '🎭', cat: 'gun', r: { g: [3, 27] }, d: 'Sahne sanatlarını tanıyalım.' },
    { id: 'kutuphane', ad: 'Kütüphaneler Haftası', ic: '📚', cat: 'hafta', r: { n: [3, 1, -1], s: 7 }, d: 'Mart\'ın son pazartesi başlayan hafta.' },
    { id: 'kanser', ad: 'Kanser Haftası', ic: '🎗️', cat: 'hafta', r: { a: [4, 1, 4, 7] }, d: 'Erken teşhis hayat kurtarır.' },
    { id: 'saglik', ad: 'Dünya Sağlık Günü', ic: '🩺', cat: 'gun', r: { g: [4, 7] }, d: 'Sağlıklı yaşam için.' },
    { id: 'turizm', ad: 'Turizm Haftası', ic: '🧳', cat: 'hafta', r: { a: [4, 15, 4, 22] }, d: 'Ülkemizin güzelliklerini tanıyalım.' },
    { id: 'cocuk', ad: 'Ulusal Egemenlik ve Çocuk Bayramı', ic: '🎈', cat: 'bayram', r: { g: [4, 23] }, d: 'TBMM\'nin açılışının yıl dönümü; dünya çocuklarına armağan.', tpl: 'cocuk' },
    { id: 'trafik', ad: 'Trafik ve İlk Yardım Haftası', ic: '🚦', cat: 'hafta', r: { n: [5, 1, 1], s: 7 }, d: 'Trafik kurallarına uyalım, ilk yardımı öğrenelim.' },
    { id: 'anneler', ad: 'Anneler Günü', ic: '💐', cat: 'gun', r: { n: [5, 0, 2] }, d: 'Tüm annelerimizin günü kutlu olsun.' },
    { id: 'engellihaf', ad: 'Engelliler Haftası', ic: '♿', cat: 'hafta', r: { a: [5, 10, 5, 16] }, d: 'Farkındalık ve eşitlik.' },
    { id: 'muzeler', ad: 'Müzeler Haftası', ic: '🏛️', cat: 'hafta', r: { a: [5, 18, 5, 24] }, d: 'Müzelerimizi gezelim.' },
    { id: '19mayis', ad: 'Atatürk\'ü Anma, Gençlik ve Spor Bayramı', ic: '🇹🇷', cat: 'bayram', r: { g: [5, 19] }, d: 'Millî Mücadele\'nin başlangıcının yıl dönümü.' },
    { id: 'fetih', ad: 'İstanbul\'un Fethi', ic: '🏰', cat: 'gun', r: { g: [5, 29] }, d: 'İstanbul\'un fethinin yıl dönümü.' },
    { id: 'cevre', ad: 'Dünya Çevre Günü', ic: '🌍', cat: 'gun', r: { g: [6, 5] }, d: 'Çevremizi koruyalım.' },
    { id: 'babalar', ad: 'Babalar Günü', ic: '👔', cat: 'gun', r: { n: [6, 0, 3] }, d: 'Tüm babalarımızın günü kutlu olsun.' }
  ];
  const CATS = { bayram: ['🎉', 'Bayramlar', '#e11d48'], anma: ['🕊️', 'Anma günleri', '#475569'], hafta: ['📆', 'Haftalar', '#2563eb'], gun: ['📅', 'Günler', '#ea580c'], ozel: ['⭐', 'Okulumuzun', '#7c3aed'] };

  const pad = n => String(n).padStart(2, '0');
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const add = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const monday = d => add(d, -((d.getDay() + 6) % 7));
  // Eğitim yılı Eylül'de başlar: Eylül-Aralık başlangıç yılında, Ocak-Ağustos bir sonraki yılda
  const yearOf = (Y, m) => m >= 9 ? Y : Y + 1;
  function nthWeekday(y, m, wd, k) {
    if (k > 0) { const f = new Date(y, m - 1, 1); return add(f, (wd - f.getDay() + 7) % 7 + (k - 1) * 7); }
    const l = new Date(y, m, 0); return add(l, -((l.getDay() - wd + 7) % 7));
  }
  // Varsayılan açılış: Eylül'ün 2. pazartesi; kapanış: Haziran'ın son cuması (MEB takviminden kontrol edilmeli)
  const schoolStart = Y => iso(nthWeekday(Y, 9, 1, 2));
  const schoolEnd = Y => iso(nthWeekday(Y + 1, 6, 5, -1));

  function range(item, Y, start) {
    const r = item.r;
    let a, b;
    if (r.ilk) { a = monday(new Date((start || schoolStart(Y)) + 'T00:00')); b = add(a, 4); }
    else if (r.g) { a = b = new Date(yearOf(Y, r.g[0]), r.g[0] - 1, r.g[1]); }
    else if (r.a) { a = new Date(yearOf(Y, r.a[0]), r.a[0] - 1, r.a[1]); b = new Date(yearOf(Y, r.a[2]), r.a[2] - 1, r.a[3]); }
    else if (r.n) { a = nthWeekday(yearOf(Y, r.n[0]), r.n[0], r.n[1], r.n[2]); b = r.s ? add(a, r.s - 1) : a; }
    else if (r.i) { a = monday(new Date(yearOf(Y, r.i[0]), r.i[0] - 1, r.i[1])); b = add(a, 6); }
    return [iso(a), iso(b)];
  }

  // Verilen eğitim yılının tüm günleri (kullanıcının eklediği ve tarihini değiştirdikleri dahil), tarih sırasıyla
  function compute(Y, opts = {}) {
    const { start, custom = [], edits = {} } = opts;
    const out = LIST.map(it => {
      const [s, e] = edits[it.id] ? [edits[it.id].start, edits[it.id].end || edits[it.id].start] : range(it, Y, start);
      return { ...it, start: s, end: e };
    });
    for (const c of custom) out.push({ id: c.id, ad: c.ad, ic: c.ic || '⭐', cat: 'ozel', d: c.d || '', start: c.start, end: c.end || c.start, custom: true });
    return out.sort((a, b) => a.start.localeCompare(b.start) || a.ad.localeCompare(b.ad, 'tr'));
  }

  const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  // "29 Ekim", "2 – 8 Kasım", "29 Ekim – 4 Kasım"
  function dateText(s, e) {
    const a = new Date(s + 'T00:00'), b = new Date((e || s) + 'T00:00');
    if (s === (e || s)) return `${a.getDate()} ${MONTHS[a.getMonth()]}`;
    if (a.getMonth() === b.getMonth()) return `${a.getDate()} – ${b.getDate()} ${MONTHS[a.getMonth()]}`;
    return `${a.getDate()} ${MONTHS[a.getMonth()]} – ${b.getDate()} ${MONTHS[b.getMonth()]}`;
  }

  window.OA = window.OA || {};
  window.OA.ozelGunler = { LIST, CATS, MONTHS, compute, dateText, schoolStart, schoolEnd, iso, monday, add };
})();
