import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const API = "https://login-signup-j4u0.onrender.com/api/auth";

function App() {
  const [view, setView] = useState("auth"); // auth | dashboard
  const [mode, setMode] = useState("login"); // login | signup

  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error

  // EMAIL REGEX (.com and .in only)
  const emailRegex = /^[^\s@]+@[^\s@]+\.(com|in)$/;
  const emailValid = emailRegex.test(email);
  const emailsMatch = email === confirmEmail;

  const passwordLength = password.length >= 8;
  const passwordLetter = /[A-Za-z]/.test(password);
  const passwordNumber = /\d/.test(password);
  const passwordSpecial = /[@$!%*#?&]/.test(password);
  const passwordsMatch = password === confirmPassword;

  // ================= SIGNUP =================
  const signup = async () => {
    if (!emailValid || !emailsMatch || !passwordsMatch) {
      setMessage("Please fix the highlighted validation errors.");
      setMessageType("error");
      return;
    }

    try {
      await axios.post(`${API}/signup`, { email, password });

      setMessage("Account created successfully");
      setMessageType("success");
      setView("dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
      setMessageType("error");
    }
  };

  // ================= LOGIN =================
  const login = async () => {
    try {
      const res = await axios.post(`${API}/login`, { email, password });
      localStorage.setItem("token", res.data.token);

      setMessage("");
      setMessageType("");
      setView("dashboard");
    } catch (err) {
      setMessage("Invalid credentials. Please check email or password.");
      setMessageType("error");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setView("auth");
    setMode("login");
    setEmail("");
    setPassword("");
    setMessage("");
  };

  // ================= DASHBOARD =================
  if (view === "dashboard") {
    return (
      <div className="container">
        <div className="card dashboard">
          <h2>Welcome To Dashboard</h2>

          {message && (
            <div className={`msg ${messageType}`}>
              {message}
            </div>
          )}

          <p>Welcome! You are logged in.</p>

          <div className="stats">
            <div className="stat-box">Status: Active</div>
            <div className="stat-box">Role: User</div>
          </div>

          <button onClick={logout}>Logout</button>
        </div>
      </div>
    );
  }

  // ================= AUTH =================
  return (
    <div className="container">
      <div className="card">
        <h2>{mode === "login" ? "Login" : "Signup"}</h2>

        {message && (
          <div className={`msg ${messageType}`}>
            {message}
          </div>
        )}

        <input
          placeholder="Email (.com or .in)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {mode === "signup" && (
          <input
            placeholder="Confirm Email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
          />
        )}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {mode === "signup" && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}

        {mode === "signup" && (
          <div className="tips">
            <p className={emailValid ? "valid" : "invalid"}>
              • Email must end with .com or .in
            </p>
            <p className={emailsMatch ? "valid" : "invalid"}>
              • Emails match
            </p>
            <p className={passwordLength ? "valid" : "invalid"}>
              • Minimum 8 characters
            </p>
            <p className={passwordLetter ? "valid" : "invalid"}>
              • At least one letter
            </p>
            <p className={passwordNumber ? "valid" : "invalid"}>
              • At least one number
            </p>
            <p className={passwordSpecial ? "valid" : "invalid"}>
              • At least one special character
            </p>
            <p className={passwordsMatch ? "valid" : "invalid"}>
              • Passwords match
            </p>
          </div>
        )}

        <div className="btn-group">
          {mode === "login" ? (
            <>
              <button onClick={login}>Login</button>
              <button className="outline" onClick={() => setMode("signup")}>
                Signup
              </button>
            </>
          ) : (
            <>
              <button onClick={signup}>Signup</button>
              <button className="outline" onClick={() => setMode("login")}>
                Back to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
