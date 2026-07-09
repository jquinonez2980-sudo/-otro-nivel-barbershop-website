# Otro Nivel Barbershop — Website

Next.js site for A Otro Nivel Barber Shop (Weston Rd & Keele St, Toronto). Mostly static content plus an online booking wizard that talks to Esmi (Orchelix AI receptionist) through server-side proxies.

## Editing content

Almost everything on the site — prices, hours, addresses, phone/email, social links, FAQs, service ids/durations — lives in one file:

```
src/data/site.ts
```

Edit a value there and every page that shows it (home, services, contact, book, and the JSON-LD structured data) updates automatically. Service `id` values must match Esmi's `tenants/otro-nivel/config.json` service keys.

To add or swap photos, drop the file in `public/images/` or `public/media/` and reference it from `src/data/site.ts` or the relevant page/component.

## Online booking

`/book` runs a 4-step wizard (location → service → date/time → contact). Call/text CTAs stay equal citizens.

Server-only env vars (Vercel project settings — never `NEXT_PUBLIC_`):

| Variable | Purpose |
|---|---|
| `ESMI_API_URL` | Railway Esmi base URL (no trailing slash) |
| `ESMI_BOOKING_SECRET` | Same value as Railway `BOOKING_API_SECRET` |
| `ESMI_TENANT_ID` | Defaults to `otro-nivel` if unset |

Proxies: `src/app/api/booking/availability` and `.../create` → Esmi `/bookings/*` with `X-Tenant-Id` + `X-Booking-Secret`.

Until calendars and secrets are live, the wizard still renders; availability may error and users can fall back to phone.

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
