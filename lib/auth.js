/**
 * Shared auth guard for internal API routes.
 * Usage: call requireInternalAuth(request) at the top of route handlers.
 * Returns null if authorized, or a NextResponse error if not.
 */
import { NextResponse } from "next/server";

/**
 * Require a valid Bearer token matching CRON_SECRET or ADMIN_PASSWORD.
 * Use for internal-only endpoints (SMS, Claude, followup, migrate).
 */
export function requireInternalAuth(request) {
  const secret = process.env.CRON_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) {
    // No auth configured — skip check (dev mode)
    return null;
  }
  const auth = request.headers.get("authorization");
  if (auth === `Bearer ${secret}`) {
    return null; // authorized
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/**
 * Require agency-level auth (ADMIN_PASSWORD session cookie).
 * Use for agency-only API endpoints.
 */
export function requireAgencyAuth(request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return null; // dev mode

  const sessionCookie = request.cookies.get("flowdesk_session")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify using same HMAC scheme as middleware
  const { createHmac } = require("crypto");
  const expected = createHmac("sha256", adminPassword)
    .update(adminPassword)
    .digest("hex");

  if (sessionCookie !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null; // authorized
}