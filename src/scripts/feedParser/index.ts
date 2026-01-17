import fs, { existsSync } from "node:fs";
import { FEED_OUTPUT_DIR, URL } from "../config";
import { parseLinks } from "../libs/linkParser";
import type { EpisodeWrapper, Link } from "../types/feed";
import { feedParser } from "./parser";

export default async () => {
  const shows = (await feedParser(URL)) as EpisodeWrapper[];
  if (!existsSync(FEED_OUTPUT_DIR)) {
    console.error(
      `output dir '${FEED_OUTPUT_DIR}' does not exist, please create it.`,
    );
    process.exit(1);
  }

  save(shows, "shows");
  const episodes: any[] = [];
  let links: Link[] = [];
  for (const episodeData of shows) {
    const episode = episodeData.data;
    const currentEpisodeLinks = parseLinks(episodeData);
    links = links.concat(currentEpisodeLinks);
    console.log(`\t\t- ${episode.title}`);

    episodes.push({
      title: episode.title,
      image: episode.image.url || null,
      fileUrl: episode.enclosures[0]?.url || null,
      links: currentEpisodeLinks,
      content: episode.description,
      publishedDate: episode.pubDate,
    });
    console.log("\t\t...done\n");
  }

  save(links, "links");
  const episodesFileName = save(episodes, "episodes");

  console.log("feed parsing done\n");
  return episodesFileName;
};

const now = () => new Date().toISOString();

const save = (data: any, prefix: string) => {
  let filename = now().replace(/:/gm, ".");
  filename = `${prefix}_${filename}.json`;
  console.log(`\t saving ${filename} file...`);
  fs.writeFileSync(
    `${FEED_OUTPUT_DIR}/${filename}`,
    JSON.stringify(data, null, 2),
  );

  return filename;
};
