# Otro Nivel Barbershop — Website

Next.js site for A Otro Nivel Barber Shop (Weston Rd & Keele St, Toronto). Fully static — no database, no forms, no server code beyond a preview-auth gate.

## Editing content

Almost everything on the site — prices, hours, addresses, phone/email, social links, FAQs — lives in one file:

```
src/data/site.ts
```

Edit a value there and every page that shows it (home, services, contact, book, and the JSON-LD structured data) updates automatically. You should rarely need to touch anything under `src/app/` or `src/components/` just to change business info.

To add or swap photos, drop the file in `public/images/` or `public/media/` and reference it from `src/data/site.ts` or the relevant page/component.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build   # production build — run this before pushing if you touched code
npm run lint    # ESLint
```

## Deployment

The site deploys to Vercel. Pushing to the connected branch triggers a build automatically.

### Preview auth

Non-production deployments can be gated behind HTTP Basic Auth via `src/proxy.ts`. Set these Vercel environment variables to turn it on:

- `PREVIEW_USER`
- `PREVIEW_PASSWORD`

If either is unset, the site is open to everyone (fails open by design). **Remove both env vars once the site goes live on the real domain**, or visitors will be prompted for a login.

### Go-live checklist

- [ ] Point `otronivelbarbershop.com` at the Vercel project (DNS + domain settings)
- [ ] Remove `PREVIEW_USER` / `PREVIEW_PASSWORD` from Vercel env vars
- [ ] Confirm `/robots.txt` and `/sitemap.xml` resolve on the real domain
- [ ] Submit the site to Google Search Console
- [ ] Link both Google Business Profiles to the site

## Structure

```
src/data/site.ts       single source of truth: prices, hours, addresses, copy
src/lib/               JSON-LD builder, open/closed hours logic
src/app/               routes: / , /services , /contact , /book
src/components/        shared UI
src/proxy.ts           preview Basic-Auth gate (Next.js "Proxy" convention)
public/images/         logo, shop interior photos
public/media/          hero video, gallery cut photos
```
