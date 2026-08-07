# Coldstart: StudentHub AI

Dokumen ini adalah rangkuman lengkap (coldstart) dari seluruh perencanaan aplikasi **StudentHub AI** yang telah disetujui, mencakup Ide, PRD, User Persona, User Flow, Wireframe, Database Schema, hingga arahan Visual UI.

---

## 1. Ide Utama
**StudentHub AI: The Academic & Life Dashboard**
Aplikasi web produktivitas personal berbantuan AI (Micro-SaaS) yang dikhususkan untuk mahasiswa dengan mobilitas tinggi. Aplikasi ini menyatukan pengelolaan tiga pilar utama kehidupan mahasiswa: Mata Kuliah, Organisasi, dan Proyek. Fitur unggulannya adalah AI Auto-Categorizer dan AI Task Breaker yang otomatis memilah input ide acak serta memecah tugas kompleks menjadi langkah-langkah *actionable*, meminimalisir *context switching* dan kelelahan mental.

---

## 2. Product Requirements Document (PRD)

### Masalah yang Diselesaikan
Mahasiswa sering kali harus membagi fokus antara jadwal mata kuliah yang padat, kewajiban rapat organisasi atau komunitas, serta pengerjaan proyek. Mengelola entitas yang berbeda-beda ini (akademik, kepanitiaan, dan *side-project*) di aplikasi yang terpisah sering kali menyebabkan bentrok jadwal, tenggat waktu yang terlewat, dan kelelahan mental. Belum ada satu *dashboard* personal yang benar-benar menyatukan pilar-pilar kehidupan mahasiswa ini secara transparan dan terpusat.

### Siapa Usernya (Target Persona)
Aplikasi ini dirancang khusus untuk mahasiswa tingkat sarjana dengan mobilitas dan aktivitas tinggi, dengan karakteristik seperti:
- Mahasiswa yang harus memantau jadwal kelas dan tugas kuliah dengan ketat.
- Anggota inti atau *core team* komunitas developer/Organisasi di kampus yang secara rutin harus mengoordinasikan acara, pertemuan, dan logistik organisasi.
- Mahasiswa yang sering mengerjakan proyek kompetisi, *hackathon*, atau portofolio teknis mandiri.

### Fitur Utama (MVP Core)
1. **Pillar Management (Matkul, Organisasi, Proyek)**: Modul master data untuk menyimpan dan mengkategorikan informasi dasar: daftar Mata Kuliah (jadwal kelas), daftar Organisasi/Komunitas, dan Proyek yang sedang berjalan.
2. **Unified Smart Schedule**: Kalender sentral yang menyatukan jadwal kelas rutin, agenda rapat organisasi, dan *deadline* proyek dalam satu tampilan visual untuk memudahkan deteksi bentrok jadwal.
3. **Quick "Brain Dump" Bar**: Kolom input statis yang selalu ada di layar untuk mencatat ide mendadak, tugas dadakan, atau draf pesan tanpa harus berpindah halaman dari fokus kerja utama.
4. **AI Auto-Categorizer**: Mesin AI yang otomatis memilah teks yang dimasukkan via *Brain Dump* dan mengaitkannya ke pilar yang tepat (misal: otomatis mengklasifikasikan sebagai Tugas Matkul, Agenda Organisasi, atau referensi Proyek).
5. **AI Task Breaker**: Fitur yang mengizinkan AI untuk mengurai tugas yang kompleks atau besar (seperti menyusun proposal acara atau merancang arsitektur sistem) menjadi langkah-langkah kerja kecil (Kanban card) yang langsung dapat dieksekusi.
6. **Landing Page**: Halaman muka publik untuk mempresentasikan nilai jual aplikasi dan mengajak pengguna baru mendaftar (via Google OAuth).

### Fitur yang Dikeluarkan dari Ruang Lingkup (Out of Scope)
Untuk menjaga efisiensi dan memastikan aplikasi dapat berjalan secara optimal di atas kuota gratis (seperti Supabase), fitur berikut tidak termasuk dalam cakupan MVP:
- **Penyimpanan Dokumen/File Berukuran Besar:** Aplikasi tidak akan menyediakan fitur *upload* file langsung. Semua referensi ke dokumen akademik, proposal organisasi, atau aset desain akan ditangani melalui penyematan *link eksternal* (misal: Google Drive).
- **Fungsi Multi-Pengguna dan Berbagi:** Tidak ada sistem ruang kerja bersama atau kemampuan berbagi tugas ke pengguna lain, 100% didedikasikan untuk manajemen pribadi pengguna.
- **Notifikasi Push Bawaan:** Pengingat bergantung penuh pada peninjauan visual pengguna melalui *dashboard* kalender, tanpa ada pengiriman notifikasi aktif ke perangkat keras atau email.

