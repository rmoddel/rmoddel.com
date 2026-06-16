import {
  BedrockRuntimeClient,
  ConverseCommand,
  type Message
} from "@aws-sdk/client-bedrock-runtime";
import { NextResponse } from "next/server";
import {
  assistantName,
  assistantSystemPrompt,
  buildFallbackReply,
  type AssistantMessage
} from "@/lib/assistant";

type AssistantRequestBody = {
  messages?: AssistantMessage[];
};

function getAssistantProvider() {
  return process.env.ASSISTANT_PROVIDER === "bedrock" ? "bedrock" : "ollama";
}

async function askLocalModel(messages: AssistantMessage[]) {
  const baseUrl = process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434";
  const model = process.env.OLLAMA_MODEL ?? "llama3.2:3b";

  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [
        { role: "system", content: assistantSystemPrompt },
        ...messages.map((message) => ({
          role: message.role,
          content: message.content
        }))
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Local model request failed with ${response.status}.`);
  }

  const data = (await response.json()) as {
    message?: {
      content?: string;
    };
  };

  const content = data.message?.content?.trim();

  if (!content) {
    throw new Error("Local model returned an empty response.");
  }

  return { content, model };
}

async function askBedrock(messages: AssistantMessage[]) {
  const region =
    process.env.BEDROCK_REGION ??
    process.env.AWS_REGION ??
    process.env.AWS_DEFAULT_REGION ??
    "us-east-1";
  const modelId = process.env.BEDROCK_MODEL_ID;

  if (!modelId) {
    throw new Error("BEDROCK_MODEL_ID is not configured.");
  }

  const client = new BedrockRuntimeClient({ region });

  const conversation: Message[] = messages.map((message) => ({
    role: message.role,
    content: [
      {
        text: message.content
      }
    ]
  }));

  const response = await client.send(
    new ConverseCommand({
      modelId,
      system: [
        {
          text: assistantSystemPrompt
        }
      ],
      messages: conversation,
      inferenceConfig: {
        maxTokens: 500,
        temperature: 0.4
      }
    })
  );

  const content = response.output?.message?.content
    ?.map((item) => ("text" in item && item.text ? item.text : ""))
    .join("")
    .trim();

  if (!content) {
    throw new Error("Bedrock returned an empty response.");
  }

  return { content, model: modelId };
}

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
    const provider = getAssistantProvider();
    const result =
      provider === "bedrock" ? await askBedrock(messages) : await askLocalModel(messages);

    return NextResponse.json({
      reply: result.content,
      source: provider === "bedrock" ? "bedrock" : "local-llm",
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
