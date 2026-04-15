import { $ } from "bun";
import { OUTPUT_DIR } from "../config";
import { existsSync } from "fs";

async function tryDo(func: () => void) {
  try {
    await func();
  } catch (err) {
    console.error(err);
  }
}

tryDo(async () => {
  if (existsSync(`${OUTPUT_DIR}`)) {
    await $`rm -f ${OUTPUT_DIR}/*.json`;
  }
});

tryDo(async () => {
  if (existsSync(".env")) {
    await $`rm .env`;
  }
});
