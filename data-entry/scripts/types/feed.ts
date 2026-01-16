export type FeedItem = {
  title: string
  description: string
  summary: string
  date: string
  pubdate: string
  pubDate: string
  link: string
  guid: string
  author: string
  comments: string | null
  origlink: string | null
  image: {
    url: string
  }
  source: Record<string, unknown>
  categories: string[]
  enclosures: {
    url: string
    type: string
    length: string
  }[]
  "rss:@": Record<string, unknown>
  "rss:title": { "@": Record<string, unknown>; "#": string }
  "rss:link": { "@": Record<string, unknown>; "#": string }
  "rss:description": { "@": Record<string, unknown>; "#": string }
  "rss:guid": { "@": { ispermalink: string }; "#": string }
  "rss:pubdate": { "@": Record<string, unknown>; "#": string }
  "rss:enclosure": {
    "@": { url: string; length: string; type: string }
  }
  "itunes:author": { "@": Record<string, unknown>; "#": string }
  "itunes:subtitle": { "@": Record<string, unknown>; "#": string }
  "itunes:summary": { "@": Record<string, unknown>; "#": string }
  "itunes:duration": { "@": Record<string, unknown>; "#": string }
  "itunes:explicit": { "@": Record<string, unknown>; "#": string }
  "itunes:image": { "@": { href: string } }
  "itunes:episodetype": { "@": Record<string, unknown>; "#": string }
  meta: {
    "#ns": Record<string, string>[]
    "@": Record<string, string>[]
    "#xml": { version: string; encoding: string }
    "#type": string
    "#version": string
    title: string
    description: string
    date: string
    pubdate: string
    pubDate: string
    link: string
    xmlurl: string
    xmlUrl: string
    author: string
    language: string
    favicon: string | null
    copyright: string
    generator: string | null
    cloud: Record<string, unknown>
    image: { url: string }
  }
}


export type SearchableLink = {
  episodeTitle: string;
  episodeAudioUrl: string;
  url: string;
  description: string;
};

export type Link = {
  href: string;
  description: string;
};

export type EpisodeWrapper = {
  data: FeedItem;
};
