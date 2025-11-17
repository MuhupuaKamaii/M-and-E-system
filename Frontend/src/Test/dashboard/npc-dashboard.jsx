import { useEffect, useState } from "react";

function NPC_Dashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [actionType, setActionType] = useState("approve");
  const [comment, setComment] = useState("");

  const token = localStorage.getItem("token");

  // Fetch all reports
  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/reports", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setReports(data.reports || []);
    } catch (err) {
      console.error("Failed to load reports", err);
    }
    setLoading(false);
  };

  // Open modal
  const openReviewModal = (report) => {
    setSelectedReport(report);
    setComment("");
    setActionType("approve");
    setShowModal(true);
  };

  // Submit review
  const submitReview = async () => {
    if (!selectedReport) return;

    try {
      const res = await fetch(
        `http://localhost:4000/api/reports/${selectedReport.report_id}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            action: actionType,
            stage: selectedReport.current_stage, // example: planning/execution/monitoring/closure
            comment,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to review report");
        return;
      }

      alert("Review submitted successfully");
      setShowModal(false);
      loadReports(); // reload list
    } catch (err) {
      console.error(err);
      alert("Server error submitting review");
    }
  };

  if (loading) return <h2>Loading reports...</h2>;

  return (
    <div style={{ padding: 20 }}>
      <h1>NPC Dashboard — National Monitoring</h1>
      <hr />

      <h2>All Reports</h2>

      {reports.length === 0 ? (
        <p>No reports found</p>
      ) : (
        <table border="1" cellPadding={10} style={{ width: "100%", marginTop: 20 }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Focus Area</th>
              <th>Status</th>
              <th>Current Stage</th>
              <th>Created By (OMA)</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((r) => (
              <tr key={r.report_id}>
                <td>{r.report_id}</td>
                <td>{r.focus_area_id}</td>
                <td>{r.status}</td>
                <td>{r.current_stage}</td>
                <td>{r.created_by}</td>
                <td>
                  <button onClick={() => openReviewModal(r)}>Review</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* -------- REVIEW MODAL -------- */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              background: "white",
              padding: 20,
              borderRadius: 8,
              width: 400,
            }}
          >
            <h2>Review Report #{selectedReport?.report_id}</h2>
            <p>Stage: <strong>{selectedReport?.current_stage}</strong></p>

            <label><b>Action:</b></label>
            <select
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              style={{ width: "100%", marginBottom: 15 }}
            >
              <option value="approve">Approve</option>
              <option value="reject">Reject</option>
            </select>

            <label><b>Comment:</b></label>
            <textarea
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ width: "100%" }}
            />

            <br /><br />

            <button onClick={submitReview} style={{ padding: 8, marginRight: 10 }}>
              Submit Review
            </button>
            <button onClick={() => setShowModal(false)} style={{ padding: 8 }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default NPC_Dashboard;