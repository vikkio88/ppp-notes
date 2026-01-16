import type { Timestamp } from "./types";

export function toTag(newTag: string): string {
  return (
    newTag
      .trim()
      .toLowerCase()
      // replacing spaces with dashes
      .replace(/\s+/g, "-")
      // removing special characters
      .replace(/[^a-z0-9\-]/g, "")
  );
}

export function toTimestapLabel(
  h: number | null | undefined,
  m: number | null | undefined,
  s: number | null | undefined
): string {
  const safe = (v: number | null | undefined) =>
    Number.isFinite(v as number) ? Number(v) : 0;

  const hh = String(safe(h)).padStart(2, "0");
  const mm = String(safe(m)).padStart(2, "0");
  const ss = String(safe(s)).padStart(2, "0");

  return `${hh}:${mm}:${ss}s`;
}

export function isZeroTs(ts: Timestamp) {
  return ts.hours === 0 && ts.minutes === 0 && ts.seconds === 0;
}
