<div align="center">
<h1>🚀 ViteMail Bot</h1>
<p><b>Layanan Email Sementara (Temp Mail) Instan & Real-time via Telegram</b></p>
<!-- Badges -->
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Node.js-43853D%3Fstyle%3Dfor-the-badge%26logo%3Dnode.js%26logoColor%3Dwhite" alt="Node.js" />
<img src="https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white" alt="Cloudflare" />
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Express.js-404D59%3Fstyle%3Dfor-the-badge%26logo%3Dexpress%26logoColor%3Dwhite" alt="Express" />
</div>

## 📖 Tentang Proyek

**ViteMail** adalah bot Telegram _open-source_ yang memungkinkan pengguna membuat alamat email sementara (Temp Mail) dengan cepat dan aman. Dibangun dengan arsitektur modern memanfaatkan **Cloudflare Email Routing**, bot ini tidak memerlukan _polling_ berkala. Setiap email yang masuk akan langsung didorong (_push notification_) ke _chat_ Telegram pengguna secara **Real-Time**.

## ✨ Fitur Utama

- 🎲 **Generate Random Email:** Buat alamat email acak hanya dengan satu ketukan.
- ✏️ **Custom Email Prefix:** Pengguna dapat membuat alamat email dengan awalan sesuai keinginan (contoh: nama@domain.com).
- ⚡ **Real-Time Push Notification:** Email masuk akan diformat ulang dengan rapi dan langsung dikirim ke Telegram pengguna dalam hitungan detik.
- 🛡️ **Kebijakan 1 Sesi (Anti-Spam):** Setiap pengguna hanya dapat memiliki 1 email aktif dalam satu waktu.
- 🗑️ **Hapus Sesi Instan:** Hapus alamat email kapan saja untuk menghentikan penerimaan pesan.
- ⏳ **Auto-Expired:** Manajemen memori dan _database_ cerdas di mana email akan hangus secara otomatis.

## 🛠️ Tech Stack & Arsitektur

ViteMail dirancang menggunakan teknologi terkini untuk memastikan skalabilitas dan performa maksimal pada spesifikasi server minimal (VPS).

### Core Stack

- **Bot Framework:** Grammy.js
- **Backend Server:** Express.js
- **Database:** LibSQL (SQLite) + Drizzle ORM
- **Session Manager:** Redis (@grammyjs/storage-redis)

### Infrastruktur Email

- **Email Router:** Cloudflare Catch-all Email Routing
- **Parser & Forwarder:** Cloudflare Workers + postal-mime
- **Build Tool (Worker):** Tsup

### 🔄 Alur Kerja Sistem

1.  Email dikirim ke random@domain.com.
2.  **Cloudflare** menangkap email tersebut (_catch-all_).
3.  **Cloudflare Worker** mem-parsing MIME/Raw email menjadi format JSON yang rapi.
4.  Worker menembakkan data JSON ke **Express Webhook** di VPS melalui metode POST.
5.  VPS memverifikasi otorisasi, mencari ID pengguna di Database, lalu menyuruh **Grammy Bot** mengirimkan pesan ke Telegram pengguna.

## 🚀 Instalasi & Setup

### Prasyarat

Sebelum memulai, pastikan sistem kamu memiliki:

- Node.js (v18 atau terbaru)
- Redis Server (berjalan di _background_)
- Akun Cloudflare (dengan domain aktif)
- Token Bot Telegram (dari @BotFather)

### 1. Clone Repository

```bash
git clone [https://github.com/xenvoid404/vitemail-bot.git](https://github.com/xenvoid404/vitemail-bot.git)
cd vitemail-bot

```

### 2. Install Dependencies

```bash
pnpm install

```

### 3. Konfigurasi Environment

Salin file .env.example menjadi .env dan isi dengan konfigurasi kamu

### 4. Setup Database (Drizzle ORM)

Jalankan migrasi untuk membuat tabel di dalam _database_:

```bash
pnpm db:generate && pnpm db:push

```

### 5. Setup Cloudflare Worker (Kurir Email)

Worker bertanggung jawab meneruskan email dari Cloudflare ke VPS kamu.

1.  Sesuaikan variabel di file wrangler.toml
2.  Set variabel rahasia untuk Webhook (harus sama dengan APP_KEY di .env)
3.  Build dan Deploy Worker:

```bash
pnpm build:worker
npx wrangler deploy

```

### 6. Jalankan Bot

```bash
# Untuk mode pengembangan (Development)
pnpm dev

# Untuk mode produksi (Production)
pnpm build
pnpm start

```

## 📜 Lisensi

Proyek ini didistribusikan di bawah lisensi **MIT**. Kamu bebas menggunakan, memodifikasi, dan mendistribusikannya kembali. Lihat file LICENSE untuk informasi lebih lanjut.

<div align="center">
<i>Dibuat dengan ❤️ dan ☕ untuk memberikan privasi yang lebih baik.</i>
</div>
