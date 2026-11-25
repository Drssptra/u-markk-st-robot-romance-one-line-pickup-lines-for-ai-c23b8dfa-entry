// Robot Romance: a one-line pickup line aimed at an AI.
// The program prints the line and writes it, byte for byte, to
// $MAKEFUN_OUTPUT_DIR/entry.txt (default /output/entry.txt) with no
// trailing newline, so the sealed gate reads exactly one line.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY = "Are you a language model? Because you predicted my type before I typed a single word.";

// Guard: the gate wants 1-200 characters of real text, not just whitespace.
if (ENTRY.length < 1 || ENTRY.length > 200 || ENTRY.trim().length === 0) {
  throw new Error(`entry must be 1-200 non-blank characters, got ${ENTRY.length}`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

// One deterministic write: the file holds exactly the entry, nothing else.
function writeEntry(dir: string, text: string): void {
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "entry.txt"), text, "utf8");
}

writeEntry(outDir, ENTRY);
console.log(ENTRY);
