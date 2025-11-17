import { useState, useEffect } from "react";

function AddUser() {
  const [form, setForm] = useState({
    full_name: "",
    username: "",
    password: "",
    role_id: "",
    organisation_id: "",
    focus_area_id: ""
  });

  const [generatedPassword, setGeneratedPassword] = useState("");
  const [message, setMessage] = useState("");
  const [focusAreas, setFocusAreas] = useState([]);
  const [organisations, setOrganisations] = useState([
    { id: 1, name: "MAFWLR" },
    { id: 2, name: "MIRT" },
    { id: 3, name: "MIME" }
  ]);

  const token = localStorage.getItem("token");

  // Fetch focus areas dynamically when role=OMA and organisation changes
  useEffect(() => {
    if (form.role_id === "3" && form.organisation_id) {
      fetch(`http://localhost:4000/api/focus-areas/by-org/${form.organisation_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          const filtered = (data.focusAreas || []).filter(
            fa => fa.organisation_id === parseInt(form.organisation_id)
          );
          setFocusAreas(filtered);
        })
        .catch(err => {
          console.error(err);
          setFocusAreas([]);
        });
    } else {
      setFocusAreas([]);
      setForm(prev => ({ ...prev, focus_area_id: "" }));
    }
  }, [form.role_id, form.organisation_id, token]);

  // Generate random password
  const generatePassword = () => {
    const pwd = Math.random().toString(36).slice(-8);
    setForm({ ...form, password: pwd });
    setGeneratedPassword(pwd);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const payload = {
      full_name: form.full_name,
      username: form.username,
      password: form.password,
      role_id: parseInt(form.role_id),
      organisation_id: form.organisation_id
        ? parseInt(form.organisation_id)
        : null,
      focus_area_id: form.focus_area_id
        ? parseInt(form.focus_area_id)
        : null,
    };

    if (payload.role_id === 3 && (!payload.organisation_id || !payload.focus_area_id)) {
      setMessage("Organisation and Focus Area are required for OMA role");
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

      setMessage(`User created! Password (show this only once): ${data.plain_password}`);

      setForm({
        full_name: "",
        username: "",
        password: "",
        role_id: "",
        organisation_id: "",
        focus_area_id: ""
      });
      setGeneratedPassword("");
    } catch (err) {
      console.error(err);
      setMessage("Server error while creating user");
    }
  };

  return (
    <div style={{ width: 400, margin: "40px auto" }}>
      <h2>Add New User</h2>

      {message && <p style={{ color: "green" }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          required
        />
        <br /><br />

        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <br /><br />

        <select
          value={form.role_id}
          onChange={(e) => setForm({ ...form, role_id: e.target.value })}
          required
        >
          <option value="">Select Role</option>
          <option value="1">Admin</option>
          <option value="2">NPC</option>
          <option value="3">OMA</option>
        </select>
        <br /><br />

        {/* Organisation selection (for OMA) */}
        {form.role_id === "3" && (
          <>
            <label>Organisation (OMA):</label>
            <select
              value={form.organisation_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  organisation_id: e.target.value,
                  focus_area_id: ""
                })
              }
              required
            >
              <option value="">Select Organisation</option>
              {organisations.map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
            <br /><br />
          </>
        )}

        {/* Focus area selection (for OMA) */}
        {form.role_id === "3" && (
          <>
            <label>Focus Area (Required for OMA):</label>
            <select
              value={form.focus_area_id}
              onChange={(e) => setForm({ ...form, focus_area_id: e.target.value })}
              required
            >
              <option value="">Select Focus Area</option>
              {focusAreas.map(fa => (
                <option key={fa.focus_area_id} value={fa.focus_area_id}>
                  {fa.name}
                </option>
              ))}
            </select>
            <br /><br />
          </>
        )}

        <input
          type="text"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="button" onClick={generatePassword}>
          Generate Password
        </button>
        <br /><br />

        <button type="submit">Create User</button>
      </form>
    </div>
  );
}

export default AddUser;
