# Product Requirements Document (PRD)
# BaranginAja — Platform Jual Beli Barang Bekas Antar Mahasiswa Kos (Surabaya)

> **Catatan untuk pembaca (termasuk AI/developer yang akan membangun aplikasi ini):**
> Dokumen ini ditulis agar bisa langsung dijadikan acuan untuk membangun aplikasi **fullstack** (frontend + backend + database + admin panel). Setiap bagian berisi aturan bisnis, alur, dan struktur data secara eksplisit — bukan hanya deskripsi umum. Bagian yang merupakan **asumsi/tambahan dari PM** (bukan permintaan eksplisit dari brief awal) ditandai dengan label `[Rekomendasi PM]` agar mudah dibedakan dan bisa didiskusikan ulang dengan stakeholder.

**Versi:** 1.0 (Draft) · **Tanggal:** 11 September 2026 · **Disusun oleh:** Product Manager
**Nama produk:** *BaranginAja* (working title, dapat diganti)

---

## Daftar Isi
1. Ringkasan Produk
2. Latar Belakang & Masalah
3. Tujuan Produk & Metrik Keberhasilan
4. Target Pengguna
5. Ruang Lingkup (Scope)
6. Peran Pengguna & Hak Akses
7. Alur Pengguna End-to-End (Inti Produk)
8. Spesifikasi Fitur per Modul
9. Business Logic & Formula
10. State Machine (Status Barang & Pesanan)
11. Model Data
12. Struktur Halaman (Sitemap)
13. Template Pesan WhatsApp
14. Kebutuhan Non-Fungsional
15. Rekomendasi Tech Stack
16. Asumsi & Pertanyaan Terbuka
17. Risiko & Mitigasi
18. Roadmap Pengembangan

---

## 1. Ringkasan Produk

BaranginAja adalah platform e-commerce khusus mahasiswa **ngekos di Surabaya** untuk jual-beli barang bekas (perabotan kos, elektronik, buku, dll) antar sesama mahasiswa. Berbeda dari marketplace umum, BaranginAja **tidak menggunakan payment gateway otomatis** — seluruh transaksi difasilitasi secara semi-manual oleh tim internal (admin/finance) melalui WhatsApp, dengan platform berperan sebagai katalog, kalkulator harga & ongkir, serta sistem pencatatan transaksi.

**Model bisnis:** platform mengambil keuntungan dari markup harga jual (10–20% tergantung harga barang) dan dari biaya jasa antar (jika pembeli memakai kurir platform).

---

## 2. Latar Belakang & Masalah

Mahasiswa kos sering punya barang bekas (rice cooker, rak, meja lipat, buku kuliah, dll) yang ingin dijual saat pindah kos/lulus, tapi:
- Marketplace besar (Tokopedia, Shopee) terasa "berat" untuk barang bernilai kecil dan lokal.
- Jual-beli lewat grup WhatsApp/Facebook kampus rawan penipuan, tidak terstruktur, dan sulit dicari.
- Pembeli sering kesulitan menemukan barang second yang lokasinya dekat (satu kota/kampus) sehingga ongkos kirim murah atau bisa COD.

BaranginAja menjawab ini dengan platform terfokus lokal (Surabaya), berbasis kampus, dengan proses transaksi yang **diawasi manusia (admin)** untuk membangun kepercayaan di komunitas mahasiswa.

---

## 3. Tujuan Produk & Metrik Keberhasilan

**Tujuan:**
- Menyediakan tempat jual-beli barang bekas yang murah, terpercaya, dan mudah untuk mahasiswa kos se-Surabaya.
- Memberi penjual (mahasiswa) cara mudah menjual barang dengan proses pencairan dana yang jelas.
- Menghasilkan revenue platform dari markup harga & ongkir.

**Metrik keberhasilan (KPI) yang disarankan `[Rekomendasi PM]`:**

| Metrik | Deskripsi |
|---|---|
| Jumlah user terverifikasi per kampus | Menunjukkan adopsi per kampus |
| Jumlah listing aktif | Kesehatan supply barang |
| GMV bulanan (Gross Merchandise Value) | Total nilai transaksi |
| Revenue platform bulanan | Markup + ongkir yang terkumpul |
| Conversion rate klik "Pesan" → transaksi selesai | Efisiensi funnel checkout manual |
| Rata-rata waktu proses (order dibuat → selesai) | Kecepatan respons admin |
| Repeat transaction rate | Retensi pengguna |

