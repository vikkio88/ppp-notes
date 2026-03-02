import { $ } from "bun";

const { stdout } = await $`git diff --name-only origin/main...HEAD`.quiet();

const changedFiles = stdout
  .toString()
  .trim()
  .split("\n")
  .filter((f) => f.endsWith(".json"));

if (changedFiles.length === 0) {
  console.log("No JSON files changed.");
  process.exit(0);
}

let hasErrors = false;

for (const file of changedFiles) {
  try {
    const content = await Bun.file(file).text();
    JSON.parse(content);
    console.log(`VALID   ${file}`);
  } catch (e) {
    const error = e as Error;
    console.error(`INVALID ${file}: ${error.message}`);
    hasErrors = true;
  }
}

process.exit(hasErrors ? 1 : 0);
