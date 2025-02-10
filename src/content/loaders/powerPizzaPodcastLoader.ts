import { feedLoader } from "@ascorbic/feed-loader";
import type { Loader, LoaderContext } from "astro/loaders";
import { z } from "astro:content";
import type { ZodObject, ZodSchema } from "astro:schema";
import { URL } from "../../config";
import { parseLinks } from "../../libs/linkParser";
import type { EpisodeWrapper } from "../../types";

export function powerPizzaPodcastLoader(): Loader {
  const feedLoaderInstance = feedLoader({
    url: URL,
  });

  const feedLoaderSchema = feedLoaderInstance.schema as ZodSchema;
  const powerPizzaPodcastSchema = (feedLoaderSchema as ZodObject<any>).extend({
    links: z
      .array(
        z.object({
          href: z.string(),
          description: z.string(),
        })
      )
      // Optional only because is an extension of the feed loader schema
      .optional(),
  });

  return {
    name: "power-pizza-podcast-loader",
    load: async (context: LoaderContext): Promise<void> => {
      await feedLoaderInstance.load(context);

      const data = context.store.values() as unknown as EpisodeWrapper[];
      context.store.clear();

      for (const episode of data) {
        let slugFromTitle = (episode.data.title as string)
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-");

        if (slugFromTitle.endsWith("-")) {
          slugFromTitle = slugFromTitle.slice(0, -1);
        }

        episode.data = {
          ...episode.data,
          links: parseLinks(episode),
        };

        context.store.set({
          ...episode,
          id: slugFromTitle,
        });
      }
    },
    schema: powerPizzaPodcastSchema,
  };
}
