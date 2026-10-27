"use client";

import { useCallback, useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

type Announcement = { id: string; text: string; publishedAt: string };
type Feed = { items: Announcement[]; nextCursor: string | null };

const endpoint = process.env.NEXT_PUBLIC_ANNOUNCEMENTS_API_URL?.replace(/\/$/, "");

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "unconfigured">(
    endpoint ? "loading" : "unconfigured"
  );
  const [loadingMore, setLoadingMore] = useState(false);

  const load = useCallback(async (nextCursor?: string) => {
    if (!endpoint) return;
    if (nextCursor) setLoadingMore(true);
    try {
      const url = new URL(`${endpoint}/announcements`);
      if (nextCursor) url.searchParams.set("cursor", nextCursor);
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error("Feed unavailable");
      const feed = (await response.json()) as Feed;
      if (!Array.isArray(feed.items)) throw new Error("Invalid feed");
      setItems(current => nextCursor ? [...current, ...feed.items] : feed.items);
      setCursor(feed.nextCursor);
      setStatus("ready");
    } catch {
      setStatus("error");
    } finally {
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => { void load(); }, 60_000);
    return () => window.clearInterval(timer);
  }, [load]);

  return (
    <main className="pageShell">
      <SiteHeader />
      <section className="sectionCard">
        <div className="sectionHeading">
          <p className="eyebrow">Updates</p>
          <h1>Announcements</h1>
        </div>
        <p className="sectionIntro">Recent announcements appear here, newest first. This page refreshes automatically.</p>
        {status === "loading" && <p role="status">Loading announcements…</p>}
        {status === "unconfigured" && <p role="status">Announcements are not connected yet.</p>}
        {status === "error" && <p role="alert">Announcements could not be loaded. <button type="button" onClick={() => void load()}>Retry</button></p>}
        {status === "ready" && items.length === 0 && <p>No announcements yet.</p>}
        <div className="announcementsList">
          {items.map(item => (
            <article className="contentCard" key={item.id}>
              <time dateTime={item.publishedAt} className="microLabel">
                {new Date(item.publishedAt).toLocaleString()}
              </time>
              <p className="announcementText" dir="auto">{item.text}</p>
            </article>
          ))}
        </div>
        {cursor && <button className="button buttonSecondary smallButton" disabled={loadingMore} onClick={() => void load(cursor)} type="button">{loadingMore ? "Loading…" : "Load older announcements"}</button>}
      </section>
      <SiteFooter />
    </main>
  );
}
