# Promptgallery — AI Storyboard Studio Workspace

A modern, fast, and responsive workspace for curating, organizing, and exploring frontier AI generative storyboards, video renders, and prompt metadata (Midjourney, Flux, Kling, Sora, Hailuo).

## 🚀 Key Features

- **Strict Role-Based Architecture**:
  - **Admin (`sr7aron@gmail.com`)**: Exclusive rights to publish multi-shot storyboards, attach AI generation prompts, and broadcast studio announcements.
  - **User**: Authenticated access to browse storyboards, inspect multi-shot scenes, copy prompts with one click, and manage a private favorites collection.
- **Strict Authentication Barrier**:
  - Unauthenticated visitors are directed to a dedicated, glassmorphic login portal with 3D mascot aesthetics.
  - Google OAuth sign-in via Firebase Auth or direct Gmail authentication.
- **User-Isolated Favorites**:
  - Each authenticated user gets their own private favorites library saved and isolated per account.
- **Multi-Shot Media Engine**:
  - Support for multi-angle sequences, camera shot breakdowns, aspect ratios, seeds, guidance parameters, and AI model tags.
  - Direct integration with Cloudinary for unsigned media uploads.
- **Real-Time Cross-Tab & Cloud Sync**:
  - `BroadcastChannel` synchronization for instant live updates across browser tabs.
  - Firestore cloud database real-time sync.
- **Progressive Web App (PWA)**:
  - Installable as a native mobile app on Android or standalone desktop app with offline service worker support.

## 🛠️ Tech Stack

- **Core**: React 18 + Vite
- **Styling**: Vanilla CSS Design System with dark/light mode tokens
- **Auth & Database**: Google Firebase (Auth & Firestore)
- **Media Storage**: Cloudinary Direct Uploads
- **Icons**: Lucide React

## 📦 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/sr9aron-dev/PromptGallery-Free-Microstock-Platform.git
cd PromptGallery-Free-Microstock-Platform
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
Copy `.env.example` to `.env` and fill in your Firebase and Cloudinary credentials:
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## 📄 License
MIT
