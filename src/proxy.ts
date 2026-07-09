import { NextRequest, NextResponse } from "next/server";

/** Hosts that serve the live public site — no auth. Everything else
 *  (vercel.app aliases, previews) stays behind the Basic Auth gate. */
const PUBLIC_HOSTS = new Set([
  "otronivelbarbershop.com",
  "www.otronivelbarbershop.com",
]);

export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
  if (PUBLIC_HOSTS.has(host)) {
    return NextResponse.next();
  }

  const user = process.env.PREVIEW_USER;
  const pass = process.env.PREVIEW_PASSWORD;

  if (!user || !pass) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");

  if (authHeader) {
    const [scheme, encoded] = authHeader.split(" ");
    if (scheme === "Basic" && encoded) {
      try {
        const decoded = atob(encoded);
        const separatorIndex = decoded.indexOf(":");
        const suppliedUser = decoded.slice(0, separatorIndex);
        const suppliedPass = decoded.slice(separatorIndex + 1);
        if (suppliedUser === user && suppliedPass === pass) {
          return NextResponse.next();
        }
      } catch {
        // malformed base64 falls through to the 401 below
      }
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Otro Nivel Preview"' },
  });
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
