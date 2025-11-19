// UserActivityTracking.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  FiSearch, FiUser, FiClock, FiActivity, FiDownload, FiChevronLeft, FiChevronRight
} from "react-icons/fi";
import axios from "axios";

const STATUS_LABELS = { success: "Success", info: "Info", warning: "Warning", danger: "Error" };
const STATUS_COLORS = { success: "#1e9e3f", info: "#006bb3", warning: "#d98c00", danger: "#c72b2b" };

function formatDatetime(isoString) {
  const d = new Date(isoString);
  return Number.isNaN(d.getTime())
    ? isoString
    : `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

export default function UserActivityTracking() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  // Fetch activities from backend
  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/user-activities");
        setActivities(res.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      } catch (err) {
        console.error("Failed to fetch activities", err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  // Filtered & paginated
  const filtered = useMemo(() => {
    return activities.filter((a) => {
      const matchesSearch = !search || a.user.toLowerCase().includes(search.toLowerCase()) || a.action.toLowerCase().includes(search.toLowerCase()) || a.details.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || a.role === roleFilter;
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      const ts = new Date(a.timestamp);
      const matchesStart = !startDate || ts >= new Date(startDate + "T00:00:00");
      const matchesEnd = !endDate || ts <= new Date(endDate + "T23:59:59");
      return matchesSearch && matchesRole && matchesStatus && matchesStart && matchesEnd;
    });
  }, [activities, search, roleFilter, statusFilter, startDate, endDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  // summary stats
  const summary = useMemo(() => {
    return {
      totalActions: filtered.length,
      uniqueUsers: new Set(filtered.map((a) => a.user)).size,
      failedAttempts: filtered.filter((a) => a.status === "danger").length,
      logins: filtered.filter((a) => a.action.toLowerCase().includes("log")).length,
    };
  }, [filtered]);

  // CSV export
  const exportCSV = () => {
    const header = ["id","timestamp","user","role","action","details","status"];
    const rows = filtered.map(r => [r.id,r.timestamp,r.user,r.role,r.action,r.details.replace(/\n/g," "),r.status]);
    const csvContent = [header, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], {type: "text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `user_activity_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // styles (kept inline)
  const styles = {
    wrapper: { display: "flex", flexDirection: "column", gap: 18, fontFamily: "'Segoe UI', sans-serif", color: "#1b1b1b" },
    cardRow: { display: "flex", gap: 16, flexWrap: "wrap" },
    statCard: { flex: "1 1 180px", background: "#0d1b2a", color: "#fff", padding: 16, borderRadius: 10, boxShadow: "0 6px 20px rgba(14,21,33,0.12)", minWidth: 160 },
    panel: { background: "#fff", padding: 18, borderRadius: 12, boxShadow: "0 6px 18px rgba(0,0,0,0.06)" },
    searchBox: { display: "flex", alignItems: "center", gap: 8, background: "#f4f6f8", padding: 10, borderRadius: 10, minWidth: 260 },
    input: { border: "none", outline: "none", background: "transparent", fontSize: 14, width: "100%" },
    select: { padding: "8px 10px", borderRadius: 8, border: "1px solid #e6e9ee", background: "#fff" },
    dateInput: { padding: "8px 10px", borderRadius: 8, border: "1px solid #e6e9ee", background: "#fff" },
    table: { width: "100%", borderCollapse: "collapse", marginTop: 12 },
    th: { textAlign: "left", padding: "12px 10px", borderBottom: "1px solid #eef2f6", fontSize: 13, color: "#333" },
    td: { padding: "12px 10px", borderBottom: "1px solid #f2f4f7", fontSize: 13, verticalAlign: "top" },
    statusBadge: { padding: "6px 10px", borderRadius: 999, color: "#fff", fontSize: 12, fontWeight: 600, display: "inline-block" },
    tinyMuted: { fontSize: 12, color: "#6b7582" },
    toolbarRight: { marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" },
    pagination: { display: "flex", gap: 8, alignItems: "center" },
    pageButton: { padding: "8px 10px", borderRadius: 8, border: "1px solid #e6e9ee", background: "#fff", cursor: "pointer" },
    disabledBtn: { opacity: 0.5, cursor: "not-allowed" },
  };

  return (
    <div style={styles.wrapper}>
      {/* Header & Export */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>User Activity Tracking</div>
        <div style={{ ...styles.tinyMuted }}>Monitor login history, actions and system events</div>
        <div style={styles.toolbarRight}>
          <button onClick={exportCSV} style={{ ...styles.pageButton, display: "flex", gap: 8, alignItems: "center" }}><FiDownload /> Export CSV</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={styles.cardRow}>
        <div style={styles.statCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div><div style={{ fontSize: 12, opacity: 0.85 }}>Actions</div><div style={{ fontSize: 20, fontWeight: 700 }}>{summary.totalActions}</div></div>
            <FiActivity size={28} />
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div><div style={{ fontSize: 12, opacity: 0.85 }}>Unique Users</div><div style={{ fontSize: 20, fontWeight: 700 }}>{summary.uniqueUsers}</div></div>
            <FiUser size={28} />
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div><div style={{ fontSize: 12, opacity: 0.85 }}>Failed Attempts</div><div style={{ fontSize: 20, fontWeight: 700 }}>{summary.failedAttempts}</div></div>
            <FiClock size={28} />
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div><div style={{ fontSize: 12, opacity: 0.85 }}>Login Events</div><div style={{ fontSize: 20, fontWeight: 700 }}>{summary.logins}</div></div>
            <FiClock size={28} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginTop: 8 }}>
        <div style={styles.searchBox}><FiSearch size={16} /><input placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={styles.input} /></div>
        <select style={styles.select} value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}>
          <option value="all">All Roles</option>
          {Array.from(new Set(activities.map(a => a.role))).map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select style={styles.select} value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="all">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select>
        <input type="date" style={styles.dateInput} value={startDate} onChange={e => { setStartDate(e.target.value); setPage(1); }} />
        <input type="date" style={styles.dateInput} value={endDate} onChange={e => { setEndDate(e.target.value); setPage(1); }} />
        <div style={styles.toolbarRight}><button style={styles.pageButton} onClick={() => { setSearch(""); setRoleFilter("all"); setStatusFilter("all"); setStartDate(""); setEndDate(""); }}>Reset</button></div>
      </div>

      {/* Table */}
      <div style={styles.panel}>
        {loading ? <div style={{ padding: 28, textAlign: "center", color: "#6b7582" }}>Loading activities…</div> : (
          <>
            <table style={styles.table}>
              <thead>
                <tr><th style={styles.th}>Timestamp</th><th style={styles.th}>User</th><th style={styles.th}>Role</th><th style={styles.th}>Action</th><th style={styles.th}>Details</th><th style={styles.th}>Status</th></tr>
              </thead>
              <tbody>
                {pageItems.length === 0 ? <tr><td colSpan={6} style={{ padding: 20, textAlign: "center", color: "#6b7582" }}>No activities found</td></tr> :
                  pageItems.map(a => (
                    <tr key={a.id}>
                      <td style={styles.td}>{formatDatetime(a.timestamp)}</td>
                      <td style={styles.td}>{a.user}</td>
                      <td style={{...styles.td, color:"#425063", fontWeight:600}}>{a.role}</td>
                      <td style={styles.td}>{a.action}</td>
                      <td style={{...styles.td,color:"#5a6b78"}}>{a.details}</td>
                      <td style={styles.td}><span style={{ ...styles.statusBadge, background: STATUS_COLORS[a.status] }}>{STATUS_LABELS[a.status]}</span></td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:12 }}>
              <div style={styles.pagination}>
                <button disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))} style={{...styles.pageButton, ...(page===1?styles.disabledBtn:{})}}><FiChevronLeft /></button>
                <div style={{padding:"8px 12px", border:"1px solid #e6e9ee", borderRadius:8, background:"#fff"}}>{page}/{totalPages}</div>
                <button disabled={page===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} style={{...styles.pageButton, ...(page===totalPages?styles.disabledBtn:{})}}><FiChevronRight /></button>
              </div>
              <div style={{color:"#6b7582", fontSize:13}}>Tip: Export filtered results as CSV</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
