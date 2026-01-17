import { $ } from "bun";
import { FEED_OUTPUT_DIR } from "../config";
async function tryDo(func: () => void) {
  try {
    await func();
  } catch (err) {
    console.error(err);
  }
}

await tryDo(async () => await $`rm -rf ${FEED_OUTPUT_DIR}`);
await tryDo(async () => await $`mkdir ${FEED_OUTPUT_DIR}`);