---

## 4. Target Pengguna

**Persona utama:**
1. **Mahasiswa Pembeli** — cari barang second murah, dekat kampus/kos, prefer COD tapi kadang butuh dikirim.
2. **Mahasiswa Penjual** — mau pindahan/lulus, ingin jual cepat tanpa ribet nego harga & pengiriman, butuh kepastian dana masuk.
3. **Admin/Finance (internal)** — tim operasional yang verifikasi pembayaran, mengelola pesanan, dan mencairkan dana ke penjual.
4. **Kurir platform (internal)** — mengantar barang jika pembeli memilih opsi kurir.

---

## 5. Ruang Lingkup (Scope)

**In-scope (MVP):**
- Registrasi & verifikasi dasar (dropdown kampus asal, khusus kampus di Surabaya).
- Katalog produk dengan kalkulasi harga otomatis (markup platform).
- Pendaftaran akun sebagai penjual + dashboard penjual.
- Proses "Pesan" yang menghubungkan user ke WhatsApp admin dengan template otomatis.
- Perhitungan ongkos kirim otomatis untuk opsi kurir platform.
- Panel admin untuk verifikasi pembayaran, update status, dan pencairan dana ke penjual.

**Out-of-scope (MVP) — masuk fase berikutnya:**
- Payment gateway otomatis (Midtrans/Xendit dsb).
- Ekspansi ke luar Surabaya.
- Chat in-app (pengganti WhatsApp).
- Verifikasi identitas dengan upload KTM/KTP.
- Sistem rating & ulasan (disarankan namun opsional, lihat Bagian 18).

---

## 6. Peran Pengguna & Hak Akses

| Role | Deskripsi | Hak Akses Utama |
|---|---|---|
| **Guest** | Belum login | Lihat katalog & detail produk, tidak bisa memesan |
| **Buyer** | User terdaftar & terverifikasi kampus | Semua hak Guest + memesan barang, lihat riwayat pesanan |
| **Seller** | Buyer yang mendaftar jadi penjual (1 akun bisa dual-role) | Semua hak Buyer + posting barang, akses dashboard penjual |
| **Admin/Finance** | Internal | Akses penuh ke panel admin: verifikasi user, kelola order, kelola pencairan dana, kelola kategori/kampus |
| **Kurir** *(opsional, bisa manual)* | Internal | Update status pengiriman (dijemput/diantar) |

---

## 7. Alur Pengguna End-to-End (Inti Produk)

Ini adalah alur paling penting dalam produk ini — **model transaksi hybrid** (katalog otomatis + checkout manual via WhatsApp).

```
Browse Katalog → Pilih Barang → Pilih Opsi Pengiriman → Klik "Pesan"
      ↓
Sistem kunci status barang → "Pending" (hold sementara)
      ↓
Redirect ke WhatsApp Admin (pesan template otomatis terisi)
      ↓
User kirim pesan ke Admin
      ↓
Admin cek Order ID di Admin Dashboard → kirim QRIS pembayaran (manual, via chat WA)
      ↓
User transfer & kirim bukti bayar ke WA Admin
      ↓
Admin verifikasi dana masuk → update status Order = "Dibayar" (di Admin Dashboard)
      ↓
   ┌─────────────────────┴─────────────────────┐
   │ Opsi: Ambil Sendiri / COD                   │ Opsi: Kurir Platform
   ↓                                              ↓
Admin transfer dana ke penjual              Kurir jemput barang → antar ke pembeli
(sebesar harga asli input penjual)          → Buyer konfirmasi barang diterima
   ↓                                              ↓
Status Order = "Selesai"                    Admin transfer dana ke penjual
                                             → Status Order = "Selesai"
```

**Langkah rinci:**

1. User membuka katalog & detail produk (boleh tanpa login).
2. Untuk memesan, user wajib **login** dan sudah lolos verifikasi kampus.
3. Di halaman detail produk, user memilih opsi pengiriman:
   - **COD / Ambil Sendiri** → harga = harga jual di katalog (sudah termasuk markup), tanpa ongkir.
   - **Kurir Platform** → user input/pilih alamat tujuan → sistem hitung ongkir otomatis (lihat Bagian 9) → total harga tampil real-time = harga jual + ongkir.
