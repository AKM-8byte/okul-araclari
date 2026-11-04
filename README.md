# 🎒 Okul Araçları

Müdürler, öğretmenler ve öğrenciler için hazırlanmış, **tarayıcıda çalışan** okul araçları koleksiyonu. Kurulum, hesap ya da sunucu gerekmez; verileriniz yalnızca kendi cihazınızda (tarayıcı `localStorage`) saklanır ve hiçbir yere gönderilmez.

## Özellikler

- 🔒 **Gizlilik:** Öğrenci listeleri ve diğer veriler cihazdan çıkmaz.
- 📚 **Ortak sınıf listesi:** Öğrencileri "Sınıflarım" sayfasında bir kez girin, tüm araçlar kullansın.
- 💾 **Yedekle / geri yükle:** Tüm verileri tek bir JSON dosyasına alın, başka cihaza taşıyın.
- 🖨️ **Yazdırma ve Excel çıktısı:** Çizelge ve belgelerin çoğu yazdırmaya hazır.
- 🌗 Açık / koyu tema, 📱 mobil uyumlu arayüz.
- 🔎 Ana sayfada arama ve role göre (öğrenci / öğretmen / müdür) filtreleme.

## Araçlar

| Araç | Açıklama |
| --- | --- |
| 📚 Sınıflarım | Sınıf ve öğrenci listelerini yönetin |
| 🪑 Sınıf Oturma Düzeni | Öğrencileri kurallara göre sıralara otomatik yerleştirir |
| 🧮 Not / Ortalama Hesaplayıcı | Ders, dönem, yıl sonu ve ağırlıklı ortalama |
| 📊 Sınıf Not Çizelgesi | Notlar, ortalamalar, istatistikler, Excel çıktısı |
| 🎯 LGS / YKS Puan Hesaplayıcı | Net ve tahmini LGS, TYT, AYT puanı |
| 📋 Yoklama Çizelgesi | Devamsızlık takibi ve sınır uyarısı |
| 🗂️ Yıllık Plan Oluşturucu | Ünite ve kazanımları haftalara dağıtır |
| 📅 Belirli Gün ve Haftalar | Sorumlu öğretmen çizelgesi ve afiş |
| 🗓️ Ders Programı | Öğretmen çakışması olmadan okul geneli program |
| 🛡️ Nöbet Çizelgesi | Nöbetleri adil dağıtır |
| 🏛️ Ortak Sınav Oturma Planı | Salon dağılımı, kapı listesi, imza çizelgesi |
| 🎲 Rastgele Öğrenci Seçici | Animasyonlu, adil seçim |
| 👥 Grup Oluşturucu | Dengeli gruplar, başkan seçimi |
| ⏳ Sınıf Zamanlayıcı | Tahtaya yansıtılabilir geri sayım ve kronometre |
| 📢 Duyuru Afişi | Yazdırılabilir afiş şablonları |
| 📝 Toplantı Tutanağı | Gündem, kararlar ve imza tablosu |
| ✉️ Resmî Yazı ve Dilekçe | İzin, mazeret, gezi izni vb. şablonlar |
| 🏅 Belge ve Sertifika | Teşekkür, takdir, katılım belgeleri; toplu çıktı |
| ✅ Etkinlik Katılım Listesi | İmzalı, veli izinli katılım listesi |

## Kullanım

Üç yol var; üçü de çevrimdışı çalışır.

**1. Taşınabilir (Windows, kurulum yok)**
Depoyu ZIP olarak indirin (Code → Download ZIP), klasörü istediğiniz yere (USB bellek dahil) çıkarın ve `Baslat.bat` dosyasına çift tıklayın. Edge veya Chrome ile uygulama penceresi açılır. Veriler klasördeki `veri/` dizininde saklanır, klasörü taşıyınca verileriniz de taşınır. Pencereyi kapatınca yerel sunucu da kapanır.

**2. Uygulama olarak kur (PWA)**
Yayınlanmış adreste ana sayfanın altındaki **📲 Uygulama olarak kur** bağlantısına (veya tarayıcının "Yükle" simgesine) tıklayın. Telefonda "Ana ekrana ekle" deyin. Bir kez açıldıktan sonra internet olmadan da çalışır.

**3. Geliştirme / yerel sunucu**
```bash
python -m http.server 8000
```
Ardından `http://localhost:8000` adresine gidin. (`index.html` dosyasına çift tıklayıp doğrudan açmak da çalışır ama çevrimdışı önbellek yalnızca http/https üzerinde etkinleşir.)

> Taşınabilir yöntemde veri tarayıcı profili yerine `veri/` klasöründedir. Yine de düzenli olarak **💾 Yedekle** kullanmanızı öneririz.

## Proje yapısı

```
index.html             Ana sayfa (araç listesi, arama, rol filtresi)
araclar/               Her araç için bağımsız bir HTML sayfası
assets/
  common.js            Ortak yardımcılar (depolama, sınıf listesi, yedekleme, tema, SW kaydı)
  style.css            Ortak stiller
  belirli-gunler.js    Belirli gün ve haftalar verisi
  fonts/, fonts.css    Nunito yazı tipi (yerel kopya)
  vendor/              xlsx ve qrcode kütüphaneleri (yerel kopya)
  icons/               Uygulama simgeleri
manifest.webmanifest   PWA bildirimi
sw.js                  Service worker (çevrimdışı önbellek)
Baslat.bat, sunucu.ps1 Taşınabilir başlatıcı (Windows)
ornek-okul-yedek.json  Deneme için örnek yedek dosyası
```

## Örnek veriyle deneme

Ana sayfadaki **💾 Yedekle / Geri yükle** bağlantısından `ornek-okul-yedek.json` dosyasını yükleyerek araçları örnek sınıf ve öğrencilerle deneyebilirsiniz.

## Teknolojiler

Saf HTML, CSS ve JavaScript; derleme aracı yok. [SheetJS](https://sheetjs.com) (Excel çıktısı, Apache-2.0), [qrcodejs](https://github.com/davidshimjs/qrcodejs) (MIT) ve Nunito yazı tipi (SIL OFL 1.1) yerel olarak pakete dahildir. Birkaç süs yazı tipi (afiş/sertifika) ilk açılışta Google Fonts'tan gelir ve sonra önbelleğe alınır.

Yeni araç eklerseniz `sw.js` içindeki `PRECACHE` listesine ekleyin ve `VERSION` değerini artırın.

## Lisans

[PolyForm Noncommercial 1.0.0](LICENSE). Kişisel kullanım, okullar ve eğitim kurumları, kâr amacı gütmeyen ve kamu kurumları için serbesttir; **ticari kullanım yasaktır**. Ticari kullanım için izin almak isterseniz GitHub üzerinden iletişime geçin.
