# 🚂 Yaswanth Babu Patnam | Engineering Portfolio

<div align="center">

[![React](https://img.shields.io/badge/React-18.2.0-black?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.5.14-black?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-black?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Upstash Redis](https://img.shields.io/badge/Upstash_Redis-Serverless-black?style=for-the-badge&logo=redis&logoColor=white)](https://upstash.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-black?style=for-the-badge)](https://opensource.org/licenses/MIT)

**A high-precision, monochromatic developer portfolio engineered with React 18, Vite, and serverless telemetry.**  
Features an interactive 3D playing card testimonial deck, dedicated client review portal, hover-interactive project showcase with smooth image zoom, 53-week GitHub activity heatmap, and live Upstash Redis telemetry.

[🌐 View Live Portfolio](https://yaswanth-babu.vercel.app/) · [📖 Read The In-Depth Architecture Bible](./PORTFOLIO_INDETAIL.md)

</div>

---

## ⚡ Core Engineering Highlights

- **🗂️ Interactive Project Discovery**: Seamless hover-triggered project accordion drawers with smooth thumbnail image zoom effects, personal vs. freelance segmented filtering, and 16:7 browser mockups.
- **🎥 Integrated Project Demos**: Dedicated demo video streaming integration for AI projects (e.g. HireLogiX.AI) directly accessible from preview cards and action links.
- **🃏 3D Playing Card Testimonials Deck**: Interactive card deck with physics-based pointer tracking, spring-snap dynamics, Web Audio API mechanical card sound, and dynamic hide/show layout.
- **📬 Dedicated Client Review Portal (`/review`)**: Dynamic URL routing, 1-click shareable review links, star rating selector, and live serverless Upstash Redis backend (`/api/reviews`).
- **📱 2-Tier Responsive Navigation**: Mobile-optimized header architecture with pinned CV and Feedback action controls and secondary horizontal category navigation.
- **📊 53-Week GitHub Activity Matrix**: Accurate 365-day rolling calendar synced with live GitHub contributions, real-time active streak calculator, and interactive hover inspection.
- **📡 Serverless Telemetry Pipeline**: Built-in `/api/analytics` endpoint backed by Upstash Redis with atomic pipelining, privacy-preserving SHA-256 visitor fingerprinting, and automatic time-series aggregation (24H, 7D, 30D).
- **📂 Dynamic GitHub Project Ingestion**: Auto-syncs public repositories tagged `#portfolio`, deduplicates against local projects, and defends against rate-limits with session caching.
- **📜 Zero-Flicker CSS Grid Drawers**: Seamless accordion animations powered by `grid-template-rows: 0fr -> 1fr` without reflows or JavaScript height calculation.

---

## 📖 In-Depth System Bible

For an in-depth architectural breakdown of every algorithm, formula, function, bottleneck, and trade-off, see:  
👉 **[THE PORTFOLIO IN-DEPTH BIBLE (PORTFOLIO_INDETAIL.md)](./PORTFOLIO_INDETAIL.md)**

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm, pnpm, or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Yaswanthpatnam/Portfolio.git
cd Portfolio

# Install dependencies
npm install

# Start local development server
npm run dev
```

### Production Build
```bash
npm run build
```

---

## 🛠️ Project Management CLI Wizard

Add new projects to your portfolio instantly via the automated interactive terminal prompt:

```bash
npm run add-project
```

The wizard prompts for project title, category, tech stack, descriptions, and URLs, automatically prepending the entry to `src/data/projects.json`.

---

## 📄 License

MIT © [Yaswanth Babu Patnam](https://github.com/Yaswanthpatnam)
