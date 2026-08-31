# Product Requirements Document (PRD): StudentHub AI

## 1. Ikhtisar Produk (Product Overview)
**StudentHub AI: The Academic & Life Dashboard**
Aplikasi web produktivitas personal berbantuan AI (Micro-SaaS) yang dikhususkan untuk mahasiswa dengan mobilitas tinggi. Aplikasi ini menyatukan pengelolaan tiga pilar utama kehidupan mahasiswa: **Mata Kuliah**, **Organisasi**, dan **Proyek**. 

Fitur unggulannya adalah **AI Auto-Categorizer** dan **AI Task Breaker** yang otomatis memilah input ide acak serta memecah tugas kompleks menjadi langkah-langkah *actionable*. Dilengkapi juga dengan sistem **Gamifikasi (RPG-style)** untuk menjaga motivasi pengguna agar terhindar dari *burnout* dan prokrastinasi.

---

## 2. Masalah & Solusi
### Masalah (Pain Points)
- **Context Switching:** Mahasiswa kewalahan berpindah aplikasi (Trello, WhatsApp, Notion, Google Calendar) untuk mengurus tugas akademik, kepanitiaan, dan proyek *freelance*.
- **Mental Overload:** Sering bingung harus mulai dari mana saat menghadapi tugas berskala besar, memicu penundaan (*procrastination*).
- **Kurangnya Motivasi:** Mengerjakan tugas terasa membosankan dan monoton tanpa adanya sistem *reward* instan.

### Solusi
- **Satu Dashboard Sentral:** Mengintegrasikan seluruh jadwal dan Kanban dalam satu platform.
- **AI Assistants:** Memecah tugas otomatis dan mencatat ide secepat kilat.
- **Gamifikasi:** Memberikan apresiasi instan melalui sistem XP, Naik Level, dan pengumpulan Lencana (*Badges*) yang diiringi efek visual menyenangkan (*Confetti*).

---

## 3. Status Fitur (Feature Breakdown)

### ✅ Fitur yang Sudah Diimplementasikan (Core MVP)
1. **Pillar Management**:
   - Master data untuk Mata Kuliah, Organisasi, dan Proyek.
   - Papan **Kanban Board** (*To-Do, Doing, Done*) khusus untuk masing-masing pilar dengan fungsi *drag-and-drop*.
2. **Quick "Brain Dump" Bar**:
   - Kolom *input* instan.
   - **AI Auto-Categorizer** membaca teks dan otomatis menugaskannya ke pilar yang tepat.
   - Terdapat label khusus `Wand2 AI Generated` pada kartu tugas.
3. **AI Task Breaker**:
   - Memecah tugas besar menjadi *checklist* sub-tugas kecil menggunakan Gemini AI.
   - Sub-tugas otomatis tersimpan ke pangkalan data (`JSONB`) sehingga pengguna dapat mencicil pekerjaan (men-centang *checklist*) tanpa kehilangan progres saat aplikasi ditutup.
4. **Sistem Gamifikasi (RPG System)**:
   - **XP & Level**: Setiap tugas yang digeser ke "Done" memberikan +25 XP. Kelipatan 100 XP akan memicu Level Up. Level dan XP selalu terlihat di sudut layar (*Sidebar*).
   - **Pencapaian (Achievements)**: Lencana (seperti *First Blood*, *Task Master*) dengan *Progress Bar* dinamis (misal: 3/10 tugas selesai) untuk melacak penyelesaian secara *real-time*.
   - **Visual Feedback**: Letupan *Confetti* kecil untuk penyelesaian tugas dan *Mega Confetti* penuh warna untuk perayaan Naik Level.

### 🚧 Fitur yang Belum Dimasukkan / Akan Datang (Upcoming Features)
1. **Unified Smart Schedule (Kalender Terpadu)**
   - **Deskripsi:** Visualisasi kalender harian/mingguan yang menggabungkan jadwal kelas rutin, rapat organisasi, dan *deadline* proyek.
   - **Fungsi:** Deteksi bentrok jadwal otomatis. Menampilkan peringatan jika *deadline* tugas tumpang tindih dengan kelas.
