import { NextResponse } from "next/server";

const PROTECTED_PATHS = ["/dashboard", "/outreach", "/book"];

// Use Web Crypto API (available in Edge Runtime) for HMAC signing
async function createToken(secret, data) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(data);

  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, messageData);
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if path should be protected
  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("flowdesk_session")?.value;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    // No password configured — allow through
    return NextResponse.next();
  }

  if (!sessionCookie) {
    // No cookie — redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify the session token using Web Crypto
  const expectedToken = await createToken(adminPassword, adminPassword);

  if (sessionCookie !== expectedToken) {
    // Invalid token — redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    // Clear invalid cookie
    response.cookies.set("flowdesk_session", "", { maxAge: 0, path: "/" });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/outreach/:path*", "/book/:path*", "/dashboard", "/outreach", "/book"],
};