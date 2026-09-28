# Darshan Portfolio — Video Editing & Visual Design Showcase

A personal portfolio website and content management system for **Darshan**, a professional editor specializing in **Cinematic Video Editing**, **High-End Image Retouching**, and **Graphic Design**.

Built with a dark editorial aesthetic, client-side category filtering, case study pages, centralized Google Drive media handling, and an administrative dashboard for full content management without touching code.

---

## 🌟 Tech Stack

* **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Components & Route Handlers)
* **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS design system
* **UI Components**: shadcn/ui-inspired primitives (Button, Input, Textarea, Card, Dialog, Tabs, Badge)
* **Data Storage**: Local Atomic JSON Persistence (`/data/portfolio.json`)
* **Media Storage**: Google Drive (with support for YouTube, Vimeo, and direct media)
* **Package Manager**: [pnpm](https://pnpm.io/)
* **Icons**: Lucide Icons & Custom SVG Brand Icons

---

## 📁 Folder Structure

```text
darshan-portfolio/
├── data/
│   └── portfolio.json               # Main single-source-of-truth portfolio database
├── public/                          # Public static assets & favicons
├── scripts/
│   ├── validate-portfolio.ts        # Automated E2E verification test suite
│   └── validate-portfolio.mjs       # Node ES Module test runner
├── src/
│   ├── app/
│   │   ├── (site)/                  # Public website routes (wrapped with Navbar & Footer)
│   │   │   ├── layout.tsx           # Public shell with navigation and footer
│   │   │   ├── page.tsx             # Homepage (Hero, Featured, Services, Catalog, About, Contact)
│   │   │   ├── work/
│   │   │   │   ├── page.tsx         # Full portfolio catalog with search & filters
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx     # Dedicated case study page with MediaViewer
│   │   │   ├── about/
│   │   │   │   └── page.tsx         # Story, skills breakdown, stats & career timeline
│   │   │   └── contact/
│   │   │       └── page.tsx         # Direct contact inquiry page & WhatsApp CTA
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   │   └── page.tsx         # Admin login screen with credentials authentication
│   │   │   └── page.tsx             # Protected Admin Dashboard
│   │   ├── api/
│   │   │   ├── portfolio/
│   │   │   │   └── route.ts         # Public portfolio data endpoint
│   │   │   └── admin/               # Protected Route Handlers (Auth, Projects, Services, Profile, etc.)
│   │   │       ├── auth/
│   │   │       │   ├── login/route.ts
│   │   │       │   ├── logout/route.ts
│   │   │       │   └── check/route.ts
│   │   │       ├── stats/route.ts
│   │   │       ├── projects/
│   │   │       │   ├── route.ts
│   │   │       │   ├── [id]/route.ts
│   │   │       │   └── reorder/route.ts
│   │   │       ├── services/
│   │   │       │   ├── route.ts
│   │   │       │   └── [id]/route.ts
│   │   │       ├── profile/route.ts
│   │   │       ├── hero/route.ts
│   │   │       ├── about/route.ts
│   │   │       ├── socials/route.ts
│   │   │       └── settings/route.ts
│   │   ├── globals.css              # Theme tokens & editorial styles
│   │   └── layout.tsx               # Root HTML/Body layout & dynamic metadata
│   ├── components/
│   │   ├── ui/                      # shadcn/ui primitives (Button, Card, Dialog, Badge, Input, etc.)
│   │   ├── public/                  # Public components (Navbar, Footer, Hero, ProjectCard, ProjectGrid, MediaViewer)
│   │   └── admin/                   # Admin components (AdminNavbar, DashboardOverview, ProjectsManager, DriveTester)
│   ├── lib/
│   │   ├── auth.ts                  # Cryptographic HMAC session verification & cookies
│   │   ├── media.ts                 # Google Drive URL parsing & media player helpers
│   │   ├── portfolio.ts             # Safe server-side atomic JSON reading & writing
│   │   ├── slug.ts                  # Client-safe slug generator
│   │   └── utils.ts                 # Tailwind cn() utility
│   └── types/
│       └── portfolio.ts             # Strict TypeScript definitions
├── .env.example                     # Environment variables template
├── .env.local                       # Local environment configuration
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
* **Node.js**: v18.18+ or v20+ / v22+
* **pnpm**: v9+ or v11+ (installed via `corepack enable` or `npm i -g pnpm`)

### 2. Installation
Clone the repository and install dependencies using pnpm:

```bash
pnpm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Configure your secure credentials:

```env
ADMIN_USERNAME=darshan_admin
ADMIN_PASSWORD=darshan@editor2026
AUTH_SECRET=your-random-secure-secret-key-at-least-32-chars
```

### 4. Running Locally
Start the development server:

```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to view the live site.

### 5. Scripts & Validation
* **Type Check**: `pnpm typecheck`
* **Linting**: `pnpm lint`
* **Production Build**: `pnpm build`
* **Production Run**: `pnpm start`
* **E2E Automated Test Suite**: `node scripts/validate-portfolio.mjs`

---

## 🔐 Admin Dashboard Access

1. Navigate to: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Enter the configured credentials:
   * **Username**: `darshan_admin` (or your `ADMIN_USERNAME`)
   * **Password**: `darshan@editor2026` (or your `ADMIN_PASSWORD`)
3. Once authenticated, you will be redirected to `/admin` where you can:
   * **Dashboard**: View summary stats across all media categories.
   * **Projects Manager**: Create, edit, delete, reorder, toggle featured highlights, and test live thumbnail previews.
   * **Services Manager**: Customize service cards and feature deliverables.
   * **Profile & Hero**: Edit display name, bio, profile photo, headline, and CTA buttons.
   * **About & Skills**: Manage editorial story, software toolkit badges, and career stats.
   * **Socials & Contact**: Configure WhatsApp direct link, email, YouTube, Instagram, Behance, and LinkedIn.
   * **Drive Media Tester**: Paste any Google Drive link to verify file IDs and preview embed playback.

---

## 📂 Google Drive Media Organization & Linking

Google Drive is the external media host. No heavy video or image binaries are stored on the web server.

### Recommended Google Drive Folder Structure:
```text
Darshan Portfolio/
├── Videos/
│   ├── Reels/
│   ├── Cinematic/
│   ├── YouTube/
│   └── Motion Graphics/
├── Images/
│   ├── Photo Editing/
│   ├── Retouching/
│   ├── Manipulation/
│   └── Color Grading/
└── Graphic Design/
    ├── Posters/
    ├── Thumbnails/
    ├── Social Media/
    └── Branding/
```

### How to Link Google Drive Files:
1. Upload your video or image file to Google Drive.
2. Right-click the file → **Share** → Set General Access to **"Anyone with the link can view"**.
3. Copy the link (e.g., `https://drive.google.com/file/d/1A2b3C4d5E6F.../view?usp=sharing`).
4. Paste this link into the **Media URL** or **Thumbnail URL** field in the Admin project form.

### How `lib/media.ts` handles Drive URLs:
* Automatically extracts the Google Drive File ID from standard `/file/d/{ID}`, `?id={ID}`, or raw ID formats.
* Generates high-res thumbnail endpoints: `https://drive.google.com/thumbnail?id={ID}&sz=w1200`
* Generates clean iframe video player embeds: `https://drive.google.com/file/d/{ID}/preview`
* Also seamlessly supports direct MP4/WebM videos, YouTube links, and Vimeo embeds.

---

## ⚙️ Architecture & JSON Persistence

1. **Client / Admin UI**: User interacts with the responsive interface.
2. **Server Route Handlers**: Requests are sent to secure Next.js App Router API handlers (`/api/admin/*`).
3. **Session Verification**: The `src/lib/auth.ts` cryptographic HMAC verification validates the `darshan_admin_token` cookie.
4. **Atomic JSON Persistence**: `src/lib/portfolio.ts` reads `/data/portfolio.json`, updates only requested fields, and writes atomically using a temporary file swap to eliminate race conditions and corruption.

---

## ⚠️ Production Notes & Limitations of JSON Storage

* **Ephemeral Filesystems**: If deploying to serverless platforms with ephemeral filesystems (like default Vercel or AWS Lambda), filesystem writes to local disk are not persisted between serverless cold starts.
* **Recommended Hosting for JSON Storage**:
  * VPS / DigitalOcean Droplet / Hetzner with persistent storage running `pnpm start` or Docker.
  * Render.com / Railway.app with a Persistent Volume attached to `/data`.
* **Future Database Migration**: If migrating to PostgreSQL, Supabase, or MongoDB in the future, only `src/lib/portfolio.ts` needs to be updated to point to database queries. The frontend components, admin UI, and API route interfaces remain completely unchanged.
