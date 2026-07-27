import React, { useState } from "react";

import { Context } from "../Context";
import "./Register.css";


function Register({ setShowLogin }) {


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
  alert(data.message);
  setShowLogin(true);
} else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
  <div className="register-container">
    <div className="register-card">
      <h1>Create Account</h1>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Register</button>
      </form>

      <p>
  Already have an account?{" "}
  <span
    onClick={() => setShowLogin(true)}
    style={{ color: "#4f8cff", cursor: "pointer" }}
  >
    Login
  </span>
</p>
    </div>
  </div>
);
}

export default Register;