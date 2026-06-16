"use client";

import { useEffect, useMemo, useState } from "react";
import {
  assistantName,
  assistantTitle,
  type AssistantSource,
  type AssistantMessage
} from "@/lib/assistant";

const starterMessage =
  "Ask about services, pricing ranges, project types, or the best way to start.";

const quickPrompts = [
  "What services does Reuben offer?",
  "What are the package price ranges?",
  "Which package should I start with?",
  "What kinds of projects are a good fit?",
  "How do I get started?"
] as const;

type AssistantHealthResponse = {
  provider: "ollama" | "bedrock";
  healthy: boolean;
  source: "local-llm" | "bedrock";
  model?: string;
  error?: string;
};

function renderMessageContent(content: string) {
  const blocks = content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.map((block, index) => {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const isBulletList = lines.every((line) => /^[-*]\s+/.test(line));
    const isNumberedList = lines.every((line) => /^\d+\.\s+/.test(line));

    if (isBulletList || isNumberedList) {
      const ListTag = isNumberedList ? "ol" : "ul";

      return (
        <ListTag className="aiBubbleList" key={`${block}-${index}`}>
          {lines.map((line) => (
            <li key={line}>{line.replace(/^([-*]|\d+\.)\s+/, "")}</li>
          ))}
        </ListTag>
      );
    }

    return (
      <p className="aiBubbleParagraph" key={`${block}-${index}`}>
        {block}
      </p>
    );
  });
}

export function AiWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [source, setSource] = useState<AssistantSource>("booting");
  const [health, setHealth] = useState<AssistantHealthResponse | null>(null);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    { role: "assistant", content: starterMessage }
  ]);

  const sourceLabel = useMemo(() => {
    switch (source) {
      case "local-llm":
        return "Local model live";
      case "bedrock":
        return "Bedrock live";
      case "site-knowledge":
        return "Site knowledge fallback";
      case "error":
        return "Reply path degraded";
      default:
        return "Ready when you are";
    }
  }, [source]);

  useEffect(() => {
    if (!isOpen || health) {
      return;
    }

    let ignore = false;

    async function loadHealth() {
      try {
        const response = await fetch("/api/assistant/health");

        if (!response.ok) {
          throw new Error("Health check failed.");
        }

        const data = (await response.json()) as AssistantHealthResponse;

        if (!ignore) {
          setHealth(data);
          setSource(data.source);
        }
      } catch {
        if (!ignore) {
          setSource("error");
        }
      }
    }

    void loadHealth();

    return () => {
      ignore = true;
    };
  }, [health, isOpen]);

  async function submitQuestion(question: string) {
    const trimmed = question.trim();

    if (!trimmed || busy) {
      return;
    }

    const nextMessages = [...messages, { role: "user" as const, content: trimmed }];

    setMessages(nextMessages);
    setInput("");
    setBusy(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: nextMessages
        })
      });

      if (!response.ok) {
        throw new Error("Assistant request failed.");
      }

      const data = (await response.json()) as {
        reply?: string;
        source?: AssistantSource;
      };

      setSource(data.source ?? "site-knowledge");
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.reply?.trim() || "The assistant could not answer right now."
        }
      ]);
    } catch {
      setSource("error");
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "The assistant is unavailable right now. Try again in a moment."
        }
      ]);
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitQuestion(input);
  }

  return (
    <div className={`aiWidget ${isOpen ? "open" : ""}`}>
      <button
        aria-expanded={isOpen}
        className="aiWidgetToggle"
        onClick={() => setIsOpen((value) => !value)}
        type="button"
      >
        <span className="aiWidgetToggleLabel">{assistantName}</span>
        <span className="aiWidgetToggleMeta">Virtual assistance</span>
      </button>
      {isOpen ? (
        <section className="aiWidgetPanel">
          <div className="aiWidgetHeader">
            <div>
              <p className="footerLabel">Reuben&apos;s Virtual Assistance</p>
              <h3>{assistantName}</h3>
            </div>
            <button
              aria-label="Close virtual assistant"
              className="aiWidgetClose"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              ×
            </button>
          </div>
          <p className="aiWidgetNote">
            {assistantTitle}. {sourceLabel}.
          </p>
          <div className={`aiHealthPill ${health?.healthy ? "healthy" : "warning"}`}>
            <span className="aiHealthDot" />
            <span>
              {health
                ? `${health.provider === "bedrock" ? "Bedrock" : "Ollama"}: ${
                    health.healthy ? `connected${health.model ? ` · ${health.model}` : ""}` : "check required"
                  }`
                : "Checking assistant backend..."}
            </span>
          </div>
          <div className="aiPromptRow" aria-label="Suggested prompts">
            {quickPrompts.map((prompt) => (
              <button
                className="aiPromptChip"
                disabled={busy}
                key={prompt}
                onClick={() => void submitQuestion(prompt)}
                type="button"
              >
                {prompt}
              </button>
            ))}
          </div>
          <div className="aiSalesCard">
            <p className="microLabel">Best Paid Entry Point</p>
            <h3>Idea-to-Execution Session</h3>
            <p>
              If the idea is still messy, start with the paid strategy session first. It is the
              fastest path to clarity and the easiest yes for most qualified leads.
            </p>
            <div className="aiSalesActions">
              <a className="button smallButton" href="#session" onClick={() => setIsOpen(false)}>
                Book Session
              </a>
              <a
                className="button buttonGhost smallButton"
                href="#contact"
                onClick={() => setIsOpen(false)}
              >
                Contact Reuben
              </a>
            </div>
          </div>
          <div className="aiWidgetMessages">
            {messages.map((message, index) => (
              <div className={`aiBubble ${message.role}`} key={`${message.role}-${index}`}>
                {renderMessageContent(message.content)}
              </div>
            ))}
          </div>
          <form className="aiWidgetForm" onSubmit={handleSubmit}>
            <textarea
              name="question"
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about packages, services, project fit, or next steps..."
              rows={3}
              value={input}
            />
            <button className="button" disabled={busy} type="submit">
              {busy ? "Thinking..." : "Ask RueMode"}
            </button>
          </form>
        </section>
      ) : null}
    </div>
  );
}
