// UserManagement.jsx
import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiSearch, FiX, FiPlus, FiActivity } from "react-icons/fi";
import './UserManagement.css';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [organisations, setOrganisations] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [createFormKey, setCreateFormKey] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch users and organisations
  useEffect(() => {
    fetchUsers();
    fetchOrganisations();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Failed to fetch users', err);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchOrganisations = async () => {
    try {
      const res = await fetch('/api/lookups/organisations');
      const data = await res.json();
      setOrganisations(data.organisations || []);
      console.log('Organisations fetched:', data.organisations);
    } catch (err) {
      console.error('Failed to fetch organisations', err);
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

  const handleDeleteClick = (user) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingUser) return;
    try {
      await fetch(`/api/admin/users/${deletingUser.id}`, { method: 'DELETE' });
      fetchUsers();
      setToast({ show: true, message: 'User deleted', type: 'success' });
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    } catch (err) {
      console.error('Delete failed', err);
      setToast({ show: true, message: 'Failed to delete user', type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 4000);
    } finally {
      setShowDeleteModal(false);
      setDeletingUser(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingUser(null);
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
        setToast({ show: true, message: 'User updated', type: 'success' });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
      })
      .catch(err => {
        console.error('Update failed', err);
        setToast({ show: true, message: 'Failed to update user', type: 'error' });
        setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 4000);
      });
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

  const getOrganisationName = (user) => {
    if (!user) return '';
    if (user.organisation) {
      const byName = organisations.find(o => o.name === user.organisation);
      if (byName) return byName.name;
    }
    const orgId = user.organisation_id || user.organisation || user.organisationId || null;
    if (!orgId) return '';
    const found = organisations.find(o => (o.organisation_id && o.organisation_id.toString() === orgId.toString()) || (o.id && o.id.toString() === orgId.toString()));
    return found ? found.name : '';
  };

  const handleCreateUser = (newUser) => {
    fetch('/api/admin/create-user', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newUser) })
      .then(async (r) => {
        if (!r.ok) throw new Error('Create failed');
        await r.json().catch(() => null);
        fetchUsers();
        setCreateFormKey(k => k + 1);
        setShowCreateModal(false);
        setToast({ show: true, message: 'User created successfully', type: 'success' });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
      })
      .catch((err) => {
        console.error('Create failed', err);
        setToast({ show: true, message: 'Failed to create user', type: 'error' });
        setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 4000);
      });
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
    actionBtn: { display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 10px", fontSize: "0.85rem", borderRadius: "6px", border: "none", cursor: "pointer", transition: "0.12s", boxShadow: "none" },
    editBtn: { backgroundColor: "#ffb740", color: "#000", padding: "6px 10px" },
    deleteBtn: { backgroundColor: "#ff4d4f", color: "#fff", padding: "6px 10px" },
    actionGroup: { display: 'flex', gap: 8, alignItems: 'center' },

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
      

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
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
        <button onClick={() => setShowCreateModal(true)} style={{ padding: '8px 12px', borderRadius: 8, background: '#0d1b2a', color: '#fff', border: 'none', cursor: 'pointer', display:'inline-flex', gap:8, alignItems:'center' }}><FiPlus /> New User</button>
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
            {loadingUsers ? (
              <tr>
                <td style={styles.td} colSpan={5}>Loading users…</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td style={styles.td} colSpan={5}>No users found</td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td style={styles.td}>{user.full_name}</td>
                  <td style={styles.td}>{user.username}</td>
                  <td style={styles.td}>{user.role}</td>
                  <td style={styles.td}>{getOrganisationName(user) || user.organisation || ''}</td>
                  <td style={styles.td}>
                    <div style={styles.actionGroup}>
                      <button aria-label={`Edit ${user.full_name}`} title="Edit" style={{ ...styles.actionBtn, ...styles.editBtn }} onClick={() => handleEditClick(user)}>
                        <FiEdit /> <span className="action-label">Edit</span>
                      </button>
                      <button aria-label={`View activity for ${user.full_name}`} title="View Activity" style={{ ...styles.actionBtn, padding: '6px 10px', background: '#e8f0ff', color: '#0d1b2a' }} onClick={() => { window.location.href = `/admin-dashboard?userId=${user.id}&user=${encodeURIComponent(user.username || user.full_name)}&page=tracking`; }}>
                        <FiActivity /> <span className="action-label">Activity</span>
                      </button>
                      <button aria-label={`Delete ${user.full_name}`} title="Delete" style={{ ...styles.actionBtn, ...styles.deleteBtn }} onClick={() => handleDeleteClick(user)}>
                        <FiTrash2 /> <span className="action-label">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

        {/* Toast */}
        {toast.show && (
          <div className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`} role="status">
            {toast.message}
          </div>
        )}

      {/* Create Modal */}
      {showCreateModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <FiX style={styles.modalClose} onClick={() => setShowCreateModal(false)} />
            <h3 style={styles.modalHeader}>Add New System User</h3>
            <CreateForm organisations={organisations} onCreate={handleCreateUser} onCancel={() => setShowCreateModal(false)} />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingUser && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <FiX style={styles.modalClose} onClick={cancelDelete} />
            <h3 style={styles.modalHeader}>Confirm Delete</h3>
            <p>Are you sure you want to delete <strong>{deletingUser.full_name}</strong>?</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
              <button onClick={cancelDelete} style={{ padding: '8px 12px', borderRadius: 6 }}>Cancel</button>
              <button onClick={confirmDelete} style={{ padding: '8px 12px', borderRadius: 6, background: '#ff4d4f', color: '#fff', border: 'none' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

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
          </div>
        </div>
      )}

      {/* (Create form is rendered inline above the table) */}
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
      {message && <p style={{ marginTop: 10, color: message.toLowerCase().includes('error') ? 'var(--alert)' : 'var(--success)' }}>{message}</p>}
    </div>
  );
}
