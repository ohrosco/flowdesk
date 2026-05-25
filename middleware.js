import { NextResponse } from "next/server";

// Routes that require agency-level auth (master password)
const AGENCY_PATHS = ["/agency", "/api/tenants"];

// Routes that require tenant-level auth (client login)
const TENANT_PATHS = ["/dashboard", "/outreach"];

// Crypto helpers (Web Crypto API - Edge Runtime compatible)
async function hmac(secret, data) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyTenantToken(token, secret) {
  if (!token || !token.includes("|")) return null;
  const lastPipe = token.lastIndexOf("|");
  const payload = token.slice(0, lastPipe);
  const sig = token.slice(lastPipe + 1);
  const expected = await hmac(secret, payload);
  if (sig !== expected) return null;
  return payload; // the tenant_id UUID
}

// Main middleware
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // Agency routes (/agency/*)
  const isAgency = AGENCY_PATHS.some(
    p => pathname === p || pathname.startsWith(p + "/")
  );

  if (isAgency) {
    if (!adminPassword) return NextResponse.next();
    const sessionCookie = request.cookies.get("flowdesk_session")?.value;
    if (!sessionCookie) return redirectToLogin(request, "/login?agency=1");
    const expected = await hmac(adminPassword, adminPassword);
    if (sessionCookie !== expected) return redirectToLogin(request, "/login?agency=1");
    return NextResponse.next();
  }

  // Tenant dashboard routes (/dashboard, /outreach)
  const isTenant = TENANT_PATHS.some(
    p => pathname === p || pathname.startsWith(p + "/")
  );

  if (!isTenant) return NextResponse.next();

  const secret = adminPassword;

  // 1. Check for new multi-tenant session cookie
  const tenantToken = request.cookies.get("flowdesk_tenant_session")?.value;
  if (tenantToken) {
    const tenantId = await verifyTenantToken(tenantToken, secret);
    if (!tenantId) return redirectToLogin(request, "/login");
    return NextResponse.next({
      request: {
        headers: new Headers({
          ...Object.fromEntries(request.headers.entries()),
          "x-tenant-id": tenantId,
        }),
      },
    });
  }

  // 2. Fall back to legacy single-tenant session cookie (backwards compat)
  const legacySession = request.cookies.get("flowdesk_session")?.value;
  if (legacySession && adminPassword) {
    const expected = await hmac(adminPassword, adminPassword);
    if (legacySession === expected) {
      return NextResponse.next({
        request: {
          headers: new Headers({
            ...Object.fromEntries(request.headers.entries()),
            "x-tenant-id": "00000000-0000-0000-0000-000000000001",
          }),
        },
      });
    }
  }

  return redirectToLogin(request, "/login");
}

function redirectToLogin(request, loginPath = "/login") {
  const url = new URL(loginPath, request.url);
  url.searchParams.set("redirect", request.nextUrl.pathname);
  const res = NextResponse.redirect(url);
  res.cookies.set("flowdesk_tenant_session", "", { maxAge: 0, path: "/" });
  return res;
}

export const config = {
  matcher: [
    "/dashboard/:path*", "/dashboard",
    "/outreach/:path*",  "/outreach",
    "/agency/:path*",    "/agency",
    "/api/tenants/:path*", "/api/tenants",
  ],
};
