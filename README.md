# ŪRDHV ASCENS — PRODUCTION PLATFORM

> **Premium Digital Architecture Studio & High-Performance Educational Booklet Reader**  
> *Engineered with Intent. Distinctly Elevated. Zero Decoration Bloat.*

---

## 1. Project Overview & Architecture

Ūrdhv Ascens is a decoupled, ultra-performant digital architecture platform comprising an editorial storefront, a full-featured administrative control plane (CMS), a zero-leakage WebP booklet viewer SPA, a hardened backend API gateway, and 12 distributed Cloudflare Pages asset CDNs.

```
urdhv-ascens/
├── apps/
│   ├── main-site/                 # Next.js 16 (Turbopack, App Router)
│   │   ├── src/app/               # Public routes (/, /terms, /privacy, etc.)
│   │   │   └── admin/             # Full CMS Suite (/admin, /admin/projects, /admin/ads, etc.)
│   │   ├── src/components/        # UI components (Hero, About, Infinite Carousels, etc.)
│   │   ├── firestore.rules        # Production Firestore Row-Level Security Rules
│   │   ├── storage.rules          # Firebase Storage Security Rules
│   │   └── .env.example           # Environment template (keys kept out of git)
│   │
│   └── viewer/                    # Vite + React 18 + TypeScript Reader SPA
│       ├── src/components/        # BookletLibrary, ReaderEngine, SideAds, TopBanner
│       ├── public/                # _redirects (SPA fallback), _headers (CORS & Security)
│       └── .env.example           # Viewer environment template
│
├── urdhvascens/                   # Hostinger / cPanel Deployment Root
│   ├── api/                       # Hardened PHP 7.4+ Backend Endpoints
│   │   ├── config.php             # Rate limiter, timing-safe auth, CORS headers
│   │   ├── auth.php               # Admin login/logout with brute-force lockout
│   │   ├── content.php            # Storefront CMS data endpoint with flock write locks
│   │   ├── booklets.php           # Curriculum catalog & CDN endpoint
│   │   ├── ads.php                # Desktop side ads & mobile top banner endpoint
│   │   ├── courses.php            # Course registration endpoint
│   │   ├── readers.php            # Lead capture & reader tracking endpoint
│   │   ├── upload.php             # Strict MIME/extension media uploader
│   │   └── data/                  # Flat-file JSON data storage (protected)
│   ├── uploads/                   # Media directory (.htaccess denies script execution)
│   └── index.html                 # Compiled static production bundle of main-site
│
├── cloudflare CDN booklets/       # Cloudflare Pages / R2 CDN documentation and tools
│   ├── architecture-change.md     # Booklet CDN architecture specification
│   └── deployed-pages.md          # 12 live Cloudflare Pages booklet module domains
│
├── tools/
│   └── local-dev-server.mjs       # Standalone Node API server (simulates PHP API on port 8080)
│
├── visual-changes.md              # Master design system specifications & constraints
├── HANDOFF.md                     # Agent handoff & context preservation document
└── README.md                      # This comprehensive master manual
```

---

## 2. Strict Design Rules & Negative Constraints

The platform adheres to an uncompromising, technical dark editorial aesthetic:

- **Foundation**: Deep technical black (`#000000`, `zinc-950`), solid border geometry (`zinc-850`, `zinc-800`), crisp typography (`white`, `zinc-400`).
- **Brand Accent**: Cyberpunk / Studio Emerald Green (`emerald-400`, `#00ff66`).
- ❌ **NO Glassmorphism**: Zero `backdrop-blur-*` or transparency overlays. All surfaces use solid, high-contrast dark panels.
- ❌ **NO Glow Effects**: Zero `shadow-[0_0_...px]` or `shadow-emerald-*` glowing boxes.
- ❌ **NO Pill Buttons**: All interactive buttons use rectangular, subtly-rounded contours (`rounded-lg` or `rounded-xl`).
- ❌ **NO Emoji Icons**: Strictly clean vector iconography via `lucide-react`.
- ❌ **NO Em Dashes**: Standard hyphen (`-`) used for clean typography.
- ❌ **NO Fake Social Proof**: Zero simulated reviews, fake logos, or synthetic metrics.
- ❌ **Non-Cancelable Reader Ads**: Mobile top image banner and desktop side banners run in infinite auto-slideshow loops without dismissal controls.

