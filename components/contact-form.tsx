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
        What do you need help with?
        <select name="helpType" defaultValue="Website">
          <option>Website</option>
          <option>Ad or campaign</option>
          <option>Logo or branding</option>
          <option>Writing or messaging</option>
          <option>AI workflow</option>
          <option>App idea</option>
          <option>Other</option>
        </select>
      </label>
      <label>
        Briefly describe the project
        <textarea
          name="project"
          rows={5}
          placeholder="What are you trying to create?"
          required
        />
      </label>
      <label>
        Timeline
        <input name="timeline" type="text" placeholder="e.g. This month" />
      </label>
      <label>
        Budget range
        <input name="budget" type="text" placeholder="e.g. $500-$2,500" />
      </label>
      <button className="button" type="submit" disabled={formState.status === "submitting"}>
        {formState.status === "submitting" ? "Sending..." : "Start a Project"}
      </button>
      <p
        className={`formNotice ${formState.status}`}
        aria-live="polite"
        role="status"
      >
        {formState.message || "Tell me what you are trying to create."}
      </p>
    </form>
  );
}