---

## 3. User Persona & User Flow

### User Persona
**Nama:** Maya
**Latar Belakang:** Mahasiswa Desain Komunikasi Visual (DKV) tingkat 3.
**Aktivitas:**
- Mengambil mata kuliah praktik/studio dengan *deadline* ketat.
- Ketua Divisi Media Sosial di Badan Eksekutif Mahasiswa (BEM).
- Rutin mengambil proyek *freelance* desain dari klien luar atau mengikuti sayembara logo.

**Kebutuhan Utama (Needs):**
- Satu *dashboard* tunggal yang bisa menampilkan jadwal *deadline* revisi desain dari klien dan jadwal rapat BEM secara berdampingan.
- Cara instan untuk mencatat ide visual atau referensi kampanye saat sedang di jalan, tanpa merusak fokus kerja.
- Sistem yang bisa membantu merombak proyek desain besar menjadi tahapan kecil agar tidak memicu *burnout*.

**Masalah Utama (Pain Points):**
- **Context Switching:** Terlalu sering berpindah antara grup WhatsApp BEM, Trello dari klien, dan kalender akademik kampus.
- **Mental Overload:** Sering kewalahan saat melihat tugas berskala besar (misal: "Bikin *Brand Identity* lengkap") karena tidak tahu harus mulai dari elemen mana.
- **Lost Information:** Tautan referensi desain, palet warna, atau detail revisi sering hilang karena hanya ditaruh di *chat* acak atau terselip di *history browser*.

### User Flow Step-by-Step
**Skenario:** Pengguna sedang fokus mengerjakan tugas mata kuliah Studio Desain, namun tiba-tiba teringat harus menyusun rencana konten (*content plan*) untuk acara BEM. Pengguna ingin mencatat ide tersebut dan memecahnya menjadi langkah kerja nyata tanpa kehilangan fokus.

1. **Buka Aplikasi**
   Pengguna membuka aplikasi dan langsung melihat ringkasan harinya.
   *Halaman yang muncul:* **Unified Smart Schedule (Dashboard Utama)** — Menampilkan visualisasi kalender hari ini yang berisi jadwal kelas studio dan tenggat waktu revisi klien.
2. **Input Ide Instan**
   Pengguna tidak perlu pindah menu. Ia langsung mengetik di kolom input statis: *"Bikin draft kalender konten untuk acara BEM bulan depan"* lalu menekan Enter.
   *Halaman yang muncul:* Tetap di **Dashboard Utama**, dengan menggunakan komponen **Quick "Brain Dump" Bar**.
3. **Pemrosesan AI**
   Sistem AI di belakang layar membaca teks tersebut dan secara otomatis memindahkannya ke dalam basis data sebagai "Tugas" dan menandainya dengan label pilar "Organisasi".
   *Halaman yang muncul:* **Notifikasi Toast/Pop-up kecil** di pojok layar berbunyi: *"Tugas berhasil ditambahkan ke pilar Organisasi!"*.
4. **Meninjau dan Memecah Tugas**
   Setelah selesai dengan tugas kuliahnya, pengguna ingin mulai mengerjakan rencana konten tersebut. Ia mengklik notifikasi atau berpindah ke menu organisasi.
   *Halaman yang muncul:* **Pillar Management View (Tab Organisasi)** — Menampilkan papan Kanban khusus untuk organisasi. Tugas "Bikin draft kalender konten..." berada di kolom *To-Do*.
5. **Aktivasi AI Task Breaker**
   Karena tugas menyusun kalender konten dirasa memakan waktu, pengguna mengklik tombol *magic wand* (AI Task Breaker) pada kartu tugas tersebut.
   *Halaman yang muncul:* **Task Detail Modal (Pop-up detail tugas)** — Menampilkan efek *loading* singkat selagi AI memproses kueri.
