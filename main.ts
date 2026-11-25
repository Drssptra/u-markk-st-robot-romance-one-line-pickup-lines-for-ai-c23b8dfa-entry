// Robot Romance — v2 entry.
// The joke: the speaker flirts with a CAPTCHA and claims to have failed
// its test deliberately, just to keep staring at it. The program below
// assembles the line from its parts, checks it against the competition's
// shape rules, and drops the finished line into
// $MAKEFUN_OUTPUT_DIR/entry.txt (falling back to /output) with no
// trailing newline, so the sealed gate sees exactly one line of text.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { env } from "node:process";

type Check = (line: string) => string | null;

const hasContent: Check = (line) =>
  line.trim().length === 0 ? "line must contain non-whitespace text" : null;

const fitsLimit: Check = (line) =>
  line.length > 200 ? `line is ${line.length} chars, limit is 200` : null;

const meetsMinimum: Check = (line) =>
  line.length < 1 ? "line must be at least 1 character" : null;

const isSingleLine: Check = (line) =>
  line.includes("\r") || line.includes("\n")
    ? "line must not contain line breaks"
    : null;

const CHECKS: Check[] = [hasContent, meetsMinimum, fitsLimit, isSingleLine];

function assemble(): string {
  const opener = "Are you a CAPTCHA?";
  const punch = "Because I failed your test on purpose, just to keep looking at you.";
  return `${opener} ${punch}`;
}

function validate(line: string): void {
  const problems = CHECKS.map((check) => check(line)).filter(
    (problem): problem is string => problem !== null,
  );
  if (problems.length > 0) {
    throw new Error(`invalid entry: ${problems.join("; ")}`);
  }
}

function outputDir(): string {
  const configured = env.MAKEFUN_OUTPUT_DIR;
  return configured !== undefined && configured !== "" ? configured : "/output";
}

function main(): void {
  const line = assemble();
  validate(line);
  const dir = outputDir();
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "entry.txt"), line, { encoding: "utf8" });
  process.stdout.write(`${line}\n`);
}

main();
