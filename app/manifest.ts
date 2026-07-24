import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "rmoddel.com",
    short_name: "rmoddel.com",
    description:
      "Personal portfolio for Reuben Moddel, focused on operations leadership, clear communication, technical problem-solving, AI-enabled automation, and practical execution.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4efe7",
    theme_color: "#b14b2b",
    categories: ["business", "productivity"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable"
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any"
      }
    ]
  };
}
