# Product Requirements Document (PRD): StudentHub AI v2.0

**Document Status:** Draft / Planning
**Version:** 2.0 (Major Update)
**Theme:** Gamification, Hyper-Focus, & AI-Driven Empathy

---

## 1. Product Overview (v2.0)
StudentHub AI v1.0 berhasil menyelesaikan masalah **Context Switching** dengan menyatukan pilar Mata Kuliah, Organisasi, dan Proyek ke dalam satu *dashboard* Kanban tersentralisasi. 

Versi 2.0 dirancang untuk menyelesaikan *pain points* psikologis mahasiswa dengan mobilitas tinggi: **Motivasi, Fokus, dan Kecemasan Komunikasi**. Pembaruan ini mengubah aplikasi dari sekadar "alat pencatat" menjadi "Asisten Digital" interaktif. Melalui integrasi RPG, *Aesthetic Pomodoro*, *AI Communication Drafter*, dan *Weekly Wrapped*, aplikasi ini menuntun pengguna melewati padatnya jadwal akademik, rapat organisasi, hingga tenggat waktu *hackathon* dengan cara yang *stress-free*.

---

## 2. Core Features

### 🎮 2.1. RPG 2.0: Familiar & Self-Bribe Reward System
Mengubah sistem XP statis menjadi ekosistem *reward* yang berdampak pada dunia nyata dan memiliki ikatan visual.

*   **Virtual Study Pet (Familiar):**
    *   Avatar digital (misal: rubah 8-bit, robot *droid*) yang menetap di *sidebar*.
    *   **Mekanisme:** Animasi bersifat reaktif. Memindahkan tugas ke "Done" akan memicu animasi evolusi atau ceria. Tumpukan tugas yang melewati tenggat waktu membuat *Familiar* terlihat lelah atau mengantuk.
*   **Self-Bribe Reward Shop:**
    *   Pengguna dapat menetapkan katalog *reward* mereka sendiri beserta "harga" penukaran XP-nya.
    *   *Contoh Use Case:* 
        *   Tukar 500 XP ➔ *"Checkout keranjang belanja"*
        *   Tukar 1200 XP ➔ *"Jajan makanan enak di area Bojongsoang akhir pekan ini"*
        *   Tukar 1500 XP ➔ *"Bebas nonton series tanpa mikirin arsitektur sistem"*
    *   **Visual Feedback:** Penukaran *reward* memicu efek *Mega Confetti* pada layar.

### 🍅 2.2. Aesthetic Pomodoro Focus Mode
Meminimalisir distraksi dari *dashboard* Kanban yang padat.

*   **Zen Interface:** Saat diaktifkan (standar 25 menit fokus / 5 menit istirahat), antarmuka Kanban disembunyikan. Layar berubah menjadi minimalis, menyorot satu tugas spesifik yang sedang dikerjakan.
*   **Companion Mode:** *Familiar* menampilkan animasi sedang fokus belajar selama *timer* berjalan.
*   **XP Multiplier:** Menyelesaikan 1 blok sesi Pomodoro tanpa pembatalan akan otomatis menyuntikkan XP bonus.

### 💬 2.3. AI Communication Drafter
Asisten *prompt* untuk mengatasi *overthinking* saat harus menyusun pesan ke pihak dosen atau birokrasi kampus.

*   **Mekanisme:** Terdapat tombol `Draft Message` di dalam detail *Card Task*.
*   **Alur Pengguna:** Pengguna mengetik *prompt* informal. Gemini API merombaknya menjadi format formal akademik yang siap di-salin (WhatsApp/Email).
*   *Contoh Use Case:*
    *   **Input User:** *"Pak minta waktu buat cek prototipe alat smart farming ulat hongkong buat tugas akhir."*
    *   **Output AI:** Pesan terstruktur dengan salam hormat, identitas diri (Nama, NIM, Kelas), tujuan yang komprehensif, dan kalimat penutup yang sopan.

### 🏆 2.4. AI Weekly "Wrapped"
Sistem afirmasi positif mingguan untuk menumbuhkan rasa pencapaian.

*   **Mekanisme:** *Pop-up summary* estetik yang muncul setiap hari Minggu malam.
*   **Alur Sistem:** AI membaca histori *JSON payload* dari tugas yang diselesaikan selama 7 hari terakhir dan merangkainya menjadi narasi motivasi.
*   *Contoh Output:* *"Minggu yang luar biasa! Kamu berhasil menyelesaikan 18 tugas, termasuk ngeberesin flow data Transparaksi 2.0 dan ngurus logistik acara Study Jam kampus. Peliharaan digitalmu juga naik 2 level. Sekarang waktunya istirahat penuh!"*

---

## 3. Technical Specifications & Database Schema

**Tech Stack:**
*   **Frontend/Backend:** Next.js 16 (App Router), TypeScript, Tailwind CSS
*   **Database:** PostgreSQL (via Supabase)
*   **AI Engine:** Google Gemini API (via Route Handlers)

### 3.1. Database Adjustments (Supabase)

| Table Name | New/Modified Column | Data Type | Description |
| :--- | :--- | :--- | :--- |
| `profiles` | `pet_state` | `VARCHAR` | Status *Familiar* (e.g., `happy`, `tired`, `focus`). |
| `profiles` | `focus_minutes` | `INT` | Akumulasi waktu sesi Pomodoro. |
| `custom_rewards`| `id`, `user_id`, `title`, `cost` | `UUID, INT, VARCHAR` | *Tabel baru* untuk Master Data *Self-Bribe Rewards*. |
| `pomodoro_logs` | `id`, `task_id`, `duration` | `UUID, INT` | *Tabel baru* untuk *log* historis *Weekly Wrapped*. |

### 3.2. AI Integration (Route Handlers)
*   `POST /api/ai/draft-message`: Membutuhkan injeksi *System Prompt* khusus untuk *Natural Language Processing* dengan gaya bahasa Indonesia formal akademik.
*   `POST /api/ai/weekly-wrapped`: Menerima *payload* *array* dari judul `tasks` yang berstatus *Done* minggu ini untuk dikonversi menjadi paragraf narasi afirmasi.

---

## 4. Success Metrics (KPIs)
1.  **Focus Rate:** Persentase sesi Pomodoro yang diselesaikan tanpa dihentikan (Target: >75%).
2.  **XP Burn Rate:** Frekuensi penukaran XP di *Self-Bribe Shop* (Indikator keberhasilan *reward system*).
3.  **Drafter Utilization:** Jumlah eksekusi AI *Communication Drafter* per pengguna per minggu.

---

## 5. UI/UX Guidelines
*   **Warna Ekstra:** Penambahan aksen *Deep Indigo* (`#4F46E5`) pada *Aesthetic Pomodoro* untuk mereduksi ketegangan mata (memberikan kesan *night/focus mode*).
*   **Micro-interactions:** Implementasi transisi *fade-in/out* yang mulus menggunakan *Framer Motion* untuk kemunculan UI *Weekly Wrapped* dan pergantian *state* Kanban.