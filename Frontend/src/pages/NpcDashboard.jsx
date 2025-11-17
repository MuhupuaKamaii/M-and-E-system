import { useMemo, useState } from "react";
import NpcTopNav from "../components/layout/NpcTopNav";
import NpcSideNav from "../components/layout/NpcSideNav";
import StatCard from "../components/common/StatCard";
import ProgressCard from "../components/common/ProgressCard";
import ReportsTable from "../components/common/ReportsTable";
import ActivityTimeline from "../components/common/ActivityTimeline";
import WorkflowStageCard from "../components/common/WorkflowStageCard";
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

const variantByStatus = {
  Submitted: "submitted",
  Pending: "pending",
  Approved: "approved",
  Rejected: "rejected",
  Closed: "closed",
};

export default function NpcDashboard() {
  const [reports, setReports] = useState(initialReports);
  const [activityItems, setActivityItems] = useState(initialTimeline);
  const [reportFilter, setReportFilter] = useState("pending");

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

  const workflowStages = useMemo(() => {
    const phaseCounts = reports.reduce(
      (acc, report) => {
        acc[report.phase] = (acc[report.phase] || 0) + 1;
        return acc;
      },
      { planning: 0, execution: 0, closure: 0 },
    );

    return [
      {
        stageKey: "planning",
        title: "Planning phase",
        description: "OMAs align indicators & budgets",
        stats: [
          { label: "Awaiting NPC", value: phaseCounts.planning?.toString() ?? "0" },
          { label: "Returned", value: flaggedCount.toString() },
        ],
        statusText: phaseCounts.planning ? "NPC review in progress" : "Backlog clear",
        statusTone: phaseCounts.planning ? "neutral" : "approved",
      },
      {
        stageKey: "execution",
        title: "Execution phase",
        description: "Projects currently live",
        stats: [
          { label: "In progress", value: phaseCounts.execution?.toString() ?? "0" },
          {
            label: "With issues",
            value: Math.max(phaseCounts.execution - approvedCount, 0).toString(),
          },
        ],
        statusText: "On schedule",
        statusTone: "approved",
      },
      {
        stageKey: "closure",
        title: "Closure & evaluation",
        description: "NPC verifies deliverables",
        stats: [
          { label: "Closed", value: phaseCounts.closure?.toString() ?? "0" },
          { label: "Pending audits", value: Math.max(phaseCounts.closure - 1, 0).toString() },
        ],
        statusText: phaseCounts.closure ? "Awaiting evidence" : "Upcoming",
        statusTone: "neutral",
      },
    ];
  }, [reports, flaggedCount, approvedCount]);

  const filteredReports = useMemo(() => {
    if (reportFilter === "approved") {
      return reports.filter((report) => report.status === "Approved");
    }
    if (reportFilter === "pending") {
      return reports.filter((report) => ["Submitted", "Pending", "Rejected"].includes(report.status));
    }
    return reports;
  }, [reports, reportFilter]);

  const addTimelineEntry = (title, oma, status) => {
    setActivityItems((prev) => [
      {
        id: `${Date.now()}`,
        title,
        oma,
        timeAgo: "just now",
        status,
      },
      ...prev,
    ]);
  };

  const updateReport = (reportId, updates) => {
    setReports((prev) =>
      prev.map((report) => (report.id === reportId ? { ...report, ...updates } : report)),
    );
  };

  const handleApprove = (report) => {
    updateReport(report.id, {
      status: "Approved",
      statusVariant: variantByStatus.Approved,
      phase: "execution",
    });
    addTimelineEntry(`NPC approved ${report.programme}`, report.owner, "Approved");
  };

  const handleReject = (report) => {
    updateReport(report.id, {
      status: "Rejected",
      statusVariant: variantByStatus.Rejected,
      phase: "planning",
    });
    addTimelineEntry(`NPC rejected ${report.programme}`, report.owner, "Rework");
  };

  const handleClose = (report) => {
    updateReport(report.id, {
      status: "Closed",
      statusVariant: variantByStatus.Closed,
      phase: "closure",
    });
    addTimelineEntry(`${report.programme} moved to closure`, report.owner, "Closed");
  };

  const renderActions = (report) => {
    const buttons = [];
    if (["Submitted", "Pending", "Rejected"].includes(report.status)) {
      buttons.push(
        <button
          key={`${report.id}-approve`}
          type="button"
          className="primary"
          onClick={() => handleApprove(report)}
        >
          Approve
        </button>,
      );
    }
    if (["Submitted", "Pending"].includes(report.status)) {
      buttons.push(
        <button
          key={`${report.id}-reject`}
          type="button"
          className="danger"
          onClick={() => handleReject(report)}
        >
          Reject
        </button>,
      );
    }
    if (report.phase === "execution" && report.status === "Approved") {
      buttons.push(
        <button
          key={`${report.id}-close`}
          type="button"
          className="success"
          onClick={() => handleClose(report)}
        >
          Close
        </button>,
      );
    }

    return buttons;
  };

  const reportFilters = (
    <div className="npc-report-filters">
      {[
        { label: "Pending review", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "All", value: "all" },
      ].map((filter) => (
        <button
          key={filter.value}
          type="button"
          className={reportFilter === filter.value ? "is-active" : ""}
          onClick={() => setReportFilter(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
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

          <section className="npc-section">
            <div className="npc-section__head">
              <div>
                <p className="npc-section__eyebrow">Review queue</p>
                <h2 className="npc-section__title">Submissions waiting for action</h2>
              </div>
            </div>
            <p className="npc-review-summary">
              <strong>{pendingCount}</strong> awaiting decision • <strong>{approvedCount}</strong> approved •{" "}
              <strong>{flaggedCount}</strong> flagged • <strong>{totalReports}</strong> total in cycle
            </p>
            <ReportsTable
              reports={filteredReports}
              renderActions={renderActions}
              filters={reportFilters}
              title="Live submissions"
            />
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


