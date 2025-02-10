import type { Item } from "@ascorbic/feed-loader";

export interface SearchableLink {
  episodeTitle: string;
  episodeAudioUrl: string;
  url: string;
  description: string;
}

export type Link = {
  href: string;
  description: string;
};

export type EpisodeWrapper = {
  data: Item;
};
