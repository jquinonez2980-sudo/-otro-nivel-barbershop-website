/**
 * SEO gating tests — drive the real site data + JSON-LD helpers.
 * Run: npm run test:seo
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { site, locations, faqs, seoCopy } from "../data/site";
import { locationJsonLd, locationsJsonLd, faqPageJsonLd } from "./jsonld";
import sitemap from "../app/sitemap";
import robots from "../app/robots";

const SRC = join(process.cwd(), "src");

function readSrc(...parts: string[]) {
  return readFileSync(join(SRC, ...parts), "utf8");
}

describe("local SEO — NAP & intent copy", () => {
  it("exposes the direct-line NAP phone (no old 416 listing)", () => {
    assert.equal(site.phone, "(647) 340-7187");
    assert.equal(site.phoneE164, "+16473407187");
    assert.doesNotMatch(site.phone, /416-901-1218/);
    assert.doesNotMatch(site.phoneE164, /4169011218/);
  });

  it("exposes Esmi's dedicated line, distinct from the direct line", () => {
    assert.equal(site.esmiPhone, "(437) 292-3949");
    assert.equal(site.esmiPhoneE164, "+14372923949");
    assert.notEqual(site.esmiPhoneE164, site.phoneE164);
  });

  it("keeps Weston ↔ Toronto and Keele ↔ North York with real streets", () => {
    const weston = locations.find((l) => l.id === "weston");
    const keele = locations.find((l) => l.id === "keele");
    assert.ok(weston);
    assert.ok(keele);
    assert.equal(weston!.area, "Toronto");
    assert.match(weston!.fullAddress, /2851 Weston Road/);
    assert.match(weston!.fullAddress, /Toronto/);
    assert.equal(keele!.area, "North York");
    assert.match(keele!.fullAddress, /2266 Keele Street/);
    assert.match(keele!.fullAddress, /North York/);
  });

  it("homepage SEO copy targets barber + Toronto + North York", () => {
    assert.match(seoCopy.home.title, /barbershop/i);
    assert.match(seoCopy.home.title, /Toronto/i);
    assert.match(seoCopy.home.title, /North York/i);
    assert.match(seoCopy.home.description, /barbershop/i);
    assert.match(seoCopy.home.description, /Weston Road/);
    assert.match(seoCopy.home.description, /Keele Street/);
    assert.match(site.tagline, /Barbershop/i);
    assert.match(site.tagline, /Toronto/);
    assert.match(site.tagline, /North York/);
  });

  it("includes North York–specific and Toronto–specific FAQ answers", () => {
    const toronto = faqs.find((f) => /Toronto/i.test(f.q) && /barber/i.test(f.q));
    const northYork = faqs.find((f) => /North York/i.test(f.q) && /barber/i.test(f.q));
    assert.ok(toronto, "expected a Toronto barber FAQ");
    assert.ok(northYork, "expected a North York barber FAQ");
    assert.match(toronto!.a, /2851 Weston Road/);
    assert.match(northYork!.a, /2266 Keele Street/);
  });

  it("uses verified per-location Google review stats (no invented numbers)", () => {
    assert.deepEqual(site.reviews.weston, { ratingValue: "4.9", reviewCount: 148 });
    assert.deepEqual(site.reviews.keele, { ratingValue: "4.9", reviewCount: 465 });
  });
});

describe("JSON-LD — BarberShop per location", () => {
  for (const loc of locations) {
    it(`${loc.id} emits BarberShop with address, geo, phone, hours`, () => {
      const graph = locationJsonLd(loc);
      assert.equal(graph["@type"], "BarberShop");
      assert.equal(graph.telephone, site.phoneE164);
      assert.equal(graph.url, `${site.url}/${loc.id}`);

      const address = graph.address as Record<string, unknown>;
      assert.equal(address["@type"], "PostalAddress");
      assert.equal(address.streetAddress, loc.address);
      assert.equal(address.postalCode, loc.postalCode);

      const geo = graph.geo as Record<string, unknown>;
      assert.equal(geo["@type"], "GeoCoordinates");
      assert.equal(geo.latitude, loc.geo.lat);
      assert.equal(geo.longitude, loc.geo.lng);

      const hours = graph.openingHoursSpecification as unknown[];
      assert.equal(hours.length, 7);

      const rating = graph.aggregateRating as Record<string, unknown>;
      assert.equal(rating["@type"], "AggregateRating");
      assert.equal(rating.ratingValue, site.reviews[loc.id].ratingValue);
      assert.equal(rating.reviewCount, site.reviews[loc.id].reviewCount);
      assert.ok(Array.isArray(graph.areaServed));
    });
  }

  it("locationsJsonLd covers both shops with verified aggregateRating", () => {
    assert.equal(locationsJsonLd.length, 2);
    for (const g of locationsJsonLd) {
      assert.equal(g["@type"], "BarberShop");
      const rating = g.aggregateRating as Record<string, unknown>;
      assert.equal(rating["@type"], "AggregateRating");
      assert.ok(Number(rating.reviewCount) > 0);
    }
  });

  it("faqPageJsonLd maps real Q&A from shipped faqs", () => {
    const page = faqPageJsonLd(faqs);
    assert.equal(page["@type"], "FAQPage");
    assert.equal(page.mainEntity.length, faqs.length);
    assert.equal(page.mainEntity[0].name, faqs[0].q);
    assert.equal(page.mainEntity[0].acceptedAnswer.text, faqs[0].a);
  });
});

describe("sitemap & robots", () => {
  it("sitemap lists all public SEO URLs", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    for (const path of ["", "/services", "/contact", "/book", "/weston", "/keele"]) {
      assert.ok(
        urls.includes(`${site.url}${path}`),
        `missing sitemap entry for ${path || "/"}`,
      );
    }
  });

  it("robots allows crawl and points at sitemap", () => {
    const r = robots();
    const rules = Array.isArray(r.rules) ? r.rules : [r.rules];
    assert.ok(rules.some((rule) => rule.allow === "/" || rule.allow?.includes("/")));
    assert.equal(r.sitemap, `${site.url}/sitemap.xml`);
  });
});

describe("page source — H1 intent, internal links, street NAP", () => {
  it("homepage metadata and locations section name both cities", () => {
    const home = readSrc("app", "page.tsx");
    assert.match(home, /seoCopy\.home/);
    assert.match(home, /Toronto or North York|Toronto & North York/i);
    assert.match(home, /ShopsShowcase/);
  });

  it("hero H1 exposes barbershop + city intent via tagline", () => {
    const hero = readSrc("components", "HeroCinematic.tsx");
    assert.match(hero, /<h1>/);
    assert.match(hero, /site\.tagline/);
  });

  it("location landings use single H1 and real addresses", () => {
    const locPage = readSrc("app", "[location]", "page.tsx");
    assert.match(locPage, /as="h1"/);
    assert.match(locPage, /Toronto Barbershop on Weston Road/);
    assert.match(locPage, /North York Barbershop on Keele Street/);
    assert.match(locPage, /2851 Weston Road/);
    assert.match(locPage, /2266 Keele/);
    assert.match(locPage, /locationJsonLd/);
    assert.match(locPage, /faqPageJsonLd/);
  });

  it("home/services/contact/footer link to both location landings with area anchors", () => {
    const files = [
      readSrc("components", "ShopsShowcase.tsx"),
      readSrc("components", "Footer.tsx"),
      readSrc("app", "services", "page.tsx"),
      readSrc("app", "contact", "page.tsx"),
    ].join("\n");
    assert.match(files, /href=\{`\/\$\{loc\.id\}`\}|href="\/weston"|href="\/keele"/);
    assert.match(files, /\/weston/);
    assert.match(files, /\/keele/);
    assert.match(files, /Toronto/);
    assert.match(files, /North York/);
  });
});
