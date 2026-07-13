import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(repoRoot, "src", "assets", "fonts", "OFL.txt");
const destinationDir = path.join(repoRoot, "dist", "assets", "fonts");
const destination = path.join(destinationDir, "OFL.txt");

mkdirSync(destinationDir, { recursive: true });
copyFileSync(source, destination);
console.log("font license: copied dist/assets/fonts/OFL.txt");
