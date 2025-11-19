import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NpcTopNav from "../components/layout/NpcTopNav";
import NpcSideNav from "../components/layout/NpcSideNav";

const RISK_DATA = [
  { id: "oma1", name: "MoHSS", level: "High", issues: ["Data breach risk", "Review overdue"], since: "2 days" },
  { id: "oma3", name: "OPM", level: "Medium", issues: ["Deadlock: Budget sign-off"], since: "5 days" },
];

const CHIP = ({ tone, children }) => (
  <span className={`npc-chip npc-chip--${tone || "default"}`}>{children}</span>
);

export default function AtRiskOmas() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const t = (q || "").toLowerCase();
    if (!t) return RISK_DATA;
    return RISK_DATA.filter((r) => r.name.toLowerCase().includes(t));
  }, [q]);

  return (
    <div className="npc-dashboard npc-dark">
      <NpcTopNav />
      <div className="npc-dashboard__grid">
        <NpcSideNav />
        <main className="npc-dashboard__main">
          <section className="npc-section">
            <div className="npc-section__head">
              <div>
                <p className="npc-section__eyebrow">Risk centre</p>
                <h1 className="npc-section__title">At Risk OMAs</h1>
                <p className="npc-section__description">OMAs currently flagged as vulnerable or compromised.</p>
              </div>
              <div>
                <input
                  className="npc-input"
                  placeholder="Search OMAs..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
            </div>

            <div className="npc-table npc-card" style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th align="left">OMA</th>
                    <th align="left">Risk level</th>
                    <th align="left">Key issues</th>
                    <th align="left">Since</th>
                    <th align="left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td>{r.name}</td>
                      <td>
                        <CHIP tone={r.level === "High" ? "alert" : "warning"}>{r.level}</CHIP>
                      </td>
                      <td>{r.issues.join(", ")}</td>
                      <td>{r.since}</td>
                      <td>
                        <button
                          className="npc-link-button"
                          type="button"
                          onClick={() => navigate(`/npc-dashboard?oma=${r.id}&filter=at-risk`)}
                        >
                          View details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
