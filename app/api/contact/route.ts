import { NextRequest, NextResponse } from "next/server";
import { createContactEmail, type ContactPayload } from "@/lib/contact-email";
import {
  checkContactEmailSuccessLimit,
  checkContactIpAttemptLimit,
  getContactClientIp,
  recordContactEmailSuccess
} from "@/lib/security/contact-rate-limit";
import { verifyTurnstile } from "@/lib/security/verify-turnstile";

export const runtime = "nodejs";

type RelayResponse = {
  ok?: boolean;
  error?: string;
  message?: string;
};

type ContactSubmission = {
  payload: ContactPayload;
  honeypot: string;
  startedAtRaw: string;
  token: string;
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
      "Your message could not be sent. Your information has been preserved—please try again."
    );
  }

  return value;
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

function contactJson(
  body: Record<string, unknown>,
  init?: ResponseInit
) {
  return NextResponse.json(body, init);
}

function clientError(message: string, status = 400, code?: string) {
  return contactJson(
    {
      ok: false,
      error: message,
      message,
      ...(code ? { code } : {})
    },
    { status }
  );
}

function rateLimitResponse(retryAfter: number) {
  return contactJson(
    {
      ok: false,
      error: "Too many submission attempts. Please wait a few minutes and try again.",
      message: "Too many submission attempts. Please wait a few minutes and try again."
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter)
      }
    }
  );
}

function contactErrorResponse(error: unknown) {
  const routeError =
    error instanceof ContactRouteError
      ? error
      : new ContactRouteError(
          error instanceof Error ? error.message : "Unknown contact send failure.",
          502,
          "Your message could not be sent. Your information has been preserved—please try again."
        );

  console.error("[contact] send failure", {
    message: routeError.message,
    status: routeError.status,
    name: routeError.name,
    config: getContactConfigSnapshot()
  });

  return clientError(routeError.clientMessage, routeError.status);
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

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function clean(value: unknown, maxLength: number) {
  return String(value || "").trim().slice(0, maxLength);
}

function getFormString(formData: FormData, field: string, maxLength = 6_000) {
  const value = formData.get(field);

  return typeof value === "string" ? clean(value, maxLength) : "";
}

function buildProjectMessage(input: {
  message: string;
  goal?: string;
  difficulty?: string;
  users?: string;
}) {
  return [
    input.message,
    input.goal ? `\nGoal:\n${input.goal}` : "",
    input.difficulty ? `\nCurrent friction:\n${input.difficulty}` : "",
    input.users ? `\nUsers:\n${input.users}` : ""
  ]
    .filter(Boolean)
    .join("\n")
    .trim()
    .slice(0, 6_000);
}

function normalizeFromFormData(formData: FormData): ContactSubmission {
  const message = getFormString(formData, "message", 5_000);
  const project =
    getFormString(formData, "project", 6_000) ||
    buildProjectMessage({
      message,
      goal: getFormString(formData, "goal", 1_500),
      difficulty: getFormString(formData, "difficulty", 1_500),
      users: getFormString(formData, "users", 1_500)
    });
  const inquiryType =
    getFormString(formData, "inquiryType", 120) ||
    getFormString(formData, "helpType", 120) ||
    "General inquiry";

  return {
    payload: {
      name: getFormString(formData, "name", 120),
      email: getFormString(formData, "email", 160),
      phone: getFormString(formData, "phone", 80),
      organization: getFormString(formData, "organization", 160),
      helpType: inquiryType,
      project,
      timeline: getFormString(formData, "timeline", 200),
      budget:
        getFormString(formData, "budget", 500) ||
        getFormString(formData, "notes", 500)
    },
    honeypot:
      getFormString(formData, "companyWebsite", 300) ||
      getFormString(formData, "website", 300),
    startedAtRaw: getFormString(formData, "startedAt", 40),
    token: getFormString(formData, "cf-turnstile-response", 2_048)
  };
}

function normalizeFromJson(body: Record<string, unknown>): ContactSubmission {
  const message = clean(body.message, 5_000);
  const project =
    clean(body.project, 6_000) ||
    buildProjectMessage({
      message,
      goal: clean(body.goal, 1_500),
      difficulty: clean(body.difficulty, 1_500),
      users: clean(body.users, 1_500)
    });

  return {
    payload: {
      name: clean(body.name, 120),
      email: clean(body.email, 160),
      phone: clean(body.phone, 80),
      organization: clean(body.organization, 160),
      helpType:
        clean(body.inquiryType, 120) ||
        clean(body.helpType, 120) ||
        "General inquiry",
      project,
      timeline: clean(body.timeline, 200),
      budget: clean(body.budget, 500) || clean(body.notes, 500)
    },
    honeypot: clean(body.companyWebsite, 300) || clean(body.website, 300),
    startedAtRaw: clean(body.startedAt, 40),
    token:
      clean(body["cf-turnstile-response"], 2_048) ||
      clean(body.turnstileToken, 2_048)
  };
}

async function readSubmission(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";

  if (
    contentType.includes("multipart/form-data") ||
    contentType.includes("application/x-www-form-urlencoded")
  ) {
    return normalizeFromFormData(await request.formData());
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  return normalizeFromJson(body);
}

function validatePayload(payload: ContactPayload) {
  const normalizedEmail = payload.email.toLowerCase();

  if (
    payload.name.length < 2 ||
    payload.name.length > 100 ||
    payload.project.length < 10 ||
    payload.project.length > 5_000
  ) {
    return {
      ok: false as const,
      response: clientError("Please check the form and try again.")
    };
  }

  if (!payload.helpType) {
    return {
      ok: false as const,
      response: clientError("Please check the form and try again.")
    };
  }

  if (!isValidEmail(normalizedEmail)) {
    return {
      ok: false as const,
      response: clientError("Please enter a valid email address.")
    };
  }

  return {
    ok: true as const,
    payload: {
      ...payload,
      email: normalizedEmail
    }
  };
}

async function sendContactMessage(payload: ContactPayload) {
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
    cache: "no-store",
    signal: AbortSignal.timeout(10_000)
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
      "Your message could not be sent. Your information has been preserved—please try again."
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const submission = await readSubmission(request);

    if (submission.honeypot) {
      return contactJson({ ok: true });
    }

    const ip = getContactClientIp(request);
    const ipLimit = await checkContactIpAttemptLimit(ip);

    if (!ipLimit.allowed) {
      return rateLimitResponse(ipLimit.retryAfter);
    }

    if (!submission.token) {
      return clientError(
        "Please complete the security verification.",
        400,
        "BOT_TOKEN_MISSING"
      );
    }

    const verified = await verifyTurnstile({
      token: submission.token,
      ip,
      expectedAction: "contact"
    });

    if (!verified) {
      return clientError(
        "We couldn’t verify the submission. Please try again.",
        400,
        "BOT_VERIFICATION_FAILED"
      );
    }

    const startedAt = Number(submission.startedAtRaw);
    const elapsed = Date.now() - startedAt;

    if (!Number.isFinite(elapsed) || elapsed < 2_000) {
      return contactJson({ ok: true });
    }

    const validation = validatePayload(submission.payload);

    if (!validation.ok) {
      return validation.response;
    }

    const emailLimit = await checkContactEmailSuccessLimit(validation.payload.email);

    if (!emailLimit.allowed) {
      return rateLimitResponse(emailLimit.retryAfter);
    }

    await sendContactMessage(validation.payload);
    await recordContactEmailSuccess(validation.payload.email);

    return contactJson({ ok: true });
  } catch (error) {
    return contactErrorResponse(error);
  }
}
