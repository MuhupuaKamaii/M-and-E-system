import { useMemo, useState } from "react";
import NpcTopNav from "../components/layout/NpcTopNav";
import NpcSideNav from "../components/layout/NpcSideNav";
import StatCard from "../components/common/StatCard";
import ProgressCard from "../components/common/ProgressCard";
import ActivityTimeline from "../components/common/ActivityTimeline";
import NpcApprovalSpotlight from "../components/common/NpcApprovalSpotlight";

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

const initialReports = [
  {
    id: "r1",
    programme: "Agriculture Value Chains",
    pillar: "Economic Growth",
    owner: "MAWLR",
    date: "17 Jul 2025",
    status: "Submitted",
    statusVariant: "submitted",
    confidence: "High",
    phase: "review",
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
    phase: "execution",
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
    phase: "review",
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
    phase: "planning",
  },
  {
    id: "r5",
    programme: "Digital ID Rollout",
    pillar: "Governance",
    owner: "MHAI",
    date: "12 Jul 2025",
    status: "Closed",
    statusVariant: "closed",
    confidence: "High",
    phase: "closure",
  },
  {
    id: "r6",
    programme: "Rural Water Access",
    pillar: "Human Development",
    owner: "MAWLR",
    date: "11 Jul 2025",
    status: "Rejected",
    statusVariant: "rejected",
    confidence: "Low",
    phase: "planning",
  },
];

const initialTimeline = [
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

export default function NpcDashboard() {
  const [reports] = useState(initialReports);
  const [activityItems] = useState(initialTimeline);

  const pendingCount = useMemo(
    () => reports.filter((report) => ["Submitted", "Pending"].includes(report.status)).length,
    [reports],
  );
  const approvedCount = useMemo(
    () => reports.filter((report) => report.status === "Approved").length,
    [reports],
  );
  const flaggedCount = useMemo(
    () => reports.filter((report) => report.status === "Rejected").length,
    [reports],
  );
  const totalReports = reports.length;

  const statBlocks = useMemo(
    () => [
      {
        label: "Total reports in cycle",
        value: totalReports.toString(),
        subtext: "All pillars • FY 2025/26",
        trend: { direction: "up", value: "+12%" },
      },
      {
        label: "Pending NPC review",
        value: pendingCount.toString(),
        subtext: "Need action",
        trend: { direction: "down", value: "-4%" },
        tone: pendingCount > 15 ? "warning" : "default",
      },
      {
        label: "Flagged for follow-up",
        value: flaggedCount.toString(),
        subtext: "Escalated to sector leads",
        trend: { direction: "up", value: `+${flaggedCount}` },
        tone: flaggedCount ? "alert" : "default",
      },
    ],
    [totalReports, pendingCount, flaggedCount],
  );

  return (
    <div className="npc-dashboard">
      <NpcTopNav />

      <div className="npc-dashboard__grid">
        <NpcSideNav pendingApprovals={pendingCount} />

        <main className="npc-dashboard__main">
          <section className="npc-section">
            <div className="npc-section__head">
              <div>
                <p className="npc-section__eyebrow">Monitoring overview</p>
                <h1 className="npc-section__title">NPC national dashboard</h1>
                <p className="npc-section__description">
                  Focus on the live review queue while OMAs progress through execution and closure.
                </p>
              </div>
            </div>
            <div className="npc-stats-grid">
              {statBlocks.map((stat) => (
                <StatCard key={stat.label} {...stat} />
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

              <ActivityTimeline items={activityItems} />
            </div>

            <div className="npc-section__column npc-section__column--narrow">
              <NpcApprovalSpotlight
                pending={pendingCount}
                approved={approvedCount}
                rejected={flaggedCount}
              />
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
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}


