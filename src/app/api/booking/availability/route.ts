import { NextRequest, NextResponse } from "next/server";

const ESMI_API_URL = process.env.ESMI_API_URL?.replace(/\/$/, "");
const ESMI_BOOKING_SECRET = process.env.ESMI_BOOKING_SECRET;
const TENANT_ID = process.env.ESMI_TENANT_ID || "otro-nivel";

export async function GET(req: NextRequest) {
  if (!ESMI_API_URL) {
    return NextResponse.json(
      { error: "Booking service not configured (ESMI_API_URL)" },
      { status: 503 },
    );
  }

  const { searchParams } = req.nextUrl;
  const location = searchParams.get("location")?.trim();
  const service = searchParams.get("service")?.trim();
  const date = searchParams.get("date")?.trim();

  if (!location || !service || !date) {
    return NextResponse.json(
      { error: "location, service, and date are required" },
      { status: 400 },
    );
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "date must be YYYY-MM-DD" }, { status: 400 });
  }

  const qs = new URLSearchParams({ location, service, date });
  const headers: Record<string, string> = {
    "X-Tenant-Id": TENANT_ID,
  };
  if (ESMI_BOOKING_SECRET) {
    headers["X-Booking-Secret"] = ESMI_BOOKING_SECRET;
  }

  try {
    const res = await fetch(`${ESMI_API_URL}/bookings/availability?${qs}`, {
      headers,
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: data.detail || data.error || "Failed to load availability" },
        { status: res.status },
      );
    }
    return NextResponse.json(data);
  } catch (e) {
    console.error("availability proxy error", e);
    return NextResponse.json(
      { error: "Booking service unreachable" },
      { status: 502 },
    );
  }
}
