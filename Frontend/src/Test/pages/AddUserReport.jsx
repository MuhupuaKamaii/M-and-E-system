import { useState, useEffect } from "react";
import FocusAreaDropdown from "../components/FocusAreaDropdown"; 

export default function AddUserReport() {
  const [focusAreas, setFocusAreas] = useState([]);
  const [selectedFocusArea, setSelectedFocusArea] = useState("");
  const [details, setDetails] = useState({});
  const [reportData, setReportData] = useState({
    programme_id: "",
    strategies: [],
    description: "",
    target: "",
    comments: "",
  });
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  const canEditField = (field) => {
    if (userRole === "Admin") return true;
    if (userRole === "NPC") return false;
    if (userRole === "OMA") return ["description", "target", "comments"].includes(field);
    return false;
  };

  const readOnlyStyle = {
    backgroundColor: "#f4f4f4",
    cursor: "not-allowed",
  };

  // Fetch all focus areas
  useEffect(() => {
    if (!token) return;

    const fetchFocusAreas = async () => {
      try {
        const res = await fetch("/api/focus-areas", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error("Error fetching focus areas:", errorData.message);
          return;
        }

        const data = await res.json();
        setFocusAreas(data.focusAreas || []);
      } catch (err) {
        console.error("Network error fetching focus areas:", err);
      }
    };

    fetchFocusAreas();
  }, [token]);

  // Fetch details for selected focus area
  useEffect(() => {
    if (!selectedFocusArea || !token) return;

    const fetchDetails = async () => {
      try {
        const res = await fetch(`/api/focus-areas/${selectedFocusArea}/details`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error("Error fetching focus area details:", errorData.message);
          return;
        }

        const data = await res.json();
        setDetails(data);
        setReportData((prev) => ({ ...prev, programme_id: "", strategies: [] }));
      } catch (err) {
        console.error("Network error fetching focus area details:", err);
      }
    };

    fetchDetails();
  }, [selectedFocusArea, token]);

  // Handle submit report
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      focus_area_id: selectedFocusArea,
      ...reportData,
    };

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) return setMessage(data.message || "Error submitting report");

      setMessage("Report created successfully!");
      setReportData({ programme_id: "", strategies: [], description: "", target: "", comments: "" });
      setSelectedFocusArea("");
      setDetails({});
    } catch (err) {
      console.error(err);
      setMessage("Error creating report");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 20 }}>
      <h2>Add Report</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        {/* FOCUS AREA DROPDOWN */}
        <label><strong>Select Focus Area:</strong></label>
        <FocusAreaDropdown
          focusAreas={focusAreas}
          selectedFocusArea={selectedFocusArea}
          setSelectedFocusArea={setSelectedFocusArea}
        />

        <br /><br />

        {selectedFocusArea && (
          <>
            {/* READ-ONLY PILLAR */}
            <label>Pillar:</label>
            <input type="text" value={details.pillar?.name || ""} readOnly style={readOnlyStyle} />

            <br /><br />

            {/* READ-ONLY THEME */}
            <label>Theme:</label>
            <input type="text" value={details.theme?.name || ""} readOnly style={readOnlyStyle} />

            <br /><br />

            {/* PROGRAMME SELECTION */}
            <label>Programme:</label>
            {details.programmes?.length > 1 ? (
              <select
                value={reportData.programme_id}
                onChange={(e) => {
                  const selectedProgrammeId = e.target.value;
                  const programme = details.programmes.find((p) => p.id.toString() === selectedProgrammeId);

                  setReportData((prev) => ({
                    ...prev,
                    programme_id: selectedProgrammeId,
                    strategies: [],
                  }));

                  // Optional: preload strategies if needed
                  if (programme && programme.strategies) {
                    setReportData((prev) => ({
                      ...prev,
                      strategies: [],
                    }));
                  }
                }}
                required
              >
                <option value="">-- Select Programme --</option>
                {details.programmes.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            ) : (
              <input type="text" readOnly value={details.programmes?.[0]?.name || ""} style={readOnlyStyle} />
            )}

            <br /><br />

            {/* STRATEGIES CHECKBOXES */}
            {reportData.programme_id && (
              <>
                <label>Strategies:</label>
                {details.programmes
                  .find((p) => p.id.toString() === reportData.programme_id)
                  ?.strategies?.map((s) => (
                    <div key={s.id}>
                      <input
                        type="checkbox"
                        checked={reportData.strategies.includes(s.id)}
                        onChange={(e) => {
                          setReportData((prev) => {
                            const updatedStrategies = e.target.checked
                              ? [...prev.strategies, s.id]
                              : prev.strategies.filter((id) => id !== s.id);
                            return { ...prev, strategies: updatedStrategies };
                          });
                        }}
                      />
                      {s.description}
                    </div>
                  ))}
              </>
            )}

            <br />

            {/* DESCRIPTION */}
            <label>Description:</label>
            <textarea
              rows={3}
              style={{ width: "100%", ...(canEditField("description") ? {} : readOnlyStyle) }}
              readOnly={!canEditField("description")}
              value={reportData.description}
              onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
            />

            <br /><br />

            {/* TARGET */}
            <label>Target:</label>
            <textarea
              rows={2}
              style={{ width: "100%", ...(canEditField("target") ? {} : readOnlyStyle) }}
              readOnly={!canEditField("target")}
              value={reportData.target}
              onChange={(e) => setReportData({ ...reportData, target: e.target.value })}
            />

            <br /><br />

            {/* COMMENTS */}
            <label>Comments:</label>
            <textarea
              rows={2}
              style={{ width: "100%", ...(canEditField("comments") ? {} : readOnlyStyle) }}
              readOnly={!canEditField("comments")}
              value={reportData.comments}
              onChange={(e) => setReportData({ ...reportData, comments: e.target.value })}
            />

            <br /><br />

            <button type="submit" style={{ padding: 10 }}>Submit Report</button>
          </>
        )}
      </form>
    </div>
  );
}
