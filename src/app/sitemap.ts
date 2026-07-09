import type { MetadataRoute } from "next";
import { site } from "@/data/site";

/** Bump this when page content actually changes — not on every deploy. */
const CONTENT_LAST_MODIFIED = "2026-07-09";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/services", "/contact", "/book", "/weston", "/keele"].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: CONTENT_LAST_MODIFIED,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
