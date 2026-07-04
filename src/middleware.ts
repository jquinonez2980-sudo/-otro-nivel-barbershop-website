import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const user = process.env.PREVIEW_USER;
  const pass = process.env.PREVIEW_PASSWORD;

  if (!user || !pass) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");

  if (authHeader) {
    const [scheme, encoded] = authHeader.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = atob(encoded);
      const separatorIndex = decoded.indexOf(":");
      const suppliedUser = decoded.slice(0, separatorIndex);
      const suppliedPass = decoded.slice(separatorIndex + 1);
      if (suppliedUser === user && suppliedPass === pass) {
        return NextResponse.next();
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
