# Google Business Profile — Fix & Growth Runbook

The site at **https://otronivelbarbershop.com is now public** (the password gate only
applies to `*.vercel.app` preview links). Everything below happens in dashboards the
business owner controls — none of it can be done from code.

**Canonical NAP (Name · Address · Phone) — use everywhere:**

| Field | Canonical value |
|---|---|
| **Legal / listing name** | `A Otro Nivel Barber Shop` |
| **Phone (both shops)** | `(647) 340-7187` · `+1 647-340-7187` |
| **Do NOT use** | `416-901-1218` (old directory listing) · `"A Otro Nivel FT Barbershop"` as primary name |
| **Weston address** | 2851 Weston Road, Toronto, ON M9M 2S1 |
| **Keele address** | 2266 Keele Street, North York, ON M6M 3Y9 |
| **Website (Weston GBP)** | `https://otronivelbarbershop.com/weston` |
| **Website (Keele GBP)** | `https://otronivelbarbershop.com/keele` |
| **Booking link** | `https://otronivelbarbershop.com/book` |

Third-party directories (Fresha, Yelp, etc.) have been found listing Keele as
**"A Otro Nivel FT Barbershop"** with **416-901-1218**. That splits local ranking
signals. Fix every citation to the table above.

---

## 1. Claim / align both Google Business Profiles (do today)

For **each** location at [business.google.com](https://business.google.com)
(sign in with the Google account that owns the profiles — if unclaimed, click
"Own this business?" on the Google listing first):

### Name & category
- Business name: **A Otro Nivel Barber Shop** (exact match to site + schema)
- Primary category: **Barber shop**
- Optional secondary: Hair salon (only if it helps; keep Barber shop primary)

### Contact
| Location | Website | Phone |
|---|---|---|
| Weston Rd profile | `https://otronivelbarbershop.com/weston` | `(647) 340-7187` |
| Keele St profile | `https://otronivelbarbershop.com/keele` | `(647) 340-7187` |

If Keele truly has a separate line at 416-901-1218 that must stay for calls,
document it as a **secondary** phone in GBP only — never as the primary, and
update the website only after the owner confirms. Default: one number, both shops.

### Hours, descriptions, photos
- Hours must match `website/src/data/site.ts` (Weston closes 8 PM most nights; Keele 9 PM).
- Write **EN + ES** short descriptions (Google supports both).
- Upload interior + cut photos; keep them fresh weekly.

### Social + booking
**Edit profile → Contact → Social profiles** → add:
- YouTube: `https://www.youtube.com/@AOtroNivelBarbershop`
- Instagram: `https://www.instagram.com/aotronivelbarbershop02`

**Edit profile → Booking** → `https://otronivelbarbershop.com/book`

---

## 2. Citation sweep (1–2 weeks)

Update every listing to the canonical NAP table:

- [ ] Fresha
- [ ] Yelp
- [ ] Facebook
- [ ] Instagram bio → `otronivelbarbershop.com/book`
- [ ] Apple Maps / Apple Business Connect
- [ ] Bing Places
- [ ] Any other Toronto barber directories

Search for: `"A Otro Nivel FT"` and `416-901-1218` and correct or request removal.

---

## 3. Google Search Console (one-time, ~10 min)

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
   → Add property → **Domain** → `otronivelbarbershop.com`.
2. Verify via DNS TXT record: Vercel dashboard → Domains → add the TXT Google shows.
3. Once verified: **Sitemaps** → submit `https://otronivelbarbershop.com/sitemap.xml`
4. Optional: **URL Inspection** → homepage → "Request indexing"
5. Confirm brand SERP from a **Toronto** IP (US proxies often show Fresha/IG first).

---

## 4. Esmi post-visit review SMS (feeds local SEO)

1. In each GBP: **Ask for reviews** → copy the short review URL.
2. Paste into `website/src/data/site.ts` → `site.googleReviewUrl.weston` / `.keele`.
3. Add to Esmi SMS templates (receptionist tenant config):

**English (after appointment / same evening):**
> Thanks for coming to Otro Nivel — hope you love the cut. Leave us a quick Google review: {review_link}

**Spanish:**
> Gracias por visitarnos en Otro Nivel — ojalá te encante el corte. Déjanos una reseña en Google: {review_link}

Reply to every review (Google rewards engagement). Once you have solid volume,
set `site.reviews = { ratingValue: "4.9", reviewCount: N }` so JSON-LD emits
`aggregateRating`.

---

## 5. Ongoing organic growth (15 min/week)

- **Post weekly on the GBP** (Updates → photo/offer): before/after cuts.
- **YouTube → site loop**: put `otronivelbarbershop.com/book` in the channel
  description and barbering video descriptions.
- **Keep NAP consistent** everywhere — name, address, phone never freestyle.

---

## What the site now does automatically

- `/weston` and `/keele` landing pages with per-shop hours, prices, map, FAQ, and
  BarberShop structured data (JSON-LD) including **geo coordinates**.
- Homepage service prices derived from the same `site.ts` tables as the wizard
  (no more stale "from $35" drift).
- Curated YouTube embeds, sitemap + robots, www → apex redirects.
- Hero video diet + long-cache headers on `/media/*` and `/images/*`.
- Booking wizard EN/ES labels; missing page `<h1>`s on services/contact/book.
