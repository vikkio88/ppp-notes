#!/usr/bin/env bun
import { Glob } from "bun";
import path from "node:path";
import {
  COLLECTED_SECTIONS,
  type BaseTopicNoId,
  type Episode,
  type IndexedTopic,
  type MainTopicNoId,
} from "../../components/dataEntry/libs/types";
const EPISODES_DIR = path.join("public", "data", "episodes");
const OUTPUT_DIR = path.join("public", "data", "index");
const OUTPUT_FILE_TOPICS = path.join(OUTPUT_DIR, "topics.json");
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
function buildTopicsIndex(episodes: Episode[]): IndexedTopic[] {
  const topics: IndexedTopic[] = [];
  for (const episode of episodes) {
    for (const section of COLLECTED_SECTIONS) {
      const sectionTopics = episode[section] as BaseTopicNoId[] | undefined;
      if (!sectionTopics) continue;
      for (const topic of sectionTopics) {
        topics.push({
          episodeNumber: episode.number,
          episodeTitle: episode.title,
          section,
          author: topic.author,
          description: topic.description,
          tags: topic.tags ?? [],
          timestamp: topic.timestamp,
          pizza: section === "main" ? (topic as MainTopicNoId).pizza : undefined,
        });
      }
    }
  }
  return topics;
}
async function main() {
  console.log(`Reading episodes from ${EPISODES_DIR}...`);
  const episodes = await loadEpisodes();
  console.log(`Loaded ${episodes.length} episodes.`);
  const topics = buildTopicsIndex(episodes);
  console.log(`Indexed ${topics.length} topics.`);
  await Bun.write(OUTPUT_FILE_TOPICS, JSON.stringify(topics, null, 2));
  console.log(`Wrote full topic index to ${OUTPUT_FILE_TOPICS}`);
}
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
