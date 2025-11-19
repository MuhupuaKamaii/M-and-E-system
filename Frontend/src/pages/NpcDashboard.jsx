import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import NpcTopNav from "../components/layout/NpcTopNav";
import NpcSideNav from "../components/layout/NpcSideNav";
import StatCard from "../components/common/StatCard";
import ProgressCard from "../components/common/ProgressCard";
import ActivityTimeline from "../components/common/ActivityTimeline";
import NpcApprovalSpotlight from "../components/common/NpcApprovalSpotlight";
// Reverted: no Web3 hero/glass components on main dashboard

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// OMA datasets (dummy) used to drive dynamic Programme trajectory
const omas = [
  { id: "oma1", name: "MoHSS" },
  { id: "oma2", name: "MoF" },
  { id: "oma3", name: "OPM" },
];

const pillarsRaw = [
  { omaId: "oma1", pillar: "Pillar 1", programme: "Agriculture Value Chains", progress: 72, status: "On track" },
  { omaId: "oma1", pillar: "Pillar 2", programme: "Health for All Campaign", progress: 61, status: "Attention" },
  { omaId: "oma1", pillar: "Pillar 4", programme: "Public Sector Governance", progress: 55, status: "Review" },
  { omaId: "oma2", pillar: "Pillar 1", programme: "Agriculture Value Chains", progress: 68, status: "On track" },
  { omaId: "oma2", pillar: "Pillar 2", programme: "Health for All Campaign", progress: 58, status: "Attention" },
  { omaId: "oma2", pillar: "Pillar 4", programme: "Public Sector Governance", progress: 62, status: "On track" },
  { omaId: "oma3", pillar: "Pillar 1", programme: "Agriculture Value Chains", progress: 74, status: "On track" },
  { omaId: "oma3", pillar: "Pillar 2", programme: "Health for All Campaign", progress: 49, status: "Review" },
  { omaId: "oma3", pillar: "Pillar 4", programme: "Public Sector Governance", progress: 64, status: "Attention" },
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
  const navigate = useNavigate();
  const [reports, setReports] = useState(initialReports);
  const [activityItems, setActivityItems] = useState(initialTimeline);
  const [statusCounts, setStatusCounts] = useState(null);
  const [summary, setSummary] = useState(null);
  const [selectedOma, setSelectedOma] = useState("all");
  // Reverted: no trading-style chart controls in main dashboard

  // Using dummy data only: no backend fetch for now

  const pendingCount = useMemo(() => {
    if (summary && typeof summary.submittedOrPending === "number") return summary.submittedOrPending;
    return reports.filter((report) => ["Submitted", "Pending"].includes(report.status)).length;
  }, [summary, reports]);
  const approvedCount = useMemo(() => {
    if (summary && typeof summary.approved === "number") return summary.approved;
    return reports.filter((report) => report.status === "Approved").length;
  }, [summary, reports]);
  const flaggedCount = useMemo(() => {
    if (summary && typeof summary.rejected === "number") return summary.rejected;
    return reports.filter((report) => report.status === "Rejected").length;
  }, [summary, reports]);
  const totalReports = useMemo(() => {
    if (summary && typeof summary.totalReports === "number") return summary.totalReports;
    return reports.length;
  }, [summary, reports]);

  const statusBuckets = useMemo(() => {
    const keys = ["Submitted", "Approved", "Pending", "Rejected", "Closed"];
    const counts = statusCounts
      ? keys.map((k) => statusCounts[k] || 0)
      : keys.map((k) => reports.filter((r) => r.status === k).length);
    return { keys, counts };
  }, [reports, statusCounts]);

  function badgeColorFor(status) {
    const s = (status || "").toLowerCase();
    if (s.includes("review") || s.includes("off")) return "#C0342A";
    if (s.includes("attention") || s.includes("warn")) return "#F4B33D";
    return "#2CB1A3";
  }

  const programmeProgress = useMemo(() => {
    if (selectedOma === "all") {
      const grouped = pillarsRaw.reduce((acc, p) => {
        acc[p.pillar] = acc[p.pillar] || [];
        acc[p.pillar].push(p);
        return acc;
      }, {});
      return Object.keys(grouped).map((pillar) => {
        const list = grouped[pillar];
        const avg = Math.round(list.reduce((a, b) => a + b.progress, 0) / list.length);
        let status = "On track";
        if (list.some((x) => String(x.status).toLowerCase().includes("review"))) status = "Review";
        else if (list.some((x) => String(x.status).toLowerCase().includes("attention"))) status = "Attention";
        return {
          title: pillar,
          programme: list[0].programme,
          progress: avg,
          status,
          badgeColor: badgeColorFor(status),
        };
      });
    }
    return pillarsRaw
      .filter((p) => p.omaId === selectedOma)
      .map((p) => ({
        title: p.pillar,
        programme: p.programme,
        progress: p.progress,
        status: p.status,
        badgeColor: badgeColorFor(p.status),
      }));
  }, [selectedOma]);

  const doughnutData = useMemo(
    () => ({
      labels: statusBuckets.keys,
      datasets: [
        {
          data: statusBuckets.counts,
          backgroundColor: [
            "rgba(44, 177, 163, 0.7)",
            "rgba(47, 155, 98, 0.7)",
            "rgba(244, 179, 61, 0.7)",
            "rgba(192, 52, 42, 0.7)",
            "rgba(14, 53, 93, 0.7)",
          ],
          borderColor: [
            "rgba(44, 177, 163, 1)",
            "rgba(47, 155, 98, 1)",
            "rgba(244, 179, 61, 1)",
            "rgba(192, 52, 42, 1)",
            "rgba(14, 53, 93, 1)",
          ],
          borderWidth: 1,
        },
      ],
    }),
    [statusBuckets],
  );

  const doughnutOptions = useMemo(
    () => ({
      cutout: '72%',
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { color: '#e8eef9', boxWidth: 12 }
        },
        tooltip: {
          backgroundColor: 'rgba(17,19,26,0.95)',
          titleColor: '#e8eef9',
          bodyColor: '#e8eef9',
          borderColor: 'rgba(255,255,255,0.12)',
          borderWidth: 1
        }
      }
    }),
    [],
  );

  const barData = useMemo(
    () => ({
      labels: programmeProgress.map((p) => p.programme),
      datasets: [
        {
          label: "Progress %",
          data: programmeProgress.map((p) => p.progress),
          backgroundColor: "rgba(14, 53, 93, 0.75)",
          borderRadius: 8,
        },
      ],
    }),
    [],
  );

  const barOptions = useMemo(
    () => ({
      responsive: true,
      plugins: { legend: { display: false }, tooltip: {
        backgroundColor: 'rgba(17,19,26,0.95)',
        titleColor: '#e8eef9',
        bodyColor: '#e8eef9',
        borderColor: 'rgba(255,255,255,0.12)',
        borderWidth: 1
      } },
      scales: {
        x: { ticks: { color: '#e8eef9' }, grid: { color: 'rgba(255,255,255,0.06)' } },
        y: { ticks: { color: '#e8eef9' }, grid: { color: 'rgba(255,255,255,0.06)' } },
      }
    }),
    [],
  );

  // Reverted: no trading-style series/candles on main dashboard

  const statBlocks = useMemo(
    () => [
      {
        label: "Total reports in cycle",
        value: totalReports.toString(),
        subtext: "All pillars • FY 2025/26",
        trend: { direction: "up", value: "+12%" },
        onClick: () => navigate(`/npc-dashboard?filter=all`),
      },
      {
        label: "Pending NPC review",
        value: pendingCount.toString(),
        subtext: "Need action",
        trend: { direction: "down", value: "-4%" },
        tone: pendingCount > 15 ? "warning" : "default",
        onClick: () => navigate(`/npc-dashboard?filter=pending`),
      },
      {
        label: "Flagged for follow-up",
        value: flaggedCount.toString(),
        subtext: "Escalated to sector leads",
        trend: { direction: "up", value: `+${flaggedCount}` },
        tone: flaggedCount ? "alert" : "default",
        onClick: () => navigate(`/npc-dashboard?filter=flagged`),
      },
    ],
    [totalReports, pendingCount, flaggedCount],
  );

  return (
    <div className="npc-dashboard npc-dark">
      <NpcTopNav />

      <div className="npc-dashboard__grid">
        <NpcSideNav pendingApprovals={pendingCount} />

        <main className="npc-dashboard__main">
          {/* Reverted: remove Web3 hero section */}

          <section className="npc-section">
            <div className="npc-section__head">
              <div>
                <p className="npc-section__eyebrow">Monitoring overview</p>
                <h1 className="npc-section__title">NPC dashboard</h1>
                <p className="npc-section__description">
                  Focus on the live review queue while OMAs progress through execution and closure.
                </p>
              </div>
            </div>
            <div className="npc-stats-grid">
              {statBlocks.map((stat) => (
                <StatCard key={stat.label} {...stat} onClick={stat.onClick} />
              ))}
            </div>
          </section>

          <section className="npc-section npc-section--split">
            <div className="npc-section__column">
              <section className="npc-section">
                <div className="npc-section__head">
                  <div>
                    <p className="npc-section__eyebrow">Programme trajectory</p>
                    <h2 className="npc-section__title">Across priority pillars</h2>
                  </div>
                  <div>
                    <select className="npc-select" value={selectedOma} onChange={(e) => setSelectedOma(e.target.value)}>
                      <option value="all">All OMAs</option>
                      {omas.map((o) => (
                        <option key={o.id} value={o.id}>{o.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="npc-trajectory-grid">
                  {programmeProgress.map((p) => (
                    <ProgressCard
                      key={`${p.title}-${p.programme}`}
                      {...p}
                      onClick={() =>
                        navigate(
                          `/npc-dashboard?pillar=${encodeURIComponent(p.title)}&oma=${selectedOma}`
                        )
                      }
                    />
                  ))}
                </div>
              </section>

              <div className="npc-card">
                <div className="npc-card__head">
                  <div>
                    <p className="npc-card__title">Submission status</p>
                    <p className="npc-card__subtitle">Live distribution</p>
                  </div>
                </div>
                <div style={{ height: 220 }}>
                  <Doughnut data={doughnutData} options={doughnutOptions} />
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
              <div className="npc-card">
                <div className="npc-card__head">
                  <div>
                    <p className="npc-card__title">Programme progress</p>
                    <p className="npc-card__subtitle">% completion by programme</p>
                  </div>
                </div>
                <Bar data={barData} options={barOptions} />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}


