# Kerfco TimberTech CNC Solutions — Marketing Site

A fast, responsive, single-page static marketing site for **Kerfco TimberTech CNC Solutions**, a precision woodworking and custom CNC routing service in Visakhapatnam, Andhra Pradesh, India.

Built with plain HTML, CSS and JavaScript — no build step, no frameworks. It deploys to **Vercel** via GitHub Actions on every commit to the `develop` branch.

## Features

- Responsive layout (mobile → desktop) with a collapsible mobile nav
- Sections: Hero, Services, Work/Portfolio, Materials, Process, Contact
- Click-to-chat WhatsApp button and a quick-enquiry form that pre-fills a WhatsApp message
- Scroll-reveal animations, sticky header, floating WhatsApp button
- SEO meta tags and Open Graph tags

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page markup and content |
| `styles.css` | All styling and responsive rules |
| `app.js` | Nav, scroll reveal, lightbox, before/after slider, WhatsApp enquiry |
| `vercel.json` | Vercel static-hosting config (clean URLs, cache headers) |
| `.github/workflows/deploy.yml` | Auto-deploys to Vercel on push to `develop` |

## Local preview

Just open `index.html` in a browser. Or serve it locally:

```bash
# Python 3
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to Vercel (continuous deployment from `develop`)

Every commit pushed to the `develop` branch triggers a production deploy to Vercel
via `.github/workflows/deploy.yml`.

### One-time setup

1. **Create a Vercel project** linked to this GitHub repo (import at https://vercel.com/new),
   OR create it via CLI:
   ```bash
   npm i -g vercel
   vercel link
   ```
2. **Get the three values** the workflow needs:
   - `VERCEL_TOKEN` — Vercel dashboard → Account Settings → Tokens → Create.
   - `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` — after `vercel link`, read them from `.vercel/project.json`.
3. **Add them as GitHub Actions secrets** in the repo:
   Settings → Secrets and variables → Actions → New repository secret. Add all three.
4. Push to `develop` — the workflow builds and deploys to Vercel production automatically.

Vercel also auto-assigns a live URL like `https://kerfco-marketing-site.vercel.app`.

## Add the real logo (one step)

The site loads the logo from `images/logo.png`. Save the official Kerfco profile
logo image to that exact path:

```
images/logo.png
```

Until that file exists, the header/footer automatically fall back to a built-in
SVG version (`images/logo.svg`) so nothing looks broken. A square image around
256×256 px works best. For a crisp browser tab icon, you can also save a
`favicon.ico`, but `logo.png` alone is fine.

## Social links

Instagram and Behance icons appear in the header, contact section, and footer:

- Instagram → https://www.instagram.com/kerfco_timbertech_cnc/
- Behance → https://www.behance.net/jogihemanth

## Customizing

- **Phone number:** update in `index.html` (the `wa.me/919652301635` and `tel:` links) and in `app.js` (the `PHONE` constant).
- **Content:** edit text directly in `index.html`.
- **Colors:** tweak the CSS variables at the top of `styles.css` (`:root`).
- **Portfolio photos:** drop images into `images/` using the `work-<category>.jpg` names referenced in `index.html`.

## Contact (business)

- Phone / WhatsApp: +91 96523 01635
- Location: Near St. Ann's School CBSE, Bakkanapalem / Madhurawada, Visakhapatnam, Andhra Pradesh
- Instagram: [@kerfco_timbertech_cnc](https://www.instagram.com/kerfco_timbertech_cnc/)
