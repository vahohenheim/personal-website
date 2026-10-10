import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "valentinbourreau",
    short_name: "valentinbourreau",
    description: "Senior front-end engineer",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F9F9",
    theme_color: "#0E1111",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
