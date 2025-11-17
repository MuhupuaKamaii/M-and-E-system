// UserManagement.jsx
import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiSearch, FiX } from "react-icons/fi";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Dummy data (replace with API call)
  useEffect(() => {
    const dummyUsers = [
      { id: 1, full_name: "John Doe", username: "jdoe", role: "Admin", organisation: "NPC" },
      { id: 2, full_name: "Jane Smith", username: "jsmith", role: "OMA", organisation: "MAFWLR" },
      { id: 3, full_name: "Peter Pan", username: "ppan", role: "NPC", organisation: "MIRT" },
    ];
    setUsers(dummyUsers);
  }, []);

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
      setUsers(users.filter((u) => u.id !== userId));
    }
  };

  const handleSaveEdit = () => {
    setUsers(users.map(u => (u.id === editUser.id ? editUser : u)));
    setShowModal(false);
    setEditUser(null);
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
            <input
              type="text"
              style={styles.modalInput}
              value={editUser.role}
              onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
              placeholder="Role"
            />
            <input
              type="text"
              style={styles.modalInput}
              value={editUser.organisation}
              onChange={(e) => setEditUser({ ...editUser, organisation: e.target.value })}
              placeholder="Organisation"
            />
            <button style={styles.modalSaveBtn} onClick={handleSaveEdit}>Save Changes</button>
          </div>
        </div>
      )}
    </div>
  );
}
