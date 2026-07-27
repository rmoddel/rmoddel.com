import type { Metadata } from "next";
import { Suspense } from "react";
import { InteractiveResume } from "@/components/interactive-resume";
import { TurnstileScript } from "@/components/turnstile";
import { chatTopics, starterQuestions } from "@/lib/interactive-resume-content";

export const metadata: Metadata = {
  title: "Interactive Résumé | Ask About Reuben Moddel",
  description:
    "Ask an AI-powered interactive résumé about Reuben Moddel’s experience, strengths, leadership, projects, and approach to improving cumbersome processes.",
  alternates: {
    canonical: "/chat"
  },
  openGraph: {
    title: "Interactive Résumé | Ask About Reuben Moddel",
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
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Interactive résumé for Reuben Moddel"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Interactive Résumé | Ask About Reuben Moddel",
    description:
      "Ask about Reuben Moddel’s experience, leadership, AI work, projects, and GPS approach.",
    images: ["/twitter-image"]
  }
};

function ChatFallback() {
  return (
    <main className="chatShell loadingChat">
      <section className="chatMain">
        <header className="chatTopBar">
          <div>
            <p className="eyebrow">Interactive Résumé</p>
            <h1>Ask Anything About My Background</h1>
          </div>
        </header>
        <p className="sectionIntro">Loading the interactive résumé...</p>
      </section>
    </main>
  );
}

export default function ChatPage() {
  return (
    <>
      <TurnstileScript />
      <Suspense fallback={<ChatFallback />}>
        <InteractiveResume topics={chatTopics} starterQuestions={starterQuestions} />
      </Suspense>
    </>
  );
}
