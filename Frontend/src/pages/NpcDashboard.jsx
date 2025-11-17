import NpcTopNav from "../components/layout/NpcTopNav";
import NpcSideNav from "../components/layout/NpcSideNav";
import StatCard from "../components/common/StatCard";
import ProgressCard from "../components/common/ProgressCard";
import ReportsTable from "../components/common/ReportsTable";
import ActivityTimeline from "../components/common/ActivityTimeline";
import WorkflowStageCard from "../components/common/WorkflowStageCard";

const statBlocks = [
  {
    label: "Total reports in cycle",
    value: "128",
    subtext: "All pillars • FY 2025/26",
    trend: { direction: "up", value: "+12%" },
  },
  {
    label: "Pending NPC review",
    value: "18",
    subtext: "Need action",
    trend: { direction: "down", value: "-4%" },
    tone: "warning",
  },
  {
    label: "Approved this week",
    value: "26",
    subtext: "Avg approval time 2.1 days",
    trend: { direction: "up", value: "+8%" },
    tone: "success",
  },
  {
    label: "Flagged for follow-up",
    value: "6",
    subtext: "Escalated to sector leads",
    trend: { direction: "up", value: "+2" },
    tone: "alert",
  },
];

const programmeProgress = [
  {
    title: "Pillar 1",
    programme: "Agriculture Value Chains",
    progress: 72,
    status: "On track",
    badgeColor: "var(--accent-teal)",
  },
  {
    title: "Pillar 2",
    programme: "Health for All Campaign",
    progress: 64,
    status: "Attention",
    badgeColor: "var(--accent-amber)",
  },
  {
    title: "Pillar 4",
    programme: "Public Sector Governance",
    progress: 58,
    status: "Review",
    badgeColor: "var(--accent-coral)",
  },
];

const reports = [
  {
    id: "r1",
    programme: "Agriculture Value Chains",
    pillar: "Economic Growth",
    owner: "MAWLR",
    date: "17 Jul 2025",
    status: "Submitted",
    statusVariant: "submitted",
    confidence: "High",
  },
  {
    id: "r2",
    programme: "Tourism Revival Labs",
    pillar: "Economic Growth",
    owner: "MoT",
    date: "16 Jul 2025",
    status: "Approved",
    statusVariant: "approved",
    confidence: "Medium",
  },
  {
    id: "r3",
    programme: "Health Workforce Boost",
    pillar: "Human Development",
    owner: "MoHSS",
    date: "15 Jul 2025",
    status: "Pending",
    statusVariant: "pending",
    confidence: "Low",
  },
  {
    id: "r4",
    programme: "Governance Modernisation",
    pillar: "Governance",
    owner: "OPM",
    date: "14 Jul 2025",
    status: "Submitted",
    statusVariant: "submitted",
    confidence: "Medium",
  },
];

const timeline = [
  {
    id: "t1",
    title: "Health for All report submitted",
    oma: "MoHSS",
    timeAgo: "45 minutes ago",
    status: "Awaiting review",
  },
  {
    id: "t2",
    title: "NPC approved Tourism labs",
    oma: "MoT",
    timeAgo: "2 hours ago",
    status: "Approved",
  },
  {
    id: "t3",
    title: "Evidence upload requested",
    oma: "MAWLR",
    timeAgo: "6 hours ago",
    status: "Info request",
  },
  {
    id: "t4",
    title: "Governance draft resubmitted",
    oma: "OPM",
    timeAgo: "Yesterday",
    status: "Re-review",
  },
];

const workflowStages = [
  {
    stageKey: "planning",
    title: "Planning phase",
    description: "OMA drafts indicators & budgets",
    stats: [
      { label: "Awaiting NPC", value: "12" },
      { label: "Revisions", value: "4" },
    ],
    statusText: "NPC review in progress",
    statusTone: "neutral",
  },
  {
    stageKey: "review",
    title: "NPC approval gate",
    description: "NPC validates feasibility & KPIs",
    stats: [
      { label: "Approved", value: "18" },
      { label: "Rejected", value: "3" },
    ],
    statusText: "Gate open",
    statusTone: "approved",
  },
  {
    stageKey: "execution",
    title: "Execution phase",
    description: "OMA implements activities",
    stats: [
      { label: "In progress", value: "22" },
      { label: "With issues", value: "5" },
    ],
    statusText: "On schedule",
    statusTone: "approved",
  },
  {
    stageKey: "closure",
    title: "Closure & evaluation",
    description: "NPC verifies deliverables at deadline",
    stats: [
      { label: "Closed", value: "7" },
      { label: "Pending audits", value: "2" },
    ],
    statusText: "Awaiting evidence",
    statusTone: "neutral",
  },
];

export default function NpcDashboard() {
  return (
    <div className="npc-dashboard">
      <NpcTopNav />

      <div className="npc-dashboard__grid">
        <NpcSideNav />

        <main className="npc-dashboard__main">
          <section className="npc-section">
            <div className="npc-section__head">
              <div>
                <p className="npc-section__eyebrow">Monitoring overview</p>
                <h1 className="npc-section__title">NPC national dashboard</h1>
              </div>
              <button className="npc-primary" type="button">
                Export summary PDF
              </button>
            </div>

            <div className="npc-stats-grid">
              {statBlocks.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>
          </section>

          <section className="npc-section">
            <div className="npc-section__head">
              <div>
                <p className="npc-section__eyebrow">Workflow control</p>
                <h2 className="npc-section__title">Planning → Execution → Closure</h2>
                <p className="npc-section__description">
                  NPC validates OMA plans, unlocks execution, and closes projects when the deadline hits.
                </p>
              </div>
            </div>

            <div className="npc-workflow-grid">
              {workflowStages.map((stage) => (
                <WorkflowStageCard key={stage.stageKey} {...stage} />
              ))}
            </div>
          </section>

          <section className="npc-section npc-section--split">
            <div className="npc-section__column">
              <div className="npc-card">
                <div className="npc-card__head">
                  <div>
                    <p className="npc-card__title">Programme trajectory</p>
                    <p className="npc-card__subtitle">Across priority pillars</p>
                  </div>
                </div>

                <div className="npc-progress-grid">
                  {programmeProgress.map((item) => (
                    <ProgressCard key={item.programme} {...item} />
                  ))}
                </div>
              </div>

              <ReportsTable reports={reports} />
            </div>

            <div className="npc-section__column npc-section__column--narrow">
              <div className="npc-card npc-card--accent">
                <p className="npc-card__title">Approvals this week</p>
                <p className="npc-highlight">26</p>
                <p className="npc-card__subtitle">+8% vs previous week</p>
                <div className="npc-mini-bars">
                  {[64, 52, 78, 45, 90].map((value, index) => (
                    <span key={value + index} style={{ height: `${value}%` }} />
                  ))}
                </div>
              </div>

              <div className="npc-card">
                <p className="npc-card__title">Indicator progress</p>
                <div className="npc-indicators">
                  <div>
                    <p className="npc-indicators__value">68%</p>
                    <p className="npc-card__subtitle">Economic Growth</p>
                  </div>
                  <div>
                    <p className="npc-indicators__value">61%</p>
                    <p className="npc-card__subtitle">Human Development</p>
                  </div>
                  <div>
                    <p className="npc-indicators__value">55%</p>
                    <p className="npc-card__subtitle">Governance</p>
                  </div>
                </div>
              </div>

              <ActivityTimeline items={timeline} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

