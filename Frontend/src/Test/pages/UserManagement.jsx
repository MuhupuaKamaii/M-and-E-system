// UserManagement.jsx
import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiSearch, FiX, FiPlus } from "react-icons/fi";

const API_BASE_URL = "http://localhost:4000/api";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [organisations, setOrganisations] = useState([]);

  // Fetch users and organisations
  useEffect(() => {
    fetchUsers();
    fetchOrganisations();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const fetchOrganisations = async () => {
    try {
      const res = await fetch('/api/admin/organisations');
      const data = await res.json();
      setOrganisations(data.organisations || []);
    } catch (err) {
      console.error('Failed to fetch organisations', err);
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/dashboard/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.users || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (user) => {
    setEditUser(user);
    setShowModal(true);
  };

  const handleDeleteClick = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      // call API
      fetch(`/api/admin/users/${userId}`, { method: 'DELETE' }).then(() => fetchUsers()).catch(err => console.error(err));
    }
  };

  const handleSaveEdit = () => {
    // Update on server
    const payload = {
      full_name: editUser.full_name,
      username: editUser.username,
      // map role text to role_id where possible
      role_id: roleTextToId(editUser.role),
      organisation_id: findOrganisationId(editUser.organisation)
    };
    fetch(`/api/admin/users/${editUser.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(r => r.json())
      .then(() => {
        fetchUsers();
        setShowModal(false);
        setEditUser(null);
      })
      .catch(err => console.error('Update failed', err));
  };

  const roleTextToId = (roleText) => {
    if (!roleText) return null;
    const t = roleText.toString().toLowerCase();
    if (t.includes('admin')) return 1;
    if (t.includes('npc')) return 2;
    if (t.includes('oma')) return 3;
    return 4; // generic user
  };

  const findOrganisationId = (orgName) => {
    if (!orgName) return null;
    const found = organisations.find(o => o.name === orgName || o.organisation_id === orgName || o.id === orgName);
    return found ? (found.organisation_id || found.id) : null;
  };

  const handleCreateUser = (newUser) => {
    fetch('/api/admin/create-user', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newUser) })
      .then(r => r.json())
      .then(() => {
        fetchUsers();
        setShowCreateModal(false);
      })
      .catch(err => console.error('Create failed', err));
  const handleDeleteClick = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || "Failed to delete user");
        return;
      }

      // Remove user from local state
      setUsers(users.filter((u) => u.id !== userId));
      alert("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Error deleting user");
    }
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/users/${editUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: editUser.full_name,
          username: editUser.username,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || "Failed to update user");
        return;
      }

      // Update user in local state
      setUsers(users.map((u) => (u.id === editUser.id ? editUser : u)));
      setShowModal(false);
      setEditUser(null);
      alert("User updated successfully");
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Error updating user");
    }
  };

  const styles = {
    container: { padding: "20px", fontFamily: "Segoe UI, sans-serif", color: "#1a1a1a" },
    header: { fontSize: "1.8rem", fontWeight: 700, marginBottom: "25px" },
    searchWrapper: {
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      backgroundColor: "#fff",
      padding: "8px 12px",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      maxWidth: "400px",
    },
    searchInput: { flex: 1, border: "none", outline: "none", fontSize: "1rem" },
    tableWrapper: { overflowX: "auto", backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
    table: { width: "100%", borderCollapse: "collapse", minWidth: "700px" },
    th: { textAlign: "left", padding: "14px 18px", backgroundColor: "#0d1b2a", color: "#fff", fontWeight: 600, fontSize: "0.95rem" },
    td: { padding: "12px 18px", borderBottom: "1px solid #eee", fontSize: "0.95rem", color: "#1a1a1a" },
    actionBtn: { display: "inline-flex", alignItems: "center", gap: "5px", padding: "6px 12px", fontSize: "0.85rem", borderRadius: "5px", border: "none", cursor: "pointer", transition: "0.2s" },
    editBtn: { backgroundColor: "#ffca28", color: "#000" },
    deleteBtn: { backgroundColor: "#ff4d4f", color: "#fff" },

    // Modal
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: "#fff",
      padding: "25px",
      borderRadius: "12px",
      width: "400px",
      position: "relative",
      boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
    },
    modalHeader: { fontSize: "1.4rem", fontWeight: 600, marginBottom: "15px" },
    modalInput: { width: "100%", padding: "8px 10px", marginBottom: "12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem" },
    modalClose: { position: "absolute", top: "12px", right: "12px", cursor: "pointer", fontSize: "1.2rem", color: "#333" },
    modalSaveBtn: { padding: "10px 20px", backgroundColor: "#0d1b2a", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "1rem" },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>User Management</h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={styles.searchWrapper}>
      <div style={styles.searchWrapper}>
        <FiSearch size={18} color="#0d1b2a" />
        <input
          type="text"
          placeholder="Search by name, username or role..."
          style={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Full Name</th>
              <th style={styles.th}>Username</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Organisation</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td style={styles.td}>{user.full_name}</td>
                <td style={styles.td}>{user.username}</td>
                <td style={styles.td}>{user.role}</td>
                <td style={styles.td}>{user.organisation}</td>
                <td style={styles.td}>
                  <button style={{ ...styles.actionBtn, ...styles.editBtn }} onClick={() => handleEditClick(user)}>
                    <FiEdit /> Edit
                  </button>
                  <button style={{ ...styles.actionBtn, ...styles.deleteBtn }} onClick={() => handleDeleteClick(user.id)}>
                    <FiTrash2 /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showModal && editUser && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <FiX style={styles.modalClose} onClick={() => setShowModal(false)} />
            <h3 style={styles.modalHeader}>Edit User</h3>
            <input
              type="text"
              style={styles.modalInput}
              value={editUser.full_name}
              onChange={(e) => setEditUser({ ...editUser, full_name: e.target.value })}
              placeholder="Full Name"
            />
            <input
              type="text"
              style={styles.modalInput}
              value={editUser.username}
              onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
              placeholder="Username"
            />
            <select style={styles.modalInput} value={editUser.role} onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}>
              <option>Admin</option>
              <option>NPC</option>
              <option>OMA</option>
              <option>User</option>
            </select>
            <select style={styles.modalInput} value={editUser.organisation || ''} onChange={(e) => setEditUser({ ...editUser, organisation: e.target.value })}>
              <option value="">-- Organisation --</option>
              {organisations.map(o => <option key={o.organisation_id || o.id} value={o.name}>{o.name}</option>)}
            </select>
            <button style={styles.modalSaveBtn} onClick={handleSaveEdit}>Save Changes</button>
            <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "12px" }}>
              Role: <strong>{editUser.role}</strong> | Organisation: <strong>{editUser.organisation}</strong>
            </p>
            <button style={styles.modalSaveBtn} onClick={handleSaveEdit}>
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CreateForm({ organisations, onCreate, onCancel }){
  const [full_name, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role_id, setRoleId] = useState(2);
  const [organisation_id, setOrganisationId] = useState('');

  const submit = () => {
    const payload = { full_name, username, password, role_id: Number(role_id), organisation_id: organisation_id ? Number(organisation_id) : null };
    onCreate(payload);
  };

  return (
    <div>
      <input style={{width:'100%',padding:8,marginBottom:10}} placeholder="Full name" value={full_name} onChange={e=>setFullName(e.target.value)} />
      <input style={{width:'100%',padding:8,marginBottom:10}} placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
      <input style={{width:'100%',padding:8,marginBottom:10}} placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <select style={{width:'100%',padding:8,marginBottom:10}} value={role_id} onChange={e=>setRoleId(e.target.value)}>
        <option value={1}>Admin</option>
        <option value={2}>NPC</option>
        <option value={3}>OMA</option>
        <option value={4}>User</option>
      </select>
      <select style={{width:'100%',padding:8,marginBottom:10}} value={organisation_id} onChange={e=>setOrganisationId(e.target.value)}>
        <option value="">-- Organisation (optional) --</option>
        {organisations.map(o => <option key={o.organisation_id || o.id} value={o.organisation_id || o.id}>{o.name}</option>)}
      </select>
      <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
        <button onClick={onCancel} style={{padding:'8px 12px',borderRadius:8}}>Cancel</button>
        <button onClick={submit} style={{padding:'8px 12px',borderRadius:8,background:'#0d1b2a',color:'#fff'}}>Create</button>
      </div>
    </div>
  )
}
}
