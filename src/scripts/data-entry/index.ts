import fs from "fs";
import path from "path";
import { FEED_OUTPUT_DIR, PUBLIC_DATA_EPISODES } from "../config";

type Episode = {
  title: string;
  image: string;
  fileUrl: string;
  links: { href: string; description: string }[];
  content: string;
  publishedDate: string;
};

export default function (filename: string | null) {
  const episodesPath = `${FEED_OUTPUT_DIR}/${filename || "episodes.json"}`;
  const episodes: Episode[] = JSON.parse(fs.readFileSync(episodesPath, "utf8"));
  if (!fs.existsSync(PUBLIC_DATA_EPISODES)) {
    fs.mkdirSync(PUBLIC_DATA_EPISODES, { recursive: true });
  }

  episodes.forEach((ep) => {
    // grab the first number anywhere in the title
    const match = ep.title.match(/(\d+)/);
    if (!match) return;

    const number = parseInt(match[1]!, 10);
    const outFile = path.join(PUBLIC_DATA_EPISODES, `episode_${number}.json`);

    if (!fs.existsSync(outFile)) {
      const emptyEpisode = {
        title: ep.title,
        number: number,
        main: [],
        menews: [],
        lorrowap: [],
        dolcetto: [],
        amaro: [],
        lore: [],
        others: [],
        meta: {
          user: null,
          date: new Date().toISOString(),
        },
      };

      fs.writeFileSync(outFile, JSON.stringify(emptyEpisode, null, 2) + "\n");
      console.log(`✅ Created ${outFile}`);
    } else {
      console.log(`⏩ Skipped ${outFile}, already exists`);
    }
  });
}
