# NZ Cable Sizing Calculator

A GitHub-hosted web calculator for **LV and HV cable sizing** with support for:

- standard cable library sizing
- selected cable size checking
- manufacturer data input mode
- voltage drop calculation
- cable loss estimation
- conduit recommendation workflow
- separate LV and HV design tabs

## Purpose

This tool is intended as an engineering support calculator for New Zealand-based projects.
It is designed to align with project workflows that reference:

- AS/NZS 3000
- AS/NZS 3008 derived cable selection data
- manufacturer cable datasheets

## Important note

This repository should **not** publish copyrighted standard tables directly unless you have the right to do so.
The sample JSON files included in this starter project are placeholders and should be replaced with:

- licensed internal cable libraries
- approved manufacturer data
- company-reviewed derating tables
- approved conduit sizing references

## Features

### Standard sizing mode
Find the smallest cable size that satisfies:
- derated current carrying capacity
- maximum voltage drop

### Check selected size mode
Enter a chosen cable size and verify whether it passes the design criteria.

### Manufacturer mode
Import manufacturer values such as:
- conductor size
- current carrying capacity
- voltage drop
- outer diameter

## Tech stack

- React
- TypeScript
- Vite
- Plain CSS

## Project structure

```text
src/
├─ components/
├─ data/
├─ lib/
├─ App.tsx
├─ index.css
└─ main.tsx
```

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Deploy to GitHub Pages

1. Create a GitHub repo named `nz-cable-sizing-calculator`.
2. Push this project to the `main` branch.
3. In GitHub, enable **Pages** and set the source to **GitHub Actions**.
4. The included workflow in `.github/workflows/deploy.yml` will build and publish the site.

## Important setup

Update the `base` path in `vite.config.ts` if your repository name is different:

```ts
base: '/nz-cable-sizing-calculator/'
```

## Recommended future improvements

- short-circuit withstand checks
- earth conductor sizing
- protection coordination checks
- installation-method presets
- printable calculation summary PDF
- project save/load
- CSV export for cable schedules

## Engineering disclaimer

Results from this tool must be reviewed by a competent engineer before issue for design, procurement, or construction.
The app does not replace formal design review, standards compliance checking, or protection studies.
