"use client";

import { useRef, useState } from "react";
import { websiteKnowledge } from "@/lib/site-content";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type AvailabilityState =
  | "unknown"
  | "available"
  | "downloading"
  | "downloadable"
  | "unavailable"
  | "unsupported";

const starterMessage =
  "Ask about services, packages, project types, or how the site describes Reuben's work.";

export function AiWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<AvailabilityState>("unknown");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: starterMessage }
  ]);
  const sessionRef = useRef<LanguageModelSession | null>(null);

  async function ensureSession() {
    if (sessionRef.current) {
      return sessionRef.current;
    }

    if (typeof window === "undefined" || !("LanguageModel" in window)) {
      setStatus("unsupported");
      throw new Error("This browser does not support the built-in AI Prompt API.");
    }

    const availability = await window.LanguageModel.availability({
      expectedInputs: [{ type: "text", languages: ["en"] }],
      expectedOutputs: [{ type: "text", languages: ["en"] }]
    });

    setStatus(availability);

    if (availability === "unavailable") {
      throw new Error("Built-in browser AI is unavailable on this device or browser.");
    }

    const session = await window.LanguageModel.create({
      expectedInputs: [{ type: "text", languages: ["en"] }],
      expectedOutputs: [{ type: "text", languages: ["en"] }],
      initialPrompts: [
        {
          role: "system",
          content: `
You are the local AI assistant for rmoddel.com.
Only answer using the website knowledge below.
If the answer is not explicitly supported by the website knowledge, reply exactly:
"I can only answer based on content currently shown on this website."
Do not invent client names, extra credentials, timelines, pricing, or portfolio claims.
Keep answers concise and practical.

Website knowledge:
${websiteKnowledge}
          `.trim()
        }
      ]
    });

    sessionRef.current = session;

    return session;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const question = input.trim();

    if (!question || busy) {
      return;
    }

    setMessages((current) => [...current, { role: "user", content: question }]);
    setInput("");
    setBusy(true);

    try {
      const session = await ensureSession();
      const response = await session.prompt(question);

      setMessages((current) => [...current, { role: "assistant", content: response.trim() }]);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The browser AI widget could not answer right now.";

      setMessages((current) => [...current, { role: "assistant", content: message }]);
    } finally {
      setBusy(false);
    }
  }

  function statusText() {
    switch (status) {
      case "downloadable":
      case "downloading":
        return "Browser AI may need to download its local model before first use.";
      case "unavailable":
        return "Built-in browser AI is unavailable on this device.";
      case "unsupported":
        return "This browser does not expose the built-in Prompt API.";
      default:
        return "Runs locally in the browser and only answers from this site.";
    }
  }

  return (
    <div className={`aiWidget ${isOpen ? "open" : ""}`}>
      <button
        aria-expanded={isOpen}
        className="aiWidgetToggle"
        onClick={() => setIsOpen((value) => !value)}
        type="button"
      >
        AI Widget
      </button>
      {isOpen ? (
        <section className="aiWidgetPanel">
          <div className="aiWidgetHeader">
            <div>
              <p className="footerLabel">Local Browser AI</p>
              <h3>Ask about this website</h3>
            </div>
            <button
              aria-label="Close AI widget"
              className="aiWidgetClose"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              ×
            </button>
          </div>
          <p className="aiWidgetNote">{statusText()}</p>
          <div className="aiWidgetMessages">
            {messages.map((message, index) => (
              <div className={`aiBubble ${message.role}`} key={`${message.role}-${index}`}>
                {message.content}
              </div>
            ))}
          </div>
          <form className="aiWidgetForm" onSubmit={handleSubmit}>
            <textarea
              name="question"
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about services, pricing, work samples, or positioning..."
              rows={3}
              value={input}
            />
            <button className="button" disabled={busy} type="submit">
              {busy ? "Thinking..." : "Ask"}
            </button>
          </form>
        </section>
      ) : null}
    </div>
  );
}
