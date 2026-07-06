"use client";

import Script from "next/script";
import { useCallback, useMemo, useRef, useState, type CSSProperties } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type TokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
};

type TokenClient = {
  requestAccessToken: (overrideConfig?: { prompt?: "" | "consent" | "select_account" }) => void;
};

type TokenClientConfig = {
  client_id: string;
  scope: string;
  callback: (response: TokenResponse) => void;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: TokenClientConfig) => TokenClient;
        };
      };
    };
  }
}

const GMAIL_SCOPE = "https://mail.google.com/";
const GMAIL_MESSAGES_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages";
const MAX_PER_CLICK = 500;
const BATCH_SIZE = 100;

const clientId = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID ?? "";

const lastUpdated = "July 1, 2026";

const buttonStyle: CSSProperties = {
  border: 0,
  borderRadius: "999px",
  cursor: "pointer",
  fontWeight: 700,
  padding: "0.9rem 1.2rem",
  marginTop: "0.75rem"
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "0.9rem 1rem",
  borderRadius: "0.75rem",
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.04)",
  color: "inherit",
  margin: "0.75rem 0"
};

async function readErrorBody(response: Response) {
  const text = await response.text();

  try {
    const json = JSON.parse(text);
    return json?.error?.message || text || response.statusText;
  } catch {
    return text || response.statusText;
  }
}

async function gmailFetch<T>(url: string, accessToken: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${accessToken}`);

  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...init,
    headers
  });

  if (!response.ok) {
    const message = await readErrorBody(response);
    throw new Error(`Gmail API ${response.status}: ${message}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : ({} as T);
}

async function listTrashMessageIds(accessToken: string, max: number) {
  const ids: string[] = [];
  let pageToken: string | undefined;

  do {
    const remaining = max - ids.length;
    const params = new URLSearchParams({
      includeSpamTrash: "true",
      maxResults: String(Math.min(500, remaining)),
      fields: "messages(id),nextPageToken"
    });

    params.append("labelIds", "TRASH");

    if (pageToken) {
      params.set("pageToken", pageToken);
    }

    const data = await gmailFetch<{
      messages?: Array<{ id: string }>;
      nextPageToken?: string;
    }>(`${GMAIL_MESSAGES_URL}?${params.toString()}`, accessToken, {
      method: "GET"
    });

    if (data.messages?.length) {
      ids.push(...data.messages.map(message => message.id));
    }

    pageToken = data.nextPageToken;
  } while (pageToken && ids.length < max);

  return ids.slice(0, max);
}

async function permanentlyDeleteBatch(accessToken: string, ids: string[]) {
  await gmailFetch(`${GMAIL_MESSAGES_URL}/batchDelete`, accessToken, {
    method: "POST",
    body: JSON.stringify({ ids })
  });
}

function chunkIds(ids: string[], size: number) {
  const chunks: string[][] = [];

  for (let i = 0; i < ids.length; i += size) {
    chunks.push(ids.slice(i, i + size));
  }

  return chunks;
}