4. User klik **"Pesan Sekarang"**.
5. Sistem otomatis:
   - Mengubah status barang menjadi **"Dipesan (Pending)"** dengan hold timer (mis. 30–60 menit) `[Rekomendasi PM]` agar barang tidak bisa dipesan 2 orang sekaligus (stok barang second selalu 1). Jika timer habis tanpa pembayaran terverifikasi, status kembali ke "Tersedia".
   - Membuat record **Order** baru, status "Menunggu Pembayaran".
   - Men-generate link `wa.me` dengan teks template otomatis (Bagian 13) berisi: nama barang, ID barang, ID order, nama & ID penjual, opsi pengiriman, total harga.
6. User diarahkan ke chat WhatsApp Admin dengan teks sudah terisi di kolom chat — tinggal tekan kirim.
7. Admin membuka Admin Dashboard, mencocokkan Order ID dari pesan yang masuk, lalu **mengirim QRIS pembayaran** (akun SeaBank perusahaan) langsung di chat WA — proses ini manual, di luar sistem.
8. User transfer/scan QRIS lalu kirim bukti pembayaran (screenshot) ke Admin via WA.
9. Admin cross-check nominal & keterangan transfer, lalu **update status Order → "Dibayar"** di Admin Dashboard. Status barang otomatis berubah jadi "Terjual" (hilang dari katalog publik).
10. Proses selanjutnya tergantung opsi pengiriman:
    - **COD/Ambil Sendiri**: Admin langsung transfer dana ke rekening penjual sejumlah **harga asli yang diinput penjual** (bukan harga jual + markup). Status Order → "Selesai".
    - **Kurir Platform**: Admin menugaskan kurir menjemput barang dari penjual → antar ke pembeli. Setelah pembeli konfirmasi barang diterima (via tombol di web, atau laporan kurir ke admin), Admin baru mencairkan dana ke penjual. Status Order → "Selesai".
11. Margin platform (markup + ongkir bila ada) tetap di rekening perusahaan sebagai revenue.

---

## 8. Spesifikasi Fitur per Modul

### 8.1 Autentikasi & Verifikasi Kampus
- Registrasi dengan email/no. HP + password.
- Saat registrasi, user **wajib memilih kampus asal dari dropdown**, dibatasi hanya kampus-kampus di Surabaya. Contoh starter list (dapat disesuaikan admin): Universitas Airlangga (UNAIR), Institut Teknologi Sepuluh Nopember (ITS), Universitas Surabaya (UBAYA), Universitas Negeri Surabaya (UNESA), Universitas Kristen Petra, Universitas Katolik Widya Mandala Surabaya, Universitas Muhammadiyah Surabaya, UNTAG Surabaya, Universitas Hang Tuah, Universitas Ciputra, Universitas Dr. Soetomo, Politeknik Elektronika Negeri Surabaya (PENS), Politeknik Perkapalan Negeri Surabaya (PPNS), + opsi "Lainnya".
- MVP: verifikasi bersifat **self-declared** (pilih dropdown saja, tanpa upload dokumen). `[Fase 2: upload foto KTM untuk verifikasi lebih kuat]`
- Login, logout, reset password standar.

### 8.2 Profil & Pendaftaran sebagai Seller
- User dapat melengkapi profil: nama, no. HP (untuk WA), alamat kos (dipakai sebagai titik jemput & untuk hitung ongkir).
- Untuk berjualan, user klik **"Daftar Jadi Penjual"** dari profil, lalu mengisi: nama rekening bank, nomor rekening, nama pemilik rekening, alamat titik jemput barang.
- Satu akun bisa berperan sebagai buyer sekaligus seller (dual-role).

### 8.3 Katalog & Pencarian Produk
- Grid produk dengan foto, nama, harga jual (sudah termasuk markup), kondisi barang, kampus penjual.
- Filter: kategori, rentang harga, kondisi barang, kampus.
- Search by nama barang.
- Sort: terbaru, termurah, termahal.

