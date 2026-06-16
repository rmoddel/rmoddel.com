import { NextResponse } from "next/server";
import { assistantName } from "@/lib/assistant";
import { getAssistantHealth } from "@/lib/assistant-provider";

export async function GET() {
  const health = await getAssistantHealth();

  return NextResponse.json({
    assistant: assistantName,
    ...health
  });
}