6. **Eksekusi Sub-Tugas**
   AI merespons dengan memecah kartu utama menjadi 3 *checklist* yang dapat dieksekusi: (1) Riset referensi visual sejenis, (2) Tentukan pilar konten mingguan, (3) Buat *brief* desain untuk tim eksekusi.
   *Halaman yang muncul:* **Task Detail Modal** (terbaru). Pengguna kemudian menekan tombol centang pada langkah pertama untuk mulai bekerja, yang menggeser persentase progres ke 33%.

---

## 4. Struktur Wireframe

### Halaman 1: Unified Smart Schedule (Dashboard Utama)
*Halaman pertama yang terbuka saat aplikasi diakses.*
- **1. Header & Navigasi Global (Top Bar)**
  - Logo & Judul Aplikasi ("StudentHub AI")
  - Menu Tab Utama (Dashboard, Matkul, Organisasi, Proyek) → *Status: Dashboard Aktif*
  - Ikon Profil Pengguna
- **2. Komponen: Quick "Brain Dump" Bar (Posisi statis di atas/bawah layar)**
  - Form Input Teks: *Placeholder* "Ketik ide, tugas mendadak, atau catatan di sini..."
  - Tombol Submit (Ikon *Send* atau *Enter*)
- **3. Area Konten Utama (Main Dashboard)**
  - Teks Sapaan ("Halo, ini fokusmu hari ini")
  - **Bagian A: Unified Timeline / Calendar**
    - Indikator Hari & Tanggal
    - Kartu Agenda/Tugas (Menampilkan blok waktu kuliah studio dan *deadline* revisi)
  - **Bagian B: Urgent Tasks**
    - Daftar tugas yang *due date*-nya hari ini dari semua pilar.
- **4. Elemen Overlay (Muncul Sesaat)**
  - **Toast Notification:** Pop-up kecil di pojok layar (Berisi teks sukses dari AI Auto-Categorizer: "Tugas berhasil ditambahkan ke pilar Organisasi").

### Halaman 2: Pillar Management View (Tab Organisasi)
*Halaman saat pengguna memeriksa tugas yang baru saja dilempar oleh AI dari Brain Dump.*
- **1. Header & Navigasi Global (Top Bar)**
  - Menu Tab Utama (Dashboard, Matkul, Organisasi, Proyek) → *Status: Organisasi Aktif*
- **2. Sub-Header Pilar**
  - Judul Halaman ("Pilar: Organisasi")
  - *Dropdown Menu*: Filter Organisasi (Misal: "BEM", "Himpunan")
  - Tombol: "+ Tambah Tugas Baru Manual"
- **3. Area Konten Utama: Kanban Board**
  - **Kolom "To-Do" (Belum Dikerjakan)**: Kartu Tugas (Contoh: "Bikin draft kalender konten..."). *Memiliki indikator AI label.*
  - **Kolom "Doing" (Sedang Dikerjakan)**: Kartu Tugas lainnya.
  - **Kolom "Done" (Selesai)**: Kartu Tugas yang sudah selesai.

### Halaman 3: Task Detail Modal (Overlay)
*Jendela pop-up yang muncul saat pengguna mengklik Kartu Tugas di Kanban untuk memecah tugas menggunakan AI.*
- **1. Modal Header**
  - *Breadcrumb* Label Pilar (Organisasi > BEM)
  - Tombol Tutup (Ikon "X")
- **2. Modal Body (Informasi Dasar)**
  - Input Field Judul Tugas (Bisa diedit)
  - Pemilih Tanggal (*Date Picker*) untuk Deadline
  - Area Teks Deskripsi / Catatan Tambahan
- **3. Modal Body (Area AI Task Breaker)**
  - **Tombol Utama:** "✨ Pecah Tugas dengan AI"
  - **State Loading:** Animasi *spinner* atau teks indikator ("AI sedang merumuskan langkah...")
  - **Hasil Generate AI (Daftar Sub-Tugas):**
    - Indikator Progress Bar (0% - 100%)
    - *Checklist Item* 1 (Bisa dicentang, teks bisa diedit)
    - *Checklist Item* 2
    - *Checklist Item* 3
- **4. Modal Footer**
  - Tombol: "Hapus Tugas"
  - Tombol: "Simpan Perubahan"

---

## 5. Database Schema
Konvensi penamaan yang digunakan adalah **snake_case** (Optimal untuk PostgreSQL / Supabase).

