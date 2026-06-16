import {
  BedrockRuntimeClient,
  ConverseCommand,
  type Message
} from "@aws-sdk/client-bedrock-runtime";
import { assistantSystemPrompt, type AssistantMessage } from "@/lib/assistant";

export type AssistantProvider = "ollama" | "bedrock";

export type AssistantProviderResult = {
  content: string;
  model: string;
  source: "local-llm" | "bedrock";
};

export type AssistantHealth = {
  provider: AssistantProvider;
  configured: boolean;
  healthy: boolean;
  source: "local-llm" | "bedrock";
  model?: string;
  error?: string;
};

export function getAssistantProvider(): AssistantProvider {
  return process.env.ASSISTANT_PROVIDER === "bedrock" ? "bedrock" : "ollama";
}

function getBedrockRegion() {
  return (
    process.env.BEDROCK_REGION ??
    process.env.AWS_REGION ??
    process.env.AWS_DEFAULT_REGION ??
    "us-east-1"
  );
}

export async function askLocalModel(messages: AssistantMessage[]) {
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

  return { content, model, source: "local-llm" as const };
}

export async function askBedrock(messages: AssistantMessage[]) {
  const modelId = process.env.BEDROCK_MODEL_ID;

  if (!modelId) {
    throw new Error("BEDROCK_MODEL_ID is not configured.");
  }

  const client = new BedrockRuntimeClient({ region: getBedrockRegion() });

  const conversation: Message[] = messages.map((message) => ({
    role: message.role,
    content: [{ text: message.content }]
  }));

  const response = await client.send(
    new ConverseCommand({
      modelId,
      system: [{ text: assistantSystemPrompt }],
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

  return { content, model: modelId, source: "bedrock" as const };
}

export async function askAssistantProvider(messages: AssistantMessage[]): Promise<AssistantProviderResult> {
  const provider = getAssistantProvider();
  return provider === "bedrock" ? askBedrock(messages) : askLocalModel(messages);
}

export async function getAssistantHealth(): Promise<AssistantHealth> {
  const provider = getAssistantProvider();

  if (provider === "bedrock") {
    const model = process.env.BEDROCK_MODEL_ID;

    if (!model) {
      return {
        provider,
        configured: false,
        healthy: false,
        source: "bedrock",
        error: "BEDROCK_MODEL_ID is missing."
      };
    }

    try {
      await askBedrock([{ role: "user", content: "Reply with OK." }]);

      return {
        provider,
        configured: true,
        healthy: true,
        source: "bedrock",
        model
      };
    } catch (error) {
      return {
        provider,
        configured: true,
        healthy: false,
        source: "bedrock",
        model,
        error: error instanceof Error ? error.message : "Bedrock check failed."
      };
    }
  }

  const model = process.env.OLLAMA_MODEL ?? "llama3.2:3b";

  try {
    await fetch(`${process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434"}/api/tags`, {
      method: "GET"
    });

    return {
      provider,
      configured: true,
      healthy: true,
      source: "local-llm",
      model
    };
  } catch (error) {
    return {
      provider,
      configured: true,
      healthy: false,
      source: "local-llm",
      model,
      error: error instanceof Error ? error.message : "Ollama check failed."
    };
  }
}
