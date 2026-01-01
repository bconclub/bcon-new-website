# BCON 2.0 Build & Project Guide

Authoritative notes for building and running the project, plus the high-level structure.

## Overview
- React (Create React App, `react-scripts@5.0.1`)
- Effects/animation: GSAP, @gsap/react, motion, three, ogl
- Testing: React Testing Library, Jest DOM
- Entry point: `src/index.js` → `src/App.js`

## Prerequisites
- Node.js 18+ (recommended) and npm 9+
- npm installed (Yarn not configured)

## Install
```bash
npm install
```

## Run (development)
```bash
npm start
```
or
```bash
npm run dev
```
- Both commands are equivalent and run the CRA dev server
- Serves at http://localhost:3000
- Hot reload enabled

## Build (production)
```bash
npm run build
```
- Outputs to `build/`

## Test
```bash
npm test
```
- Interactive watch mode

## Scripts (from package.json)
- `start` – CRA dev server
- `dev` – CRA dev server (alias for `start`)
- `build` – production bundle
- `test` – Jest/RTL in watch mode
- `eject` – one-way eject of CRA config (not recommended unless necessary)

## Dependency notes
- Overrides applied for security fixes:
  - `terser` ^5.15.1
  - `css-what` ^6.1.0
  - `nth-check` ^2.1.1

## Project structure (key paths)
```
public/            Static assets, index.html
src/               Application source
  index.js         React entry, renders <App />
  App.js           Main page composition and layout
  App.css          Global styles
  assets/images/   Logos and thumbnails
  components/      Reusable UI components
    StaggeredMenu/
  effects/         Visual effects (LiquidEther, Loader, GradualBlur, etc.)
  sections/        Page sections
    ShowReel/
    ServicesGrid/
    LiquidBentoPortfolio/
    ContactSection/
    RotatingText/
    ScrollReveal/
  reportWebVitals.js
  setupTests.js
```

## Build truths / operational notes
- Both `npm start` and `npm run dev` start the development server (they are equivalent).
- CRA 5 uses Webpack 5; environment variables must be prefixed with `REACT_APP_`.
- Static assets in `public/` are copied through unchanged; prefer importing from `src/` when possible for hashing.
- The build output (`build/`) is safe to deploy on any static host.
- React version: 19.2.0, React DOM: 19.2.0

## Deployment
- Run `npm run build` and deploy the `build/` directory to your static host or CDN.

## Troubleshooting
- Both `npm start` and `npm run dev` are available for development.
- After dependency changes, re-run `npm install` to ensure overrides take effect.
- For Windows PowerShell, use the commands exactly as shown above.
- If you encounter build issues, ensure Node.js 18+ and npm 9+ are installed.
