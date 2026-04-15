import { $ } from "bun";
import { OUTPUT_DIR } from "../config";

async function tryDo(func: () => void) {
  try {
    await func();
  } catch (err) {
    console.error(err);
  }
}

tryDo(async () => await $`rm -f ${OUTPUT_DIR}/*.json`);
tryDo(async () => await $`rm -f .env`);
