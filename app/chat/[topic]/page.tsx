import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { InteractiveResume } from "@/components/interactive-resume";
import { chatTopics, starterQuestions } from "@/lib/interactive-resume-content";
import { openGraphImagePath, twitterImagePath } from "@/lib/seo";

type ChatTopicPageProps = {
  params: {
    topic: string;
  };
};

function getTopic(topicId: string) {
  return chatTopics.find((topic) => topic.id === topicId);
}

export function generateStaticParams() {
  return chatTopics.map((topic) => ({ topic: topic.id }));
}

export function generateMetadata({ params }: ChatTopicPageProps): Metadata {
  const topic = getTopic(params.topic);

  if (!topic) {
    return {
      title: "Chat With My Resume"
    };
  }

  return {
    title: `${topic.label} | Chat With My Resume`,
    description: topic.openingAnswer.replace(/\s+/g, " ").slice(0, 155),
    alternates: {
      canonical: `/chat/${topic.id}`
    },
    openGraph: {
      title: `${topic.label} | Chat With My Resume`,
      description: topic.openingAnswer.replace(/\s+/g, " ").slice(0, 155),
      url: `/chat/${topic.id}`,
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
          alt: `${topic.label} - Reuben Moddel interactive resume`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${topic.label} | Chat With My Resume`,
      description: topic.openingAnswer.replace(/\s+/g, " ").slice(0, 155),
      images: [twitterImagePath]
    }
  };
}

function ChatFallback() {
  return (
    <main className="chatShell loadingChat">
      <section className="chatMain">
        <header className="chatTopBar">
          <div>
            <p className="eyebrow">Chat With My Resume</p>
            <h1>Loading Topic</h1>
          </div>
        </header>
        <p className="sectionIntro">Loading the interactive resume...</p>
      </section>
    </main>
  );
}

export default function ChatTopicPage({ params }: ChatTopicPageProps) {
  const topic = getTopic(params.topic);

  if (!topic) {
    notFound();
  }

  return (
    <>
      <Suspense fallback={<ChatFallback />}>
        <InteractiveResume
          initialTopicId={topic.id}
          topics={chatTopics}
          starterQuestions={starterQuestions}
        />
      </Suspense>
    </>
  );
}
