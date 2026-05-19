import crypto from "crypto";

export async function POST(request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return Response.json(
        { error: "Server misconfigured: ADMIN_PASSWORD not set" },
        { status: 500 }
      );
    }

    if (password !== adminPassword) {
      return Response.json({ error: "Wrong password" }, { status: 401 });
    }

    // Generate signed session token
    const token = crypto
      .createHmac("sha256", adminPassword)
      .update(adminPassword)
      .digest("hex");

    // Determine cookie domain/secure settings based on environment
    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions = [
      `flowdesk_session=${token}`,
      "Path=/",
      "HttpOnly",
      "SameSite=Lax",
      isProd ? "Secure" : "",
      "MaxAge=86400", // 24 hours
    ]
      .filter(Boolean)
      .join("; ");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": cookieOptions,
      },
    });
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
