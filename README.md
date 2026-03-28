# Venditio Ventures

A portfolio website for Patrik Tjäderqvist featuring an interactive 3D folder experience that opens to reveal a project gallery. Built with React, Three.js, and Framer Motion.

## Tech Stack

- **React 19** with Vite
- **Three.js** / React Three Fiber / Drei — 3D folder interaction
- **Framer Motion** — page and gallery animations
- **Tailwind CSS 4** — styling

## Getting Started

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |

## Project Structure

```
src/
├── components/
│   ├── Scene.jsx            # Three.js canvas and lighting
│   ├── Folder3D.jsx         # Interactive 3D folder
│   ├── ProjectGallery.jsx   # Tabbed gallery (Story, Work, Consulting, Academic, Connect)
│   ├── ProjectCard.jsx      # Individual project card
│   ├── AddProjectModal.jsx  # Admin: add new projects
│   └── BackgroundText.jsx   # Decorative background text
├── data/
│   └── projects.json        # Sample project data
├── App.jsx                  # Root component and state management
├── main.jsx                 # Entry point
└── index.css                # Global styles and CSS variables
```

## Deploying to Vercel

1. Push the repo to GitHub.
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Vercel auto-detects Vite — no extra config needed. Click **Deploy**.

The included `vercel.json` sets the build command, output directory, and a catch-all rewrite for client-side routing.

## Admin Mode

Append `?admin=true` to the URL to enable adding and removing projects. Custom projects are persisted in localStorage.
