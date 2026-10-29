import CopyCitation from "./copy-citation";
import ProjectNav from "./project-nav";
import RevealOnView from "./reveal-on-view";
import RobotDataFigure from "./robot-data-figure";
import SystemOverview from "./system-overview";
import VideoPlayer from "./video-player";

type BarItem = {
  label: string;
  value: number;
  display?: string;
  highlight?: boolean;
};

type VerticalGroup = {
  label: string;
  bars: BarItem[];
};

const citationText = `Meituan Robotics Team. “Meituan-Robotics-0: A Vision-Language-Action
Foundation Model for Desktop Manipulation.” Technical Report, 2026.`;

function VerticalBarChart({
  items,
  min = 0,
  max,
  label,
}: {
  items: BarItem[];
  min?: number;
  max: number;
  label: string;
}) {
  return (
    <div className="vertical-chart" role="group" aria-label={label}>
      {items.map((item, index) => (
        <div className={`vertical-column${item.highlight ? " highlight" : ""}`} key={item.label}>
          <b>{item.display ?? item.value}</b>
          <div className="vertical-track"><span style={{ height: `${Math.max(0, Math.min(100, (item.value - min) / (max - min) * 100))}%`, transitionDelay: `${index * 65}ms` }} /></div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function GroupedVerticalChart({
  groups,
  min = 0,
  max,
  series,
  label,
}: {
  groups: VerticalGroup[];
  min?: number;
  max: number;
  series: [string, string];
  label: string;
}) {
  return (
    <div className="grouped-vertical-chart" role="group" aria-label={label}>
      <div className="vertical-legend"><span>{series[0]}</span><span>{series[1]}</span></div>
      <div className="vertical-groups">
        {groups.map((group, groupIndex) => (
          <div className="vertical-group" key={group.label}>
            <div className="group-bars">
              {group.bars.map((bar, barIndex) => (
                <div className={`grouped-column${bar.highlight ? " highlight" : ""}`} key={bar.label} aria-label={`${bar.label}: ${bar.display ?? bar.value}`}>
                  <b>{bar.display ?? bar.value}</b>
                  <div className="vertical-track"><span style={{ height: `${Math.max(0, Math.min(100, (bar.value - min) / (max - min) * 100))}%`, transitionDelay: `${(groupIndex * 2 + barIndex) * 80}ms` }} /></div>
                </div>
              ))}
            </div>
            <strong>{group.label}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main id="top">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Meituan Robotics home">
          <span className="brand-mark">美团</span>
          <span>Meituan Robotics</span>
        </a>
        <ProjectNav />
      </header>

      <section className="hero section-shell">
        <h1>Meituan-Robotics-0</h1>
        <p className="hero-subtitle">
          A Vision-Language-Action Foundation Model for Desktop Manipulation
        </p>
        <div className="resource-row">
          <a className="resource primary" href="/Meituan-Robotics-0.pdf?v=20261029">
            Technical Report <span aria-hidden="true">↗</span>
          </a>
          <span className="resource unavailable">Code · Coming soon</span>
          <span className="resource unavailable">Model · Coming soon</span>
          <span className="resource unavailable">Dataset · Coming soon</span>
        </div>

        <figure className="hero-demo">
          <VideoPlayer
            src="/video/block-placement-full.mp4?v=20260828-block1440"
            poster="/assets/block-placement-first-frame.jpg"
            ariaLabel="Full Letter-block Placement featured demo"
          />
        </figure>
      </section>

      <section className="project-section section-shell" id="overview">
        <div className="section-heading">
          <h2>Overview</h2>
        </div>
        <SystemOverview />
        <div className="overview-copy">
          <p>
            Meituan-Robotics-0 (MR0) is a vision-language-action foundation model
            and embodied-agent system for stationary-base desktop manipulation.
            It combines 147 million vision-language samples with 15,060 hours of
            robot trajectories, then transfers these priors to continuous control
            through a three-stage training recipe. The standalone policy reaches
            93.6% success on RoboTwin 2.0 and an average Score of 19.68 with
            14.07% success on RoboDojo using compact historical context.
            Real-world post-training uses demonstrations and human corrections;
            Rollback pairs replaced policy segments with corrective continuations
            for CFG-DAgger. The event-driven agent adds persistent task memory and
            condition-aware resumption for long-horizon execution.
          </p>
        </div>
        <div className="fact-grid" aria-label="Key results">
          <div><strong>147M</strong><span>curated vision-language samples</span></div>
          <div><strong>15,060h</strong><span>curated robot trajectory data</span></div>
          <div><strong>93.6%</strong><span>RoboTwin 2.0 overall SR</span></div>
          <div><strong>19.68 / 14.07%</strong><span>RoboDojo avg. Score / SR</span></div>
        </div>
      </section>

      <section className="project-section section-shell" id="data">
        <div className="section-heading">
          <h2>Data</h2>
        </div>
        <p className="section-intro">
          The training corpus combines broad visual-language supervision with
          curated robot trajectories across 12 embodiments. Vision-language data
          supplies semantic coverage, while the robot corpus combines RoboDesk,
          licensed real-robot data, and open simulation data to ground that
          knowledge in executable behavior.
        </p>

        <div className="subsection">
          <div className="subsection-copy">
            <h3>Vision-Language Data</h3>
            <p>
              147 million samples provide both general visual understanding and
              embodied grounding. General data accounts for 78% of the mixture,
              while embodied data contributes the remaining 22%. The embodied
              portion emphasizes robot-centric scenes, spatial relationships, and
              manipulation progress without discarding the backbone&apos;s broader
              visual-language capability.
            </p>
          </div>
          <figure className="paper-figure wide-figure">
            <img
              src="/assets/vision-language-data-20261029.svg"
              alt="Composition and examples of the vision-language dataset"
              width={422}
              height={182}
              loading="lazy"
            />
          </figure>
        </div>

        <div className="subsection">
          <div className="subsection-copy">
            <h3>Robotic Manipulation Data</h3>
            <p>
              The final robot corpus contains 15,060 hours of retained
              tabletop trajectories across 12 embodiments. It comprises 3,235
              hours of curated open-source real-robot data from RoboDesk, 7,530
              hours of licensed real-robot data, and 4,295 hours of open
              simulation data. In total, 10,765 hours come from physical robot
              execution. The corpus is restricted to stationary-base manipulation
              and excludes segments containing base motion.
            </p>
          </div>
          <RobotDataFigure />
        </div>

      </section>

      <section className="project-section section-shell" id="method">
        <div className="section-heading">
          <h2>Method</h2>
        </div>
        <p className="section-intro">
          The method combines a three-stage training recipe with an event-driven
          agent. Discrete action-token pre-training establishes broad behavioral
          priors, continuous flow-matching mid-training transfers them to precise
          cross-embodiment control, and closed-loop post-training adapts the policy
          to errors encountered during real-world deployment.
        </p>

        <div className="subsection">
          <div className="subsection-copy">
            <h3>Training Recipe</h3>
            <p>
              The three stages separate broad multimodal learning from continuous
              control and real-world adaptation. SFT initializes a task policy
              for data collection. HG-DAgger, RECAP, and CFG-DAgger are alternative
              post-training strategies: each is trained anew from the same
              mid-training checkpoint using cumulative data, not sequentially
              applied to one policy.
            </p>
          </div>
          <div className="training-timeline" role="list" aria-label="Three-stage training timeline from scale to precision to reliability">
            <article className="training-stage" role="listitem">
              <header><span>01</span><b>Scale</b></header>
              <div className="training-stage-body">
                <small>Pre-training</small>
                <h4>FAST + VLM</h4>
                <p>Train the Qwen3.5-4B backbone end to end with vision-language supervision and discrete FAST action tokens using a shared next-token objective.</p>
                <strong className="stage-outcome">Broad action priors</strong>
              </div>
            </article>

            <article className="training-stage" role="listitem">
              <header><span>02</span><b>Precision</b></header>
              <div className="training-stage-body">
                <small>Mid-training</small>
                <h4>MMDiT + JiT</h4>
                <p>Initialize a continuous MMDiT action head with JiT clean-sample prediction, masked flow matching, and a unified end-effector representation.</p>
                <strong className="stage-outcome">Coherent action chunks</strong>
              </div>
            </article>

            <article className="training-stage alignment-stage" role="listitem">
              <header><span>03</span><b>Reliability</b></header>
              <div className="training-stage-body">
                <small>Closed-loop post-training</small>
                <div className="alignment-steps" aria-label="Alternative post-training algorithms: HG-DAgger, RECAP, and CFG-DAgger">
                  <strong>HG-DAgger</strong><strong>RECAP</strong><strong>CFG-DAgger</strong>
                </div>
                <p>Learn from demonstrations and corrections. Rollback additionally retains replaced policy segments as negative supervision for CFG-DAgger.</p>
                <strong className="stage-outcome">Closed-loop policy optimization</strong>
              </div>
            </article>
          </div>
          <p className="method-note">
            The stage-specific pre-training mixture contains approximately 13.6k
            hours of VLA data and 150.7M VLM samples from 64 sub-datasets. These
            effective training pools are distinct from the curated inventories
            summarized in Data.
          </p>
        </div>

        <div className="subsection">
          <div className="subsection-copy">
            <h3>Rollback and CFG-DAgger</h3>
            <p>
              Near a failure, an operator returns the robot to an earlier recorded
              state and provides a corrective continuation. Rollback pairs the
              replaced policy segment with its human replacement from the same
              anchor. CFG-DAgger treats demonstrations and human corrections as
              positive data and replaced segments as negative data, independently
              of the final episode outcome.
            </p>
            <p>
              A shared policy learns positive, negative, and unconditional branches;
              classifier-free guidance combines positive and negative predictions
              at inference. This avoids value-model training, advantage labeling,
              and additional autonomous rollout collection. In the matched
              comparison, RECAP instead reconstructs complete trajectories from
              the same recorded Rollback branches for value and advantage learning.
            </p>
          </div>
          <figure className="paper-figure wide-figure">
            <img src="/assets/rollback-20261029.svg" alt="Rollback pairs replaced policy segments with human corrections from a shared historical anchor" width={419} height={125} loading="lazy" />
          </figure>
        </div>

        <div className="subsection" id="agent">
          <div className="subsection-copy">
            <h3>Event-Driven Agent</h3>
            <p>
              A Monitor, Memory Manager, and Planner operate above the VLA policy
              at different rates. The Monitor summarizes short visual windows,
              the Memory Manager converts them into persistent events with
              supporting keyframes, and the Planner is invoked only when an event
              changes task progress or feasibility. Low-level control therefore
              continues at robot frequency while the system preserves cross-task
              state and resumes objectives after temporary interruptions.
            </p>
          </div>
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- The horizontally scrollable diagram must be reachable by keyboard. */}
          <figure className="paper-figure wide-figure agent-figure" role="region" aria-label="Scrollable event-driven agent architecture" tabIndex={0}>
            <img
              src="/assets/embodied-agent-20261029.svg"
              alt="Event-driven agent with task context, an asynchronous agent loop, and high-frequency action execution"
              width={442}
              height={221}
              loading="lazy"
            />
          </figure>
        </div>
      </section>

      <section className="project-section section-shell" id="evaluation">
        <div className="section-heading">
          <h2>Evaluation</h2>
        </div>
        <p className="section-intro">
          Evaluation spans simulation benchmarks and physical robot deployment.
          Simulation measures standalone-policy transfer, while real-robot studies
          report success rate (SR) and progress score (PS) under matched
          post-training protocols.
        </p>

        <div className="subsection">
          <div className="subsection-copy">
            <h3>Simulation and Real-Robot Evaluation</h3>
            <p>
              We evaluate MR0 on RoboTwin 2.0, RoboDojo, and three real-robot
              tasks: letter-block placement, garment folding, and Ethernet
              insertion.
            </p>
          </div>
          <RevealOnView className="result-card-grid">
            <article className="result-card">
              <header>
                <div><span>Simulation · Overall SR</span><h4>RoboTwin 2.0</h4></div>
                <strong>93.6%</strong>
              </header>
              <VerticalBarChart label="RoboTwin 2.0 overall success-rate comparison, shown on an 80 to 95 percent scale" min={80} max={95} items={[
                { label: "ABot-M0", value: 85.6 },
                { label: "Fast-WAM", value: 91.8 },
                { label: "InternVLA", value: 93.2 },
                { label: "MR0", value: 93.6, highlight: true },
              ]} />
              <footer><b>+0.4</b> vs. InternVLA-A1.5 · scale 80–95%</footer>
            </article>

            <article className="result-card">
              <header>
                <div><span>Simulation · Average Score</span><h4>RoboDojo</h4></div>
                <strong>19.68</strong>
              </header>
              <VerticalBarChart label="MR0 RoboDojo capability Scores from Table 5; these are not model rankings" max={40} items={[
                { label: "General.", value: 14.59 },
                { label: "Precision", value: 20.40, display: "20.40" },
                { label: "Long-Horizon", value: 27.78 },
                { label: "Memory", value: 32.23 },
                { label: "Open", value: 3.40, display: "3.40" },
              ]} />
              <footer><b>Average SR 14.07%</b> · Table 5, Oct. 26, 2026 · Score scale 0–40</footer>
            </article>

            <article className="result-card">
              <header>
                <div><span>Matched HG-DAgger · PS</span><h4>Real Robot</h4></div>
                <strong className="metric-pair">0.96 / 0.93</strong>
              </header>
              <GroupedVerticalChart label="Task-specific progress scores under matched HG-DAgger post-training, shown on a 0.6 to 1 scale" min={0.6} max={1} series={["π0.5", "MR0"]} groups={[
                { label: "Letter-block PS", bars: [{ label: "π0.5", value: 0.90, display: "0.90" }, { label: "MR0", value: 0.96, highlight: true }] },
                { label: "Garment PS", bars: [{ label: "π0.5", value: 0.91 }, { label: "MR0", value: 0.93, highlight: true }] },
              ]} />
              <footer><b>Garment completion: 133 → 117 s</b> · PS scale 0.6–1</footer>
            </article>

            <article className="result-card">
              <header>
                <div><span>Ethernet insertion · Rollback</span><h4>CFG-DAgger</h4></div>
                <strong className="metric-pair">0.70 / 0.90</strong>
              </header>
              <GroupedVerticalChart label="CFG-DAgger compared with RECAP on Ethernet insertion using the same demonstrations and Rollback episodes" max={1} series={["RECAP", "CFG-DAgger"]} groups={[
                { label: "SR", bars: [{ label: "RECAP", value: 0.60, display: "0.60" }, { label: "CFG-DAgger", value: 0.70, display: "0.70", highlight: true }] },
                { label: "PS", bars: [{ label: "RECAP", value: 0.67 }, { label: "CFG-DAgger", value: 0.90, display: "0.90", highlight: true }] },
              ]} />
              <footer><b>+0.10 SR / +0.23 PS</b> vs. RECAP · full Rollback set · scale 0–1</footer>
            </article>

          </RevealOnView>
          <p className="method-note">
            RoboDojo uses an initial-scene reference and latent-action history
            over the most recent 20 seconds, without the embodied-agent system
            or RL-based post-training. Open-vocabulary instruction following
            remains a limitation (Score 3.40 / SR 3.00%). Real-robot charts keep
            the matched HG-DAgger study separate from the Rollback comparison.
          </p>
        </div>
      </section>

      <section className="project-section section-shell" id="demos">
        <div className="section-heading">
          <h2>Real-World Demos</h2>
        </div>
        <p className="section-intro">
          Real-robot demonstrations show the policy executing precise bimanual
          manipulation and the agent preserving task state across interruptions.
        </p>

        <div className="subsection">
          <div className="subsection-copy">
            <h3>Desktop Manipulation</h3>
            <p>
              Three desktop tasks cover ordered placement, deformable-object
              handling, and contact-rich insertion. The set stresses sequencing,
              bimanual coordination, recovery from local errors, and fine geometric
              alignment. Videos illustrate the tasks; the metrics summarize the
              paper&apos;s evaluations: HG-DAgger for letter-block placement and
              garment folding, and CFG-DAgger for Ethernet insertion. SR requires
              full completion. PS measures consecutive correct placements for
              blocks, time-based execution efficiency for folding, and completed
              grasping, handover, and insertion milestones for Ethernet insertion.
            </p>
          </div>
          <div className="task-grid">
            <article className="task-card">
              <div className="task-media task-demo-media">
                <VideoPlayer
                  src="/video/letter-block-placement.mp4?v=20260828-letter1440"
                  poster="/assets/letter-block-placement-first-frame.jpg?v=20260828-letter1440"
                  ariaLabel="Letter-block Placement demo"
                />
              </div>
              <div className="task-copy">
                <h4>Letter-block Placement</h4>
                <dl><div><dt>SR</dt><dd>0.83</dd></div><div><dt>PS</dt><dd>0.96</dd></div></dl>
              </div>
            </article>
            <article className="task-card">
              <div className="task-media task-demo-media">
                <VideoPlayer
                  src="/video/garment-folding-demo.mp4?v=20260828-hq"
                  poster="/assets/garment-folding-first-frame.jpg"
                  ariaLabel="Garment Folding demo"
                />
              </div>
              <div className="task-copy">
                <h4>Garment Folding</h4>
                <dl><div><dt>SR</dt><dd>0.83</dd></div><div><dt>PS</dt><dd>0.93</dd></div></dl>
              </div>
            </article>
            <article className="task-card">
              <div className="task-media task-demo-media">
                <VideoPlayer
                  src="/video/network-cable-insertion.mp4?v=20260828-hq"
                  poster="/assets/network-cable-insertion-first-frame.jpg"
                  ariaLabel="Ethernet Insertion demo"
                />
              </div>
              <div className="task-copy">
                <h4>Ethernet Insertion</h4>
                <dl><div><dt>SR</dt><dd>0.70</dd></div><div><dt>PS</dt><dd>0.90</dd></div></dl>
              </div>
            </article>
          </div>
        </div>

        <div className="subsection" id="agent-demos">
          <div className="subsection-copy">
            <h3>Long-Horizon Agent Behaviors</h3>
            <p>
              Two deployment traces illustrate persistent event memory and
              conditional recovery. These videos are qualitative cases rather than
              an aggregate success-rate benchmark.
            </p>
          </div>
          <div className="agent-cases">
            <article>
              <figure className="agent-demo-media">
                <VideoPlayer
                  src="/video/vla_demo_01_en.mp4?v=20260828-hq"
                  poster="/assets/event-retrieval-first-frame.jpg"
                  ariaLabel="Cross-task Event Retrieval demo"
                />
              </figure>
              <div>
                <h4>Cross-task Event Retrieval</h4>
                <p>While the screwdriver subtask continues, a person moves the key from the bottom drawer to the middle drawer. The agent stores that event and later retrieves the key&apos;s last observed location for a new instruction.</p>
              </div>
            </article>
            <article>
              <figure className="agent-demo-media">
                <VideoPlayer
                  src="/video/vla_demo_02_en.mp4?v=20260828-hq"
                  poster="/assets/waiting-recovery-first-frame.jpg"
                  ariaLabel="Subtask Waiting and Recovery demo"
                />
              </figure>
              <div>
                <h4>Subtask Waiting and Recovery</h4>
                <p>When the key is temporarily removed, the agent preserves the pending placement objective and waits. Its return triggers reassessment, allowing the original instruction to resume and complete.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="project-section section-shell" id="conclusion">
        <div className="section-heading">
          <h2>Conclusion</h2>
        </div>
        <div className="conclusion-copy">
          <p>
            Meituan-Robotics-0 connects aligned heterogeneous data, continuous
            cross-embodiment control, closed-loop policy optimization, and
            event-level memory in one desktop-manipulation system. The evaluation
            shows that broad pre-training supports transfer, human interventions
            improve recovery from policy-induced states, Rollback pairs support
            CFG-DAgger for precision-sensitive insertion without value learning,
            and persistent events extend
            planning beyond the current observation.
          </p>
        </div>
      </section>

      <section className="project-section section-shell citation-section" id="citation">
        <div className="section-heading">
          <h2>Citation</h2>
        </div>
        <p className="section-intro">
          Please cite the technical report when using this work.
        </p>
        <div className="citation-block">
          <pre><code>{citationText}</code></pre>
          <CopyCitation text={citationText} />
        </div>
        <div className="citation-resources">
          <a className="resource primary" href="/Meituan-Robotics-0.pdf?v=20261029">Technical Report ↗</a>
        </div>
      </section>

      <footer>
        <div className="section-shell footer-inner">
          <div className="brand"><span className="brand-mark">美团</span><span>Meituan Robotics</span></div>
          <span>Meituan-Robotics-0</span>
        </div>
      </footer>
    </main>
  );
}
