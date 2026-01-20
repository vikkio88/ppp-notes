import type { EpisodeEntry } from "../dataEntry/libs/types";

export async function load(uri: string): Promise<EpisodeEntry | null> {
  const resp = await fetch(uri);
  if (!resp.ok) {
    console.error(`Could not load '${uri}'`);
    return null;
  }

  return (await resp.json()) as EpisodeEntry;
}
