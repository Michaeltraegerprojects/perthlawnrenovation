# Perth Lawn Renovation Services: website

Static site for perthlawnrenovationservices.com.au, served by GitHub Pages from `main` (repo root). Plain HTML, CSS and JavaScript. No framework and no build step to deploy.

## Layout

```
index.html            homepage (instant estimate + quote form)
vertimowing.html      service pages, each ends with a short quote form
aeration.html
top-dressing.html
hire.html
quote.html            full calculator (renovation + equipment hire). Its own script and CONFIG.
spring-guide.html     lead-magnet landing page (noindex)
css/site.css          shared design system: tokens, components, page styles
js/site.js            shared script: config, forms, estimate, before/after, tracking
assets/img/           responsive images (generated, see below)
assets/fonts/         self-hosted Anton + Hanken Grotesk
assets/*.jpg, *.png   original photos (ads, flyers and Open Graph tags link to these)
scripts/build-images.py
marketing/            ad and flyer source files (not part of the site)
```

## Things you can change without touching anything else

All in the `SITE` object at the top of `js/site.js`:

- `tracking.metaPixelId` / `tracking.ga4Id`: paste an ID to switch tracking on. Blank loads nothing.
- `banner`: the strip at the top of every page. Set `text`, `textShort` (phones), `href` and `expires` (YYYY-MM-DD). It hides itself after that date.
- `rates`: per-m² rates and the minimum job used by the homepage estimate.
- `endpoints`: the Formspree URLs the forms post to.

`quote.html` keeps its own `CONFIG` block (rates, hire pricing, promo code, lead endpoint).

## Images

Add or replace a photo in `assets/`, list it in `scripts/build-images.py`, then run:

```
pip install pillow
python3 scripts/build-images.py
```

It writes AVIF, WebP and JPEG copies at several widths into `assets/img/`.

## Reviews

Only real, named customer reviews go on the site, in the customer's own words. Publishing invented reviews breaches Australian Consumer Law.

## Leads

- Quote forms post JSON to Formspree (`mlgqkwan`). Each lead includes the services, lawn size, estimate, the page it came from and any `utm_*`, `fbclid` or `gclid` the visitor arrived with.
- The aftercare guide and spring guide forms post to Formspree (`xykroepj`).
- If a send fails, the visitor keeps what they typed and gets prefilled text, WhatsApp and email links.

## Contact points wired in

Phone and SMS 0427 206 246 · WhatsApp wa.me/61427206246 · perthlawnrenovationservices@outlook.com · ABN 29 942 711 312
