# 🌟 Yaswanth Babu Patnam |  Portfolio

<div align="center">

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.5.14-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**A high-aesthetic, modern, responsive portfolio engineered with React, Tailwind CSS, and custom glassmorphism.**  
Designed in Figma wireframes and brought to life with smooth micro-interactions, dark/light modes, and effortless project management.

[View Live Portfolio](https://findit-bice.vercel.app/) · [Report Bug](https://github.com/Yaswanthpatnam/portfolio/issues) · [Request Feature](https://github.com/Yaswanthpatnam/portfolio/issues)

</div>

---

## ✨ Key Highlights

- **Bespoke Hero Showcase**: Warm golden ambient lighting halo matching natural sunlight, "Available for Opportunities" pulsing live badge, and instant CTA links.
- **Sticky Section Navigation**: Floating top capsule bar with active scroll spy for `#about`, `#skills`, `#projects`, `#experience`, and `#connect`.
- **Dynamic Dark / Light Themes**: Fully configured CSS theme variables with smooth transitions and custom golden-olive scrollbars.
- **Filterable Projects Grid**: Category tabs (`All`, `Full-Stack`, `Frontend`, `Backend & APIs`) with rich engineering highlights and direct GitHub / Live demo links.
- **Categorized Bento Skills**: Domain-driven skill cards with interactive shimmer pills.
- **Career Timeline**: Connecting vertical milestone rail detailing real-world development internships and impact.
- **Interactive Connect Dock**: Dedicated get-in-touch card with 1-click email copy feedback and floating quick-navigation dock.

---

## 🎨 Design System & Identity

- **Background**: Deep Obsidian `#070709` with atmospheric warm radial gradients.
- **Signature Accent**: Warm Olive-Gold `#C8BD56` (matches sunset lighting in hero photography).
- **Status Live**: Emerald Green `#83CE7E` with pulsing radar wave.
- **Typography**: 
  - Headings: `Sansation` / `Outfit` (Bold geometric display)
  - Body & UI: `Albert Sans` (Clean contemporary readability)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- `npm` or `yarn` or `pnpm`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Yaswanthpatnam/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser to view the portfolio.

4. **Create a production build**:
   ```bash
   npm run build
   ```

---

## 🛠️ Effortless Project Updates

Adding and managing projects on your portfolio is completely decoupled from UI code. You have **3 convenient methods**:

### Method 1: In-App Visual Modal (Easiest)
1. Run `npm run dev` and open your portfolio.
2. In the **Projects** section, click the glowing **`+ Add Project`** button.
3. Fill in your project details and watch the **live card preview** update in real-time.
4. Click **Save Project** — the local Vite server writes directly to `src/data/projects.json` and hot-reloads instantly!

### Method 2: Terminal Interactive Wizard
Run the automated CLI prompt in your terminal:
```bash
npm run add-project
```
Answer the guided prompts (Title, Category, Tech Stack, URLs, Highlights) and the script will automatically validate, format, and prepend your project to the portfolio data.

### Method 3: Direct JSON Editing
Open [`src/data/projects.json`](./src/data/projects.json) directly in your code editor and append your project:
```json
{
  "id": "my-new-app",
  "title": "My New Application",
  "subtitle": "Short descriptive tagline",
  "description": "In-depth summary of architecture, features, and challenges solved.",
  "category": "fullstack",
  "categoryLabel": "Full-Stack",
  "stack": ["Django", "React", "PostgreSQL", "Tailwind CSS"],
  "status": "Live",
  "statusColor": "#83CE7E",
  "github": "https://github.com/Yaswanthpatnam/my-new-app",
  "live": "https://my-new-app.vercel.app/",
  "featured": true,
  "highlights": [
    "High-throughput caching pipeline",
    "Responsive, accessible design system"
  ]
}
```

---

## 📁 Project Structure

```
portfolio/
├── public/
│   ├── hero.jpg             # Hero portrait image
│   ├── profile.jpg          # Profile image fallback
│   └── logo.jpg             # Brand icon
├── scripts/
│   └── add-project.js       # Interactive CLI wizard (`npm run add-project`)
├── src/
│   ├── components/
│   │   ├── navbar.jsx       # Sticky top navigation with scroll-spy & mobile menu
│   │   ├── header.jsx       # Bespoke hero section with golden ambient aura
│   │   ├── about.jsx        # Biography & philosophy cards
│   │   ├── skills.jsx       # Bento-style categorized technical toolkit
│   │   ├── projects.jsx     # Filterable project showcase + modal trigger
│   │   ├── addProjectModal.jsx # Visual in-app project manager modal
│   │   ├── experiences.jsx  # Vertical milestone timeline
│   │   ├── navigator.jsx    # Connect card & bottom floating dock
│   │   └── icons.jsx        # Custom SVG brand icons (GitHub, LinkedIn)
│   ├── data/
│   │   ├── projects.json    # Central project database
│   │   ├── projects.js      # Data module and category exports
│   │   └── skills.js        # Categorized engineering toolkit data
│   ├── App.jsx              # Main application layout & ambient cursor spotlight
│   ├── index.css            # Custom glassmorphism, theme tokens, & scrollbars
│   └── main.jsx             # React DOM entry point
├── index.html               # Semantic HTML shell with preconnect & meta tags
├── tailwind.config.js       # Custom colors, fonts, shadows, and animations
├── vite.config.js           # Vite configuration with local project-saver middleware
└── package.json             # Scripts and dependencies
```

---

## 👨‍💻 Author

**Yaswanth Babu Patnam**
- **Role**: Full Stack Developer & Creative Technologist
- **GitHub**: [@Yaswanthpatnam](https://github.com/Yaswanthpatnam)
- **LinkedIn**: [Yaswanth Patnam](https://www.linkedin.com/in/yaswanth-patnam-2aa28b340/)
- **Email**: [patnamyaswanth79@gmail.com](mailto:patnamyaswanth79@gmail.com)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) - feel free to use it as inspiration for your own portfolio!
