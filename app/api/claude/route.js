import { NextResponse } from "next/server";
import { requireAgencyAuth } from "@/lib/auth";

// ─── POST /api/claude ─────────────────────────────────────────────────────────
// Proxies requests to Anthropic API so the key stays server-side.
// Called from the dashboard browser client — uses session cookie auth.
export async function POST(req) {
  const authCheck = requireAgencyAuth(req);
  if (authCheck) return authCheck;

  const { prompt, system, messages, max_tokens = 1000 } = await req.json();

  const msgs = messages || [{ role: "user", content: prompt }];

  const body = {
    model: "claude-sonnet-4-20250514",
    max_tokens,
    messages: msgs,
  };
  if (system) body.system = system;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: res.status });
  }

  const data = await res.json();
  const text = data.content?.map(b => b.text || "").join("") || "";
  return NextResponse.json({ text });
}
