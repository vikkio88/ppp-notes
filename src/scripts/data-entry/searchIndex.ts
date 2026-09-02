#!/usr/bin/env bun
import { Glob } from "bun";
import path from "node:path";
import {
  COLLECTED_SECTIONS,
  type BaseTopicNoId,
  type Episode,
  type IndexedPizza,
  type IndexedTopic,
} from "../../components/dataEntry/libs/types";
const EPISODES_DIR = path.join("public", "data", "episodes");
const OUTPUT_DIR = path.join("public", "data", "index");
const OUTPUT_FILE_TAGS = path.join(OUTPUT_DIR, "tags.json");
const OUTPUT_FILE_EPISODES = path.join(OUTPUT_DIR, "tags_episodes.json");
const OUTPUT_FILE_PIZZA_EPISODES = path.join(OUTPUT_DIR, "pizza_episodes.json");
async function loadEpisodes(): Promise<Episode[]> {
  const glob = new Glob("episode_*.json");
  const episodes: Episode[] = [];
  for await (const file of glob.scan({ cwd: EPISODES_DIR, absolute: true })) {
    try {
      const parsed = (await Bun.file(file).json()) as Episode;
      episodes.push(parsed);
    } catch (err) {
      console.error(`Failed to parse ${file}:`, err);
    }
  }
  return episodes;
}
function buildTagIndex(episodes: Episode[]): Map<string, IndexedTopic[]> {
  const index = new Map<string, IndexedTopic[]>();
  for (const episode of episodes) {
    for (const section of COLLECTED_SECTIONS) {
      const topics = episode[section] as BaseTopicNoId[] | undefined;
      if (!topics) continue;
      for (const topic of topics) {
        if (!topic.tags || topic.tags.length === 0) continue;
        const indexed: IndexedTopic = {
          episodeNumber: episode.number,
          episodeTitle: episode.title,
          section,
          author: topic.author,
          description: topic.description,
          tags: topic.tags,
          timestamp: topic.timestamp,
        };
        for (const tag of topic.tags) {
          const bucket = index.get(tag);
          if (bucket) {
            bucket.push(indexed);
          } else {
            index.set(tag, [indexed]);
          }
        }
      }
    }
  }
  return index;
}
function buildPizzaList(episodes: Episode[]): IndexedPizza[] {
  const list: IndexedPizza[] = [];
  for (const episode of episodes) {
    for (const topic of episode.main) {
      if (!topic.pizza) continue;
      list.push({
        episodeNumber: episode.number,
        episodeTitle: episode.title,
        author: topic.author,
        description: topic.description,
        pizza: topic.pizza,
        slices: topic.pizza.slices,
      });
    }
  }
  return list;
}
async function main() {
  console.log(`Reading episodes from ${EPISODES_DIR}...`);
  const episodes = await loadEpisodes();
  console.log(`Loaded ${episodes.length} episodes.`);
  const tagIndex = buildTagIndex(episodes);
  console.log(`Found ${tagIndex.size} distinct tags.`);
  const tagOutput: Record<string, IndexedTopic[]> = {};
  for (const tag of [...tagIndex.keys()].sort()) {
    tagOutput[tag] = tagIndex.get(tag)!;
  }
  await Bun.write(
    OUTPUT_FILE_TAGS,
    JSON.stringify(Object.keys(tagOutput), null, 2),
  );
  console.log(`Wrote tag index to ${OUTPUT_FILE_TAGS}`);
  await Bun.write(OUTPUT_FILE_EPISODES, JSON.stringify(tagOutput, null, 2));
  console.log(`Wrote tag index to ${OUTPUT_FILE_EPISODES}`);
  const pizzaList = buildPizzaList(episodes);
  console.log(`Found ${pizzaList.length} pizza ratings.`);
  await Bun.write(
    OUTPUT_FILE_PIZZA_EPISODES,
    JSON.stringify(pizzaList, null, 2),
  );
  console.log(`Wrote pizza index to ${OUTPUT_FILE_PIZZA_EPISODES}`);
}
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
