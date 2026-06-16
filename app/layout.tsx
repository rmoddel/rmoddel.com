import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reuben Moddel | Creative AI Operator for Real-World Business",
  description:
    "Turn rough ideas into polished websites, ads, campaigns, business documents, workflows, and AI-powered systems."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
