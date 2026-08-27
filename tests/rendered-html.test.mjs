import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const basePath = process.env.GITHUB_PAGES_BASE_PATH ?? "";

  return worker.fetch(
    new Request(`http://localhost${basePath}/`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Meituan-Robotics-0 project page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Meituan-Robotics-0 \| LongCat Robotics Team<\/title>/i);
  assert.match(html, /main-overview\.svg/);
  assert.match(html, />Overview</);
  assert.match(html, />Data</);
  assert.match(html, />Method</);
  assert.match(html, />Evaluation</);
  assert.match(html, />Real-World Demos</);
  assert.match(html, />Conclusion</);
  assert.match(html, />Citation</);
  assert.match(html, /name="robots" content="noindex, nofollow, nocache"/);
  assert.match(html, /name="googlebot" content="noindex, nofollow, noimageindex"/);
  assert.doesNotMatch(html, />Applications</);
  assert.match(html, /Page reading progress/);
  assert.match(html, /15,060h/);
  assert.ok(
    html.indexOf("main-overview.svg") <
      html.indexOf("Meituan-Robotics-0 is a vision-language-action foundation model"),
  );
  assert.doesNotMatch(html, /Unified Action Representation|Model Architecture|action-flow/);
  assert.match(html, /training-timeline/);
  assert.doesNotMatch(html, /method-facts|stage-grid/);
  assert.match(html, /0\.08 → 0\.86/);
  assert.match(html, /RoboTwin 2\.0/);
  assert.match(html, /RoboDojo/);
  assert.match(html, /15\.27/);
  assert.match(html, /Real Robot/);
  assert.match(html, />\+ HIL</);
  assert.doesNotMatch(html, /real-robot-results\.png|robotwin-results\.png/);
  assert.doesNotMatch(html, /robot-data\.png/);
  assert.doesNotMatch(html, /<table\b/i);
  assert.match(html, /Composition of the 15,060-hour robot dataset/);
  assert.match(html, /Embodiment-wise Duration/);
  assert.match(html, /Select a data source/);
  assert.match(html, /data-source="inhouse"/);
  assert.match(html, /data-source="open-real"/);
  assert.match(html, /data-source="open-sim"/);
  assert.match(html, /AgiBot G1/);
  assert.match(html, /RealMan Aida-L/);
  assert.match(html, /RoboTwin 2\.0 overall success-rate comparison, shown on an 80 to 95 percent scale/);
  assert.match(html, /Average real-robot success rate and score comparison/);
  assert.match(html, /scale 60–100%/);
  assert.match(html, /vertical-chart/);
  assert.match(html, /grouped-vertical-chart/);
  assert.doesNotMatch(html, /Agent trace metrics|≈2 Hz|10 events|6 events/);
  assert.match(html, /\+0\.2/);
  assert.match(html, /\+0\.78 SR/);
  assert.doesNotMatch(html, /Capability Breakdown|RoboTwin clean-scene|RoboTwin randomized-scene/);
  assert.doesNotMatch(html, /Data Curation|data-curation\.png/);
  assert.match(html, /vision-language-data\.svg/);
  assert.doesNotMatch(html, /action-head\.svg/);
  assert.match(html, /embodied-agent\.svg/);
  assert.doesNotMatch(html, /main-overview\.png|vision-language-data\.png|action-head\.png|embodied-agent\.png/);
  assert.match(html, /event-retrieval-first-frame\.jpg/);
  assert.match(html, /waiting-recovery-first-frame\.jpg/);
  assert.doesNotMatch(html, /event-memory\.png|waiting-recovery\.png/);
  assert.match(html, /10,765 hours/);
  assert.match(html, /Network Cable Insertion/);
  assert.match(html, /block-placement-full\.mp4/);
  assert.match(html, /letter-block-placement\.mp4/);
  assert.match(html, /garment-folding-demo\.mp4/);
  assert.match(html, /network-cable-insertion\.mp4/);
  assert.match(html, /letter-block-placement-first-frame\.jpg/);
  assert.match(html, /garment-folding-first-frame\.jpg/);
  assert.match(html, /network-cable-insertion-first-frame\.jpg/);
  assert.doesNotMatch(html, /cable-grasp-handover\.mp4|cable-align-insert\.mp4|cable-adaptive-tracking\.mp4|Demo coming soon/);
  assert.match(html, /vla_demo_01_en\.mp4/);
  assert.match(html, /vla_demo_02_en\.mp4/);
  assert.match(html, /playback speed/);
  assert.match(html, />Copy Citation</);
  assert.match(html, /<option value="1"/);
  assert.match(html, /<option value="2"/);
  assert.match(html, /<option value="3"/);
  assert.doesNotMatch(html, /<option value="(?:0\.5|1\.5)"/);
  assert.match(html, /Cross-task Event Retrieval demo/);
  assert.match(html, /Subtask Waiting and Recovery demo/);
  assert.doesNotMatch(html, /Demo 04 · Coming soon|Demo 05 · Coming soon|demo placeholder/);
  assert.match(html, /og:image/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("keeps the finished site free of starter-preview dependencies", async () => {
  const [page, layout, packageJson, styles] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /Meituan-Robotics-0/);
  assert.match(layout, /Meituan-Robotics-0 \| LongCat Robotics Team/);
  assert.match(layout, /\/og\.png/);
  assert.doesNotMatch(page, /_sites-preview|SkeletonPreview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.match(styles, /--data-inhouse:\s*#676d70/);
  assert.doesNotMatch(styles, /--data-inhouse:\s*#e9a200/i);
  assert.match(
    styles,
    /top:\s*calc\(var\(--training-axis-y\) - var\(--training-stage-offset\)\)/,
  );
});

function readTrackDimensions(video) {
  const typeOffset = video.indexOf(Buffer.from("tkhd"));
  assert.notEqual(typeOffset, -1, "MP4 is missing a track header");

  const boxStart = typeOffset - 4;
  const version = video[typeOffset + 4];
  const dimensionsOffset = boxStart + (version === 1 ? 96 : 84);
  return [
    video.readUInt32BE(dimensionsOffset) / 65536,
    video.readUInt32BE(dimensionsOffset + 4) / 65536,
  ];
}

test("ships every project demo at its high-resolution source dimensions in a browser-compatible H.264 container", async () => {
  const videos = await Promise.all([
    readFile(new URL("../public/video/block-placement-full.mp4", import.meta.url)),
    readFile(new URL("../public/video/letter-block-placement.mp4", import.meta.url)),
    readFile(new URL("../public/video/garment-folding-demo.mp4", import.meta.url)),
    readFile(new URL("../public/video/network-cable-insertion.mp4", import.meta.url)),
    readFile(new URL("../public/video/vla_demo_01_en.mp4", import.meta.url)),
    readFile(new URL("../public/video/vla_demo_02_en.mp4", import.meta.url)),
  ]);

  for (const video of videos) {
    assert.equal(video.includes(Buffer.from("avc1")), true);
    assert.equal(video.includes(Buffer.from("mp4v")), false);
  }

  assert.deepEqual(videos.map(readTrackDimensions), [
    [960, 540],
    [960, 540],
    [960, 540],
    [960, 540],
    [1280, 720],
    [1280, 720],
  ]);
});

test("serves the PPT-derived project figures as cropped SVG assets", async () => {
  const figures = await Promise.all([
    readFile(new URL("../public/assets/main-overview.svg", import.meta.url), "utf8"),
    readFile(new URL("../public/assets/vision-language-data.svg", import.meta.url), "utf8"),
    readFile(new URL("../public/assets/embodied-agent.svg", import.meta.url), "utf8"),
  ]);

  for (const figure of figures) {
    assert.match(figure, /<svg\b[^>]*viewBox="[^"]+"[^>]*preserveAspectRatio="xMidYMid meet"/);
    assert.match(figure, /<path\b/);
  }
});
