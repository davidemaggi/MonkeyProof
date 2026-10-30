import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { SITE } from "@/config";

dayjs.extend(utc);
dayjs.extend(timezone);

/** "12 Apr 2026" in the post's (or site's) timezone. */
export const formatDate = (date: Date, tz?: string | null) =>
  dayjs(date).tz(tz || SITE.timezone).format("D MMM YYYY");

/** Whole minutes at ~220 wpm, ignoring code fences. */
export const readingMinutes = (body?: string) => {
  if (!body) return 1;
  const prose = body.replace(/```[\s\S]*?```/g, " ");
  const words = prose.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
};
