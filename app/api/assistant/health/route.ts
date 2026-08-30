import { NextResponse } from "next/server";
import { assistantName } from "@/lib/assistant";

export async function GET() {
  return NextResponse.json({
    assistant: assistantName,
    configured: true,
    healthy: true,
    source: "site-knowledge",
    model: "local-response-library"
  });
}
