"use client";

import { useRef, useState } from "react";
import { TurnstileWidget } from "@/components/turnstile";

type FormState = {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
};

const initialState: FormState = {
  status: "idle",
  message: ""
};

const inquiryTypes = [
  "Role or leadership opportunity",
  "AI or software solution",
  "Process improvement",
  "Collaboration",
  "General inquiry"
] as const;

function getText(formData: FormData, name: string) {
  return String(formData.get(name) || "").trim();
}

export function ContactForm() {
  const startedAt = useRef(Date.now());
  const [formState, setFormState] = useState<FormState>(initialState);
  const [inquiryType, setInquiryType] = useState<(typeof inquiryTypes)[number]>(
    inquiryTypes[0]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const turnstileToken = getText(formData, "cf-turnstile-response");

    if (!turnstileToken) {
      setFormState({
        status: "error",
        message: "Please complete the security verification."
      });
      window.turnstile?.reset();
      return;
    }

    setFormState({
      status: "submitting",
      message: "Sending..."
    });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData
      });

      const data = (await response.json()) as {
        ok?: boolean;
        sent?: boolean;
        error?: string;
        message?: string;
      };

      if (!response.ok || !data.ok || data.sent !== true) {
        throw new Error(
          data.message ||
            data.error ||
            "Your message could not be sent. Your information has been preserved—please try again."
        );
      }

      form.reset();
      setInquiryType(inquiryTypes[0]);
      setFormState({
        status: "success",
        message: "Thanks — your message was sent."
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Your message could not be sent. Your information has been preserved—please try again.";

      setFormState({
        status: "error",
        message
      });
      window.turnstile?.reset();
    }
  }

  const showProcessQuestions =
    inquiryType === "Process improvement" || inquiryType === "AI or software solution";

  return (
    <form className="contactForm" onSubmit={handleSubmit}>
      <input type="hidden" name="startedAt" value={startedAt.current} />

      <div className="hiddenField" aria-hidden="true">
        <label htmlFor="companyWebsite">Company website</label>
        <input
          autoComplete="off"
          id="companyWebsite"
          name="companyWebsite"
          tabIndex={-1}
          type="text"
        />
      </div>

      <label>
        Name
        <input autoComplete="name" name="name" type="text" required />
      </label>

      <label>
        Email
        <input autoComplete="email" name="email" type="email" required />
      </label>

      <label>
        Phone <span>optional</span>
        <input autoComplete="tel" name="phone" type="tel" />
      </label>

      <label>
        Organization <span>optional</span>
        <input autoComplete="organization" name="organization" type="text" />
      </label>

      <label>
        Inquiry type
        <select
          name="inquiryType"
          onChange={(event) =>
            setInquiryType(event.target.value as (typeof inquiryTypes)[number])
          }
          value={inquiryType}
        >
          {inquiryTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </label>

      <label>
        Message
        <textarea
          name="message"
          rows={5}
          required
          placeholder="Role, project, collaboration, process, or reason for reaching out"
        />
      </label>

      {showProcessQuestions ? (
        <div className="processFields">
          <label>
            What are you trying to accomplish?
            <textarea name="goal" rows={3} />
          </label>
          <label>
            What is difficult or inefficient today?
            <textarea name="difficulty" rows={3} />
          </label>
          <label>
            Who needs to use the solution?
            <textarea name="users" rows={3} />
          </label>
        </div>
      ) : null}

      <label>
        Notes <span>optional</span>
        <input name="notes" type="text" />
      </label>

      <TurnstileWidget action="contact" />

      <button className="button" type="submit" disabled={formState.status === "submitting"}>
        {formState.status === "submitting" ? "Sending..." : "Send Message"}
      </button>

      <p className={`formNotice ${formState.status}`} aria-live="polite" role="status">
        {formState.message ||
          "Please avoid confidential or sensitive details. The privacy page has the full policy."}
      </p>
    </form>
  );
}
