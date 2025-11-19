import { useMemo, useState } from "react";
import NpcTopNav from "../components/layout/NpcTopNav";
import NpcSideNav from "../components/layout/NpcSideNav";
import GlowCard from "../components/ui/GlowCard";
import SparklineApex from "../components/charts/SparklineApex";
import TimeSeriesChart from "../components/charts/TimeSeriesChart";
import CandlestickChart from "../components/charts/CandlestickChart";

export default function NpcDashboardPro() {
  // Mocked UI-only data (no backend dependency)
  const [range, setRange] = useState("30d");
  const [viewMode, setViewMode] = useState("line");
  const [counts] = useState({ total: 124, pending: 18, approved: 82, rejected: 6 });

  const sparkTotal = [8, 10, 9, 12, 11, 13, 14];
  const sparkPending = [2, 3, 3, 4, 5, 6, 6];
  const sparkApproved = [4, 6, 6, 7, 7, 8, 9];
  const sparkRejected = [0, 1, 1, 1, 1, 2, 2];

  const now = Math.floor(Date.now() / 1000);
  const baseSeries = Array.from({ length: 30 }).map((_, i) => ({
    time: now - (29 - i) * 86400,
    value: 40 + Math.round(10 * Math.sin(i / 4) + (i % 3))
  }));
  const filteredSeries = useMemo(() => {
    if (range === "24h") return baseSeries.slice(-1);
    if (range === "7d") return baseSeries.slice(-7);
    return baseSeries;
  }, [baseSeries, range]);

  const candleData = useMemo(() => {
    return filteredSeries.map((p, idx) => {
      const open = p.value + ((idx % 2) ? 1 : -1);
      const close = p.value + ((idx % 3) ? -1 : 1);
      const high = Math.max(open, close) + 2;
      const low = Math.min(open, close) - 2;
      return { time: p.time, open, high, low, close };
    });
  }, [filteredSeries]);

  return (
    <div className="npc-dashboard">
      <NpcTopNav />
      <div className="npc-dashboard__grid">
        <NpcSideNav pendingApprovals={counts.pending} />
        <main className="npc-dashboard__main">
          <section className="npc-hero">
            <div className="npc-hero__head">
              <div>
                <h1 className="npc-hero__title">NPC Dashboard Pro</h1>
                <p className="npc-hero__subtitle">Dark, glass, neon with trading-style charts (UI demo).</p>
              </div>
            </div>

            <div className="npc-hero__grid">
              <div className="npc-kpi-grid">
                <GlowCard title="Total Reports" subtitle="All pillars" tone="default" rightSlot={<span className="npc-kpi__trend npc-kpi__trend--up">Live</span>}>
                  <div style={{ display: "grid", gap: 8 }}>
                    <div style={{ fontSize: 28, fontWeight: 800 }}>{counts.total}</div>
                    <SparklineApex data={sparkTotal} color="#2CB1A3" />
                  </div>
                </GlowCard>
                <GlowCard title="Submitted / Pending" subtitle="NPC review queue" tone={counts.pending > 10 ? "alert" : "default"} rightSlot={<span className={`npc-kpi__trend ${counts.pending > 10 ? "npc-kpi__trend--down" : "npc-kpi__trend--up"}`}>{counts.pending > 10 ? "High queue" : "Healthy"}</span>}>
                  <div style={{ display: "grid", gap: 8 }}>
                    <div style={{ fontSize: 28, fontWeight: 800 }}>{counts.pending}</div>
                    <SparklineApex data={sparkPending} color="#F4B33D" />
                  </div>
                </GlowCard>
                <GlowCard title="Approved" subtitle="This cycle" tone="success" rightSlot={<span className="npc-kpi__trend npc-kpi__trend--up">On track</span>}>
                  <div style={{ display: "grid", gap: 8 }}>
                    <div style={{ fontSize: 28, fontWeight: 800 }}>{counts.approved}</div>
                    <SparklineApex data={sparkApproved} color="#2F9B62" />
                  </div>
                </GlowCard>
                <GlowCard title="Returned / Rejected" subtitle="Follow-ups" tone={counts.rejected > 0 ? "alert" : "default"} rightSlot={<span className={`npc-kpi__trend ${counts.rejected > 0 ? "npc-kpi__trend--down" : "npc-kpi__trend--up"}`}>{counts.rejected > 0 ? "Action required" : "Clear"}</span>}>
                  <div style={{ display: "grid", gap: 8 }}>
                    <div style={{ fontSize: 28, fontWeight: 800 }}>{counts.rejected}</div>
                    <SparklineApex data={sparkRejected} color="#C0342A" />
                  </div>
                </GlowCard>
              </div>

              <div className="npc-urgent npc-attention-pulse">
                <div className="npc-urgent__head">
                  <p className="npc-urgent__title">Needs Immediate Attention</p>
                  <div className="npc-urgent__meta">
                    <span className="npc-urgent__dot npc-deadline-blink" />
                    <span>Live alerts</span>
                  </div>
                </div>
                <ul className="npc-urgent__list">
                  <li className="npc-urgent__item">
                    <span>Reports waiting NPC review</span>
                    <span className="npc-urgent__pill npc-urgent__pill--bad">{counts.pending}</span>
                  </li>
                  <li className="npc-urgent__item">
                    <span>Returned for revision</span>
                    <span className="npc-urgent__pill npc-urgent__pill--bad">{counts.rejected}</span>
                  </li>
                  <li className="npc-urgent__item">
                    <span>Approved this cycle</span>
                    <span className="npc-urgent__pill npc-urgent__pill--good">{counts.approved}</span>
                  </li>
                </ul>
                <button type="button" className="npc-urgent__cta">Open Approval Queue</button>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <GlowCard
                title="National Activity Index"
                subtitle="Interactive trend"
                tone="default"
                rightSlot={
                  <div className="npc-chip-group">
                    <button className={`npc-chip ${viewMode === "line" ? "npc-chip--active" : ""}`} onClick={() => setViewMode("line")}>
                      Line
                    </button>
                    <button className={`npc-chip ${viewMode === "candle" ? "npc-chip--active" : ""}`} onClick={() => setViewMode("candle")}>
                      Candle
                    </button>
                    <button className={`npc-chip ${range === "24h" ? "npc-chip--active" : ""}`} onClick={() => setRange("24h")}>24h</button>
                    <button className={`npc-chip ${range === "7d" ? "npc-chip--active" : ""}`} onClick={() => setRange("7d")}>7d</button>
                    <button className={`npc-chip ${range === "30d" ? "npc-chip--active" : ""}`} onClick={() => setRange("30d")}>30d</button>
                  </div>
                }
              >
                {viewMode === "line" ? (
                  <TimeSeriesChart data={filteredSeries} color="#7c4dff" />
                ) : (
                  <CandlestickChart candles={candleData} />
                )}
              </GlowCard>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
