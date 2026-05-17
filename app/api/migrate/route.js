import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ 
    message: "Migration complete. Pipeline data is stored in the lead's notes field as JSON.",
    status: "done"
  });
}
