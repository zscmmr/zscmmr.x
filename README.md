# zscmmr Portfolio

A static website featuring the zscmmr digital studio landing page, portfolio, and selected website examples.

## Features

- Home page with links to selected projects and social profiles
- Portfolio page describing services, process, and selected work
- Website examples page linking to live project demos
- Responsive layouts for mobile and desktop
- Image optimization to WebP with a Node.js build script
- GitHub Pages deployment workflow

## Run locally

```bash
npm install
npm run build
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Deploy to GitHub Pages

1. Push the project to a GitHub repository.
2. Open **Settings > Pages**.
3. Set the publishing source to **GitHub Actions**.
4. Run the workflow in `.github/workflows/deploy-pages.yml`.

## Main files

- `index.html` — home page
- `portfolio-utama.html` — main portfolio
- `website-example.html` — website examples
- `privacy-policy/index.html` and `terms/index.html` — legal information
- `assets/` — stylesheets, scripts, and optimized images
- `scripts/optimize-images.js` — image optimization script

The site uses static HTML and does not require a front-end framework.
