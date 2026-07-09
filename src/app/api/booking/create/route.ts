import { NextRequest, NextResponse } from "next/server";

const ESMI_API_URL = process.env.ESMI_API_URL?.replace(/\/$/, "");
const ESMI_BOOKING_SECRET = process.env.ESMI_BOOKING_SECRET;
const TENANT_ID = process.env.ESMI_TENANT_ID || "otro-nivel";

// Simple in-memory rate limit per IP (best-effort on serverless).
const hits = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 60_000;
const MAX_HITS = 8;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const row = hits.get(ip);
  if (!row || now > row.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  row.count += 1;
  return row.count > MAX_HITS;
}

export async function POST(req: NextRequest) {
  if (!ESMI_API_URL) {
    return NextResponse.json(
      { error: "Booking service not configured (ESMI_API_URL)" },
      { status: 503 },
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot
  if (typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({
      ok: true,
      message: "Booked — confirmation text on its way.",
    });
  }

  const location = String(body.location || "").trim();
  const service = String(body.service || "").trim();
  const start_time = String(body.start_time || "").trim();
  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const email = body.email ? String(body.email).trim() : undefined;
  const lang = body.lang ? String(body.lang).trim() : "en";
  const idempotency_key = body.idempotency_key
    ? String(body.idempotency_key).trim()
    : undefined;

  if (!location || !service || !start_time || !name || !phone) {
    return NextResponse.json(
      { error: "location, service, start_time, name, and phone are required" },
      { status: 400 },
    );
  }
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 7) {
    return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
  }
  if (name.length > 120 || phone.length > 32) {
    return NextResponse.json({ error: "Invalid field length" }, { status: 400 });
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Tenant-Id": TENANT_ID,
  };
  if (ESMI_BOOKING_SECRET) {
    headers["X-Booking-Secret"] = ESMI_BOOKING_SECRET;
  }
  if (idempotency_key) {
    headers["Idempotency-Key"] = idempotency_key;
  }

  try {
    const res = await fetch(`${ESMI_API_URL}/bookings`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        location,
        service,
        start_time,
        name,
        phone,
        email: email || null,
        lang,
        idempotency_key,
      }),
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const detail =
        typeof data.detail === "string"
          ? data.detail
          : Array.isArray(data.detail)
            ? data.detail.map((d: { msg?: string }) => d.msg).join("; ")
            : data.error || "Booking failed";
      return NextResponse.json({ error: detail }, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (e) {
    console.error("create booking proxy error", e);
    return NextResponse.json(
      { error: "Booking service unreachable" },
      { status: 502 },
    );
  }
}