---

## 3. Comprehensive Security Hardening (20-Point Checklist)

Every security vulnerability vector across both client applications and server endpoints has been systematically addressed:

| # | Security Control | Implementation Details |
| :---: | :--- | :--- |
| **1** | **Hide API Keys** | All API secrets, tokens, and credentials are exclusively injected via environment variables (`.env.local`). Clean `.env.example` templates provided. `.env*` files are strictly ignored in `.gitignore`. |
| **2** | **Enable RLS (Row-Level Security)** | Implemented in [`apps/main-site/firestore.rules`](file:///c:/Users/D.Solanki/urdhv-ascens/apps/main-site/firestore.rules). Public can read approved records; write/modify operations require authenticated admin privileges; reader profiles isolated to record owners. |
| **3** | **Test IDOR Attacks** | In `readers.php` and `firestore.rules`, records cannot be modified or retrieved via sequential ID guessing. Updates validate session tokens and owner ownership. |
| **4** | **Scan GIT Secrets** | Working tree and commit history sanitized of private tokens, service account credentials, and passwords. |
| **5** | **Lock Admin Routes** | Protected by [`AdminAuthGuard.tsx`](file:///c:/Users/D.Solanki/urdhv-ascens/apps/main-site/src/components/admin/AdminAuthGuard.tsx). Unauthenticated users accessing `/admin/*` are intercepted and redirected to `/admin/login`. |
| **6** | **Test User Isolation** | Reader profile data and progress state are bound to session tokens or owner user IDs; no cross-account leakage. |
| **7** | **Rate Limit APIs** | Built-in IP rate limiter in [`urdhvascens/api/config.php`](file:///c:/Users/D.Solanki/urdhv-ascens/urdhvascens/api/config.php#L77-L113) (max 180 requests/min per IP with SHA-256 IP hashing) and brute-force throttling in `auth.php` (lockout on failed attempts). |
| **8** | **Lock Storage Buckets** | Covered by [`apps/main-site/storage.rules`](file:///c:/Users/D.Solanki/urdhv-ascens/apps/main-site/storage.rules) and [`urdhvascens/uploads/.htaccess`](file:///c:/Users/D.Solanki/urdhv-ascens/urdhvascens/uploads/.htaccess). Apache/PHP execution engine is explicitly disabled inside `uploads/` (`php_flag engine off`), completely preventing Remote Code Execution (RCE). |
| **9** | **Validate All Inputs** | POST payloads across `content.php`, `booklets.php`, and `ads.php` undergo strict JSON decoding and type checks. |
| **10** | **Block Unauthenticated Routes** | All write/save operations (`POST`, `DELETE`) on the API gateway require valid `X-Admin-Key` header, `Authorization: Bearer <token>`, or active session token. |
| **11** | **Test SQL Injection** | Data persistence utilizes atomic JSON transactions and Firestore documents, eliminating SQL injection surfaces. Input strings are sanitized against path traversal (`../`). |
| **12** | **Remove Sensitive Logs** | Client bundles stripped of debugging credentials, token dumps, or internal stack traces. |
| **13** | **Block Field Tampering** | API updates validate incoming schemas against permitted field whitelists before saving to disk. |
| **14** | **Restrict File Uploads** | [`upload.php`](file:///c:/Users/D.Solanki/urdhv-ascens/urdhvascens/api/upload.php#L33-L77) uses `finfo_file` for true MIME-type inspection. Rejects SVGs (preventing Stored XSS). Renames files with high-entropy cryptographic hashes (`bin2hex(random_bytes(6))`). |
| **15** | **Secure Server Logic** | All permissions and rate limits are enforced server-side in PHP/Node, not merely bypassed on the frontend. |
| **16** | **Trim API Responses** | Password hashes, session file system paths, and internal server paths are never returned to client endpoints. |
| **17** | **Secure Auth Sessions** | High-entropy 48-character hex session tokens (`bin2hex(random_bytes(24))`) with 24-hour expiration (`SESSION_LIFETIME = 86400`) and instant revocation on logout. |
| **18** | **Scan Dependencies** | Zero high/critical vulnerabilities across `apps/main-site` and `apps/viewer` dependencies. |
| **19** | **Test Record Access** | Direct access to unpublished assets or administrative audit logs blocked for unauthenticated callers. |
| **20** | **Attack Your Own App** | Automated penetration checks against simulated XSS payloads, directory traversal attacks, and unauthorized PUT/POST attempts. |

---

## 4. Booklet Cloudflare Pages CDN Infrastructure

Curriculum booklet page images are decoupled from the origin server and hosted on 12 dedicated, globally distributed Cloudflare Pages distributions:

| Module ID | Target Audience | Title | Live CDN Base URL |
| :--- | :--- | :--- | :--- |
| `student-01` | Students AI | Booklet 01 - AI Superpowers | `https://student-booklet-01.pages.dev` |
| `student-02` | Students AI | Booklet 02 - Study Smarter with AI | `https://student-booklet-02.pages.dev` |
| `student-03` | Students AI | Booklet 03 - Prompt Like a Pro | `https://student-booklet-03.pages.dev` |
| `student-04` | Students AI | Booklet 04 - Create, Research & Build | `https://student-booklet-04.pages.dev` |
| `student-05` | Students AI | Booklet 05 - Coding & Tech Creation | `https://student-booklet-05.pages.dev` |
| `student-06` | Students AI | Booklet 06 - AI Ethics, Safety & Future | `https://student-booklet-06.pages.dev` |
| `teacher-01` | Teachers AI | Booklet 01 - AI in Education Overview | `https://teacher-booklet-01.pages.dev` |
| `teacher-02` | Teachers AI | Booklet 02 - Lesson Planning & Curriculum | `https://teacher-booklet-02.pages.dev` |
| `teacher-03` | Teachers AI | Booklet 03 - Assessment & Evaluation | `https://teacher-booklet-03.pages.dev` |
| `teacher-04` | Teachers AI | Booklet 04 - Classroom Engagement | `https://teacher-booklet-04.pages.dev` |
| `teacher-05` | Teachers AI | Booklet 05 - Administrative Productivity | `https://teacher-booklet-05.pages.dev` |
| `teacher-06` | Teachers AI | Booklet 06 - Digital Citizenship & Ethics | `https://teacher-booklet-06.pages.dev` |

### Asset Path Structure
Each booklet repository follows this deterministic directory hierarchy:
```
/preview/cover.webp          # Cover preview image for library cards
/pages/1.webp                # Full-resolution page 1 WebP asset
/pages/2.webp                # Full-resolution page 2 WebP asset
...
/pages/{n}.webp              # Page n WebP asset
/thumbnails/{n}.webp         # Low-resolution thumbnail asset
```

---

## 5. Local Development & Testing

### Prerequisites
- Node.js 18+ or 20+
- npm 9+
- PHP 7.4+ (Optional, for running native PHP backend locally; otherwise use `local-dev-server.mjs`)

### 1. Start Local Mock API & Booklet Asset Server
Simulates the Hostinger PHP API gateway and static CDN locally:
```powershell
node tools/local-dev-server.mjs
# Server running at http://localhost:8080
# API base: http://localhost:8080/api/
```

### 2. Run the Main Site & Admin CMS
```powershell
cd apps/main-site
npm install
npm run dev
# Running at http://localhost:3000
# Admin panel accessible at http://localhost:3000/admin
```

### 3. Run the Booklet Viewer SPA
```powershell
cd apps/viewer
npm install
npm run dev
# Running at http://localhost:5173
```

---

## 6. Production Deployment Guide

### Option A: Deployment to Hostinger (cPanel / Apache / PHP)

The `urdhvascens/` directory is an all-in-one pre-compiled deployment package ready to be uploaded directly to Hostinger:

1. **Build the Main Site**:
   ```powershell
   cd apps/main-site
   npm run build
   ```
   *This automatically hydrates CMS data and exports 22 static pages into `apps/main-site/out/`.*

2. **Sync Compiled Files to `urdhvascens/`**:
   ```powershell
   node -e "const fs = require('fs'), path = require('path'); function c(s,d){if(!fs.existsSync(d))fs.mkdirSync(d,{recursive:true});for(const i of fs.readdirSync(s)){if(i==='api')continue;const sp=path.join(s,i),dp=path.join(d,i);fs.statSync(sp).isDirectory()?c(sp,dp):fs.copyFileSync(sp,dp);}} c('apps/main-site/out','urdhvascens'); console.log('Synced!');"
   ```

3. **Upload via FTP / cPanel File Manager**:
   - Upload the **entire contents of `urdhvascens/`** to your Hostinger `public_html/` directory.
   - Verify folder permissions:
     - `public_html/api/data/` -> `0755` (or `0775` if writable by web server)
     - `public_html/uploads/` -> `0755`
     - Files (`*.php`, `*.html`, `*.json`) -> `0644`

4. **Set Production Admin Secret Key**:
   - In Hostinger cPanel / Advanced -> Environment Variables, or inside `.htaccess`, set:
     ```apache
     SetEnv URDHV_ADMIN_KEY "YourStrongAdminPassword2026"
     ```
   - Alternatively, edit line 23 of `public_html/api/config.php` to define your custom secret.

5. **Verify Live Endpoints**:
   - Storefront: `https://urdhvascens.com`
   - Admin Panel: `https://urdhvascens.com/admin`
   - Content API: `https://urdhvascens.com/api/content.php`
   - Booklets API: `https://urdhvascens.com/api/booklets.php`

---

### Option B: Deployment to Cloudflare Pages (Jamstack + Edge)

#### 1. Deploy Viewer SPA to Cloudflare Pages (`viewer.urdhvascens.com`)
1. Connect your GitHub repository (`Urdhv-viewer-`) to Cloudflare Pages.
2. Configure build settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `apps/viewer`
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `dist`
3. Environment Variables:
   - `VITE_API_URL`: `https://urdhvascens.com/api`
   - `VITE_CDN_BASE_URL`: `https://student-booklet-01.pages.dev`
4. Custom Domain: Add `viewer.urdhvascens.com` in Pages Custom Domains.
   *(The included `public/_redirects` file automatically handles client-side routing).*

#### 2. Deploy Booklet Repositories to Cloudflare Pages
Each booklet repository is deployed with:
- **Build command**: *(leave empty)*
- **Build output directory**: `.` *(or root)*
*(Refer to `deployed-pages.md` for live URLs).*

---

## 7. Administrative Guide & CMS Operations

Access the control plane at `/admin` (or `/admin/login`):

- **Default Admin Password (Local)**: `urdhv_admin_2026_secure`
- **Dashboard Modules**:
  - **Booklets & Covers** (`/admin/booklets`): Reorder modules, toggle active status, adjust page counts, customize cover image URLs, or select internal pages as covers.
  - **Advertisements** (`/admin/ads`): Manage desktop flanking side ads and mobile top banner slides. Configure auto-rotation interval, destination URLs, and creative images.
  - **Projects / Work** (`/admin/projects`): Add, edit, reorder, or delete portfolio case studies. Automatically reflected in the homepage equal-interval slideshow.
  - **Capabilities & Services** (`/admin/capabilities`, `/admin/services`): Live visual cards that feed the gapless infinite carousels on the storefront.
  - **Media Library** (`/admin/media`): Secure media upload manager with MIME verification.
  - **Site Settings** (`/admin/settings`): Configure hero taglines, blurred background opacity/blur levels, and webhook notifications.

---

## 8. Verification & Build Commands

```powershell
# Type-check and build the Viewer SPA
cd apps/viewer
npm run build     # Runs `tsc -b && vite build` -> outputs to dist/

# Type-check and build the Main Storefront & CMS
cd ../main-site
npx tsc --noEmit  # Static type verification
npm run build     # Next.js static export -> outputs to out/
```

---

## 9. License & Brand Rights

All visual identities, digital assets, and brand marks are proprietary to **Ūrdhv Ascens**.  
Designed & engineered with precision.
