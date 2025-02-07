import { feedLoader, type Item } from '@ascorbic/feed-loader';
import type { Loader, LoaderContext } from 'astro/loaders';
import { z } from 'astro:content';
import type { ZodObject, ZodSchema } from 'astro:schema';

interface Link {
    href: string;
    description: string;
}

/**
* Extract links from "Scontrino" content
*
* This parser decorates the default feed object, coming from the feed loader, with the list of links in the "scontrino".
* It allows to reuse them across the project without errors.
*/
function parseLinks(episode: any): Link[] {
    const links: Link[] = [];

    const SCONTRINO_SEPARATOR = "+++ Scontrino +++";

    const description = (episode.data as Item).description!;

    const scontrino = description.includes(SCONTRINO_SEPARATOR)
        ? description.split(SCONTRINO_SEPARATOR)[1]
        : description;
    const scontrinoLines = scontrino
        // Replace double line breaks with a single one
        .replaceAll("<br /><br />", "<br />")
        // Swap line breaks inside links with the link closing tag
        .replaceAll("<br /></a>", "</a><br />")
        .split("<br />")
        .map((l) => l.trim());
    const rawLinkIndexes = scontrinoLines
        .map((l, i) => (l.startsWith("<a") ? i : -1))
        .filter((i) => i !== -1);
    for (const index of rawLinkIndexes) {
        const rawLink = scontrinoLines[index];

        // Supports multiple links with the same description
        let descriptionIndex = index - 1;
        while (
            scontrinoLines[descriptionIndex].startsWith("<a") &&
            descriptionIndex > 0
        ) {
            descriptionIndex--;
        }
        const description = scontrinoLines[descriptionIndex].replace("►", "");
        const href = rawLink.match(/\>(.*)\<\/a\>/)![1];

        links.push({ href, description });
    }

    return links;
}

export function powerPizzaPodcastLoader(): Loader {
    const feedLoaderInstance = feedLoader({
        url: "https://www.spreaker.com/show/3039391/episodes/feed",
    });

    const feedLoaderSchema = feedLoaderInstance.schema as ZodSchema;
    const powerPizzaPodcastSchema = (feedLoaderSchema as ZodObject<any>).extend({
        links: z
            .array(
                z.object({
                    href: z.string(),
                    description: z.string(),
                }),
            )
            // Optional only because is an extension of the feed loader schema
            .optional(),
    });

    return {
        name: "power-pizza-podcast-loader",
        load: async (context: LoaderContext): Promise<void> => {
            await feedLoaderInstance.load(context);

            const data = context.store.values();
            context.store.clear();

            for (const episode of data) {
                let slugFromTitle = (episode.data.title as string)
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^a-z0-9]+/g, "-");

                if (slugFromTitle.endsWith('-')) {
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
