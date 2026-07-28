"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TurnstileWidget } from "@/components/turnstile";
import type { ChatTopic } from "@/lib/interactive-resume-content";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

type ContactDraft = {
  inquiryType: string;
  name: string;
  email: string;
  organization: string;
  phone: string;
  message: string;
  goal: string;
  difficulty: string;
  users: string;
};

type ContactStatus = {
  state: "idle" | "editing" | "review" | "sending" | "sent" | "error";
  message: string;
};

const initialContactDraft: ContactDraft = {
  inquiryType: "Role or leadership opportunity",
  name: "",
  email: "",
  organization: "",
  phone: "",
  message: "",
  goal: "",
  difficulty: "",
  users: ""
};

const contactTypes = [
  "Role or leadership opportunity",
  "AI or software solution",
  "Process improvement",
  "Collaboration",
  "General inquiry"
] as const;

function isContactPrompt(text: string) {
  return /\b(contact|email|reach out|message reuben|send a note|hire|recruit|opportunity)\b/i.test(
    text
  );
}

function normalizePrompt(text: string) {
  return text
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9+#.\s/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function renderMessage(content: string) {
  return content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => {
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      const isList = lines.every((line) => /^[-*]\s+/.test(line));

      if (isList) {
        return (
          <ul className="chatBubbleList" key={`${block}-${index}`}>
            {lines.map((line) => (
              <li key={line}>{line.replace(/^[-*]\s+/, "")}</li>
            ))}
          </ul>
        );
      }

      return <p key={`${block}-${index}`}>{block}</p>;
    });
}

function buildContactMessage(draft: ContactDraft) {
  return [
    draft.message,
    draft.goal ? `\nGoal:\n${draft.goal}` : "",
    draft.difficulty
      ? `\nWhat is difficult or inefficient today:\n${draft.difficulty}`
      : "",
    draft.users ? `\nWho needs to use the solution:\n${draft.users}` : ""
  ]
    .filter(Boolean)
    .join("\n");
}

type InteractiveResumeProps = {
  topics: ChatTopic[];
  starterQuestions: readonly string[];
};

