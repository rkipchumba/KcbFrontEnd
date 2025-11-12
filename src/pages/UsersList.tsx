/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { auth } from "../auth";
import type { User } from "../types/user";
import UserForm from "./UserForm";
import styles from "../styles/Users.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();
  const loggedInUser = auth.getUser();

  const fetchUsers = async (query?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = query ? { userName: query } : {};
      const res = await api.get<User[]>("/users", { params });
      setUsers(res.data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      navigate("/", { replace: true });
      return;
    }
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success("User deleted successfully", { position: "top-right" });
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to delete user");
      toast.error("Failed to delete user", { position: "top-right" });
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setEditingUser(null);
    setShowForm(false);
  };

const handleFormSave = (user: User, isNew: boolean) => {
  if (isNew) {
    setUsers(prev => [...prev, user]);
    toast.success(`User ${user.userName} added successfully!`, { position: "top-right" });
  } else {
    setUsers(prev => prev.map(u => (u.id === user.id ? user : u)));
    toast.success(`User ${user.userName} updated successfully!`, { position: "top-right" });
  }
  handleFormClose();
};

  const handleLogout = () => {
    auth.clear();
    navigate("/", { replace: true });
  };

  return (
    <div className={styles["users-container"]}>
      <ToastContainer autoClose={3000} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h2 style={{ marginBottom: "0.25rem" }}>All Users</h2>
          {loggedInUser && (
            <p style={{ color: "#004d4d", fontWeight: "500" }}>
              Welcome: <strong>{loggedInUser.firstName}</strong>
            </p>
          )}
        </div>

        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#004d4d",
            color: "white",
            border: "none",
            padding: "0.6rem 1.2rem",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>

      <div className={styles["users-actions"]}>
        <input
          placeholder="Search by username"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className={styles["search-btn"]} onClick={() => fetchUsers(search)}>
          Search
        </button>
        <button className={styles["add-btn"]} onClick={() => setShowForm(true)}>
          Add New User
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className={styles["users-table"]}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.userName}</td>
                <td>
                  {u.firstName} {u.lastName}
                </td>
                <td>{u.email}</td>
                <td>
                  <button className={styles["edit-btn"]} onClick={() => handleEdit(u)}>
                    Edit
                  </button>
                  <button className={styles["delete-btn"]} onClick={() => handleDelete(u.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <UserForm user={editingUser} onClose={handleFormClose} onSave={handleFormSave} />
      )}
    </div>
  );
};

export default UsersList;
