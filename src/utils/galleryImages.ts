import type { ImageMetadata } from "astro";

// Every image in every gallery folder, resolved at build time.
const allImages = import.meta.glob<{ default: ImageMetadata }>(
  "/src/data/galleries/**/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG,WEBP}",
  { eager: true }
);

export type GalleryImage = { src: ImageMetadata; alt: string; filename: string };

/** "03-old-town_square.jpg" → "Old Town Square" */
const filenameToAlt = (filename: string, fallback: string) =>
  filename
    .replace(/\.[^.]+$/, "")
    .replace(/^\d+[-_]?/, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim() || fallback;

export const getGalleryImages = (slug: string, fallbackAlt = slug): GalleryImage[] =>
  Object.entries(allImages)
    .filter(([path]) => path.startsWith(`/src/data/galleries/${slug}/`))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, mod]) => {
      const filename = path.split("/").pop() ?? "";
      return { src: mod.default, alt: filenameToAlt(filename, fallbackAlt), filename };
    });
