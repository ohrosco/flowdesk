export async function GET() {
  return doLogout();
}

export async function POST() {
  return doLogout();
}

function doLogout() {
  const cookieOptions = [
    "flowdesk_session=",
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "MaxAge=0",
  ].join("; ");

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": cookieOptions,
    },
  });
}