### Tabel: `pillars`
Menyimpan data master untuk 3 pilar utama kehidupan pengguna.
- `id` (UUID) - **Primary Key**
- `user_id` (UUID) - **Foreign Key** ke tabel auth.users
- `name` (VARCHAR) - Nama pilar (misal: "Studio Desain", "BEM")
- `type` (VARCHAR) - Kategori pilar: 'MATKUL', 'ORGANISASI', 'PROYEK'
- `created_at` (TIMESTAMP) - Waktu data dibuat

### Tabel: `tasks`
Tabel sentral untuk manajemen Kanban dan hasil input dari Quick Brain Dump.
- `id` (UUID) - **Primary Key**
- `pillar_id` (UUID) - **Foreign Key** ke tabel *pillars* (Bisa NULL)
- `title` (TEXT) - Judul tugas atau teks mentah
- `status` (VARCHAR) - Status Kanban: 'TO_DO', 'DOING', 'DONE'
- `due_date` (TIMESTAMP) - Tenggat waktu tugas
- `is_ai_generated` (BOOLEAN) - *Flag* jika tugas ini hasil pilahan otomatis AI
- `created_at` (TIMESTAMP) - Waktu tugas dibuat

### Tabel: `subtasks`
Menyimpan rincian langkah-langkah hasil dari AI Task Breaker.
- `id` (UUID) - **Primary Key**
- `task_id` (UUID) - **Foreign Key** ke tabel *tasks* (Tugas induk)
- `title` (TEXT) - Instruksi sub-tugas spesifik
- `is_completed` (BOOLEAN) - Status penyelesaian (Default: FALSE)

### Tabel: `events`
Tabel untuk mengatur jadwal waktu spesifik (kelas, rapat).
- `id` (UUID) - **Primary Key**
- `pillar_id` (UUID) - **Foreign Key** ke tabel *pillars*
- `title` (TEXT) - Nama kegiatan
- `start_time` (TIMESTAMP) - Waktu mulai
- `end_time` (TIMESTAMP) - Waktu selesai

---

## 6. Tech Stack (Diputuskan)
Berdasarkan konfirmasi awal, aplikasi ini akan dibangun menggunakan:
- **Framework Utama**: Next.js (App Router)
- **Bahasa Pemrograman**: TypeScript (untuk keandalan dan *type safety*)
- **Styling**: Tailwind CSS (memudahkan implementasi desain *cheerful* dan warna kustom)
- **Database & Auth**: PostgreSQL via Supabase (menggunakan Google OAuth untuk autentikasi)
- **AI Integration**: Google Gemini API (untuk fitur Auto-Categorizer dan Task Breaker, diproses via Next.js API Routes)

---

## 7. Desain UI (Style & Mood)

### Konsep Utama
**Cheerful & Stress-Free**: Mengurangi beban kognitif dengan warna yang ceria dan menenangkan, menghindari warna neon atau merah/hitam pekat.

### Rekomendasi Warna (Hex Code)
1. **#FF9F43 (Soft Tangerine)**
   - *Peruntukan*: Tombol Utama (CTA), ikon Brain Dump, status "To-Do".
   - *Mood*: Oranye *soft* mengundang aksi tanpa terasa seperti paksaan, memancarkan energi kreatif.
2. **#10B981 (Pastel Emerald)**
   - *Peruntukan*: Kolom "Done", indikator sukses, tombol checklist.
   - *Mood*: Memberikan efek menenangkan dan rasa lega (*rewarding*) saat tugas selesai.
3. **#FBBF24 (Sunny Amber)**
   - *Peruntukan*: Highlight kartu Kanban, ikon AI, status "Doing".
   - *Mood*: Keceriaan hangat untuk menandai fitur cerdas tanpa menyilaukan mata.

### Referensi Aplikasi (Moodboard)
- [Amie](https://amie.so/)
- [Llama Life](https://llamalife.co/)
- [Finch](https://finchcare.com/)

### Rekomendasi Tipografi
**Wajib menggunakan Custom Font (Bukan font default Tailwind/System Font).**
- *Alasan*: Font bawaan (Inter, Arial) bersiku tajam dan memberi kesan korporat yang memicu stres.
- *Rekomendasi*: Gunakan font dengan ujung membulat (*rounded*) dari Google Fonts agar terasa santai dan bersahabat.
  - **Quicksand**: Sangat bulat, ceria, dan modern. Cocok dipadukan dengan desain kartu yang ujungnya *rounded*.
  - **Nunito**: Geometris dengan ujung terminal membulat. Rapi untuk teks panjang namun tidak kaku.