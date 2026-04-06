export const SITE = {
  website: "https://monkeyproof.dev/",
  author: "Davide Maggi",
  profile: "https://github.com/DavideMaggi",
  avatar: {
    src: "/images/avatar.jpeg", // located in the public folder
    alt: "Portrait of Davide Maggi",
  },
  desc: "Software architecture, backend engineering, and technically accurate chaos — from a system architect who has broken enough things to start writing about them.",
  title: "MonkeyProof",
  ogImage: "monkeyproof-og.png", // located in the public folder
  lightAndDarkMode: true,
  postPerIndex: 6,
  postPerPage: 12,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showGalleries: false,
  showGalleriesInIndex: false, // Show galleries in the general paginated list (only if showGalleries is true)
  showBackButton: true, // show back button in post detail
  heroTerminalPrompt: {
    prefix: "~", // highlighted part on the left
    path: "/go-bananas", // central prompt text
    suffix: "$", // terminal symbol on the right
  },
  backdropEffects: {
    cursorGlow: false, // cursor tracking with soft halo
    grain: true, // background visual noise layer
  },
  editPost: {
    enabled: false,
    text: "Edit this post",
    url: "https://github.com/davidemaggi/MonkeyProof/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Europe/Rome", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
  introAudio: {
    enabled: false, // show/hide intro player in home and compact player while navigating
    // src: path to file (relative to /public or absolute URL). Example: "/intro.mp3" or "https://example.com/stream"
    src: "https://fluxfm.streamabc.net/flx-chillhop-mp3-128-8581707",
    // src: "/audio/intro-web.mp3",
    isStream: true, // true for radio/live stream URLs (example: https://fluxfm.streamabc.net/flx-chillhop-mp3-128-8581707)
    label: "LOFI", // display label in player
    duration: 30, // duration in seconds (used for local files, ignored on streams)
  },
} as const;
