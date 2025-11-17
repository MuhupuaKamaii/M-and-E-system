// OMA_Dashboard.jsx
import React, { useState } from "react";
import { Link } from 'react-router-dom';

export default function OMA_Dashboard() {
  const [activePage, setActivePage] = useState("planning"); 
  const [formData, setFormData] = useState({
    project_name: "",
    description: "",
    deadline: "",
  });
  const [message, setMessage] = useState("");

  const styles = {
    container: { display: "flex", minHeight: "100vh", fontFamily: "Segoe UI, sans-serif", backgroundColor: "#f4f6f8", color: "#1a1a1a" },
    sidebar: { width: "250px", backgroundColor: "#0d1b2a", color: "#e0e6ed", padding: "30px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between" },
    logo: { fontSize: "1.6rem", fontWeight: "700", marginBottom: "35px", letterSpacing: "1px" },
    menuItem: { display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "1rem", transition: "all 0.2s" },
    activeMenuItem: { backgroundColor: "#1b2a41", fontWeight: 600 },
    bottomMenu: { marginTop: "auto", display: "flex", flexDirection: "column", gap: "12px" },
    main: { flex: 1, padding: "40px 50px" },
    header: { fontSize: "2rem", fontWeight: "700", marginBottom: "10px" },
    subtext: { opacity: 0.7, marginBottom: "25px", fontSize: "1rem" },
    card: { backgroundColor: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.12)", marginBottom: "30px" },
    formGroup: { display: "flex", flexDirection: "column", marginBottom: "15px" },
    input: { padding: "10px 12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem" },
    button: { padding: "10px 16px", backgroundColor: "#0d1b2a", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", marginTop: "10px" },
    successMsg: { color: "green", marginBottom: "15px" },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Normally send data to backend API
    console.log("Form Submitted:", formData);
    setMessage("Planning form submitted successfully!");
    setFormData({ project_name: "", description: "", deadline: "" });
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.logo}>Ministry Panel</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div
              style={{ ...styles.menuItem, ...(activePage === "planning" ? styles.activeMenuItem : {}) }}
              onClick={() => setActivePage("planning")}
            >
              Planning
            </div>
            <div
              style={{ ...styles.menuItem, ...(activePage === "execution" ? styles.activeMenuItem : {}) }}
              onClick={() => setActivePage("execution")}
            >
              Execution
            </div>
          </div>
        </div>

        {/* Bottom Menu */}
        <div style={styles.bottomMenu}>
          <div style={styles.menuItem}>Logout</div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        {activePage === "planning" && (
          <>
            <h1 style={styles.header}>Planning Panel</h1>
            <p style={styles.subtext}>Submit new project plans and initiatives.</p>
            <div style={styles.card}>
              {message && <div style={styles.successMsg}>{message}</div>}
              <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                  <label>Project Name</label>
                  <input
                    type="text"
                    value={formData.project_name}
                    onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={styles.input}
                    rows={4}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label>Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    style={styles.input}
                    required
                  />
                </div>
                <button type="submit" style={styles.button}>
                  Submit Plan
                </button>
              </form>
            </div>
          </>
        )}

        <div>
          <h1>OMA Dashboard — Ministry Workspace</h1>
          <Link to="/test-form">Go to Test Form</Link>
        </div>

        {activePage === "execution" && (
          <>
            <h1 style={styles.header}>Execution Panel</h1>
            <p style={styles.subtext}>Monitor ongoing projects and execution status.</p>
            <div style={styles.card}>
              <h2>Ongoing Projects</h2>
              <p>Here you can see all active projects assigned to your ministry.</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
