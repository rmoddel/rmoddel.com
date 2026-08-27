import type { Metadata } from "next";
import { Suspense } from "react";
import { InteractiveResume } from "@/components/interactive-resume";
import { chatTopics } from "@/lib/interactive-resume-content";
import { openGraphImagePath, twitterImagePath } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Chat With My Resume | Ask About Reuben Moddel",
  description:
    "Ask an AI-powered interactive resume about Reuben Moddel’s experience, strengths, leadership, projects, and approach to improving cumbersome processes.",
  alternates: {
    canonical: "/chat"
  },
  openGraph: {
    title: "Chat With My Resume | Ask About Reuben Moddel",
    description:
      "Explore Reuben Moddel’s experience, leadership, AI work, projects, GPS approach, and fit for opportunities.",
    url: "/chat",
    siteName: "rmoddel.com",
    locale: "en_US",
    type: "profile",
    firstName: "Reuben",
    lastName: "Moddel",
    images: [
      {
        url: openGraphImagePath,
        width: 1200,
        height: 630,
        alt: "Chat With My resume for Reuben Moddel"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Chat With My Resume | Ask About Reuben Moddel",
    description:
      "Ask about Reuben Moddel’s experience, leadership, AI work, projects, and GPS approach.",
    images: [twitterImagePath]
  }
};

function ChatFallback() {
  return (
    <main className="chatShell loadingChat">
      <section className="chatMain">
        <header className="chatTopBar">
          <div>
            <p className="eyebrow">Chat With My Resume</p>
            <h1>Ask Anything About My Background</h1>
          </div>
        </header>
        <p className="sectionIntro">Loading the interactive resume...</p>
      </section>
    </main>
  );
}

export default function ChatPage() {
  return (
    <>
      <Suspense fallback={<ChatFallback />}>
        <InteractiveResume topics={chatTopics} />
      </Suspense>
    </>
  );
}
