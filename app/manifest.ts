import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "rmoddel.com",
    short_name: "rmoddel.com",
    description:
      "Reuben Moddel helps turn rough ideas into polished websites, ads, campaigns, business documents, workflows, and AI-powered systems.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4efe7",
    theme_color: "#b14b2b",
    icons: []
  };
}
