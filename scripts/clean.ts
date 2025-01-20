import { $ } from "bun";
import { OUTPUT_DIR, PUBLIC_DATA_DIR } from "./config";

await $`rm ${OUTPUT_DIR}/*.json`;
await $`rm ${PUBLIC_DATA_DIR}/*.json`;
await $`rm .env`;