### 8.4 Detail Produk & Posting Barang (Seller)
Form posting barang oleh seller, field wajib:
- Nama barang, kategori, kondisi (mis. "Seperti Baru", "Baik", "Cukup Baik"), deskripsi.
- **Harga jual asli** (input murni dari penjual, sebelum markup).
- **Berat barang (kg)** — input estimasi, dengan placeholder contoh ("Contoh: 1.5") sesuai instruksi awal.
- Foto barang (minimal 1, maksimal 5 `[Rekomendasi PM]`).
- Titik jemput (default dari alamat kos di profil, dapat diedit per-produk).

Di halaman detail produk, sistem otomatis menampilkan **harga jual ke publik** = harga asli + markup (formula di Bagian 9), bukan harga asli seller.

### 8.5 Proses Pemesanan (lihat detail penuh di Bagian 7)
- Tombol pilih opsi pengiriman.
- Kalkulasi ongkir real-time (jika kurir).
- Tombol "Pesan Sekarang" → redirect WhatsApp dengan template otomatis.

### 8.6 Pembayaran
- Tidak ada payment gateway otomatis di MVP.
- Semua pembayaran ditujukan ke **1 rekening SeaBank milik perusahaan**, dikonfirmasi manual oleh admin lewat QRIS yang dikirim via WA.
- Admin mencatat status pembayaran di Admin Dashboard (bukan otomatis dari bank).

### 8.7 Pengiriman
Dua opsi (dipilih user saat checkout):
1. **Ambil Sendiri / COD** — tanpa ongkir, buyer datang ke titik jemput penjual.
2. **Kurir Platform** — ongkir dihitung otomatis dari jarak + berat (formula Bagian 9), diantar oleh kurir internal perusahaan.

### 8.8 Dashboard Seller
- Ringkasan: jumlah produk aktif, jumlah terjual, total pendapatan (setelah dicairkan).
- Kelola produk: tambah/edit/nonaktifkan/hapus listing.
- Daftar pesanan masuk untuk produk miliknya beserta status terkini.
- Riwayat penjualan & status pencairan dana (menunggu / sudah cair).
- Pengaturan rekening bank.

### 8.9 Dashboard Admin/Finance (Internal)
- Ringkasan statistik: total transaksi, GMV, revenue markup & ongkir.
- Manajemen user: lihat status verifikasi, nonaktifkan akun bermasalah.
- Manajemen kampus & kategori (tambah/edit/hapus item dropdown).
- **Manajemen Order** (fitur inti admin): daftar semua order dengan status, search by Order ID/nama barang, aksi update status ("Dibayar", "Dijemput", "Dalam Pengiriman", "Selesai", "Dibatalkan").
- Detail order: menampilkan semua info untuk cross-check (nama barang, harga, buyer, seller, opsi kirim, bukti transfer jika diunggah).
- **Manajemen Pencairan Dana**: antrian penjual yang menunggu dibayar, tombol "Tandai Sudah Dicairkan" beserta timestamp & nama admin yang memproses (audit trail).
- Log aktivitas admin `[Rekomendasi PM]` — mencatat siapa mengubah status apa, kapan, untuk akuntabilitas dana.

### 8.10 Notifikasi
- MVP: notifikasi in-app sederhana (mis. badge/status di dashboard) untuk perubahan status pesanan.
- `[Fase 2]` Notifikasi otomatis via WhatsApp Business API atau email saat status order berubah.

### 8.11 Rating & Ulasan `[Rekomendasi PM — Opsional, disarankan Fase 2]`
Tidak disebutkan di brief awal, namun disarankan untuk membangun kepercayaan antar mahasiswa (rating penjual setelah transaksi selesai). Bisa ditunda ke Fase 2 agar MVP tetap sederhana.

---

## 9. Business Logic & Formula

### 9.1 Markup Harga Jual (Keuntungan Platform)

| Tier | Kondisi Harga Input Penjual | Markup Platform |
|---|---|---|
| 1 | < Rp 50.000 | +20% |
| 2 | ≥ Rp 50.000 dan < Rp 100.000 | +15% |
| 3 | ≥ Rp 100.000 | +10% |

**Formula:**
```
harga_jual_tampil = harga_input_penjual × (1 + markup%)
fee_platform = harga_jual_tampil − harga_input_penjual
```

**Contoh perhitungan:**

