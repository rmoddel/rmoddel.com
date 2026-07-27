import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "rmoddel.com",
    short_name: "rmoddel.com",
    description:
      "Personal career site for Reuben Moddel, focused on AI solutions, operations, people leadership, personalized software, and practical execution.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f7f4",
    theme_color: "#0f615c",
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
