import { readFileSync, writeFileSync } from "node:fs";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

function walk(dir) {
  const files = [];

  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);

    if (stat.isDirectory()) {
      files.push(...walk(full));
    } else if (entry.endsWith(".js")) {
      files.push(full);
    }
  }

  return files;
}

const jsFiles = walk("dist");
let patched = 0;

for (const file of jsFiles) {
  const before = readFileSync(file, "utf8");

  const after = before
    .replace(/\n?\/\/# sourceMappingURL=data:application\/json[^\n\r]*/g, "")
    .replace(/\n?\/\/# sourceMappingURL=.*\.map[^\n\r]*/g, "");

  if (after !== before) {
    writeFileSync(file, after);
    patched++;
    console.log(`Removed sourcemap from ${file}`);
  }
}

console.log(`Patched ${patched} file(s)`);