| Harga Input Penjual | Tier | Markup | Harga Tampil di Katalog | Fee Platform |
|---|---|---|---|---|
| Rp 35.000 | 1 | 20% | Rp 42.000 | Rp 7.000 |
| Rp 50.000 | 2 | 15% | Rp 57.500 | Rp 7.500 |
| Rp 99.000 | 2 | 15% | Rp 113.850 | Rp 14.850 |
| Rp 100.000 | 3 | 10% | Rp 110.000 | Rp 10.000 |
| Rp 500.000 | 3 | 10% | Rp 550.000 | Rp 50.000 |

> ⚠️ **Catatan PM:** Perhatikan bahwa barang seharga Rp 99.000 (tier 2) hasil markup-nya (Rp 113.850) justru **lebih mahal** dari barang Rp 100.000 (tier 3, hasil Rp 110.000). Ini adalah efek umum dari sistem tier non-progresif (bukan graduated/marginal). Ini sesuai persis dengan aturan yang diberikan di brief, jadi tetap diimplementasikan seperti ini — tapi disarankan didiskusikan lagi apakah perlu diubah ke skema markup progresif (seperti pajak berjenjang) di masa depan agar tidak ada "titik harga" yang merugikan penjual.

### 9.2 Ongkos Kirim (Opsi Kurir Platform)

**Formula:**
```
ongkir_raw = (jarak_km × Rp 2.500) + (berat_kg × Rp 5000)
ongkir_final = round_up(ongkir_raw ke kelipatan terdekat Rp 5000)   
```

**Contoh:** jarak 3,2 km, berat barang 2,5 kg
```
ongkir_raw = (3,2 × 2.500) + (2,5 × 5000) = 8.000 + 12.500 = Rp 20.500
```

**Total harga saat checkout:**
- Ambil Sendiri/COD → `total = harga_jual_tampil`
- Kurir Platform → `total = harga_jual_tampil + ongkir_final`

**Perhitungan jarak** `[Rekomendasi PM]`: gunakan koordinat titik jemput penjual (dari alamat kos yang di-pin di peta) dan alamat tujuan pembeli (diinput saat memilih opsi kurir), dihitung otomatis via API jarak (lihat Bagian 15). Nominal ini adalah estimasi otomatis yang tampil di web dan masuk ke template WA — admin tetap bisa menyesuaikan manual saat cross-check di chat bila ada selisih signifikan.

### 9.3 Pencairan Dana ke Penjual
Nominal yang ditransfer ke penjual = **harga input asli penjual** (sebelum markup), **tidak termasuk** markup maupun ongkir — kedua komponen tersebut adalah revenue platform.

---

## 10. State Machine (Status Barang & Pesanan)

**Status Produk (Product):**
`Tersedia → Dipesan (Pending) → Terjual` , atau `Dipesan (Pending) → Tersedia` (jika hold timer habis tanpa pembayaran)

**Status Order (Order):**
```
Menunggu Pembayaran
   ↓ (admin verifikasi dana masuk)
Dibayar
   ↓
   ├─ [Ambil Sendiri] → Selesai (dana langsung dicairkan)
   └─ [Kurir]  → Dijemput Kurir → Dalam Pengiriman → Diterima Pembeli → Selesai (dana dicairkan)

(dari status manapun sebelum "Dibayar") → Dibatalkan  (hold timer habis / dibatalkan admin/user)
```

**Status Pencairan Dana (Payout):** `Menunggu Pencairan → Dicairkan`

---

## 11. Model Data

### 11.1 User
| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID | Primary key |
| nama_lengkap | string | |
| email | string | unique |
| password_hash | string | |
| no_hp | string | untuk WhatsApp |
| kampus_id | FK → Campus | dari dropdown saat daftar |
| alamat_kos | text | dipakai sbg titik jemput & hitung ongkir |
| lat, lng | float | koordinat alamat kos |
| status_verifikasi | enum | pending / verified |
| is_seller | boolean | apakah sudah daftar jadi penjual |
| no_rekening, nama_bank, nama_pemilik_rekening | string (nullable) | diisi saat daftar jadi seller |
| role | enum | buyer, seller, admin |
| created_at | timestamp | |

### 11.2 Campus
`id, nama_kampus, kota (default: Surabaya), aktif (boolean)`

### 11.3 Category
`id, nama_kategori`

