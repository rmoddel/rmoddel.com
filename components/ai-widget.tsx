"use client";

import { useEffect, useRef, useState } from "react";
import { assistantName, type AssistantMessage } from "@/lib/assistant";

const starterMessage =
  "Ask about Reuben's background, work themes, capabilities, or ask me to send him a note.";

const quickPrompts = [
  { label: "Background", prompt: "What is Reuben's professional background?" },
  { label: "Capabilities", prompt: "Where is Reuben most useful?" },
  { label: "Send a note", prompt: "I want to send Reuben a message." }
] as const;

type ContactDraft = {
  name?: string;
  email?: string;
  context?: string;
};

type ContactStep = "idle" | "name" | "email" | "context" | "confirm";

const emailPattern = /[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+/;

function extractEmail(text: string) {
  return text.match(emailPattern)?.[0] ?? "";
}

function normalizeText(text: string) {
  return text.trim().toLowerCase();
}

function isContactRequest(text: string) {
  const normalized = normalizeText(text);

  return [
    "contact",
    "get in touch",
    "send reuben",
    "send him",
    "send my info",
    "send my information",
    "send a note",
    "send a message",
    "message reuben",
    "reach out",
    "submit form",
    "contact form",
    "email reuben",
    "hire",
    "recruit",
    "job opportunity"
  ].some((phrase) => normalized.includes(phrase));
}

function isCancelRequest(text: string) {
  return /^(cancel|stop|never mind|nevermind|abort)$/i.test(text.trim());
}

function isSendConfirmation(text: string) {
  return /^(send|submit|yes|yes send|send it|go ahead|looks good|please send)$/i.test(
    text.trim()
  );
}

function cleanName(text: string) {
  return text
    .replace(emailPattern, "")
    .replace(/^(my name is|name is|i am|i'm|this is)\s+/i, "")
    .trim()
    .replace(/[.,;:]+$/g, "");
}

function hasEnoughContext(text: string) {
  return text.trim().replace(emailPattern, "").length >= 12;
}

function buildContactSummary(draft: Required<ContactDraft>) {
  return [
    "I have enough to send this to Reuben:",
    "",
    `- Name: ${draft.name}`,
    `- Email: ${draft.email}`,
    `- Context: ${draft.context}`,
    "",
    "Type “send” to submit it, or tell me what to change."
  ].join("\n");
}

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
  const [contactStep, setContactStep] = useState<ContactStep>("idle");
  const [contactDraft, setContactDraft] = useState<ContactDraft>({});
  const [messages, setMessages] = useState<AssistantMessage[]>([
    { role: "assistant", content: starterMessage }
  ]);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const messageList = messagesRef.current;

    if (!messageList) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      messageList.scrollTo({
        top: messageList.scrollHeight,
        behavior: "smooth"
      });
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [busy, isOpen, messages.length]);

  async function sendContactDraft(draft: Required<ContactDraft>) {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: draft.name,
        email: draft.email,
        phone: "",
        helpType: "Chatbot inquiry",
        project: draft.context,
        timeline: "",
        budget: "Submitted through chatbot"
      })
    });

    const data = (await response.json()) as { ok?: boolean; error?: string };

    if (!response.ok || !data.ok) {
      throw new Error(data.error || "Could not send the message.");
    }
  }

  async function handleContactFlow(text: string) {
    if (isCancelRequest(text)) {
      setContactStep("idle");
      setContactDraft({});

      return "No problem. I stopped the message draft.";
    }

    if (contactStep === "idle") {
      const email = extractEmail(text);
      const nextDraft: ContactDraft = email ? { email } : {};

      setContactDraft(nextDraft);
      setContactStep(email ? "name" : "name");

      return email
        ? "I can send a note to Reuben after I collect the basics. What name should I include?"
        : "I can collect a note here and send it to Reuben. What is your name?";
    }

    if (contactStep === "name") {
      const email = extractEmail(text);
      const name = cleanName(text);
      const nextDraft = {
        ...contactDraft,
        ...(email ? { email } : {}),
        ...(name ? { name } : {})
      };

      if (!nextDraft.name || nextDraft.name.length < 2) {
        return "What name should I include with the message?";
      }

      setContactDraft(nextDraft);

      if (nextDraft.email) {
        setContactStep("context");
        return "Thanks. Briefly, what should I tell Reuben this is about?";
      }

      setContactStep("email");
      return `Thanks, ${nextDraft.name}. What email should Reuben use to reply?`;
    }

    if (contactStep === "email") {
      const email = extractEmail(text);

      if (!email) {
        return "Please send a valid email address so Reuben can reply.";
      }

      const nextDraft = {
        ...contactDraft,
        email
      };

      setContactDraft(nextDraft);
      setContactStep("context");

      return "Got it. Briefly, what should I tell Reuben this is about?";
    }

    if (contactStep === "context") {
      if (!hasEnoughContext(text)) {
        return "Please add a little more context: role, project, workflow, team need, or reason for reaching out.";
      }

      const nextDraft = {
        ...contactDraft,
        context: text.trim()
      };

      if (!nextDraft.name || !nextDraft.email || !nextDraft.context) {
        setContactDraft(nextDraft);
        setContactStep(!nextDraft.name ? "name" : !nextDraft.email ? "email" : "context");

        return "I am missing one required detail before I can send it.";
      }

      const completeDraft = nextDraft as Required<ContactDraft>;

      setContactDraft(completeDraft);
      setContactStep("confirm");

      return buildContactSummary(completeDraft);
    }

    if (contactStep === "confirm") {
      if (isSendConfirmation(text)) {
        const completeDraft = contactDraft as Required<ContactDraft>;

        if (!completeDraft.name || !completeDraft.email || !completeDraft.context) {
          setContactStep(!completeDraft.name ? "name" : !completeDraft.email ? "email" : "context");
          return "I am missing one required detail before I can send it.";
        }

        try {
          await sendContactDraft(completeDraft);
          setContactStep("idle");
          setContactDraft({});

          return "Sent. Reuben will have your note and can reply by email.";
        } catch {
          return "I could not send that right now. You can try again by typing “send,” or use the contact form below.";
        }
      }

      const email = extractEmail(text);
      const nextDraft = {
        ...contactDraft,
        ...(email ? { email } : { context: text.trim() })
      };

      if (!nextDraft.name || !nextDraft.email || !nextDraft.context) {
        setContactDraft(nextDraft);
        setContactStep(!nextDraft.name ? "name" : !nextDraft.email ? "email" : "context");

        return "I updated the draft, but I am missing one required detail.";
      }

      const completeDraft = nextDraft as Required<ContactDraft>;

      setContactDraft(completeDraft);

      return buildContactSummary(completeDraft);
    }

    return "I can collect a note for Reuben. What is your name?";
  }

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
      if (contactStep !== "idle" || isContactRequest(trimmed)) {
        const reply = await handleContactFlow(trimmed);

        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            content: reply
          }
        ]);
        return;
      }

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
      };

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.reply?.trim() || "The assistant could not answer right now."
        }
      ]);
    } catch {
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
      {!isOpen ? (
        <button
          aria-expanded={isOpen}
          className="aiWidgetToggle"
          onClick={() => setIsOpen(true)}
          type="button"
        >
          <span className="aiWidgetToggleLabel">{assistantName}</span>
          <span className="aiWidgetToggleMeta">Chat</span>
        </button>
      ) : null}
      {isOpen ? (
        <section aria-label="Chat with Reuben's Assistant" className="aiWidgetPanel">
          <div className="aiWidgetHeader">
            <div>
              <p className="footerLabel">Site assistant</p>
              <h3>{assistantName}</h3>
            </div>
            <button
              aria-label="Close chat"
              className="aiWidgetClose"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              ×
            </button>
          </div>
          <p className="aiWidgetNote">
            Ask about background, work themes, capabilities, or send a note.
          </p>
          <div className="aiPromptRow" aria-label="Suggested questions">
            {quickPrompts.map(({ label, prompt }) => (
              <button
                className="aiPromptChip"
                disabled={busy}
                key={label}
                onClick={() => void submitQuestion(prompt)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
          <div aria-live="polite" className="aiWidgetMessages" ref={messagesRef}>
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
              placeholder="Ask a question or type 'send Reuben a note'..."
              rows={2}
              value={input}
            />
            <button className="button" disabled={busy || !input.trim()} type="submit">
              {busy ? "Thinking..." : "Send"}
            </button>
          </form>
        </section>
      ) : null}
    </div>
  );
}