export function InteractiveResume({ topics, starterQuestions }: InteractiveResumeProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [recentTopicIds, setRecentTopicIds] = useState<string[]>([]);
  const [contactDraft, setContactDraft] = useState<ContactDraft>(initialContactDraft);
  const [contactStatus, setContactStatus] = useState<ContactStatus>({
    state: "idle",
    message: ""
  });
  const messagesRef = useRef<HTMLDivElement>(null);
  const contactFormRef = useRef<HTMLFormElement>(null);
  const contactStartedAt = useRef(Date.now());
  const loadedTopicRef = useRef<string | null>(null);

  const topicMap = useMemo(
    () => new Map(topics.map((topic) => [topic.id, topic])),
    [topics]
  );
  const activeTopic = activeTopicId ? topicMap.get(activeTopicId) : undefined;
  const selectedTopicFromUrl = searchParams.get("topic");

  useEffect(() => {
    const stored = window.localStorage.getItem("rmoddel-chat-recents");

    if (stored) {
      setRecentTopicIds(JSON.parse(stored) as string[]);
    }
  }, []);

  useEffect(() => {
    if (!selectedTopicFromUrl || loadedTopicRef.current === selectedTopicFromUrl) {
      return;
    }

    const topic = topicMap.get(selectedTopicFromUrl);

    if (topic) {
      loadTopic(topic, false);
    }
  }, [selectedTopicFromUrl, topicMap]);

  useEffect(() => {
    const messageList = messagesRef.current;

    if (!messageList) {
      return;
    }

    messageList.scrollTo({
      top: messageList.scrollHeight,
      behavior: "smooth"
    });
  }, [busy, messages.length, contactStatus.state]);

  function storeRecentTopic(topicId: string) {
    const next = [topicId, ...recentTopicIds.filter((id) => id !== topicId)].slice(0, 5);
    setRecentTopicIds(next);
    window.localStorage.setItem("rmoddel-chat-recents", JSON.stringify(next));
  }

  function loadTopic(topic: ChatTopic, updateUrl = true) {
    loadedTopicRef.current = topic.id;
    setActiveTopicId(topic.id);
    setMessages([{ role: "assistant", content: topic.openingAnswer }]);
    setInput("");
    setContactStatus({
      state: topic.id === "contact" ? "editing" : "idle",
      message: ""
    });
    setSidebarOpen(false);
    storeRecentTopic(topic.id);

    if (updateUrl) {
      router.push(`/chat?topic=${topic.id}`, { scroll: false });
    }
  }

  function newConversation() {
    loadedTopicRef.current = null;
    setActiveTopicId(null);
    setMessages([]);
    setInput("");
    setBusy(false);
    setContactDraft(initialContactDraft);
    setContactStatus({ state: "idle", message: "" });
    setSidebarOpen(false);
    router.push("/chat", { scroll: false });
  }

  function startContactFlow() {
    const contactTopic = topicMap.get("contact");

    if (contactTopic) {
      loadTopic(contactTopic);
    }

    setContactStatus({
      state: "editing",
      message: "Add the details, review the message, then send it."
    });
  }

  async function submitQuestion(question: string) {
    const trimmed = question.trim();

    if (!trimmed || busy) {
      return;
    }

    if (isContactPrompt(trimmed)) {
      setMessages((current) => [...current, { role: "user", content: trimmed }]);
      setInput("");
      startContactFlow();
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
          messages: nextMessages,
          topic: activeTopicId
        })
      });

      const data = (await response.json()) as { reply?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error || "I cannot answer from the résumé right now.");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            data.reply?.trim() ||
            "That detail is not in my résumé materials yet. You can contact me directly for the specifics."
        }
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? `${error.message} You can still view my résumé, learn about my background, or contact me directly.`
              : "I cannot answer from the résumé right now. You can still view my résumé, learn about my background, or contact me directly."
        }
      ]);
    } finally {
      setBusy(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitQuestion(input);
  }

  function handleComposerKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey || busy || !input.trim()) {
      return;
    }

    event.preventDefault();
    void submitQuestion(input);
  }

  function updateContactDraft(field: keyof ContactDraft, value: string) {
    setContactDraft((current) => ({ ...current, [field]: value }));
    setContactStatus((current) =>
      current.state === "error" ? { state: "editing", message: "" } : current
    );
  }

  function reviewContactMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!contactDraft.name || !contactDraft.email || !contactDraft.message) {
      setContactStatus({
        state: "error",
        message: "Name, email, and message are required before review."
      });
      return;
    }

    setContactStatus({
      state: "review",
      message: "This is the message I’ll receive. Review it, then use Send Message."
    });
  }

  async function sendContactMessage() {
    if (!contactDraft.name || !contactDraft.email || !contactDraft.message) {
      setContactStatus({
        state: "error",
        message: "Name, email, and message are required before sending."
      });
      return;
    }

    if (contactStatus.state !== "review") {
      setContactStatus({
        state: "error",
        message: "Review the message before sending."
      });
      return;
    }

    const form = contactFormRef.current;

    if (!form) {
      setContactStatus({
        state: "error",
        message: "Your message could not be sent. Your information has been preserved—please try again."
      });
      return;
    }

    const formData = new FormData(form);
    const turnstileToken = String(formData.get("cf-turnstile-response") || "").trim();

    if (!turnstileToken) {
      setContactStatus({
        state: "error",
        message: "Please complete the security verification."
      });
      window.turnstile?.reset();
      return;
    }

    formData.set("timeline", "");
    formData.set("budget", "Submitted through interactive résumé");

    setContactStatus({ state: "sending", message: "Sending..." });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData
      });

      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        message?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Your message could not be sent. Your information has been preserved—please try again."
        );
      }

      setContactStatus({
        state: "sent",
        message: "Message sent. I have your note and can reply directly."
      });
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "Sent. I have your note and can reply directly."
        }
      ]);
    } catch (error) {
      setContactStatus({
        state: "error",
        message:
          error instanceof Error
            ? `${error.message} Your message is still here so you can retry.`
            : "The message could not be sent. Your message is still here so you can retry."
      });
      window.turnstile?.reset();
    }
  }

  const visibleRecentTopics = recentTopicIds
    .map((id) => topicMap.get(id))
    .filter((topic): topic is ChatTopic => Boolean(topic));

  const showProcessFields =
    contactDraft.inquiryType === "Process improvement" ||
    contactDraft.inquiryType === "AI or software solution";
  const canSendContact =
    contactStatus.state === "review" &&
    Boolean(contactDraft.name && contactDraft.email && contactDraft.message);
  const latestUserQuestion =
    [...messages].reverse().find((message) => message.role === "user")?.content ?? "";
  const visibleFollowUps =
    activeTopic?.followUps.filter(
      (question) => normalizePrompt(question) !== normalizePrompt(latestUserQuestion)
    ) ?? [];

  return (
    <main className="chatShell">
      <button
        aria-expanded={sidebarOpen}
        className="chatMenuButton"
        onClick={() => setSidebarOpen(true)}
        type="button"
      >
        Topics
      </button>

      <aside className={`chatSidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="chatBrand">
          <a href="/">RM</a>
          <div>
            <strong>Reuben Moddel</strong>
            <span>Interactive Résumé</span>
          </div>
          <button
            aria-label="Close topics"
            className="chatDrawerClose"
            onClick={() => setSidebarOpen(false)}
            type="button"
          >
            ×
          </button>
        </div>

        <button className="newChatButton" onClick={newConversation} type="button">
          New Conversation
        </button>

        <nav className="topicNav" aria-label="Interactive résumé topics">
          {topics.map((topic) => (
            <button
              aria-current={activeTopicId === topic.id ? "page" : undefined}
              key={topic.id}
              onClick={() => loadTopic(topic)}
              type="button"
            >
              {topic.label}
            </button>
          ))}
        </nav>

        {visibleRecentTopics.length ? (
          <div className="recentTopics">
            <p className="footerLabel">Recent</p>
            {visibleRecentTopics.map((topic) => (
              <button key={topic.id} onClick={() => loadTopic(topic)} type="button">
                {topic.label}
              </button>
            ))}
          </div>
        ) : null}

        <div className="chatSidebarLinks">
          <a href="/resume">Résumé</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </div>
      </aside>

      <section className="chatMain" aria-label="Interactive résumé conversation">
        <header className="chatTopBar">
          <div>
            <p className="eyebrow">Interactive Résumé</p>
            <h1>{activeTopic?.label ?? "Ask Anything About My Background"}</h1>
          </div>
          <div className="chatTopActions">
            <a className="button buttonSecondary smallButton" href="/resume">
              View Résumé
            </a>
            <a className="button smallButton" href="/contact">
              Contact Me
            </a>
          </div>
        </header>

        <div className="chatMessages" ref={messagesRef}>
          {!messages.length ? (
            <section className="chatWelcome">
              <p className="sectionIntro">
                Explore my experience, leadership approach, skills,
                projects, AI work, values, or the kinds of problems I am best
                equipped to solve.
              </p>
              <article className="introCard">
                <p>
                  I bring 15+ years across business systems,
                  operations, software delivery, process improvement, and team
                  leadership. I combine human understanding and practical
                  execution with AI-enabled software to improve cumbersome
                  real-world processes.
                </p>
              </article>
              <div className="starterGrid" aria-label="Starter questions">
                {starterQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => void submitQuestion(question)}
                    type="button"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          {messages.map((message, index) => (
            <article className={`chatBubble ${message.role}`} key={`${message.role}-${index}`}>
              {renderMessage(message.content)}
            </article>
          ))}

          {busy ? (
            <article className="chatBubble assistant" aria-live="polite">
              <p>Thinking...</p>
            </article>
          ) : null}

          {contactStatus.state !== "idle" ? (
            <section className="contactFlowPanel" aria-label="Contact me">
              <div className="sectionHeading compactHeading">
                <p className="eyebrow">Contact Me</p>
                <h2>Send me a message.</h2>
              </div>
              <form onSubmit={reviewContactMessage} ref={contactFormRef}>
                <input type="hidden" name="startedAt" value={contactStartedAt.current} />
                <div className="hiddenField" aria-hidden="true">
                  <label htmlFor="chatCompanyWebsite">Company website</label>
                  <input
                    autoComplete="off"
                    id="chatCompanyWebsite"
                    name="companyWebsite"
                    tabIndex={-1}
                    type="text"
                  />
                </div>
                <div className="grid twoGrid">
                  <label>
                    What would you like to discuss?
                    <select
                      name="inquiryType"
                      value={contactDraft.inquiryType}
                      onChange={(event) =>
                        updateContactDraft("inquiryType", event.target.value)
                      }
                    >
                      {contactTypes.map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Name
                    <input
                      autoComplete="name"
                      name="name"
                      value={contactDraft.name}
                      onChange={(event) => updateContactDraft("name", event.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Email
                    <input
                      autoComplete="email"
                      name="email"
                      type="email"
                      value={contactDraft.email}
                      onChange={(event) => updateContactDraft("email", event.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Organization <span>optional</span>
                    <input
                      autoComplete="organization"
                      name="organization"
                      value={contactDraft.organization}
                      onChange={(event) =>
                        updateContactDraft("organization", event.target.value)
                      }
                    />
                  </label>
                  <label>
                    Phone <span>optional</span>
                    <input
                      autoComplete="tel"
                      name="phone"
                      type="tel"
                      value={contactDraft.phone}
                      onChange={(event) => updateContactDraft("phone", event.target.value)}
                    />
                  </label>
                </div>

                <label>
                  Message
                  <textarea
                    name="message"
                    rows={4}
                    value={contactDraft.message}
                    onChange={(event) => updateContactDraft("message", event.target.value)}
                    required
                  />
                </label>

                {showProcessFields ? (
                  <div className="grid threeGrid">
                    <label>
                      What are you trying to accomplish?
                      <textarea
                        name="goal"
                        rows={3}
                        value={contactDraft.goal}
                        onChange={(event) => updateContactDraft("goal", event.target.value)}
                      />
                    </label>
                    <label>
                      What is difficult or inefficient today?
                      <textarea
                        name="difficulty"
                        rows={3}
                        value={contactDraft.difficulty}
                        onChange={(event) =>
                          updateContactDraft("difficulty", event.target.value)
                        }
                      />
                    </label>
                    <label>
                      Who needs to use the solution?
                      <textarea
                        name="users"
                        rows={3}
                        value={contactDraft.users}
                        onChange={(event) => updateContactDraft("users", event.target.value)}
                      />
                    </label>
                  </div>
                ) : null}

                {canSendContact ? (
                  <dl className="contactSummary">
                    <div>
                      <dt>Topic</dt>
                      <dd>{contactDraft.inquiryType}</dd>
                    </div>
                    <div>
                      <dt>Name</dt>
                      <dd>{contactDraft.name}</dd>
                    </div>
                    <div>
                      <dt>Email</dt>
                      <dd>{contactDraft.email}</dd>
                    </div>
                    <div>
                      <dt>Organization</dt>
                      <dd>{contactDraft.organization || "Not provided"}</dd>
                    </div>
                    <div>
                      <dt>Phone</dt>
                      <dd>{contactDraft.phone || "Not provided"}</dd>
                    </div>
                    <div>
                      <dt>Message</dt>
                      <dd>{buildContactMessage(contactDraft)}</dd>
                    </div>
                  </dl>
                ) : null}

                <div className="contactReview">
                  <p
                    className={
                      contactStatus.state === "sent" || contactStatus.state === "error"
                        ? contactStatus.state
                        : undefined
                    }
                  >
                    {contactStatus.message || "Review the details before sending."}
                  </p>
                  {canSendContact ? <TurnstileWidget action="contact" /> : null}
                  <div className="contactReviewActions">
                    <button className="button buttonSecondary smallButton" type="submit">
                      Review Message
                    </button>
                    <button
                      className="button smallButton"
                      disabled={contactStatus.state === "sending" || !canSendContact}
                      onClick={() => void sendContactMessage()}
                      type="button"
                    >
                      {contactStatus.state === "sending" ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </div>
              </form>
            </section>
          ) : null}
        </div>

        <div className="chatContextPanel">
          {visibleFollowUps.length ? (
            <div className="followUpRow" aria-label="Suggested follow-up questions">
              {visibleFollowUps.map((question) => (
                <button
                  disabled={busy}
                  key={question}
                  onClick={() => void submitQuestion(question)}
                  type="button"
                >
                  {question}
                </button>
              ))}
            </div>
          ) : null}

          {activeTopic?.links.length ? (
            <div className="contextLinks" aria-label="Relevant links">
              {activeTopic.links.map((link) => (
                <a href={link.href} key={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <form className="chatComposer" onSubmit={handleSubmit}>
          <label>
            Ask a question
            <textarea
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleComposerKeyDown}
              placeholder="Ask about experience, leadership, AI, GPS, projects, or fit..."
              rows={2}
              value={input}
            />
          </label>
          <button className="button" disabled={busy || !input.trim()} type="submit">
            Send
          </button>
          <p className="chatPrivacyNote">
            Please avoid confidential or sensitive details. Questions may be
            processed by an AI service to generate a response. <a href="/privacy">Privacy</a>
          </p>
        </form>
      </section>
    </main>
  );
}