### 11.4 Product
| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID | |
| seller_id | FK → User | |
| kategori_id | FK → Category | |
| nama_barang | string | |
| deskripsi | text | |
| kondisi | enum | Seperti Baru / Baik / Cukup Baik |
| harga_input | integer | harga asli dari seller |
| harga_jual | integer | hasil kalkulasi markup (Bagian 9.1) |
| berat_kg | float | estimasi, diisi seller |
| foto_urls | array\<string\> | 1–5 foto |
| lat, lng | float | titik jemput (default dari alamat kos seller) |
| status | enum | Tersedia / Dipesan / Terjual |
| created_at | timestamp | |

### 11.5 Order
| Field | Tipe | Keterangan |
|---|---|---|
| id | UUID | dipakai sbg Order ID di template WA |
| product_id | FK → Product | |
| buyer_id | FK → User | |
| opsi_pengiriman | enum | cod / kurir |
| jarak_km, ongkir | float, integer | terisi jika opsi kurir |
| total_harga | integer | harga_jual (+ongkir jika kurir) |
| status | enum | lihat Bagian 10 |
| bukti_bayar_url | string (nullable) | opsional, jika mau diunggah juga di web |
| hold_expires_at | timestamp | untuk hold timer |
| dikonfirmasi_diterima_at | timestamp (nullable) | untuk opsi kurir |
| admin_id | FK → User (nullable) | admin yang memproses |
| created_at, paid_at, completed_at | timestamp | |

### 11.6 Payout (Pencairan Dana)
`id, order_id (FK), seller_id (FK), nominal (= harga_input produk terkait), status (menunggu/dicairkan), tanggal_dicairkan, admin_id (FK)`

### 11.7 ActivityLog `[Rekomendasi PM]`
`id, admin_id, order_id (nullable), aksi (string), timestamp` — untuk audit trail setiap perubahan status/pencairan.

---

## 12. Struktur Halaman (Sitemap)

**Publik (belum login):**
- Beranda
- Katalog Produk (dengan filter & search)
- Detail Produk
- Cara Kerja / FAQ *(penting, jelaskan bahwa checkout lewat WhatsApp)*
- Login / Register

**Buyer (sudah login):**
- Profil Saya
- Riwayat Pesanan Saya + Detail Pesanan
- Tombol "Daftar Jadi Penjual" (jika belum seller)

**Seller Dashboard:**
- Overview (ringkasan performa)
- Kelola Produk (list, tambah, edit, nonaktifkan)
- Form Tambah/Edit Produk
- Pesanan Masuk
- Riwayat Penjualan & Status Pencairan
- Pengaturan Rekening Bank

**Admin/Finance Dashboard (internal, route terproteksi):**
- Overview Statistik
- Manajemen User & Verifikasi
- Manajemen Kampus & Kategori
- Manajemen Order (list + detail + update status)
- Manajemen Pencairan Dana
- Log Aktivitas

---

## 13. Template Pesan WhatsApp

Saat user klik "Pesan Sekarang", sistem membuka link `wa.me/<nomor_admin>?text=<pesan_terenkode>` dengan isi pesan berikut (sudah terisi di kolom chat, tinggal ditekan kirim oleh user):

```
Halo Admin BaranginAja 👋

Saya ingin memesan barang berikut:

🛍️ Nama Barang: {nama_barang}
🆔 ID Barang: {id_barang}
👤 Penjual: {nama_penjual} (ID Seller: {id_penjual})
🚚 Opsi Pengiriman: {opsi_pengiriman}
💰 Total Harga: Rp {total_harga}
🔖 ID Pesanan: {id_order}

Mohon diproses ya, terima kasih!
```

Semua variabel `{...}` diisi otomatis oleh sistem dari data Order & Product sebelum di-encode ke URL.

---

## 14. Kebutuhan Non-Fungsional

- **Mobile-first & responsif** — mayoritas target user mengakses dari HP.
- **Keamanan**: password di-hash, koneksi HTTPS, validasi input di sisi server, proteksi role-based untuk route admin/seller.
- **Performa**: optimasi gambar produk (compress/resize saat upload) mengingat koneksi internet di kos kadang terbatas.
- **Auditability**: setiap aksi admin terkait uang (verifikasi bayar, pencairan dana) harus tercatat dengan timestamp & pelaku (lihat ActivityLog).
- **Skalabilitas awal**: cukup untuk volume 1 kota (Surabaya), tidak perlu arsitektur high-scale di MVP.

