# Promptgallery Studio Workspace — Walkthrough

## Ringkasan Pembaruan Terkini

Sesuai arahan:
> **"Semua user & pengunjung, kenapa pengunjung? hanya user login saja"**

Kini akses **pengunjung tanpa login telah ditiadakan sepenuhnya**. Seluruh ruang kerja (*workspace*), item storyboard, prompt AI, dan media **hanya dapat diakses oleh pengguna yang sudah login**.

---

## Rincian Implementasi

### 1. Proteksi Akses Penuh (Strict Login Barrier)
- **File**: [src/App.jsx](file:///c:/App%20Tools/PromptGallery-Free-Microstock-Platform/src/App.jsx)
- Pengunjung yang belum login (atau setelah menekan **Sign Out**) **tidak dapat melihat isi storyboard sama sekali**.
- Layar akan langsung menampilkan **Halaman Login Khusus** ([src/components/auth/LoginPage.jsx](file:///c:/App%20Tools/PromptGallery-Free-Microstock-Platform/src/components/auth/LoginPage.jsx)).
- Di halaman login:
  - Maskot Robot AI 3D Promptgallery (`/icon.png`) dengan animasi melayang (*floating animation*).
  - Penjelasan status ruang kerja (*Restricted Studio Workspace*).
  - Tombol **"Continue with Google"** resmi via Firebase Auth Popup.
  - Form input alamat Gmail langsung dengan tombol masuk.
  - Penjelasan transparan hak akses role:
    - `sr7aron@gmail.com` $\rightarrow$ Akses **Admin** (Posting & Broadcast).
    - Gmail lainnya $\rightarrow$ Akses **User** (Melihat karya admin, menyalin prompt, & koleksi favorit pribadi).
  - Tombol pengalih tema (Dark/Light mode) dan tombol install aplikasi Android (PWA).

### 2. Hak Akses Posting (Hanya Admin `sr7aron@gmail.com`)
- **File**: [src/services/auth.js](file:///c:/App%20Tools/PromptGallery-Free-Microstock-Platform/src/services/auth.js) & [src/components/layout/Header.jsx](file:///c:/App%20Tools/PromptGallery-Free-Microstock-Platform/src/components/layout/Header.jsx)
- Hanya akun **`sr7aron@gmail.com`** yang mendapatkan role **`admin`**.
- Tombol **`+` (New Storyboard)** di header hanya muncul untuk admin.
- Hanya admin yang dapat membuat postingan storyboard dan mengirim broadcast notifikasi ke semua user.

### 3. Hak Akses Melihat (Semua User yang Sudah Login)
- Semua user yang telah login dapat:
  - Melihat seluruh postingan storyboard yang diunggah oleh admin.
  - Membuka halaman detail storyboard (multi-shot media, prompt kamera, aspect ratio, seed, model AI).
  - Menyalin prompt AI sekali klik.
  - Melakukan pencarian dan filter berdasarkan kategori maupun tipe media.

### 4. Koleksi Favorit Terisolasi Per-User
- **File**: [src/App.jsx](file:///c:/App%20Tools/PromptGallery-Free-Microstock-Platform/src/App.jsx) & [src/components/storyboard/MediaGrid.jsx](file:///c:/App%20Tools/PromptGallery-Free-Microstock-Platform/src/components/storyboard/MediaGrid.jsx)
- Favorit disimpan secara terpisah berdasarkan email (`promptgallery_favorites_<email>`).
- Jika user A menyimpan storyboard ke favorit lalu logout dan user B login, daftar favorit user B akan murni milik user B dan tidak tercampur.
- Ketika user logout, sesi user dibersihkan dan layar kembali ke halaman login.

---

## Verifikasi & Status
- **Build Status**: `npm run build` sukses 100% tanpa error (`dist/` dibuat dalam 2.16s).
- **Hot Reload**: Server dev Vite aktif di `http://localhost:3000/`.
