import fs from "node:fs";
import p from "node:path";
import type {
  Episode,
  EpisodeEntry,
} from "../../components/dataEntry/libs/types";
import { PUBLIC_DATA, PUBLIC_DATA_EPISODES } from "../config";

const files = fs.readdirSync(PUBLIC_DATA_EPISODES, { withFileTypes: true });
const result: EpisodeEntry[] = [];
for (const f of files) {
  if (!f.isFile()) {
    continue;
  }

  const filepath = p.join(PUBLIC_DATA_EPISODES, f.name);
  let episode: Episode | null = null;
  try {
    const raw = fs.readFileSync(filepath, "utf8");
    episode = JSON.parse(raw) as Episode;
  } catch (err) {
    console.error(`could not parse file '${filepath}', skipping.`);
    continue;
  }

  if (episode) {
    const collected = Boolean(episode.main.length) || !!episode.meta.user;
    result.push({
      title: episode.title,
      file: `/data/episodes/${f.name}`,
      number: episode.number,
      meta: episode.meta,
      collected,
    });
  }
}

result.sort((e, o) => e.number - o.number);
fs.writeFileSync(
  p.join(PUBLIC_DATA, "episodeReport.json"),
  JSON.stringify(result, null, 2),
);
