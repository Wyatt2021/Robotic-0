import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const output = new URL("../.github-pages/", import.meta.url);

test("exports a self-contained GitHub Pages project site", async () => {
  const html = await readFile(new URL("index.html", output), "utf8");

  assert.match(html, /<title>Meituan-Robotics-0 \| LongCat Robotics Team<\/title>/);
  assert.match(html, /name="robots" content="noindex, nofollow, nocache"/);
  assert.match(html, /\/Robotic-0\/_next\/static\/chunks\//);
  assert.match(html, /\/Robotic-0\/video\/vla_demo_01_en\.mp4/);
  assert.match(html, /\/Robotic-0\/assets\/main-overview\.svg/);
  assert.match(
    html,
    /property="og:image" content="https:\/\/wyatt2021\.github\.io\/Robotic-0\/og\.png"/,
  );
  assert.doesNotMatch(html, /https?:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?\/Robotic-0\/og\.png/);

  const withoutScopedAssets = html
    .replaceAll("/Robotic-0/_next/", "")
    .replaceAll("/Robotic-0/assets/", "")
    .replaceAll("/Robotic-0/video/", "");
  assert.doesNotMatch(withoutScopedAssets, /\/(?:_next|assets|video)\//);

  await Promise.all([
    access(new URL("_next/static/chunks/", output)),
    access(new URL("assets/main-overview.svg", output)),
    access(new URL("video/block-placement-full.mp4", output)),
    access(new URL("video/vla_demo_01_en.mp4", output)),
    access(new URL("Meituan-Robotics-0.pdf", output)),
    access(new URL("robots.txt", output)),
    access(new URL(".nojekyll", output)),
  ]);
});
