import { useState, useEffect } from "react";

export default function AddUser() {
  const [form, setForm] = useState({
    full_name: "",
    username: "",
    password: "",
    role_id: "",
    organisation_id: ""
  });

  const [generatedPassword, setGeneratedPassword] = useState("");
  const [message, setMessage] = useState("");
  const [organisations, setOrganisations] = useState([]);

  const token = localStorage.getItem("token");

  // Fetch organisations for the organisation dropdown
  useEffect(() => {
    const fetchOrganisations = async () => {
      try {
        const res = await fetch('/api/lookups/organisations');
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        setOrganisations(data.organisations || []);
      } catch (err) {
        console.error('Error fetching organisations:', err);
        setOrganisations([]);
      }
    };

    fetchOrganisations();
  }, []);

  /* -----------------------------------------------------------
      Generate Password
  ------------------------------------------------------------*/
  const generatePassword = () => {
    const pwd = Math.random().toString(36).slice(-8);
    setForm({ ...form, password: pwd });
    setGeneratedPassword(pwd);
  };

  /* -----------------------------------------------------------
      Submit Handler
  ------------------------------------------------------------*/
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const payload = {
      full_name: form.full_name,
      username: form.username,
      password: form.password,
      role_id: parseInt(form.role_id),
      organisation_id: form.organisation_id ? parseInt(form.organisation_id) : null,
    };

    // Validations
    if (payload.role_id === 3 && !payload.organisation_id) {
      setMessage("Organisation is required for OMA role");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/admin/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Error creating user");
        return;
      }

      setMessage(`User created! Temporary Password: ${data.plain_password}`);

      setForm({
        full_name: "",
        username: "",
        password: "",
        role_id: "",
        organisation_id: ""
      });
      setGeneratedPassword("");
    } catch (err) {
      console.error(err);
      setMessage("Server error while creating user");
    }
  };

  /* -----------------------------------------------------------
      INLINE INDUSTRY-LEVEL UI STYLES
  ------------------------------------------------------------*/
  const styles = {
    wrapper: {
      maxWidth: "520px",
      margin: "0 auto",
      background: "#ffffff",
      padding: "30px 35px",
      borderRadius: "12px",
      boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
      fontFamily: "Segoe UI, sans-serif",
      color: "#1a1a1a",
    },
    title: {
      fontSize: "1.8rem",
      fontWeight: "600",
      marginBottom: "20px",
      textAlign: "center",
      color: "#003366",
    },
    input: {
      width: "100%",
      padding: "12px",
      marginBottom: "18px",
      borderRadius: "8px",
      border: "1px solid #cfd6dd",
      fontSize: "1rem",
      outline: "none",
      transition: "all 0.2s ease",
    },
    select: {
      width: "100%",
      padding: "12px",
      marginBottom: "18px",
      borderRadius: "8px",
      border: "1px solid #cfd6dd",
      fontSize: "1rem",
      background: "white",
    },
    generateBtn: {
      padding: "10px 15px",
      background: "#0056a6",
      color: "white",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      marginLeft: "10px",
    },
    submitBtn: {
      width: "100%",
      padding: "14px",
      background: "#003366",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "1rem",
      cursor: "pointer",
      marginTop: "10px",
    },
    label: {
      fontSize: "0.95rem",
      marginBottom: "6px",
      fontWeight: 500,
      display: "block",
      color: "#003366",
    },
    success: { color: "green", marginBottom: "15px", fontSize: "0.95rem" },
    error: { color: "red", marginBottom: "15px", fontSize: "0.95rem" },
    passwordRow: { display: "flex", alignItems: "center" },
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Add New System User</h2>

      {message && <p style={message.includes("error") ? styles.error : styles.success}>{message}</p>}

      <form onSubmit={handleSubmit}>

        <label style={styles.label}>Full Name</label>
        <input
          style={styles.input}
          type="text"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          placeholder="Enter full name"
          required
        />

        <label style={styles.label}>Username</label>
        <input
          style={styles.input}
          type="text"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          placeholder="Enter username"
          required
        />

        <label style={styles.label}>Role</label>
        <select
          style={styles.select}
          value={form.role_id}
          onChange={(e) => setForm({ ...form, role_id: e.target.value })}
          required
        >
          <option value="">Select role</option>
          <option value="1">Admin</option>
          <option value="2">NPC</option>
          <option value="3">OMA</option>
        </select>

        {/* ORGANISATION for OMA */}
        {form.role_id === "3" && (
          <>
            <label style={styles.label}>Organisation (OMA)</label>
            <select
              style={styles.select}
              value={form.organisation_id}
              onChange={(e) => setForm({ ...form, organisation_id: e.target.value })}
              required
            >
              <option value="">Select organisation</option>
              {organisations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </>
        )}

        {/* PASSWORD */}
        <label style={styles.label}>Password</label>
        <div style={styles.passwordRow}>
          <input
            style={{ ...styles.input, marginBottom: 0 }}
            type="text"
            value={form.password}
            placeholder="Enter or generate password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button type="button" style={styles.generateBtn} onClick={generatePassword}>
            Generate
          </button>
        </div>
        <div style={{ marginBottom: "20px" }} />

        <button type="submit" style={styles.submitBtn}>
          Create User
        </button>
      </form>
    </div>
  );
}
