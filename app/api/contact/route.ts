import { NextResponse } from "next/server";
import { createContactEmail, type ContactPayload } from "@/lib/contact-email";

type RelayResponse = {
  ok?: boolean;
  error?: string;
  message?: string;
};

class ContactRouteError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly clientMessage: string
  ) {
    super(message);
    this.name = "ContactRouteError";
  }
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

type ContactEnvName = "EMAIL_API_URL" | "EMAIL_API_SECRET" | "EMAIL_FROM" | "CONTACT_TO";

function getContactEnv(name: ContactEnvName) {
  const values: Record<ContactEnvName, string | undefined> = {
    EMAIL_API_URL: process.env.EMAIL_API_URL,
    EMAIL_API_SECRET: process.env.EMAIL_API_SECRET,
    EMAIL_FROM: process.env.EMAIL_FROM,
    CONTACT_TO: process.env.CONTACT_TO
  };

  return values[name];
}

function requiredEnv(name: ContactEnvName) {
  const value = getContactEnv(name);

  if (!value) {
    throw new ContactRouteError(
      `Missing required contact environment variable: ${name}`,
      500,
      "Contact email is not configured right now."
    );
  }

  return value;
}

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function getContactConfigSnapshot() {
  let apiUrl = "missing";
  const emailApiUrl = process.env.EMAIL_API_URL;
  const emailApiSecret = process.env.EMAIL_API_SECRET;
  const emailFrom = process.env.EMAIL_FROM;
  const contactTo = process.env.CONTACT_TO;

  try {
    const url = emailApiUrl ? new URL(emailApiUrl) : undefined;
    apiUrl = url ? `${url.origin}${url.pathname}` : "missing";
  } catch {
    apiUrl = "invalid-url";
  }

  return {
    apiUrl,
    hasSecret: Boolean(emailApiSecret),
    secretLength: emailApiSecret?.length ?? 0,
    from: emailFrom || "missing",
    to: contactTo || "missing"
  };
}

function contactErrorResponse(error: unknown) {
  const routeError =
    error instanceof ContactRouteError
      ? error
      : new ContactRouteError(
          error instanceof Error ? error.message : "Unknown contact send failure.",
          502,
          "The email service could not send your message right now."
        );

  console.error("[contact] send failure", {
    message: routeError.message,
    status: routeError.status,
    name: routeError.name,
    config: getContactConfigSnapshot()
  });

  return NextResponse.json(
    {
      ok: false,
      error: routeError.clientMessage,
      ...(isProduction() ? {} : { detail: routeError.message })
    },
    { status: routeError.status }
  );
}

async function readRelayResponse(response: Response) {
  const body = await response.text();
  let data: RelayResponse = {};

  try {
    data = body ? (JSON.parse(body) as RelayResponse) : {};
  } catch {
    data = {};
  }

  return {
    data,
    bodyPreview: body.slice(0, 500)
  };
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

    const { data: relayData, bodyPreview } = await readRelayResponse(relayResponse).catch(
      (error) => ({
        data: {} as RelayResponse,
        bodyPreview: error instanceof Error ? error.message : "Could not read relay response."
      })
    );

    if (!relayResponse.ok || relayData.ok === false) {
      const relayRequestId =
        relayResponse.headers.get("apigw-requestid") ??
        relayResponse.headers.get("x-amzn-requestid") ??
        "unknown-request-id";

      throw new ContactRouteError(
        `Email relay request failed with ${relayResponse.status} (${relayRequestId}): ${
          relayData.error || relayData.message || bodyPreview || "Relay did not return ok."
        }`,
        502,
        "The email service could not send your message right now."
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return contactErrorResponse(error);
  }
}