---

## 15. Rekomendasi Tech Stack

`[Rekomendasi PM — dapat disesuaikan dengan kemampuan tim]`

| Layer | Rekomendasi |
|---|---|
| Frontend | Next.js (React) + TailwindCSS — mobile-responsive |
| Backend | Next.js API Routes (fullstack dalam satu app) atau Node.js/Express terpisah |
| Database | PostgreSQL (cocok untuk data transaksi finansial) |
| ORM | Prisma |
| Auth | NextAuth.js atau Supabase Auth |
| File storage (foto produk, bukti bayar) | Supabase Storage atau Cloudinary |
| Kalkulasi jarak (ongkir) | Google Maps Distance Matrix API, atau alternatif gratis: OpenRouteService/OSRM |
| Integrasi WhatsApp | MVP: link click-to-chat `wa.me` (tanpa API resmi). Fase 2: WhatsApp Business API untuk notifikasi otomatis |
| Hosting | Vercel (frontend/Next.js) + Supabase/Railway (DB & storage) |

Admin Dashboard disarankan dibangun sebagai route terproteksi (`/admin`) dalam aplikasi yang sama, bukan aplikasi terpisah, untuk mempercepat MVP.

---

## 16. Asumsi & Pertanyaan Terbuka

1. Satu akun bisa berperan ganda sebagai buyer & seller (upgrade dari profil).
2. Verifikasi kampus MVP = self-declared dropdown saja (tanpa upload dokumen), sesuai instruksi awal.
3. Setiap produk = stok 1 (barang bekas unik), bukan multi-stok.
4. Ditambahkan **hold timer** saat barang diklik "Pesan" untuk mencegah 2 pembeli memesan barang yang sama secara bersamaan — ini krusial karena tidak disebutkan eksplisit di brief tapi penting untuk integritas sistem.
5. Ongkir dihitung otomatis via API jarak, tapi nominal final tetap bisa disesuaikan admin secara manual di WA jika perlu.
6. MVP diasumsikan pakai **1 nomor WhatsApp admin sentral**. Multi-admin/antrian CS masuk Fase 2.
7. Daftar kampus & kategori awal perlu dikonfirmasi final oleh tim (contoh starter list sudah disediakan di Bagian 8.1).
8. Rating/ulasan penjual belum ada di brief awal — direkomendasikan sebagai fitur trust-building, tapi opsional untuk MVP.

---

## 17. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Proses manual via WA lambat saat volume order tinggi | Admin Dashboard yang jelas + antrian order terurut, notifikasi order baru |
| Ketergantungan pada 1 nomor WA/admin (single point of failure) | Rencana tambah admin/CS di Fase 2 |
| Efek "cliff-edge" pada tier markup (lihat catatan Bagian 9.1) | Sosialisasikan di FAQ; evaluasi skema progresif di masa depan |
| Uang terpusat di 1 rekening + pencairan manual rawan kesalahan/kelalaian | SOP ketat + ActivityLog wajib untuk setiap verifikasi & pencairan dana |
| Estimasi jarak/berat dari user tidak akurat | Admin dapat override ongkir manual sebelum konfirmasi ke pembeli |

---

## 18. Roadmap Pengembangan

**Fase 1 — MVP** (sesuai seluruh kebutuhan di dokumen ini):
Registrasi + verifikasi dropdown kampus, posting barang + kalkulasi markup otomatis, katalog & pencarian, checkout via WA handoff, pembayaran manual + verifikasi admin, 2 opsi pengiriman dengan kalkulasi ongkir otomatis, dashboard seller, dashboard admin/finance dasar.

**Fase 2 — Pengembangan Lanjutan dan belum masuk ke development sekarang:**
- Rating & ulasan penjual/pembeli
- Notifikasi otomatis (WhatsApp Business API / email)
- Verifikasi identitas dengan upload KTM
- Multi-admin & sistem antrian CS
- Laporan keuangan lanjutan
- Wishlist/favorit produk
- Ekspansi ke kota lain di luar Surabaya

---
*Akhir dokumen.*