export default function GmailTrashPurgePage() {
  const tokenClientRef = useRef<TokenClient | null>(null);
  const tokenResolverRef = useRef<((token: string) => void) | null>(null);
  const tokenRejecterRef = useRef<((error: Error) => void) | null>(null);

  const [gisLoaded, setGisLoaded] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [status, setStatus] = useState<"idle" | "connecting" | "ready" | "deleting" | "done" | "error">("idle");
  const [statusText, setStatusText] = useState("Connect your Google account, then delete only messages already in Trash.");
  const [deletedCount, setDeletedCount] = useState(0);
  const [foundCount, setFoundCount] = useState(0);

  const canDelete = useMemo(() => {
    return Boolean(clientId && gisLoaded && confirmText === "DELETE" && status !== "deleting");
  }, [confirmText, gisLoaded, status]);

  const initializeGoogleAuth = useCallback(() => {
    if (!clientId) {
      setStatus("error");
      setStatusText("Missing NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID.");
      return;
    }

    const oauth = window.google?.accounts?.oauth2;

    if (!oauth) {
      setStatus("error");
      setStatusText("Google Identity Services did not load.");
      return;
    }

    tokenClientRef.current = oauth.initTokenClient({
      client_id: clientId,
      scope: GMAIL_SCOPE,
      callback: response => {
        const resolver = tokenResolverRef.current;
        const rejecter = tokenRejecterRef.current;

        tokenResolverRef.current = null;
        tokenRejecterRef.current = null;

        if (response.error) {
          const message = response.error_description || response.error;
          rejecter?.(new Error(message));
          return;
        }

        if (!response.access_token) {
          rejecter?.(new Error("Google did not return an access token."));
          return;
        }

        setAccessToken(response.access_token);
        resolver?.(response.access_token);
      }
    });

    setGisLoaded(true);
    setStatus("idle");
    setStatusText("Ready. Sign in once, then the delete button will permanently purge Trash.");
  }, []);

  const requestAccessToken = useCallback(
    (forceConsent = false) => {
      return new Promise<string>((resolve, reject) => {
        if (!tokenClientRef.current) {
          reject(new Error("Google sign-in is not ready yet."));
          return;
        }

        tokenResolverRef.current = resolve;
        tokenRejecterRef.current = reject;

        tokenClientRef.current.requestAccessToken({
          prompt: forceConsent || !accessToken ? "consent" : ""
        });
      });
    },
    [accessToken]
  );

  const handleConnect = useCallback(async () => {
    try {
      setStatus("connecting");
      setStatusText("Opening Google permission prompt...");
      await requestAccessToken(true);
      setStatus("ready");
      setStatusText("Connected. This page will not display message subjects, senders, snippets, or bodies.");
    } catch (error) {
      setStatus("error");
      setStatusText(error instanceof Error ? error.message : "Could not connect to Google.");
    }
  }, [requestAccessToken]);

  const handleDeleteForever = useCallback(async () => {
    setStatus("deleting");
    setDeletedCount(0);
    setFoundCount(0);
    setStatusText("Requesting Gmail access token...");

    try {
      const token = accessToken || (await requestAccessToken(false));

      setStatusText("Finding message IDs in Trash only. No message content is being loaded.");
      const ids = await listTrashMessageIds(token, MAX_PER_CLICK);
      setFoundCount(ids.length);

      if (ids.length === 0) {
        setStatus("done");
        setStatusText("Trash is already empty. Nothing was permanently deleted.");
        return;
      }

      const batches = chunkIds(ids, BATCH_SIZE);
      let deleted = 0;

      for (const batch of batches) {
        setStatusText(`Permanently deleting batch ${Math.floor(deleted / BATCH_SIZE) + 1} of ${batches.length}...`);
        await permanentlyDeleteBatch(token, batch);
        deleted += batch.length;
        setDeletedCount(deleted);
      }

      setStatus("done");
      setStatusText(`Done. Permanently deleted ${deleted} message${deleted === 1 ? "" : "s"} from Trash.`);
    } catch (error) {
      setStatus("error");
      setStatusText(error instanceof Error ? error.message : "Delete failed.");
    }
  }, [accessToken, requestAccessToken]);

  return (
    <main className="pageShell">
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={initializeGoogleAuth} />

      <SiteHeader />

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Gmail Trash Purge</p>
          <h1>Delete Trash Forever</h1>
        </div>

        <p className="sectionIntro">
          One-button Gmail cleanup for messages that have already been moved to Trash by your Gmail filters.
          This page requests message IDs from Trash only, then permanently deletes those IDs. It does not render
          email subjects, senders, snippets, images, or bodies.
        </p>

        <div className="twoColumn">
          <div className="contentCard">
            <p className="microLabel">Last Updated</p>
            <h3>{lastUpdated}</h3>
            <p>
              Built as a client-side page using Google Identity Services and the Gmail API. The access token is
              kept in browser memory for this session and is not stored by this page.
            </p>
          </div>

          <div className="contentCard">
            <p className="microLabel">Scope</p>
            <h3>Trash only</h3>
            <p>
              Each click permanently deletes up to {MAX_PER_CLICK} messages that currently have Gmail&apos;s Trash
              label. Click again if there are more than {MAX_PER_CLICK} messages waiting in Trash.
            </p>
          </div>
        </div>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Delete Control</p>
          <h2>Permanent deletion</h2>
        </div>

        <div className="grid twoGrid">
          <article className="contentCard">
            <h3>1. Connect Gmail</h3>
            <p>
              Sign in with the Google account whose Trash you want to purge. Google will ask for Gmail permission
              because permanent deletion requires full Gmail access.
            </p>
            <button
              type="button"
              onClick={handleConnect}
              disabled={!gisLoaded || status === "deleting"}
              style={{ ...buttonStyle, opacity: !gisLoaded || status === "deleting" ? 0.55 : 1 }}
            >
              {accessToken ? "Reconnect Google" : "Connect Google"}
            </button>
          </article>

          <article className="contentCard">
            <h3>2. Confirm and delete</h3>
            <p>
              Type <strong>DELETE</strong>, then press the button. This bypasses Gmail&apos;s recoverable Trash state
              and permanently deletes matching Trash messages.
            </p>
            <input
              aria-label="Type DELETE to enable permanent deletion"
              value={confirmText}
              onChange={event => setConfirmText(event.target.value)}
              placeholder="Type DELETE"
              style={inputStyle}
            />
            <button
              type="button"
              onClick={handleDeleteForever}
              disabled={!canDelete}
              style={{ ...buttonStyle, opacity: canDelete ? 1 : 0.55 }}
            >
              Delete Trash Forever
            </button>
          </article>
        </div>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Status</p>
          <h2>{status === "error" ? "Action needed" : "Current run"}</h2>
        </div>

        <div className="grid twoGrid">
          <article className="contentCard">
            <p className="microLabel">Messages found in Trash</p>
            <h3>{foundCount}</h3>
            <p>Only Gmail message IDs are requested. This page intentionally does not display any email content.</p>
          </article>

          <article className="contentCard">
            <p className="microLabel">Permanently deleted</p>
            <h3>{deletedCount}</h3>
            <p>{statusText}</p>
          </article>
        </div>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Resume Download</p>
          <h2>Protected product leadership version</h2>
        </div>

        <div className="contentCard">
          <p>
            This is the tailored product operations and technical leadership resume.
            It stays behind this protected page instead of being shown publicly.
          </p>
          <a className="button buttonGhost smallButton resumeDownloadButton" href="/resume-product.pdf">
            Download Product Resume
          </a>
        </div>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Resume Download</p>
          <h2>Customer success and operations version</h2>
        </div>

        <div className="contentCard">
          <p>
            This version is tailored for customer success, healthcare workflow, and technical
            operations roles while staying grounded in the experience shown in the current resume.
          </p>
          <a
            className="button buttonGhost smallButton resumeDownloadButton"
            href="/resume-customer-success.pdf"
          >
            Download Customer Success Resume
          </a>
        </div>
      </section>

      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Setup</p>
          <h2>Required environment variable</h2>
        </div>

        <p className="sectionIntro">
          Add your Google OAuth Web Client ID as <code>NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID</code>. In Google Cloud,
          add this site&apos;s origin, such as <code>https://yourdomain.com</code>, to the OAuth client&apos;s authorized
          JavaScript origins.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
