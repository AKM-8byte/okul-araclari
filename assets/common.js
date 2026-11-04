// Okul Araçları — tüm sayfaların ortak yardımcıları
(function () {
  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v == null ? fallback : JSON.parse(v); } catch { return fallback; }
    },
    set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }
  };

  // Seçilen tema sayfa çizilmeden önce uygulanır
  const saved = store.get('oa.theme', null);
  if (saved) document.documentElement.dataset.theme = saved;

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function toast(msg) {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast no-print'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('show'), 2600);
  }

  function toggleTheme() {
    const root = document.documentElement;
    const cur = root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    root.dataset.theme = cur === 'dark' ? 'light' : 'dark';
    store.set('oa.theme', root.dataset.theme);
  }

  // Sayfanın en üstüne site çubuğunu ekler; help verilirse ❔ düğmesi rehberi açar
  function topbar({ emoji, title, home = '../index.html', help, about } = {}) {
    const bar = document.createElement('header');
    bar.className = 'topbar no-print';
    bar.innerHTML = `
      <a class="brand" href="${home}" title="Ana sayfa"><span class="brand-ic">🎒</span><span class="brand-txt">Okul Araçları</span></a>
      ${title ? `<span class="crumb">›</span><h1 class="page-title">${emoji ? emoji + ' ' : ''}${esc(title)}</h1>` : ''}
      <span class="spacer"></span>
      ${about ? '<button class="icon-btn" data-about title="Hakkında" aria-label="Hakkında">ℹ️</button>' : ''}
      ${help ? '<button class="icon-btn" data-help title="Nasıl kullanılır?" aria-label="Nasıl kullanılır?">❔</button>' : ''}
      <button class="icon-btn" data-backup title="Yedekle / geri yükle" aria-label="Yedekle / geri yükle">💾</button>
      <button class="icon-btn" data-theme-btn title="Açık / koyu tema" aria-label="Açık / koyu tema">🌗</button>`;
    document.body.prepend(bar);
    bar.querySelector('[data-theme-btn]').onclick = toggleTheme;
    bar.querySelector('[data-backup]').onclick = backupDialog;
    if (about) bar.querySelector('[data-about]').onclick = aboutDialog;
    if (help) {
      bar.querySelector('[data-help]').onclick = () => welcome(help, true);
      welcome(help);
    }
  }

  // İlk girişte "nasıl kullanılır" rehberi; Tamam'a basınca bir daha kendiliğinden açılmaz
  function welcome(opts, force) {
    const seenKey = 'oa.welcome.' + opts.key;
    if (!force && store.get(seenKey, false)) return;
    const wrap = document.createElement('div');
    wrap.className = 'modal-back no-print';
    wrap.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="wl-title">
        <div class="modal-hero">
          <div class="modal-emoji">${opts.emoji}</div>
          <div><div class="eyebrow">Hoş geldiniz!</div><h2 id="wl-title">${esc(opts.title)}</h2></div>
        </div>
        <p class="modal-intro">${esc(opts.intro)}</p>
        <ol class="steps">${opts.steps.map(s => `
          <li><span class="step-n">${s.icon}</span><div><b>${esc(s.title)}</b><p>${esc(s.text)}</p></div></li>`).join('')}
        </ol>
        <div class="modal-foot">
          <span class="small">Bu rehbere sağ üstteki ❔ düğmesinden tekrar ulaşabilirsiniz.</span>
          <button class="btn primary" data-ok>Tamam, başlayalım 🚀</button>
        </div>
      </div>`;
    document.body.appendChild(wrap);
    const close = () => { store.set(seenKey, true); wrap.remove(); document.removeEventListener('keydown', onKey); };
    const onKey = e => { if (e.key === 'Escape') close(); };
    wrap.querySelector('[data-ok]').onclick = close;
    wrap.addEventListener('click', e => { if (e.target === wrap) close(); });
    document.addEventListener('keydown', onKey);
    wrap.querySelector('[data-ok]').focus();
  }

  // ===== Hakkında mesajı: geliştirici bilgileri (boş bırakılan alanlar görünmez) =====
  const ABOUT = {
    name: 'Ahmet Kayra Maden',
    role: 'Okul Araçları\'nın geliştiricisi',
    school: '',
    email: 'ahmetkayramaden@gmail.com',
    icon: '👨‍💻'   // yuvarlak simgede gösterilir; boşsa addan baş harfler alınır
  };
  function aboutDialog() {
    const wrap = document.createElement('div');
    wrap.className = 'modal-back no-print';
    const who = [ABOUT.role, ABOUT.school].filter(Boolean).map(esc).join(' · ');
    wrap.innerHTML = `
      <div class="modal about-msg" role="dialog" aria-modal="true" aria-labelledby="ab-title">
        <div class="modal-hero">
          <div class="modal-emoji">👋</div>
          <div><div class="eyebrow">Hakkında</div><h2 id="ab-title">Merhaba, hoş geldiniz!</h2></div>
        </div>
        <p>Okul Araçları'nı, okulda her gün tekrar eden işleri kısaltmak için hazırladım. Oturma planı, not çizelgesi, tutanak, afiş, nöbet listesi, dilekçe… Bunların her biri birkaç dakika sürüyor ama hepsi bir araya gelince öğretmenin derse ve öğrenciye ayıracağı zamandan çalıyor.</p>
        <p>Amacım bu yükü hafifletmek: <b>öğretmenler, idareciler ve öğrenciler</b> için Türkiye'deki okul düzenine uygun, kolay ve ücretsiz araçlar sunmak.</p>
        <div class="about-chips">
          <span>🔒 Verileriniz yalnızca bu cihazda kalır</span><span>🆓 Ücretsiz, üyelik yok</span><span>🖨️ Yazdırmaya hazır</span><span>📱 Telefonda da çalışır</span>
        </div>
        <p>Önerileriniz ve bulduğunuz hatalar sitenin gelişmesine yardım eder. Kullandığınız için teşekkür ederim.</p>
        <div class="about-sign">
          <div class="about-av">${ABOUT.icon ? esc(ABOUT.icon) : ABOUT.name ? esc(initials(ABOUT.name)) : '🧑‍🏫'}</div>
          <div><b>${esc(ABOUT.name || 'Okul Araçları geliştiricisi')}</b>${who ? `<small>${who}</small>` : ''}${ABOUT.email ? `<a href="mailto:${esc(ABOUT.email)}">${esc(ABOUT.email)}</a>` : ''}</div>
        </div>
        <div class="modal-foot" style="justify-content:flex-end"><button class="btn primary" data-ok>Kapat</button></div>
      </div>`;
    document.body.appendChild(wrap);
    const close = () => { wrap.remove(); document.removeEventListener('keydown', onKey); };
    const onKey = e => { if (e.key === 'Escape') close(); };
    wrap.querySelector('[data-ok]').onclick = close;
    wrap.addEventListener('click', e => { if (e.target === wrap) close(); });
    document.addEventListener('keydown', onKey);
    wrap.querySelector('[data-ok]').focus();
  }

  // Not → harf/derece karşılığı (MEB 5'li sistem)
  function band(score) {
    if (score == null || isNaN(score)) return null;
    if (score >= 85) return { n: 5, label: 'Pekiyi', cls: 'ok' };
    if (score >= 70) return { n: 4, label: 'İyi', cls: 'ok' };
    if (score >= 60) return { n: 3, label: 'Orta', cls: 'info' };
    if (score >= 50) return { n: 2, label: 'Geçer', cls: 'warn' };
    return { n: 1, label: 'Geçmez', cls: 'bad' };
  }

  const fmt = (n, d = 2) => n == null || isNaN(n) ? '—' : (+n.toFixed(d)).toLocaleString('tr-TR');

  let uidN = 0;
  const uid = () => Date.now().toString(36) + (uidN++).toString(36) + Math.random().toString(36).slice(2, 5);
  const up = s => String(s ?? '').trim().replace(/\s+/g, ' ').toLocaleUpperCase('tr');
  const initials = name => { const w = String(name).split(' ').filter(Boolean); return (w[0]?.[0] || '?') + (w.length > 1 ? w[w.length - 1][0] : ''); };
  const hue = name => [...String(name)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7);
  const eduYear = () => { const d = new Date(), y = d.getFullYear(); return d.getMonth() >= 7 ? `${y}-${y + 1}` : `${y - 1}-${y}`; };
  const trDate = (v, opts = { day: '2-digit', month: '2-digit', year: 'numeric' }) => {
    if (!v) return '';
    const d = new Date(v + 'T00:00');
    return isNaN(d) ? v : d.toLocaleDateString('tr-TR', opts);
  };

  // ---------- Ortak sınıf listeleri: bir kez girilen sınıf tüm araçlarda kullanılır ----------
  const CL_KEY = 'oa.siniflar';
  const classes = {
    data() { return store.get(CL_KEY, null) || { active: null, list: [] }; },
    list() { return this.data().list; },
    get(id) { return this.list().find(c => c.id === id) || null; },
    active() { const d = this.data(); return d.list.find(c => c.id === d.active) || d.list[0] || null; },
    setActive(id) { const d = this.data(); d.active = id; store.set(CL_KEY, d); },
    save(cls) {
      const d = this.data(), i = d.list.findIndex(c => c.id === cls.id);
      if (i >= 0) d.list[i] = cls; else d.list.push(cls);
      store.set(CL_KEY, d);
      return cls;
    },
    remove(id) { const d = this.data(); d.list = d.list.filter(c => c.id !== id); if (d.active === id) d.active = d.list[0]?.id || null; store.set(CL_KEY, d); },
    create(name, students = []) {
      return this.save({ id: uid(), name: name || 'Yeni Sınıf', students: students.map(s => ({ id: uid(), no: String(s.no ?? '').trim(), name: up(s.name) })).filter(s => s.name) });
    }
  };

  // Sınıf seçme penceresi; seçilen sınıfla (ya da vazgeçilirse null ile) çözülür
  function pickClass({ title = 'Sınıf seçin', manage = 'siniflar.html' } = {}) {
    return new Promise(resolve => {
      const list = classes.list();
      const wrap = document.createElement('div');
      wrap.className = 'modal-back no-print';
      wrap.innerHTML = `
        <div class="modal">
          <div class="modal-hero"><div class="modal-emoji">📚</div><div><div class="eyebrow">Sınıflarım</div><h2>${esc(title)}</h2></div></div>
          ${list.length ? `<div class="stack" style="gap:8px">${list.map(c => `
            <button class="btn" data-id="${c.id}" style="justify-content:space-between;width:100%">
              <span>🏫 ${esc(c.name)}</span><span class="chip">${c.students.length} öğrenci</span></button>`).join('')}</div>`
            : '<p class="modal-intro">Henüz kayıtlı sınıfınız yok. Sınıflarım sayfasından bir kez sınıf listesi oluşturun; tüm araçlar onu kullanabilsin.</p>'}
          <div class="modal-foot" style="margin-top:16px"><a class="btn ghost" href="${manage}">⚙️ Sınıflarımı yönet</a><button class="btn" data-no>Vazgeç</button></div>
        </div>`;
      document.body.appendChild(wrap);
      const done = v => { wrap.remove(); resolve(v); };
      wrap.querySelector('[data-no]').onclick = () => done(null);
      wrap.addEventListener('click', e => {
        if (e.target === wrap) return done(null);
        const b = e.target.closest('[data-id]');
        if (b) { classes.setActive(b.dataset.id); done(classes.get(b.dataset.id)); }
      });
    });
  }

  // Araçların üstündeki sınıf açılır listesini doldurur
  function fillClassSelect(sel, selectedId, { manual = false, manage = 'siniflar.html' } = {}) {
    const list = classes.list();
    sel.innerHTML = (list.length ? '' : '<option value="">— Kayıtlı sınıf yok —</option>') +
      list.map(c => `<option value="${c.id}" ${c.id === selectedId ? 'selected' : ''}>🏫 ${esc(c.name)} (${c.students.length})</option>`).join('') +
      (manual ? `<option value="__manual" ${selectedId === '__manual' ? 'selected' : ''}>✍️ Elle liste yaz</option>` : '') +
      '<option value="__manage">⚙️ Sınıflarımı yönet…</option>';
    if (!sel.dataset.bound) {
      sel.dataset.bound = '1';
      sel.addEventListener('change', () => { if (sel.value === '__manage') location.href = manage; });
    }
  }

  // ---------- Kâğıt önizleme + yazdırma ----------
  // html: bir ya da birden çok .paper; stage içinde ölçeklenmiş önizleme gösterilir, yazdırınca sadece kâğıtlar çıkar
  function renderPaper(stage, html, { orient = 'portrait', margin = '14mm' } = {}) {
    let holder = document.querySelector('.print-holder');
    if (!holder) {
      holder = document.createElement('div'); holder.className = 'print-holder';
      document.body.appendChild(holder); document.body.classList.add('has-print');
    }
    holder.innerHTML = html;
    let ps = document.getElementById('oaPage');
    if (!ps) { ps = document.createElement('style'); ps.id = 'oaPage'; document.head.appendChild(ps); }
    ps.textContent = `@page{size:A4 ${orient};margin:${margin}}`;
    if (!stage) return;
    let sc = stage.querySelector('.paper-scaler');
    if (!sc) { sc = document.createElement('div'); sc.className = 'paper-scaler'; stage.appendChild(sc); }
    sc.innerHTML = html;
    fitPaper(stage);
    if (!stage._ro) { stage._ro = new ResizeObserver(() => fitPaper(stage)); stage._ro.observe(stage); }
  }
  function fitPaper(stage) {
    const sc = stage.querySelector('.paper-scaler'); if (!sc) return;
    sc.style.transform = 'none'; sc.style.width = 'max-content'; sc.style.height = '';
    const w = sc.offsetWidth, h = sc.offsetHeight;
    const k = Math.min(1, (stage.clientWidth - 36) / w);
    sc.style.transform = `scale(${k})`;
    sc.style.width = w * k + 'px'; sc.style.height = h * k + 'px';
  }

  // ---------- Yedekle / geri yükle ----------
  // Tüm araç verileri tarayıcıda durduğu için tek bir .json dosyasına alınıp başka cihaza taşınabilir
  const isOurKey = k => k.startsWith('oa.') || k === 'siraAyarlama.v1';
  const backup = {
    keys() { const out = []; try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (isOurKey(k) && k !== 'oa.lastBackup') out.push(k); } } catch {} return out; },
    hasData() { return this.keys().some(k => !k.startsWith('oa.welcome.') && k !== 'oa.theme' && k !== 'oa.home.role'); },
    last() { return store.get('oa.lastBackup', null); },
    download() {
      const data = {};
      for (const k of this.keys()) data[k] = localStorage.getItem(k);
      const blob = new Blob([JSON.stringify({ app: 'okul-araclari', version: 1, date: new Date().toISOString(), data }, null, 1)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `okul-araclari-yedek-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      store.set('oa.lastBackup', new Date().toISOString());
      toast('Yedek dosyası indirildi 💾');
    },
    // Dosyayı okur; onaylanırsa içindeki verileri bu cihaza yazar ve kaç kayıt yüklendiğini döndürür
    async restore(file) {
      let json;
      try { json = JSON.parse(await file.text()); } catch { toast('Dosya okunamadı'); return 0; }
      if (json?.app !== 'okul-araclari' || typeof json.data !== 'object') { toast('Bu bir Okul Araçları yedek dosyası değil'); return 0; }
      const keys = Object.keys(json.data).filter(isOurKey);
      const when = json.date ? new Date(json.date).toLocaleString('tr-TR') : 'bilinmeyen tarih';
      if (!confirm(`${when} tarihli yedek yüklensin mi?\n\nBu cihazdaki aynı araç verileri (${keys.length} kayıt) yedektekilerle değiştirilecek.`)) return 0;
      try { for (const k of keys) localStorage.setItem(k, json.data[k]); } catch { toast('Kaydedilemedi: tarayıcı depolaması dolu ya da kapalı'); return 0; }
      toast(`Yedek yüklendi (${keys.length} kayıt) ✔`);
      return keys.length;
    },
    // Dosya seçtirip geri yükler; bitince sayfayı yeniler
    pickAndRestore() {
      const inp = document.createElement('input');
      inp.type = 'file'; inp.accept = '.json,application/json';
      inp.onchange = async () => { if (inp.files[0] && await backup.restore(inp.files[0])) setTimeout(() => location.reload(), 900); };
      inp.click();
    }
  };

  function backupDialog() {
    const last = backup.last();
    const wrap = document.createElement('div');
    wrap.className = 'modal-back no-print';
    wrap.innerHTML = `
      <div class="modal">
        <div class="modal-hero"><div class="modal-emoji">💾</div><div><div class="eyebrow">Verilerim</div><h2>Yedekle / Geri yükle</h2></div></div>
        <p class="modal-intro">Sınıf listeleri, notlar, programlar ve tüm araç ayarları yalnızca bu tarayıcıda saklanır. Tarayıcı verileri silinirse kaybolmasın diye ara sıra yedek alın; yedek dosyasıyla başka bilgisayara da taşıyabilirsiniz.</p>
        <ol class="steps">
          <li><span class="step-n">⬇️</span><div><b>Yedek al</b><p>Tüm verileri tek bir dosya olarak indirir. ${last ? `Son yedek: ${new Date(last).toLocaleString('tr-TR')}` : 'Henüz hiç yedek alınmadı.'}</p></div></li>
          <li><span class="step-n">⬆️</span><div><b>Yedekten geri yükle</b><p>Daha önce indirdiğiniz yedek dosyasını seçin. Bu cihazdaki aynı veriler yedektekilerle değiştirilir.</p></div></li>
        </ol>
        <div class="modal-foot"><button class="btn" data-no>Kapat</button><span class="row"><button class="btn" data-restore>⬆️ Geri yükle</button><button class="btn primary" data-dl>⬇️ Yedek al</button></span></div>
      </div>`;
    document.body.appendChild(wrap);
    const close = () => wrap.remove();
    wrap.querySelector('[data-no]').onclick = close;
    wrap.querySelector('[data-dl]').onclick = () => { backup.download(); close(); };
    wrap.querySelector('[data-restore]').onclick = () => { close(); backup.pickAndRestore(); };
    wrap.addEventListener('click', e => { if (e.target === wrap) close(); });
  }

  window.OA = { store, esc, toast, topbar, welcome, aboutDialog, toggleTheme, band, fmt, uid, up, initials, hue, eduYear, trDate, classes, pickClass, fillClassSelect, renderPaper, backup, backupDialog };
})();

// PWA: çevrimdışı çalışma için service worker kaydı (yalnızca http/https üzerinde)
(function () {
  if (!('serviceWorker' in navigator) || !/^https?:$/.test(location.protocol)) return;
  const src = document.currentScript && document.currentScript.src;
  if (!src) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(new URL('../sw.js', src)).catch(() => {});
  });
})();
