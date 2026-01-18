import fs from "node:fs";
import p from "node:path";
import type { Episode } from "../../components/dataEntry/libs/types";
import { PUBLIC_DATA_EPISODES } from "../config";

const files = fs.readdirSync(PUBLIC_DATA_EPISODES, { withFileTypes: true });
const result = [];
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
    result.push(episode);
  }
}

result.sort((e, o) => e.number - o.number);
result.forEach((e) => console.log(e.title));
