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
  assert.match(html, /<title>Meituan-Robotics-0<\/title>/i);
  assert.doesNotMatch(html, /LongCat Robotics Team/i);
  assert.match(html, /main-overview-20260902\.svg/);
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
    html.indexOf("main-overview-20260902.svg") <
      html.indexOf("Meituan-Robotics-0 (MR0) is a vision-language-action foundation model"),
  );
  assert.doesNotMatch(html, /Unified Action Representation|Model Architecture|action-flow/);
  assert.match(html, /training-timeline/);
  assert.doesNotMatch(html, /method-facts|stage-grid/);
  assert.match(html, /14\.95 \/ 9\.53/);
  assert.match(html, /RoboTwin 2\.0/);
  assert.match(html, /RoboDojo/);
  assert.match(html, /14\.95/);
  assert.match(html, /Real Robot/);
  assert.match(html, /RECAP/);
  assert.doesNotMatch(html, /real-robot-results\.png|robotwin-results\.png/);
  assert.doesNotMatch(html, /robot-data\.png/);
  assert.doesNotMatch(html, /<table\b/i);
  assert.match(html, /Composition of the 15,060-hour robot dataset/);
  assert.match(html, /Embodiment-wise Duration/);
  assert.match(html, /Select a data source/);
  assert.match(html, /data-source="inhouse"/);
  assert.match(html, /data-source="open-real"/);
  assert.match(html, /data-source="open-sim"/);
  assert.match(html, /Licensed Real/);
  assert.match(html, /RoboDesk/);
  assert.doesNotMatch(html, /data-active-source=/);
  assert.match(html, /AgiBot G1/);
  assert.match(html, /RealMan Aida-L/);
  assert.match(html, /RoboTwin 2\.0 overall success-rate comparison, shown on an 80 to 95 percent scale/);
  assert.match(html, /Average real-robot success rate and progress score under matched HG-DAgger post-training/);
  assert.match(html, /scale 60–100%/);
  assert.match(html, /vertical-chart/);
  assert.match(html, /grouped-vertical-chart/);
  assert.doesNotMatch(html, /Agent trace metrics|≈2 Hz|10 events|6 events/);
  assert.match(html, /\+0\.4/);
  assert.match(html, /\+0\.25 SR/);
  assert.doesNotMatch(html, /0\.08 → 0\.86|15\.27|>Score</);
  assert.doesNotMatch(html, /Capability Breakdown|RoboTwin clean-scene|RoboTwin randomized-scene/);
  assert.doesNotMatch(html, /Data Curation|data-curation\.png/);
  assert.match(html, /vision-language-data\.svg/);
  assert.doesNotMatch(html, /action-head\.svg/);
  assert.match(html, /embodied-agent-20260902\.svg/);
  assert.match(html, /aria-label="Scrollable event-driven agent architecture" tabindex="0"/);
  assert.doesNotMatch(html, /main-overview\.png|vision-language-data\.png|action-head\.png|embodied-agent\.png/);
  assert.match(html, /event-retrieval-first-frame\.jpg/);
  assert.match(html, /waiting-recovery-first-frame\.jpg/);
  assert.doesNotMatch(html, /event-memory\.png|waiting-recovery\.png/);
  assert.match(html, /10,765 hours/);
  assert.match(html, /Ethernet Insertion/);
  assert.match(html, /block-placement-full\.mp4/);
  assert.match(html, /letter-block-placement\.mp4/);
  assert.match(html, /garment-folding-demo\.mp4/);
  assert.match(html, /network-cable-insertion\.mp4/);
  assert.doesNotMatch(html, /Arrange seven letter blocks in order inside a continuous groove/);
  assert.doesNotMatch(html, /Coordinate two arms while handling deformable cloth/);
  assert.doesNotMatch(html, /Localize, hand over, align, and insert a thin deformable connector/);
  assert.match(html, /block-placement-first-frame\.jpg/);
  assert.match(html, /letter-block-placement-first-frame\.jpg/);
  assert.match(html, /garment-folding-first-frame\.jpg/);
  assert.match(html, /network-cable-insertion-first-frame\.jpg/);
  assert.doesNotMatch(html, /cable-grasp-handover\.mp4|cable-align-insert\.mp4|cable-adaptive-tracking\.mp4|Demo coming soon/);
  assert.match(html, /vla_demo_01_en\.mp4/);
  assert.match(html, /vla_demo_02_en\.mp4/);
  assert.equal((html.match(/\?v=20260828-hq/g) ?? []).length, 8);
  assert.equal((html.match(/\?v=20260828-block1440/g) ?? []).length, 2);
  assert.equal((html.match(/\?v=20260828-letter1440/g) ?? []).length, 4);
  assert.doesNotMatch(html, /Each video can be viewed at 1×, 2×, or 3× playback speed\./);
  assert.doesNotMatch(html, /Code, model weights, dataset, and demos: coming soon\./);
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
  assert.match(layout, /title:\s*"Meituan-Robotics-0"/);
  assert.doesNotMatch(page + layout, /LongCat Robotics Team/i);
  assert.match(layout, /\/og\.png/);
  assert.doesNotMatch(page, /_sites-preview|SkeletonPreview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.match(styles, /--data-inhouse:\s*#f2c14e/);
  assert.match(styles, /--data-inhouse-active:\s*#e5ad27/);
  assert.match(styles, /--data-real-world:\s*#e9a200/);
  assert.doesNotMatch(styles, /--data-inhouse:\s*#(?:676d70|e9a200)/i);
  assert.match(styles, /--data-open-real-active:\s*#d9b96f/);
  assert.match(styles, /--data-open-sim-active:\s*#579895/);
  assert.doesNotMatch(styles, /--data-highlight/);
  assert.doesNotMatch(styles, /rgba\(255,\s*209,\s*0,\s*\.12\)/);
  assert.match(styles, /\.source-donut\s*\{[^}]*var\(--data-inhouse\)/);
  assert.match(styles, /\.world-donut\s*\{[^}]*var\(--data-real-world\)/);
  assert.equal((styles.match(/--source-active:\s*var\(--data-(?:inhouse|open-real|open-sim)-active\)/g) ?? []).length, 3);
  assert.equal((styles.match(/--source-tint:\s*rgba\(/g) ?? []).length, 3);
  assert.equal((styles.match(/var\(--source-active\)/g) ?? []).length, 4);
  assert.match(styles, /background:\s*var\(--source-tint\)/);
  assert.match(styles, /data-active-source\]\s+\.source-control\s*\{\s*opacity:\s*\.58/);
  assert.match(styles, /data-active-source\]\s+\.stacked-track i\s*\{\s*opacity:\s*\.32/);
  assert.match(styles, /opacity:\s*\.78;\s*stroke:\s*var\(--source-active\)/);
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

test("ships every project demo at high-bitrate source quality in a browser-compatible H.264 container", async () => {
  const videos = await Promise.all([
    readFile(new URL("../public/video/block-placement-full.mp4", import.meta.url)),
    readFile(new URL("../public/video/letter-block-placement.mp4", import.meta.url)),
    readFile(new URL("../public/video/garment-folding-demo.mp4", import.meta.url)),
    readFile(new URL("../public/video/network-cable-insertion.mp4", import.meta.url)),
    readFile(new URL("../public/video/vla_demo_01_en.mp4", import.meta.url)),
    readFile(new URL("../public/video/vla_demo_02_en.mp4", import.meta.url)),
  ]);

  const minimumBytes = [
    90 * 1024 * 1024,
    80 * 1024 * 1024,
    70 * 1024 * 1024,
    40 * 1024 * 1024,
    50 * 1024 * 1024,
    20 * 1024 * 1024,
  ];

  for (const [index, video] of videos.entries()) {
    assert.equal(video.includes(Buffer.from("avc1")), true);
    assert.equal(video.includes(Buffer.from("mp4v")), false);
    assert.equal(video.includes(Buffer.from("soun")), false);
    assert.ok(video.indexOf(Buffer.from("moov")) < video.indexOf(Buffer.from("mdat")));
    assert.ok(video.length >= minimumBytes[index]);
    assert.ok(video.length < 100 * 1024 * 1024);
  }

  assert.deepEqual(videos.map(readTrackDimensions), [
    [2560, 1440],
    [2560, 1440],
    [2560, 1440],
    [1920, 1080],
    [1280, 720],
    [1280, 720],
  ]);
});

test("serves the PPT-derived project figures as cropped SVG assets", async () => {
  const figures = await Promise.all([
    readFile(new URL("../public/assets/main-overview-20260902.svg", import.meta.url), "utf8"),
    readFile(new URL("../public/assets/vision-language-data.svg", import.meta.url), "utf8"),
    readFile(new URL("../public/assets/embodied-agent-20260902.svg", import.meta.url), "utf8"),
  ]);

  for (const figure of figures) {
    assert.match(figure, /<svg\b[^>]*viewBox="[^"]+"[^>]*preserveAspectRatio="xMidYMid meet"/);
    assert.match(figure, /<path\b/);
  }

  assert.match(figures[0], /width="1762\.545" height="1169\.894" viewBox="804\.484 1061\.304 1762\.545 1169\.894"/);
  assert.match(figures[2], /width="2484\.841" height="1243\.087" viewBox="217\.386 78\.301 2484\.841 1243\.087"/);
});
