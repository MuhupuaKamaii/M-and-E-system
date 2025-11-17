import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OMA_Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch my reports
  useEffect(() => {
    async function loadReports() {
      try {
        const res = await fetch("/api/reports/mine", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        if (res.ok) setReports(data.reports || []);
      } catch (err) {
        console.error("Failed to load reports", err);
      }
      setLoading(false);
    }

    loadReports();
  }, [token]);

  // Render status badge
  const statusBadge = (status) => {
    const styles = {
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "12px",
      color: "white"
    };

    switch (status) {
      case "pending_planning":
        return <span style={{ ...styles, background: "orange" }}>Planning</span>;
      case "planning_approved":
        return <span style={{ ...styles, background: "blue" }}>Approved (Planning)</span>;
      case "rejected":
        return <span style={{ ...styles, background: "red" }}>Rejected</span>;
      case "closed":
        return <span style={{ ...styles, background: "green" }}>Closed</span>;
      default:
        return <span style={{ ...styles, background: "gray" }}>{status}</span>;
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>OMA Dashboard — Ministry Workspace</h1>
      <p>Welcome! Manage all your Ministry Performance Reports here.</p>

      <button
        onClick={() => navigate("/addUserReport")}
        style={{
          padding: "12px 20px",
          backgroundColor: "#0A66C2",
          border: "none",
          color: "white",
          fontSize: "16px",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "20px"
        }}
      >
        ➕ Create New Report
      </button>

      <hr style={{ margin: "25px 0" }} />

      <h2>Your Reports</h2>

      {loading ? (
        <p>Loading...</p>
      ) : reports.length === 0 ? (
        <p>You have not created any reports yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th style={{ padding: 10, border: "1px solid #ccc" }}>Report ID</th>
              <th style={{ padding: 10, border: "1px solid #ccc" }}>Focus Area</th>
              <th style={{ padding: 10, border: "1px solid #ccc" }}>Status</th>
              <th style={{ padding: 10, border: "1px solid #ccc" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.report_id}>
                <td style={{ padding: 10, border: "1px solid #ccc" }}>{r.report_id}</td>
                <td style={{ padding: 10, border: "1px solid #ccc" }}>{r.focus_area_id}</td>
                <td style={{ padding: 10, border: "1px solid #ccc" }}>
                  {statusBadge(r.status)}
                </td>
                <td style={{ padding: 10, border: "1px solid #ccc" }}>
                  {/* Continue Editing if planning */}
                  {r.current_stage === "planning" && (
                    <button
                      onClick={() => navigate(`/edit-report/${r.report_id}`)}
                      style={{
                        marginRight: 10,
                        padding: "6px 10px",
                        background: "orange",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    >
                      ✏ Edit Draft
                    </button>
                  )}

                  {/* View NPC Comments */}
                  {r.npc_comments?.length > 0 && (
                    <button
                      onClick={() =>
                        alert(
                          r.npc_comments
                            .map(
                              (c) =>
                                `• Stage: ${c.stage}\n  Action: ${c.action}\n  Comment: ${c.comment}\n`
                            )
                            .join("\n")
                        )
                      }
                      style={{
                        padding: "6px 10px",
                        background: "#555",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    >
                      💬 Feedback
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
