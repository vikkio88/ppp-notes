const fs = require("fs");
import { OUTPUT_DIR, URL } from "../config";
import type { EpisodeWrapper, Link } from "../types";
import { parseLinks } from "../libs/linkParser";
import { feedParser } from "./feedParser";

const main = async () => {
  const shows = (await feedParser(URL)) as EpisodeWrapper[];

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
      fileUrl: episode.fileUrl,
      links: currentEpisodeLinks,
      content: episode.description,
      isoDate: episode.isoDate,
    });
    console.log("\t\t...done\n");
  }

  save(links, "links");
  save(episodes, "episodes");

  console.log("...all done bye <3\n");
};

const now = () => new Date().toISOString();

const save = (data: any, prefix: string) => {
  let filename = now().replace(/:/gm, ".");
  filename = `${prefix}_${filename}.json`;
  console.log(`\t saving ${filename} file...`);
  fs.writeFileSync(`${OUTPUT_DIR}/${filename}`, JSON.stringify(data));

  return filename;
};

main();
