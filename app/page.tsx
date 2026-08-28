import CopyCitation from "./copy-citation";
import ProjectNav from "./project-nav";
import RevealOnView from "./reveal-on-view";
import RobotDataFigure from "./robot-data-figure";
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

const citationText = `“Meituan-Robotics-0: A Vision-Language-Action Foundation Model for
Desktop Manipulation.” Technical Report, 2026.`;

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
          <a className="resource primary" href="/Meituan-Robotics-0.pdf">
            Technical Report <span aria-hidden="true">↗</span>
          </a>
          <span className="resource unavailable">Code · Coming soon</span>
          <span className="resource unavailable">Model · Coming soon</span>
          <span className="resource unavailable">Dataset · Coming soon</span>
        </div>

        <figure className="hero-demo">
          <VideoPlayer
            src="/video/block-placement-full.mp4?v=20260828-hq"
            poster="/assets/letter-block-placement-first-frame.jpg"
            ariaLabel="Full Letter-block Placement featured demo"
          />
        </figure>
      </section>

      <section className="project-section section-shell" id="overview">
        <div className="section-heading">
          <h2>Overview</h2>
        </div>
        <figure
          className="main-figure overview-main-figure"
          role="region"
          aria-label="Scrollable system overview"
        >
          <img
            src="/assets/main-overview.svg"
            alt="Overview of the data, training, model, agent, and real-world capabilities of Meituan-Robotics-0"
            width={1763}
            height={1170}
            loading="lazy"
          />
        </figure>
        <div className="overview-copy">
          <p>
            Meituan-Robotics-0 is a vision-language-action foundation model for
            precise, bimanual desktop manipulation. It combines large-scale
            vision-language pre-training, multi-embodiment robot data, continuous
            action modeling, and real-world post-training in one system. The model
            uses a Qwen3.5-4B backbone and is evaluated in simulation, on physical
            robots, and in long-horizon agent settings that require memory,
            interruption handling, and recovery. Rather than optimizing for a
            single benchmark, the system is designed to connect broad pre-training,
            precise continuous control, and deployment feedback in one reusable
            policy.
          </p>
        </div>
        <div className="fact-grid" aria-label="Key results">
          <div><strong>147M</strong><span>vision-language samples</span></div>
          <div><strong>15,060h</strong><span>robot trajectories</span></div>
          <div><strong>93.4%</strong><span>RoboTwin 2.0 overall SR</span></div>
          <div><strong>0.08 → 0.86</strong><span>real-robot SR after HIL</span></div>
        </div>
      </section>

      <section className="project-section section-shell" id="data">
        <div className="section-heading">
          <h2>Data</h2>
        </div>
        <p className="section-intro">
          The training corpus combines broad visual-language supervision with
          curated robot trajectories across twelve embodiments. Vision-language
          data supplies semantic coverage, while robot data grounds that knowledge
          in executable behavior.
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
              src="/assets/vision-language-data.svg"
              alt="Composition and examples of the vision-language dataset"
              width={2712}
              height={1206}
              loading="lazy"
            />
          </figure>
        </div>

        <div className="subsection">
          <div className="subsection-copy">
            <h3>Robotic Manipulation Data</h3>
            <p>
              The final robot corpus contains 15,060 hours of retained
              trajectories. It brings together in-house collection and public
              real and simulated data across 12 embodiments, including 10,765
              hours of physical robot execution. Combining consistent in-house
              demonstrations with diverse public sources prevents pre-training
              from becoming tied to one robot morphology or collection setup.
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
          agent. The policy progresses from broad action priors to precise
          continuous control and deployment feedback, while the agent adds memory,
          monitoring, and sparse high-level planning for long-horizon execution.
        </p>

        <div className="subsection">
          <div className="subsection-copy">
            <h3>Training Recipe</h3>
            <p>
              The three stages address complementary bottlenecks: data scale,
              continuous-control precision, and real-world reliability. Training
              gradually shifts from broad next-token supervision toward feedback
              collected around deployment failures.
            </p>
          </div>
          <div className="training-timeline" role="list" aria-label="Three-stage training timeline from scale to precision to reliability">
            <article className="training-stage" role="listitem">
              <header><span>01</span><b>Scale</b></header>
              <div className="training-stage-body">
                <small>Pre-training</small>
                <h4>FAST + VLM</h4>
                <p>Learn reusable visual-language-action priors from the full heterogeneous corpus with a shared next-token objective.</p>
                <strong className="stage-outcome">Broad action priors</strong>
              </div>
            </article>

            <article className="training-stage" role="listitem">
              <header><span>02</span><b>Precision</b></header>
              <div className="training-stage-body">
                <small>Mid-training</small>
                <h4>MMDiT + JiT</h4>
                <p>Replace discrete action prediction with continuous flow matching for smooth, high-resolution bimanual control.</p>
                <strong className="stage-outcome">Coherent action chunks</strong>
              </div>
            </article>

            <article className="training-stage alignment-stage" role="listitem">
              <header><span>03</span><b>Reliability</b></header>
              <div className="training-stage-body">
                <small>Real-world alignment</small>
                <div className="alignment-steps" aria-label="Behavior cloning, human intervention, and RECAP">
                  <strong>BC</strong><i>→</i><strong>HIL</strong><i>→</i><strong>RECAP</strong>
                </div>
                <p>Move from demonstrations to interventions and rollout feedback, concentrating data collection around deployment failures.</p>
                <strong className="stage-outcome">Deployment feedback loop</strong>
              </div>
            </article>
          </div>
        </div>

        <div className="subsection" id="agent">
          <div className="subsection-copy">
            <h3>Event-Driven Agent</h3>
            <p>
              A hierarchical agent combines a Monitor, Memory &amp; Event module,
              and Planner above the VLA policy. High-level reasoning is triggered
              only when meaningful events occur, while low-level control continues
              at robot frequency. This allows the system to remember cross-task
              state changes, revise plans when conditions change, and resume
              interrupted objectives without continuously invoking the planner.
            </p>
          </div>
          <figure className="paper-figure wide-figure agent-figure">
            <img
              src="/assets/embodied-agent.svg"
              alt="Event-driven agent with task context, an asynchronous agent loop, and high-frequency action execution"
              width={2485}
              height={1243}
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
          Results report aggregate success rate and task score, covering policy
          generalization, execution quality, and the effect of real-world
          post-training.
        </p>

        <div className="subsection">
          <div className="subsection-copy">
            <h3>Simulation and Real-Robot Evaluation</h3>
            <p>
              Results are reported with success rate and task score. Human-in-the-loop
              collection has the largest deployment effect, increasing average
              real-robot success rate from 0.08 to 0.86. RoboTwin 2.0 measures
              policy generalization across clean and randomized simulation, while
              RoboDojo probes precision, memory, and long-horizon behavior. The
              physical evaluations add a partial-progress score alongside strict
              task completion.
            </p>
          </div>
          <RevealOnView className="result-card-grid">
            <article className="result-card">
              <header>
                <div><span>Simulation · Overall SR</span><h4>RoboTwin 2.0</h4></div>
                <strong>93.4%</strong>
              </header>
              <VerticalBarChart label="RoboTwin 2.0 overall success-rate comparison, shown on an 80 to 95 percent scale" min={80} max={95} items={[
                { label: "ABot-M0", value: 85.6 },
                { label: "Fast-WAM", value: 91.8 },
                { label: "InternVLA", value: 93.2 },
                { label: "MR0", value: 93.4, highlight: true },
              ]} />
              <footer><b>+0.2</b> vs. InternVLA-A1.5 · scale 80–95%</footer>
            </article>

            <article className="result-card">
              <header>
                <div><span>Simulation · Average Score</span><h4>RoboDojo</h4></div>
                <strong>15.27</strong>
              </header>
              <VerticalBarChart label="RoboDojo average-score comparison for pure VLAs without UMI pre-training" max={16} items={[
                { label: "VLAct", value: 10.66 },
                { label: "InternVLA", value: 11.15 },
                { label: "π0.5", value: 11.41 },
                { label: "Spatial", value: 12.38 },
                { label: "MR0", value: 15.27, highlight: true },
              ]} />
              <footer><b>+2.89</b> vs. Spatial Forcing · scale 0–16</footer>
            </article>

            <article className="result-card">
              <header>
                <div><span>Physical deployment · Average</span><h4>Real Robot</h4></div>
                <strong className="metric-pair">0.86 / 0.93</strong>
              </header>
              <GroupedVerticalChart label="Average real-robot success rate and score comparison, shown on a 60 to 100 percent scale" min={0.6} max={1} series={["π0.5", "MR0"]} groups={[
                { label: "Avg. SR", bars: [{ label: "π0.5", value: 0.82 }, { label: "MR0", value: 0.86, highlight: true }] },
                { label: "Avg. Score", bars: [{ label: "π0.5", value: 0.86 }, { label: "MR0", value: 0.93, highlight: true }] },
              ]} />
              <footer><b>+0.04 SR / +0.07 Score</b> vs. π0.5 · scale 60–100%</footer>
            </article>

            <article className="result-card">
              <header>
                <div><span>Post-training · Average SR</span><h4>Human Intervention</h4></div>
                <strong className="metric-pair">0.08 → 0.86</strong>
              </header>
              <GroupedVerticalChart label="Effect of human intervention on average success rate and score" max={1} series={["Teleop", "+ HIL"]} groups={[
                { label: "Avg. SR", bars: [{ label: "Teleop", value: 0.08 }, { label: "+ HIL", value: 0.86, highlight: true }] },
                { label: "Avg. Score", bars: [{ label: "Teleop", value: 0.24 }, { label: "+ HIL", value: 0.93, highlight: true }] },
              ]} />
              <footer><b>+0.78 SR / +0.69 Score</b> with HIL · scale 0–1</footer>
            </article>

          </RevealOnView>
        </div>
      </section>

      <section className="project-section section-shell" id="demos">
        <div className="section-heading">
          <h2>Real-World Demos</h2>
        </div>
        <p className="section-intro">
          Real-robot demonstrations show the policy executing precise bimanual
          manipulation and the Agent preserving task state across interruptions.
        </p>

        <div className="subsection">
          <div className="subsection-copy">
            <h3>Desktop Manipulation</h3>
            <p>
              Three desktop tasks cover ordered placement, deformable-object
              handling, and contact-rich insertion. The set stresses sequencing,
              bimanual coordination, recovery from local errors, and fine geometric
              alignment. Success rate requires full task completion, while task
              score also reflects meaningful partial progress.
            </p>
          </div>
          <div className="task-grid">
            <article className="task-card">
              <div className="task-media task-demo-media">
                <VideoPlayer
                  src="/video/letter-block-placement.mp4?v=20260828-hq"
                  poster="/assets/letter-block-placement-first-frame.jpg"
                  ariaLabel="Letter-block Placement demo"
                />
              </div>
              <div className="task-copy">
                <h4>Letter-block Placement</h4>
                <p>Arrange seven letter blocks in order inside a continuous groove, combining sequence tracking with precise placement.</p>
                <dl><div><dt>SR</dt><dd>0.83</dd></div><div><dt>Score</dt><dd>0.96</dd></div></dl>
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
                <p>Coordinate two arms while handling deformable cloth and recovering from folds that drift away from the target state.</p>
                <dl><div><dt>SR</dt><dd>0.83</dd></div><div><dt>Score</dt><dd>0.93</dd></div></dl>
              </div>
            </article>
            <article className="task-card">
              <div className="task-media task-demo-media">
                <VideoPlayer
                  src="/video/network-cable-insertion.mp4?v=20260828-hq"
                  poster="/assets/network-cable-insertion-first-frame.jpg"
                  ariaLabel="Network Cable Insertion demo"
                />
              </div>
              <div className="task-copy">
                <h4>Network Cable Insertion</h4>
                <p>Localize, hand over, align, and insert a thin deformable connector through a contact-rich bimanual sequence.</p>
                <dl><div><dt>SR</dt><dd>0.90</dd></div><div><dt>Score</dt><dd>0.89</dd></div></dl>
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
                <p>Store a state change and retrieve it when a later task depends on that history. The planner can reuse committed events instead of reconstructing the scene from scratch.</p>
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
                <p>Preserve an unfinished objective, monitor its preconditions, and resume when execution becomes possible. Temporary blockers therefore pause progress without discarding the plan.</p>
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
            Meituan-Robotics-0 presents a unified path from large-scale
            multi-embodiment pre-training to real-world desktop manipulation.
            The system combines broad data coverage, continuous action modeling,
            and human-in-the-loop post-training in a single training pipeline.
          </p>
          <p>
            Future work will extend task and embodiment coverage, improve
            long-horizon robustness, and release additional project resources.
            The current results also show that scale alone is not sufficient:
            careful post-training and feedback from deployment are central to
            turning a broadly pre-trained policy into a reliable real-world system.
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
          <a className="resource primary" href="/Meituan-Robotics-0.pdf">Technical Report ↗</a>
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
