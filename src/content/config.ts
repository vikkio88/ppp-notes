import { defineCollection } from "astro:content";
import { powerPizzaPodcastLoader } from "./loaders/powerPizzaPodcastLoader";

const episodes = defineCollection({ loader: powerPizzaPodcastLoader() });

export const collections = { episodes };