2. **Financial Tracker (Pelacak Keuangan)**
   - **Deskripsi:** Manajemen pemasukan (*income*) dan pengeluaran (*expense*) khusus mahasiswa.
   - **Fungsi:** Melacak uang saku bulanan, bayaran proyek/freelance, pengeluaran makan, dan buku. (Tabel basis data `transactions` sudah siap, namun UI belum dibangun).
3. **Pomodoro Timer Terintegrasi**
   - **Deskripsi:** *Timer* fokus bawaan di dalam aplikasi.
   - **Fungsi:** Memungkinkan pengguna untuk mengerjakan tugas dengan teknik Pomodoro (25 menit kerja, 5 menit istirahat) langsung dari *Task Detail Modal*, yang bisa terhubung ke sistem XP ekstra.
4. **Analitik Produktivitas Mingguan**
   - **Deskripsi:** Halaman metrik yang menampilkan jam paling produktif pengguna, rasio penyelesaian tugas, dan distribusi beban kerja per pilar.
5. **Mode Gelap (Dark Mode)**
   - **Deskripsi:** Pilihan tema *interface* agar mata tidak lelah saat mengerjakan tugas di malam hari, dengan transisi yang mulus.

### ❌ Fitur Di Luar Ruang Lingkup (Out of Scope / Future Roadmap)
- Penyimpanan *File/Upload* dokumen berukuran besar (dialihkan ke tautan eksternal).
- Mode Kolaborasi Multi-Pengguna (Aplikasi ini 100% untuk manajemen pribadi).
- Aplikasi *Native Mobile* (iOS/Android) (Saat ini difokuskan pada *Responsive Web App*).

---

## 4. Target Persona Pengguna
- **Demografi:** Mahasiswa sarjana (S1), mobilitas tinggi, aktif di kampus dan luar kampus.
- **Karakteristik:** Sibuk dengan kelas, menjadi inti kepanitiaan/BEM, dan mengambil proyek sampingan (*freelance*/lomba).
- **Tujuan Utama:** Menghindari *burnout*, menyeimbangkan akademik dan sosial, serta lulus tepat waktu dengan portofolio yang kaya.

---

## 5. Spesifikasi Teknis & Database Schema (Updated)

**Tech Stack:**
- **Frontend & Backend:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Turbopack.
- **Database & Auth:** PostgreSQL via Supabase, Google OAuth.
- **AI Integration:** Google Gemini API (via Next.js Route Handlers).

**Skema Database Utama:**
1. `profiles`: Menyimpan `id` pengguna, `full_name`, `xp` (int), `level` (int). Diperkuat dengan RLS Policy khusus untuk *INSERT* dan *UPDATE*.
2. `pillars`: Menyimpan daftar pilar (tipe: `MATKUL`, `ORGANISASI`, `PROYEK`).
3. `tasks`: Tabel utama Kanban. Memiliki kolom *flag* `is_ai_generated` dan penyimpanan `subtasks` dengan tipe **JSONB** (untuk mencatat *checklist* AI Task Breaker secara fleksibel).
4. `badges` & `user_badges`: Menyimpan data master lencana dan relasi perolehannya oleh pengguna.
5. `transactions`: Tabel pencatatan arus kas (belum dieksekusi di *frontend*).

---

## 6. Desain UI/UX (Style & Mood)
- **Tema:** Cheerful, Stress-Free, & Premium.
- **Tipografi:** Menggunakan *custom font* dengan ujung membulat (Quicksand/Nunito) untuk meminimalkan kesan kaku/korporat.
- **Palet Warna:**
  - `#FF9F43` (Soft Tangerine) untuk CTA dan status To-Do.
  - `#10B981` (Pastel Emerald) untuk keberhasilan (Done).
  - `#FBBF24` (Sunny Amber) untuk highlight AI dan Doing.
- **Micro-interactions:** *Hover states*, transisi halus, *toast notifications*, dan *Confetti* untuk meningkatkan kepuasan pengguna.

---
*Dokumen ini adalah PRD hidup (Living Document) yang akan terus diperbarui seiring berjalannya proses iterasi produk.*
