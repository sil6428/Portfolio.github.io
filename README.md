# Affan Shaikh Portfolio

A dark, multi-page personal portfolio for Affan Shaikh, a Networking and Cybersecurity student at Ontario Tech University.

[View the live portfolio](https://affan-shaikh-portfolio.sil6428-archtech.workers.dev)

![Affan Shaikh portfolio preview](public/og-lab.png)

## Overview

The site presents my technical work, education, experience, and interests without relying on a profile photo. Its visual direction is built around an interactive Three.js network topology that reacts to pointer movement, scrolling, and the current section.

The portfolio is designed as a set of focused pages instead of one long landing page. Project and interest cards lead to expanded pages with more context.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Selected work and project overview |
| `/info` | Education, skills, experience, volunteer work, resume, and contact links |
| `/interests` | Personal interests and interactive visual cards |
| `/work/archtech` | Archtech case study and current work-in-progress status |
| `/work/ssik` | SSIK consulting website case study |
| `/interests/badminton` | Regional badminton experience |
| `/interests/3d-printing` | 3D printing and design projects |
| `/interests/reading` | Current reading interests |
| `/interests/photography` | Photography and VSCO link |
| `/interests/home-lab` | Proxmox home-lab plans |

## Features

- Responsive navigation for desktop, tablet, and mobile layouts
- Expandable project and interest pages
- Custom CSS illustrations for badminton and 3D printing
- Interactive Three.js topology with section-specific visual states
- Interactive Three.js cyber-lab with draggable camera controls and clickable objects
- Accessible room directory linking the workstation, server rack, printer, racket, books, camera, and wall board
- Uneven systems-map layout that gives major projects different visual weight
- Spotify playlist link plus device-local audio playback for files the visitor owns
- GitHub, LinkedIn, VSCO, email, phone, and resume links
- Metadata, Open Graph images, robots rules, and a generated sitemap
- Motion with reduced-motion support
- Rendered HTML tests for important routes, links, metadata, and private-content checks
- Cloudflare Workers deployment

## Technology

- React 19
- TypeScript 5
- Three.js
- Next.js-compatible routing through Vinext
- Vite 8
- HTML and custom CSS
- Cloudflare Workers and the Cloudflare Vite plugin
- ESLint
- Node.js test runner

## Local development

Requirements:

- Node.js 22.13 or newer
- npm

```bash
git clone https://github.com/sil6428/Portfolio.github.io.git
cd Portfolio.github.io
npm install
npm run dev
```

The development server prints its local address after startup.

## Quality checks

```bash
npm run lint
npm test
```

`npm test` creates a production build and checks the rendered output for the main pages and project routes.

## Production build

```bash
npm run build
```

The production site is deployed to Cloudflare Workers:

<https://affan-shaikh-portfolio.sil6428-archtech.workers.dev>

## Project notes

- Archtech remains unreleased and in development. This portfolio only includes information suitable for public viewing.
- The SSIK case study describes my work building the consulting team’s public service website.
- Generated build output, local Cloudflare state, environment files, and deployment metadata are excluded from version control.

## License

Copyright © 2026 Archtech. All rights reserved.

The source is public for portfolio review. Reuse, redistribution, modification, or publication requires prior written permission. See [LICENSE](LICENSE).
