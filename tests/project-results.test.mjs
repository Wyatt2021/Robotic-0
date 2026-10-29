import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  renderOverviewResults,
  splitOverview,
  startMarker,
  synchronizeOverview,
  validateResults,
} from "../scripts/sync-overview-results.mjs";

const results = JSON.parse(await readFile(new URL("../data/project-results.json", import.meta.url), "utf8"));
const overview = await readFile(new URL("../public/assets/main-overview-20260902.svg", import.meta.url), "utf8");

test("keeps benchmark sources and post-training protocols separate", () => {
  validateResults(results);
  assert.equal(results.paper.version, "2026-10-29");
  assert.deepEqual(results.data, { visionLanguageSamples: 147000000, robotHours: 15060 });
  assert.deepEqual(results.robotwin.models.map(({ label, value }) => [label, value]), [
    ["ABot-M0", 85.6], ["Fast-WAM", 91.8], ["InternVLA-A1.5", 93.2], ["MR0", 93.6],
  ]);
  assert.deepEqual(results.robodojo.models.map(({ label, value }) => [label, value]), [
    ["VLACT", 10.66], ["InternVLA-A1.5", 11.15], ["π0.5", 11.41], ["Spatial Forcing", 12.38], ["MR0", 19.68],
  ]);
  assert.equal(Object.hasOwn(results.robodojo, "mr0SR"), false, "Do not mix the Figure 1 Score with a different experiment's SR");
  assert.deepEqual(results.robodojo.sources, { baselines: "Figure 1", mr0: "Table 5" });
  assert.equal(results.robodojo.min, 0);
  assert.equal(results.robodojo.max, 20);
  assert.equal(results.robodojo.selectedBaselines, true);
  assert.equal(results.realRobot.protocol, "HG-DAgger");
  assert.deepEqual(results.realRobot.baseline, { label: "π0.5", sr: 0.69, ps: 0.85 });
  assert.deepEqual(results.realRobot.mr0, { label: "MR0", sr: 0.78, ps: 0.91 });
  assert.deepEqual(results.ethernetRollback.baseline, { label: "RECAP", sr: 0.6, ps: 0.67 });
  assert.deepEqual(results.ethernetRollback.mr0, { label: "CFG-DAgger", sr: 0.7, ps: 0.9 });
  assert.deepEqual(results.demos.letterBlock, { protocol: "HG-DAgger", sr: 0.83, ps: 0.96 });
  assert.deepEqual(results.demos.garment, { protocol: "HG-DAgger", sr: 0.83, ps: 0.93 });
  assert.deepEqual(results.demos.ethernet, { protocol: "CFG-DAgger", resultRef: "ethernetRollback.mr0" });
});

test("generates all three overview charts from the shared result data", () => {
  const generated = renderOverviewResults(results);
  assert.equal(splitOverview(overview).generated, generated);
  assert.equal(synchronizeOverview(overview, results), overview);
  assert.equal((generated.match(/data-model=/g) ?? []).length, 13);
  assert.match(generated, /id="real-robot-comparison"/);
  assert.match(generated, /id="robotwin-comparison"/);
  assert.match(generated, /id="robodojo-comparison"/);
  assert.match(generated, /Fig\. 1 baselines · MR0: Table 5/);
  assert.match(generated, /Matched HG-DAgger/);
  assert.doesNotMatch(generated, /SimpleMem|KinRT|Hy-Embodied|14\.95|14\.07|9\.53/);

  const bars = [...generated.matchAll(/<rect data-model="([^"]+)" data-(sr|ps|score)="([^"]+)"[^>]*y="([^"]+)"[^>]*height="([^"]+)"[^>]*fill="([^"]+)"/g)];
  assert.equal(bars.length, 13);
  for (const [, label, metric, valueText, yText, heightText, color] of bars) {
    const value = Number(valueText);
    const height = Number(heightText);
    const scaleMin = metric === "sr" && value > 1 ? results.robotwin.min : 0;
    const scaleMax = metric === "score" ? 20 : value > 1 ? results.robotwin.max : 1;
    assert.ok(Math.abs(height - (value - scaleMin) / (scaleMax - scaleMin) * 85) < 0.001);
    assert.ok(Math.abs(Number(yText) + height - 1008) < 0.001);
    assert.equal(color, label === "MR0" ? "#ffbd00" : "#969696");
  }
});

test("updating results changes chart text and geometry, not the surrounding artwork", () => {
  const nextResults = structuredClone(results);
  nextResults.robodojo.models.find((model) => model.highlight).value = 19.5;
  const updated = synchronizeOverview(overview, nextResults);
  const before = splitOverview(overview);
  const after = splitOverview(updated);
  assert.equal(after.prefix, before.prefix);
  assert.equal(after.suffix, before.suffix);
  assert.match(after.generated, /data-model="MR0" data-score="19\.5"[^>]*y="925\.125"[^>]*height="82\.875"/);
  assert.match(after.generated, />19\.50<\/text>/);
  assert.doesNotMatch(after.generated, /19\.68/);
});

test("rejects missing chart boundaries and invalid or mismatched results", () => {
  assert.throws(() => synchronizeOverview("<svg></svg>", results), /Unable to locate/);
  assert.throws(() => synchronizeOverview(startMarker + "<g></g>", results), /Invalid generated results markers/);
  const wrongReference = structuredClone(results);
  wrongReference.demos.ethernet.resultRef = "realRobot.mr0";
  assert.throws(() => validateResults(wrongReference), /must reference/);
  const outOfRange = structuredClone(results);
  outOfRange.robodojo.models.find((model) => model.highlight).value = 21;
  assert.throws(() => validateResults(outOfRange), /RoboDojo/i);
  const nonFinite = structuredClone(results);
  nonFinite.realRobot.mr0.sr = NaN;
  assert.throws(() => validateResults(nonFinite), /finite number/);
});
