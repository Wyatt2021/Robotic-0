import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const output = new URL("../.github-pages/", import.meta.url);

test("exports a self-contained GitHub Pages project site", async () => {
  const html = await readFile(new URL("index.html", output), "utf8");
  const notFoundHtml = await readFile(new URL("404.html", output), "utf8");

  assert.match(html, /<title>Meituan-Robotics-0<\/title>/);
  assert.doesNotMatch(html, /LongCat Robotics Team/i);
  assert.match(html, /name="robots" content="noindex, nofollow, nocache"/);
  assert.match(html, /\/Robotic-0\/_next\/static\/css\//);
  assert.match(html, /\/Robotic-0\/video\/vla_demo_01_en\.mp4/);
  assert.match(html, /\/Robotic-0\/assets\/main-overview\.svg\?v=20260902/);
  assert.match(html, /\/Robotic-0\/assets\/embodied-agent\.svg\?v=20260902/);
  assert.match(html, /<script src="\/Robotic-0\/github-pages\.js" defer><\/script>/);
  assert.match(
    html,
    /property="og:image" content="https:\/\/wyatt2021\.github\.io\/Robotic-0\/og\.png"/,
  );
  assert.doesNotMatch(html, /https?:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?\/Robotic-0\/og\.png/);
  assert.doesNotMatch(html, /vinext\.navigationRuntime/);
  assert.doesNotMatch(html, /<script\b[^>]*type=["']module["']/i);
  assert.doesNotMatch(html, /rel=["']modulepreload["']/i);
  assert.doesNotMatch(html, /\/Robotic-0\/Robotic-0\//);
  assert.equal((html.match(/<video\b/g) ?? []).length, 6);
  assert.doesNotMatch(notFoundHtml, /vinext\.navigationRuntime|rel=["']modulepreload["']/i);

  const enhancer = await readFile(new URL("github-pages.js", output), "utf8");
  assert.match(enhancer, /playbackRate/);
  assert.match(enhancer, /copy-citation/);
  assert.match(enhancer, /dataset\.activeSource/);

  const withoutScopedAssets = html
    .replaceAll("/Robotic-0/_next/", "")
    .replaceAll("/Robotic-0/assets/", "")
    .replaceAll("/Robotic-0/video/", "");
  assert.doesNotMatch(withoutScopedAssets, /\/(?:_next|assets|video)\//);

  const references = [...html.matchAll(/\b(?:src|href|poster)="([^"]+)"/g)].map(
    (match) => match[1],
  );
  const localFiles = references.filter((reference) => reference.startsWith("/"));
  for (const reference of localFiles) {
    assert.ok(
      reference.startsWith("/Robotic-0/"),
      `Local asset is outside the project base path: ${reference}`,
    );
    const assetPath = decodeURIComponent(reference.slice("/Robotic-0/".length)).split(/[?#]/)[0];
    if (assetPath) await access(new URL(assetPath, output));
  }

  await Promise.all([
    access(new URL("_next/static/chunks/", output)),
    access(new URL("assets/main-overview.svg", output)),
    access(new URL("assets/embodied-agent.svg", output)),
    access(new URL("video/block-placement-full.mp4", output)),
    access(new URL("video/vla_demo_01_en.mp4", output)),
    access(new URL("Meituan-Robotics-0.pdf", output)),
    access(new URL("github-pages.js", output)),
    access(new URL("robots.txt", output)),
    access(new URL(".nojekyll", output)),
  ]);
});
