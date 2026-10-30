import type { IconName } from "@/components/Icon.astro";
import { SITE } from "@/config";

interface Social {
  name: string;
  href: string;
  linkTitle: string;
  icon: IconName;
}

export const SOCIALS: Social[] = [
  {
    name: "GitHub",
    href: "https://github.com/DavideMaggi/",
    linkTitle: `${SITE.title} on GitHub`,
    icon: "github",
  },
  {
    name: "X",
    href: "https://x.com/DavideMaggi",
    linkTitle: `${SITE.title} on X`,
    icon: "x",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/DavideMaggi/",
    linkTitle: `${SITE.title} on LinkedIn`,
    icon: "linkedin",
  },
  {
    name: "Mail",
    href: "mailto:davide@monkeyproof.dev",
    linkTitle: `Send an email to ${SITE.title}`,
    icon: "mail",
  },
];

export const SHARE_LINKS: Social[] = [
  {
    name: "WhatsApp",
    href: "https://wa.me/?text=",
    linkTitle: "Share via WhatsApp",
    icon: "whatsapp",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/sharer.php?u=",
    linkTitle: "Share on Facebook",
    icon: "facebook",
  },
  {
    name: "X",
    href: "https://x.com/intent/post?url=",
    linkTitle: "Share on X",
    icon: "x",
  },
  {
    name: "Telegram",
    href: "https://t.me/share/url?url=",
    linkTitle: "Share on Telegram",
    icon: "telegram",
  },
  {
    name: "Mail",
    href: "mailto:?subject=Check%20this%20out&body=",
    linkTitle: "Share via email",
    icon: "mail",
  },
];

type NavLink = { href: string; label: string; icon: IconName };

export const NAV_LINKS: NavLink[] = [
  { href: "/posts/", label: "Posts", icon: "notes" },
  { href: "/tags/", label: "Tags", icon: "tag" },
  ...(SITE.showArchives
    ? [{ href: "/archives/", label: "Archive", icon: "archive" } satisfies NavLink]
    : []),
  ...(SITE.showGalleries
    ? [{ href: "/galleries/", label: "Galleries", icon: "photo" } satisfies NavLink]
    : []),
  { href: "/about/", label: "About", icon: "user" },
];
