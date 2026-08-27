import { cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const projectDir = process.cwd();
const clientDir = path.join(projectDir, "dist", "client");
const outputDir = path.join(projectDir, ".github-pages");
const exportUrl = (process.env.EXPORT_URL ?? "http://127.0.0.1:3001").replace(/\/$/, "");
const repository = process.env.GITHUB_REPOSITORY?.split("/").at(-1) ?? "Robotic-0";
const owner = process.env.GITHUB_REPOSITORY_OWNER ?? "Wyatt2021";
const basePath = process.env.GITHUB_PAGES_BASE_PATH ?? `/${repository}`;
const publicOrigin = process.env.GITHUB_PAGES_ORIGIN ?? `https://${owner.toLowerCase()}.github.io`;

const response = await fetch(`${exportUrl}${basePath}/`);
if (!response.ok) {
  throw new Error(`Unable to render the project page: ${response.status} ${response.statusText}`);
}

let html = await response.text();

// The production render contains browser-ready React/Vite assets, but absolute
// URLs point to the domain root. GitHub project sites live under /<repository>/,
// so rewrite both visible markup and the embedded RSC payload consistently.
const escapedBasePath = basePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
for (const directory of ["_next", "assets", "video"]) {
  html = html.replace(
    new RegExp(`(?<!${escapedBasePath})/${directory}/`, "g"),
    `${basePath}/${directory}/`,
  );
}

for (const file of ["Meituan-Robotics-0.pdf", "favicon.png", "og.png"]) {
  html = html.replace(
    new RegExp(`(?<!${escapedBasePath})/${file.replaceAll(".", "\\.")}`, "g"),
    `${basePath}/${file}`,
  );
}

html = html
  .replace(
    new RegExp(
      `https?://(?:127\\.0\\.0\\.1|localhost)(?::\\d+)?${escapedBasePath}/og\\.png`,
      "g",
    ),
    `${publicOrigin}${basePath}/og.png`,
  )
  .replace('nav:{"pathname":"/"', `nav:{"pathname":"${basePath}/"`);

const validationHtml = html
  .replaceAll(`${basePath}/_next/`, "")
  .replaceAll(`${basePath}/assets/`, "")
  .replaceAll(`${basePath}/video/`, "");
const unresolvedAsset = validationHtml.match(/\/(?:_next|assets|video)\//);
if (unresolvedAsset) {
  throw new Error(`Found an unscoped asset URL after export: ${unresolvedAsset[0]}`);
}

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

const prefixedDirectoryName = basePath.replace(/^\//, "");
for (const entry of await readdir(clientDir, { withFileTypes: true })) {
  if (entry.name === prefixedDirectoryName) continue;
  await cp(path.join(clientDir, entry.name), path.join(outputDir, entry.name), {
    recursive: true,
  });
}

const prefixedClientDir = path.join(clientDir, prefixedDirectoryName);
for (const entry of await readdir(prefixedClientDir, { withFileTypes: true })) {
  await cp(path.join(prefixedClientDir, entry.name), path.join(outputDir, entry.name), {
    recursive: true,
  });
}
await Promise.all([
  writeFile(path.join(outputDir, "index.html"), html),
  writeFile(path.join(outputDir, "404.html"), html),
  writeFile(path.join(outputDir, ".nojekyll"), ""),
]);

console.log(`GitHub Pages export created at ${outputDir}`);
console.log(`Expected public URL: ${publicOrigin}${basePath}/`);
