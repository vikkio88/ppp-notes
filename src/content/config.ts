import { defineCollection } from "astro:content";
import { feedLinksLoader } from "./loaders/feedLinksLoader";

const feedLinks = defineCollection({ loader: feedLinksLoader() });

export const collections = { feedLinks };
