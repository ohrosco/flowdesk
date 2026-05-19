import { getTenantBySlug, verifyPassword, signTenantToken } from "@/lib/tenant";

// ─── POST /api/auth/tenant-login ───────────────────────────────────────────────
// Authenticates a client (sub-account) by slug + password.
// Sets a signed tenant session cookie on success.
export async function POST(request) {
  try {
    const { slug, password } = await request.json();

    if (!slug || !password) {
      return Response.json({ error: "slug and password required" }, { status: 400 });
    }

    const tenant = await getTenantBySlug(slug);
    if (!tenant) {
      return Response.json({ error: "Account not found" }, { status: 401 });
    }

    if (!verifyPassword(password, tenant.password_hash)) {
      return Response.json({ error: "Wrong password" }, { status: 401 });
    }

    if (tenant.subscription_status === "canceled") {
      return Response.json({ error: "Account subscription has ended. Contact your administrator." }, { status: 403 });
    }

    const secret = process.env.ADMIN_PASSWORD || "fallback_secret";
    const token = signTenantToken(tenant.id, secret);

    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions = [
      `flowdesk_tenant_session=${token}`,
      "Path=/",
      "HttpOnly",
      "SameSite=Lax",
      isProd ? "Secure" : "",
      "MaxAge=86400",
    ].filter(Boolean).join("; ");

    return new Response(JSON.stringify({
      success: true,
      tenant: { id: tenant.id, name: tenant.name, slug: tenant.slug, plan: tenant.plan },
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": cookieOptions,
      },
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
