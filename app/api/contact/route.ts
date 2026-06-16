import { NextResponse } from "next/server";
import { createContactEmail, type ContactPayload } from "@/lib/contact-email";

type RelayResponse = {
  ok?: boolean;
  error?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function requiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function normalizePayload(body: unknown): ContactPayload {
  const input = body as Record<string, unknown>;

  return {
    name: String(input.name || "").trim(),
    email: String(input.email || "").trim(),
    phone: String(input.phone || "").trim(),
    helpType: String(input.helpType || "").trim(),
    project: String(input.project || "").trim(),
    timeline: String(input.timeline || "").trim(),
    budget: String(input.budget || "").trim()
  };
}

export async function POST(request: Request) {
  try {
    const payload = normalizePayload(await request.json());

    if (!payload.name || !payload.email || !payload.helpType || !payload.project) {
      return NextResponse.json(
        { ok: false, error: "Please fill in the required fields." },
        { status: 400 }
      );
    }

    if (!isValidEmail(payload.email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const apiUrl = requiredEnv("EMAIL_API_URL");
    const apiSecret = requiredEnv("EMAIL_API_SECRET");
    const from = requiredEnv("EMAIL_FROM");
    const to = requiredEnv("CONTACT_TO");
    const { subject, text, html } = createContactEmail(payload);

    const relayResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiSecret}`
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        text,
        html,
        replyTo: payload.email
      }),
      cache: "no-store"
    });

    const relayData = (await relayResponse.json().catch(() => ({}))) as RelayResponse;

    if (!relayResponse.ok || !relayData.ok) {
      throw new Error(relayData.error || "Email relay request failed.");
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] send failure", error);

    return NextResponse.json(
      { ok: false, error: "Could not send your message right now." },
      { status: 500 }
    );
  }
}
