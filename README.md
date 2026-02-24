# Monster 3D Landing

An interactive 3D landing page featuring a monster shaker model with smooth scroll-driven animations. Built with React, Three.js, and GSAP.

## Tech Stack

- **React 19** — UI framework
- **Three.js / React Three Fiber** — 3D rendering
- **React Three Drei** — Three.js helpers and abstractions
- **GSAP** — Scroll-triggered animations
- **Lenis** — Smooth scrolling
- **Vite** — Build tool and dev server

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   └── Scene.jsx       # 3D scene with the GLB model
├── App.jsx             # Main app layout and animations
├── App.css             # Styles
├── main.jsx            # Entry point
└── index.css           # Global styles
public/
├── shaker.glb          # 3D monster shaker model
└── vite.svg            # Favicon
```

## Credits

- Agency: [Weabers](https://weabers.com)
- Author: [Atihar Hossen Mahir](https://atiharhossenmahir.com)
- Inspired by [CodeGrid](https://www.youtube.com/@codegrid)
