import type { Item } from "@ascorbic/feed-loader";
import FeedParser from "feedparser";
import { Readable } from "node:stream";
import type { ReadableStream } from "node:stream/web";
import type { FeedItem } from "../types/feed";

// ripped from https://github.com/ascorbic/astro-loaders/blob/main/packages/feed/src/feed-loader.ts
// https://github.com/ascorbic/astro-loaders/commit/3b22a8a7f6ede978790a28dca9a03fedfb0710de
export function webToNodeStream(
  webStream: ReadableStream<Uint8Array>
): Readable {
  const reader = webStream.getReader();
  return new Readable({
    async read() {
      try {
        const { done, value } = await reader.read();
        if (done) {
          this.push(null);
        } else {
          this.push(Buffer.from(value));
        }
      } catch (err) {
        this.destroy(err as Error);
      }
    },
  });
}

export const feedParser = async (feedurl: string) => {
  const parser = new FeedParser({ feedurl });

  const res = await fetch(feedurl);

  if (res.status === 304) {
    return;
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch feed: ${res.statusText}`);
  }
  if (!res.body) {
    throw new Error("Response body is empty");
  }

  const result: { id: string; data: FeedItem; rendered: { html: string } }[] =
    [];

  parser.on("readable", async () => {
    let item: FeedItem | null;
    while ((item = parser.read() as unknown as FeedItem) !== null) {
      const id = item.guid;
      if (!id) {
        continue;
      }

      result.push({
        id,
        data: item,
        rendered: {
          html: item.description ?? "",
        },
      });
    }
  });

  const stream = webToNodeStream(res.body as ReadableStream<Uint8Array>);
  stream.pipe(parser);

  return new Promise((resolve, reject) => {
    parser.on("end", () => {
      resolve(result);
    });
    parser.on("error", (err: Error) => {
      reject(err);
    });
  });
};
