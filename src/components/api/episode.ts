import type { Episode } from "../dataEntry/libs/types";

export async function load(uri: string): Promise<Episode | null> {
  //TODO: check URI is same as current, and sanitize episode before inputting in
  const resp = await fetch(uri);
  if (!resp.ok) {
    console.error(`Could not load '${uri}'`);
    return null;
  }

  return (await resp.json()) as Episode;
}
