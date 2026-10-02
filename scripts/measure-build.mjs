import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? files(join(dir, entry.name))
      : [join(dir, entry.name)],
  );
}
const chunks = files(".next/static").filter((path) => path.endsWith(".js"));
const result = {
  generatedAt: new Date().toISOString(),
  modelBytes: statSync("public/models/volt-r1.glb").size,
  totalJavaScriptBytes: chunks.reduce(
    (sum, path) => sum + statSync(path).size,
    0,
  ),
  totalJavaScriptGzipBytes: chunks.reduce(
    (sum, path) => sum + gzipSync(readFileSync(path)).length,
    0,
  ),
  javaScriptFiles: chunks.length,
  scope:
    "All emitted client JavaScript across both routes, including lazy 3D chunks. Not an initial-route transfer or a Lighthouse score.",
};
writeFileSync(
  "public/build-metrics.json",
  JSON.stringify(result, null, 2) + "\n",
);
console.log(
  `Measured ${chunks.length} client JS files: ${(result.totalJavaScriptGzipBytes / 1024).toFixed(1)} KiB gzip total; model ${(result.modelBytes / 1024).toFixed(1)} KiB.`,
);
