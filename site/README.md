# Perth Lawn Renovation Services — Website

One-page animated site for Perth Lawn Renovation Services.
Vertimowing · Lawn Aeration · Weed Spraying · Complete Rejuvenation — All Perth Metro.

## What's in here

```
site/
├── index.html      ← the whole site (one page)
├── quote.html      ← standalone full quote calculator (renovation + equipment hire)
├── support.js      ← runtime index.html needs (keep next to index.html)
├── LICENSE         ← MIT
└── assets/         ← photos + logo
```

### About quote.html

A dedicated, self-contained calculator with two modes:
1. **Lawn renovation quote** — dethatching ($7/m²) and aeration ($1.50/m²) priced instantly by
   lawn size, plus the rejuvenation package and assessment-priced extras (fertiliser, reticulation).
2. **DIY equipment dry hire** — scarifier / vertimower / aerator by the day, 3-day or weekly rate,
   with automatic 3-machine package pricing and the full trailer package.

It's linked from the main site's nav ("Full Calculator") and from the on-page quote section.
Every submission opens the customer's email app pre-filled to `perthlawnrenovationservices@outlook.com`
with all details — or set `CONFIG.leadEndpoint` inside `quote.html` to a Formspree/Getform URL to
receive leads as JSON instead of via email.

## Deploy to GitHub Pages (free hosting)

1. Create a new repository on github.com (e.g. `perth-lawn-renovation`), set it **Public**.
2. Upload everything inside the `site/` folder to the repository **root**
   (`index.html` and `support.js` at top level, `assets/` folder beside them).
3. In the repo: **Settings → Pages → Source: Deploy from a branch → Branch: main / (root) → Save**.
4. Wait ~1 minute. Your site is live at `https://YOUR-USERNAME.github.io/perth-lawn-renovation/`.

### Custom domain later
Buy the domain (e.g. perthlawnrenovationservices.com.au), then in **Settings → Pages → Custom domain**
enter it and follow GitHub's DNS instructions. The SEO tags in `index.html` already point to
`https://perthlawnrenovationservices.com.au/` — update those URLs if you use a different domain.

## Before going live — IMPORTANT

- **Replace the three reviews** in the "What Perth homeowners say" section with REAL customer
  quotes and names. The current three (Jason M., Sarah K., Mark T.) are sample copy from the
  build docs, not real customers. Publishing invented reviews as real breaches Australian
  Consumer Law. Text your last three happy customers — one sentence each is enough.
- Check the quote calculator rates ($7/m² dethatch, $1.50/m² aeration) are current.
- The WhatsApp button assumes 0427 206 246 is WhatsApp-enabled. If not, remove that button.

## Contact points wired in

- Phone: 0427 206 246 (tel: links)
- Email: perthlawnrenovationservices@outlook.com (quote tool emails a pre-filled estimate)
- WhatsApp: wa.me/61427206246 (pre-filled with live estimate)
- Facebook: https://www.facebook.com/profile.php?id=61579701849078
- ABN 29 942 711 312 (footer)

## Editing basics

Everything is inline in `index.html` — search for the text you want to change.
Quote rates: search `dethatchRate` / `aerateRate` defaults (also editable via the
`data-props` JSON on the script tag at the bottom of the file).
