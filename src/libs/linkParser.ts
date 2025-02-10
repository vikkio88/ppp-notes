import { SCONTRINO_SEPARATOR } from "../config";
import type { EpisodeWrapper, Link } from "../types";

/**
 * Extract links from "Scontrino" content
 *
 * This parser decorates the default feed object, coming from the feed loader, with the list of links in the "scontrino".
 * It allows to reuse them across the project without errors.
 */
export function parseLinks(episode: EpisodeWrapper): Link[] {
  const links: Link[] = [];

  const description = episode.data.description;
  if (!description) {
    return [];
  }

  const scontrino = description.includes(SCONTRINO_SEPARATOR)
    ? description.split(SCONTRINO_SEPARATOR)[1]
    : description;
  const scontrinoLines = scontrino
    // Replace double line breaks with a single one
    .replaceAll("<br /><br />", "<br />")
    // Swap line breaks inside links with the link closing tag
    .replaceAll("<br /></a>", "</a><br />")
    .split("<br />")
    .map((l) => l.trim());
  const rawLinkIndexes = scontrinoLines
    .map((l, i) => (l.startsWith("<a") ? i : -1))
    .filter((i) => i !== -1);
  for (const index of rawLinkIndexes) {
    const rawLink = scontrinoLines[index];

    // Supports multiple links with the same description
    let descriptionIndex = index - 1;
    while (
      scontrinoLines[descriptionIndex].startsWith("<a") &&
      descriptionIndex > 0
    ) {
      descriptionIndex--;
    }
    const description = scontrinoLines[descriptionIndex].replace("►", "");
    const href = rawLink.match(/\>(.*)\<\/a\>/)![1];

    links.push({ href, description });
  }

  return links;
}
