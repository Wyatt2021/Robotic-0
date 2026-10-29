import "./system-overview.css";

function FlowArrow() {
  return (
    <svg className="system-overview-arrow" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12h15m-5-5 5 5-5 5" />
    </svg>
  );
}

export default function SystemOverview() {
  return (
    <figure className="system-overview" aria-label="Meituan-Robotics-0 system overview">
      <div className="system-overview-data">
        <div className="system-overview-section-label">Curated data</div>
        <a href="#data" className="system-overview-stat">
          <strong>147M</strong><span>vision-language samples</span>
        </a>
        <a href="#data" className="system-overview-stat">
          <strong>15,060<span> h</span></strong><span>robot trajectories</span>
        </a>
        <a href="#data" className="system-overview-stat">
          <strong>12</strong><span>robot embodiments</span>
        </a>
      </div>

      <div className="system-overview-model">
        <div>
          <span className="system-overview-kicker">Vision-language-action policy</span>
          <h3>Meituan-Robotics-0</h3>
        </div>
        <span className="system-overview-backbone">Qwen3.5-4B backbone</span>
      </div>

      <div className="system-overview-training" aria-label="Three-stage training recipe">
        <a href="#method" className="system-overview-stage">
          <div className="system-overview-stage-heading"><span>01</span><small>Pre-training</small></div>
          <h4>FAST + VLM</h4>
          <p>Multimodal supervision and discrete action tokens.</p>
          <span className="system-overview-stage-result">Broad behavioral priors</span>
        </a>
        <FlowArrow />
        <a href="#method" className="system-overview-stage">
          <div className="system-overview-stage-heading"><span>02</span><small>Mid-training</small></div>
          <h4>MMDiT + JiT</h4>
          <p>Continuous flow matching over unified end-effector actions.</p>
          <span className="system-overview-stage-result">Continuous control</span>
        </a>
        <FlowArrow />
        <a href="#method" className="system-overview-stage system-overview-post-training">
          <div className="system-overview-stage-heading"><span>03</span><small>Post-training</small></div>
          <h4>Real-world optimization</h4>
          <p>SFT initializes data collection.</p>
          <div className="system-overview-alternatives" aria-label="Alternative post-training strategies">
            <span>HG-DAgger</span><span>RECAP</span><span>CFG-DAgger</span>
          </div>
          <span className="system-overview-training-note">Each policy trains anew from the same mid-training checkpoint.</span>
        </a>
      </div>

      <a className="system-overview-rollback" href="#method">
        <div><strong>Rollback</strong><span>Paired continuations from a shared anchor</span></div>
        <div className="system-overview-pair">
          <span><i aria-hidden="true">+</i>Human correction</span>
          <span><i aria-hidden="true">−</i>Replaced policy segment</span>
        </div>
        <span className="system-overview-pair-note">Direct positive / negative supervision for CFG-DAgger</span>
      </a>

      <div className="system-overview-deployment">
        <a href="#evaluation" className="system-overview-output">
          <span className="system-overview-kicker">Policy evaluation</span>
          <h4>Simulation &amp; real robots</h4>
          <p>RoboTwin 2.0 · RoboDojo · Desktop manipulation</p>
        </a>
        <a href="#agent" className="system-overview-output system-overview-agent">
          <span className="system-overview-kicker">Event-driven agent · qualitative studies</span>
          <h4>Memory &amp; condition-aware recovery</h4>
          <p>Monitor · Memory Manager · Planner</p>
          <span className="system-overview-agent-note">Cross-task retrieval · Waiting and resumption</span>
        </a>
      </div>
    </figure>
  );
}
