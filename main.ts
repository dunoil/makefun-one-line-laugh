import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The single funny line for "The One-Line Laugh": one sentence, 90 characters,
// an everyday appliance doing something unexpectedly competent. The gate
// requires UTF-8 text of 1 to 200 characters on a single line, so the
// validation below mirrors that gate exactly before anything is written.
const ENTRY =
  "My fridge emailed me a grocery list this morning, and honestly, it shops better than I do.";

function validate(text: string): void {
  if (text.length < 1 || text.length > 200) {
    throw new Error(`Entry must be 1 to 200 characters, got ${text.length}.`);
  }
  if (text.trim().length === 0) {
    throw new Error("Entry must not be only white space.");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("Entry must be a single line.");
  }
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if ((code < 0x20 && ch !== "\t") || code === 0x7f) {
      throw new Error("Entry must not contain control characters.");
    }
  }
}

const outputPath = process.env.OUTPUT_PATH ?? "/output/entry.txt";

validate(ENTRY);
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, ENTRY, "utf8");
const readBack = readFileSync(outputPath, "utf8");
if (readBack !== ENTRY) {
  throw new Error("Verification failed: file contents differ from entry text.");
}
console.log(ENTRY);
console.log(`Characters: ${ENTRY.length}`);
