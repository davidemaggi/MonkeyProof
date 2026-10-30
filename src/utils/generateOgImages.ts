import { Resvg } from "@resvg/resvg-js";
import { type CollectionEntry } from "astro:content";
import ogCard from "./og-templates/card";
import { getPath } from "./getPath";
import { SITE } from "@/config";

const toPng = (svg: string) => new Resvg(svg).render().asPng();

export async function generateOgImageForPost(post: CollectionEntry<"blog">) {
  const svg = await ogCard({
    path: `~/posts/${getPath(post.id, post.filePath, false)}.md`,
    title: post.data.title,
    footer: `by ${post.data.author}`,
  });
  return toPng(svg);
}

export async function generateOgImageForSite() {
  const svg = await ogCard({ path: "~/go-bananas", title: SITE.title, footer: "Technically accurate chaos." });
  return toPng(svg);
}
