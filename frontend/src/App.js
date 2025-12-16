import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const API = "https://login-signup-j4u0.onrender.com/api/auth";


function App() {
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const emailsMatch = email === confirmEmail;

  const passwordLength = password.length >= 8;
  const passwordLetter = /[A-Za-z]/.test(password);
  const passwordNumber = /\d/.test(password);
  const passwordSpecial = /[@$!%*#?&]/.test(password);
  const passwordsMatch = password === confirmPassword;

  const signup = async () => {
    if (!emailsMatch || !passwordsMatch) {
      setMessage("Emails or passwords do not match");
      setIsSuccess(false);
      return;
    }

    try {
      const res = await axios.post(`${API}/signup`, { email, password });
      setMessage("Signup successful. Please login.");
      setIsSuccess(true);
      setMode("login");
    } catch (err) {
      setMessage(err.response.data.message);
      setIsSuccess(false);
    }
  };

  const login = async () => {
    try {
      const res = await axios.post(`${API}/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      setLoggedIn(true);
      setMessage("Login successful");
      setIsSuccess(true);
    } catch (err) {
      setMessage(err.response.data.message);
      setIsSuccess(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setEmail("");
    setPassword("");
    setMessage("");
  };

  // ✅ SUCCESS SCREEN
  if (loggedIn) {
    return (
      <div className="container">
        <div className="card success-card">
          <h2>🎉 Welcome!</h2>
          <p>You are successfully logged in.</p>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h2>{mode === "login" ? "Login" : "Signup"}</h2>

        {message && (
          <div className={isSuccess ? "msg success" : "msg error"}>
            {message}
          </div>
        )}

        <input
          placeholder="Email"
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
            <p className={emailValid ? "valid" : "invalid"}>• Valid email</p>
            <p className={emailsMatch ? "valid" : "invalid"}>• Emails match</p>
            <p className={passwordLength ? "valid" : "invalid"}>• 8+ chars</p>
            <p className={passwordLetter ? "valid" : "invalid"}>• Letter</p>
            <p className={passwordNumber ? "valid" : "invalid"}>• Number</p>
            <p className={passwordSpecial ? "valid" : "invalid"}>
              • Special char
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
