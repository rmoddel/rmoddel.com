import { NextResponse } from "next/server";
import {
  assistantName,
  buildFallbackReply,
  retrieveAssistantContext,
  type AssistantMessage
} from "@/lib/assistant";
import { askAssistantProvider } from "@/lib/assistant-provider";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";

type AssistantRequestBody = {
  messages?: AssistantMessage[];
  topic?: string | null;
};

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(getClientKey(request, "assistant"), 30, 10 * 60 * 1000);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many assistant requests. Please try again later." },
      { status: 429 }
    );
  }

  const body = (await request.json()) as AssistantRequestBody;
  const messages = body.messages
    ?.filter(
      (message): message is AssistantMessage =>
        Boolean(message?.content) &&
        (message.role === "user" || message.role === "assistant")
    )
    .slice(-8)
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, 1200)
    }));

  if (!messages?.length) {
    return NextResponse.json({ error: "At least one message is required." }, { status: 400 });
  }

  const latestUserMessage = [...messages].reverse().find((message) => message.role === "user");

  if (!latestUserMessage) {
    return NextResponse.json({ error: "A user message is required." }, { status: 400 });
  }

  if (latestUserMessage.content.length > 1000) {
    return NextResponse.json(
      { error: "Please keep assistant questions under 1,000 characters." },
      { status: 400 }
    );
  }

  const topic = body.topic?.slice(0, 80);
  const context = retrieveAssistantContext(latestUserMessage.content, topic);

  try {
    const result = await askAssistantProvider(messages, context);

    return NextResponse.json({
      reply: result.content,
      source: result.source,
      model: result.model,
      assistant: assistantName
    });
  } catch {
    return NextResponse.json({
      reply: buildFallbackReply(latestUserMessage.content, messages, topic),
      source: "site-knowledge",
      assistant: assistantName
    });
  }
}
