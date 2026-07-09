import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const ESMI_API_URL = (
  process.env.ESMI_API_URL ??
  "https://ai-receptionist-production-5375.up.railway.app"
).replace(/\/$/, "");
const TENANT_ID = process.env.ESMI_TENANT_ID || "otro-nivel";

/**
 * SSE proxy to the Esmi chat backend. Keeps CHAT_PROXY_SECRET server-side and
 * pins the tenant so the widget can never talk to another business's Esmi.
 */
export async function POST(req: NextRequest) {
  const body = await req.json();

  // Vercel's edge sets x-forwarded-for to the real visitor IP; without
  // forwarding it, every visitor would share this function's egress IP and
  // collapse Esmi's per-visitor rate limit into one bucket.
  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  let upstream: Response;
  try {
    upstream = await fetch(`${ESMI_API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Chat-Secret": process.env.CHAT_PROXY_SECRET ?? "",
        "X-Tenant-Id": TENANT_ID,
        "X-Client-IP": clientIp,
      },
      body: JSON.stringify({
        message: body.message,
        thread_id: body.thread_id,
      }),
      // @ts-expect-error — Node 18 fetch supports duplex but types lag
      duplex: "half",
    });
  } catch {
    return new Response(
      `data: ${JSON.stringify({ type: "error", message: "Could not reach Esmi — please call or text us instead." })}\n\n`,
      { status: 502, headers: { "Content-Type": "text/event-stream" } },
    );
  }

  if (!upstream.ok || !upstream.body) {
    return new Response(
      `data: ${JSON.stringify({ type: "error", message: "Esmi is having trouble right now — please call or text us instead." })}\n\n`,
      { status: upstream.status, headers: { "Content-Type": "text/event-stream" } },
    );
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
