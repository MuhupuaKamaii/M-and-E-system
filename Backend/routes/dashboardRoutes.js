const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");

// GET /api/dashboard
router.get("/", async (_req, res) => {
  try {
    // Fetch recent reports with status if available
    const { data: reports, error } = await supabase
      .from("reports")
      .select("id, status, programme_id, created_at")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) throw error;

    const statusCounts = { Submitted: 0, Pending: 0, Approved: 0, Rejected: 0, Closed: 0 };
    const recentActivity = [];
    const timeseriesMap = new Map(); // key = YYYY-MM-DD (UTC), value = count

    (reports || []).forEach((r) => {
      const st = (r.status || "Submitted").toString();
      if (statusCounts[st] !== undefined) statusCounts[st] += 1;
      else statusCounts[st] = 1;

      if (recentActivity.length < 12) {
        recentActivity.push({
          id: String(r.id),
          title: `Report ${r.id} ${st.toLowerCase()}`,
          oma: "OMA",
          timeAgo: new Date(r.created_at).toISOString(),
          status: st,
        });
      }

      const d = new Date(r.created_at);
      const day = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
      const key = day.toISOString().slice(0, 10);
      timeseriesMap.set(key, (timeseriesMap.get(key) || 0) + 1);
    });

    // Build daily timeseries for last 30 days
    const now = new Date();
    const days = 30;
    const timeseries = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      d.setUTCDate(d.getUTCDate() - i);
      const key = d.toISOString().slice(0, 10);
      const value = timeseriesMap.get(key) || 0;
      timeseries.push({ time: Math.floor(d.getTime() / 1000), value });
    }

    // Derive simple synthetic candles from timeseries if you do not yet store OHLC
    const candles = timeseries.map((p, idx) => {
      const open = p.value + ((idx % 2) ? 1 : -1);
      const close = p.value + ((idx % 3) ? -1 : 1);
      const high = Math.max(open, close) + 2;
      const low = Math.min(open, close) - 2;
      return { time: p.time, open, high, low, close };
    });

    const totalReports = (reports || []).length;
    const summary = {
      totalReports,
      submittedOrPending: (statusCounts.Submitted || 0) + (statusCounts.Pending || 0),
      approved: statusCounts.Approved || 0,
      rejected: statusCounts.Rejected || 0,
    };

    // Placeholder alerts (can be refined later with deadlines table)
    const alerts = [
      {
        id: "queue",
        type: "review_queue",
        severity: summary.submittedOrPending > 20 ? "alert" : summary.submittedOrPending > 10 ? "warning" : "info",
        title: "Reports waiting NPC review",
        value: summary.submittedOrPending,
      },
    ];

    res.json({ summary, statusCounts, timeseries, candles, recentActivity, progressByProgramme: [], alerts, deadlines: [] });
  } catch (err) {
    console.error("/api/dashboard error", err);
    res.status(200).json({
      summary: { totalReports: 0, submittedOrPending: 0, approved: 0, rejected: 0 },
      statusCounts: { Submitted: 0, Pending: 0, Approved: 0, Rejected: 0, Closed: 0 },
      timeseries: [],
      candles: [],
      recentActivity: [],
      progressByProgramme: [],
      alerts: [],
      deadlines: [],
    });
  }
});

module.exports = router;
