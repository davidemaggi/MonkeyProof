/**
 * Site chrome behaviour: preferences (theme, wallpaper, focus mode), the
 * control center, the menu bar clock, the cursor glow, and the DaveOS
 * hand-off.
 *
 * The initial attributes are set by the inline script in Layout.astro
 * before first paint; this module only reacts to the user.
 */
import { SITE, WALLPAPERS, type Theme, type Wallpaper } from "@/config";

const root = document.documentElement;
const STORAGE = {
  theme: "mp.theme",
  wallpaper: "mp.wallpaper",
  focus: "mp.focus",
} as const;

const store = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private mode: preferences live for this page only */
  }
};

const currentTheme = () => (root.dataset.theme as Theme) ?? SITE.appearance.theme;
const currentWallpaper = () =>
  (root.dataset.wallpaper as Wallpaper) ?? SITE.appearance.wallpaper;

const syncThemeColor = () => {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = getComputedStyle(root).getPropertyValue("--wp-base").trim();
};

const reflectControls = () => {
  const theme = currentTheme();
  const wallpaper = currentWallpaper();
  const focus = root.dataset.focus === "true";

  document.querySelectorAll<HTMLButtonElement>("[data-set-theme]").forEach(btn => {
    btn.setAttribute("aria-pressed", String(btn.dataset.setTheme === theme));
  });
  document.querySelectorAll<HTMLButtonElement>("[data-set-wallpaper]").forEach(btn => {
    btn.setAttribute("aria-pressed", String(btn.dataset.setWallpaper === wallpaper));
  });
  document.querySelectorAll<HTMLElement>("[data-focus-toggle]").forEach(btn => {
    btn.setAttribute("aria-pressed", String(focus));
  });
  syncThemeColor();
};

const setTheme = (theme: Theme) => {
  root.dataset.theme = theme;
  store(STORAGE.theme, theme);
  reflectControls();
};

const setWallpaper = (wallpaper: Wallpaper) => {
  if (!WALLPAPERS.includes(wallpaper)) return;
  root.dataset.wallpaper = wallpaper;
  store(STORAGE.wallpaper, wallpaper);
  reflectControls();
};

const toggleFocus = () => {
  const next = root.dataset.focus !== "true";
  root.dataset.focus = String(next);
  store(STORAGE.focus, String(next));
  reflectControls();
};

/* ---------- Delegated clicks (survive view-transition swaps) ---------- */

document.addEventListener("click", event => {
  const target = event.target as HTMLElement | null;
  if (!target) return;

  const themeBtn = target.closest<HTMLElement>("[data-set-theme]");
  if (themeBtn) {
    setTheme(themeBtn.dataset.setTheme as Theme);
    return;
  }

  const wallpaperBtn = target.closest<HTMLElement>("[data-set-wallpaper]");
  if (wallpaperBtn) {
    setWallpaper(wallpaperBtn.dataset.setWallpaper as Wallpaper);
    return;
  }

  if (target.closest("[data-focus-toggle]")) {
    toggleFocus();
    return;
  }


  // Hand the current look over to DaveOS so the jump feels like one desktop.
  const daveos = target.closest<HTMLAnchorElement>("a[data-daveos]");
  if (daveos) {
    const url = new URL(daveos.href);
    url.searchParams.set("theme", currentTheme());
    url.searchParams.set("wallpaper", currentWallpaper());
    daveos.href = url.toString();
  }
});

/* ---------- Menu bar clock ---------- */

let clockTimer = 0;
const tickClock = () => {
  const clock = document.querySelector<HTMLElement>("[data-clock]");
  if (!clock) return;
  const now = new Date();
  const day = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(now);
  const time = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);
  clock.textContent = `${day}  ${time}`;
};

/* ---------- Cursor glow on the wallpaper (fine pointers only) ---------- */

let glowFrame = 0;
const glowMedia = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
window.addEventListener(
  "pointermove",
  event => {
    if (!glowMedia.matches || glowFrame) return;
    glowFrame = requestAnimationFrame(() => {
      glowFrame = 0;
      const glow = document.querySelector<HTMLElement>(".wallpaper__glow");
      if (glow) glow.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    });
  },
  { passive: true }
);

/* ---------- Menu bar gets denser once content scrolls under it ---------- */

const syncScrolled = () => {
  root.toggleAttribute("data-scrolled", window.scrollY > 8);
};
window.addEventListener("scroll", syncScrolled, { passive: true });

/* ---------- Page lifecycle ---------- */

const onPageLoad = () => {
  syncScrolled();
  reflectControls();
  tickClock();
  window.clearInterval(clockTimer);
  clockTimer = window.setInterval(tickClock, 20_000);

  // Close any open popover after navigating.
  document.querySelectorAll<HTMLElement>("[popover]").forEach(el => {
    try {
      el.hidePopover();
    } catch {
      /* not open */
    }
  });
};

document.addEventListener("astro:page-load", onPageLoad);
