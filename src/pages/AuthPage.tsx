import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { auth } from "../auth";
import type { User } from "../types/user";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/AuthPage.css";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const resetFields = () => {
    setUsername("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setEmail("");
  };

const handleLogin = async () => {
  setLoading(true);
  try {
    const res = await api.get<User[]>("/users");
    const user = res.data.find(
      u => u.userName === username && u.password === password
    );

    if (!user) {
      toast.error("Invalid credentials", { position: "top-right" });
      return;
    }

    // Save mock token + user info
    auth.setToken("mock-jwt-token");
    auth.setUser(user);

    toast.success(`Welcome back, ${user.userName}!`, { position: "top-right" });
    navigate("/users", { replace: true });
  } catch {
    toast.error("Login failed", { position: "top-right" });
  } finally {
    setLoading(false);
  }
};


  const handleRegister = async () => {
    setLoading(true);
    try {
      await api.post("/users", { userName: username, firstName, lastName, email, password });
      toast.success("Account created successfully!", { position: "top-right" });
      setIsLogin(true);
      resetFields();
    } catch {
      toast.error("Registration failed", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) handleLogin();
    else handleRegister();
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>{isLogin ? "KCB Login" : "KCB Register"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          {!isLogin && (
            <>
              <input
                placeholder="First Name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
              />
              <input
                placeholder="Last Name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </>
          )}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? (isLogin ? "Signing in..." : "Registering...") : isLogin ? "Sign In" : "Register"}
          </button>
        </form>
        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span className="toggle-link" onClick={() => { setIsLogin(!isLogin); resetFields(); }}>
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default AuthPage;
