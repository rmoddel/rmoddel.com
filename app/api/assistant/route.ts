import { NextResponse } from "next/server";
import {
  assistantName,
  buildFallbackReply,
  type AssistantMessage
} from "@/lib/assistant";
import { askAssistantProvider } from "@/lib/assistant-provider";

type AssistantRequestBody = {
  messages?: AssistantMessage[];
};

export async function POST(request: Request) {
  const body = (await request.json()) as AssistantRequestBody;
  const messages = body.messages?.filter(
    (message): message is AssistantMessage =>
      Boolean(message?.content) &&
      (message.role === "user" || message.role === "assistant")
  );

  if (!messages?.length) {
    return NextResponse.json({ error: "At least one message is required." }, { status: 400 });
  }

  const latestUserMessage = [...messages].reverse().find((message) => message.role === "user");

  if (!latestUserMessage) {
    return NextResponse.json({ error: "A user message is required." }, { status: 400 });
  }

  try {
    const result = await askAssistantProvider(messages);

    return NextResponse.json({
      reply: result.content,
      source: result.source,
      model: result.model,
      assistant: assistantName
    });
  } catch {
    return NextResponse.json({
      reply: buildFallbackReply(latestUserMessage.content),
      source: "site-knowledge",
      assistant: assistantName
    });
  }
}
