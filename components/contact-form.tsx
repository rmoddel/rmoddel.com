"use client";

import { useState } from "react";

type FormState = {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
};

const initialState: FormState = {
  status: "idle",
  message: ""
};

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>(initialState);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setFormState({
      status: "submitting",
      message: "Sending..."
    });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          helpType: formData.get("helpType"),
          project: formData.get("project"),
          timeline: formData.get("timeline"),
          budget: formData.get("budget")
        })
      });

      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Failed to send your message.");
      }

      form.reset();
      setFormState({
        status: "success",
        message: "Message sent. I’ll follow up by email."
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to send your message.";

      setFormState({
        status: "error",
        message
      });
    }
  }

  return (
    <form className="contactForm" onSubmit={handleSubmit}>
      <label>
        Name
        <input name="name" type="text" placeholder="Your name" required />
      </label>
      <label>
        Email
        <input name="email" type="email" placeholder="you@example.com" required />
      </label>
      <label>
        Phone
        <input name="phone" type="tel" placeholder="Optional" />
      </label>
      <label>
        Reason for reaching out
        <select name="helpType" defaultValue="Job opportunity">
          <option>Job opportunity</option>
          <option>Recruiting conversation</option>
          <option>Consulting or service inquiry</option>
          <option>Collaboration</option>
          <option>Operations or process question</option>
          <option>Other</option>
        </select>
      </label>
      <label>
        Briefly describe the context
        <textarea
          name="project"
          rows={5}
          placeholder="Role, project, operational need, team context, or reason for reaching out"
          required
        />
      </label>
      <label>
        Timing
        <input name="timeline" type="text" placeholder="e.g. This month, this quarter, flexible" />
      </label>
      <label>
        Compensation, budget, or notes
        <input name="budget" type="text" placeholder="Optional context" />
      </label>
      <button className="button" type="submit" disabled={formState.status === "submitting"}>
        {formState.status === "submitting" ? "Sending..." : "Send Message"}
      </button>
      <p
        className={`formNotice ${formState.status}`}
        aria-live="polite"
        role="status"
      >
        {formState.message || "Share enough context for me to understand the fit."}
      </p>
    </form>
  );
}
