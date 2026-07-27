import React, { useState, useContext } from "react";
import { Context } from "../Context";
import "./Login.css";


import "./Login.css";
function Login({ setShowLogin })  {
    const { setIsAuthenticated } = useContext(Context);


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // JWT token save
        localStorage.setItem("token", data.token);

       setIsAuthenticated(true);

      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>
<p>
  Don't have an account?{" "}
  <span
    onClick={() => setShowLogin(false)}
    style={{ color: "#4f8cff", cursor: "pointer" }}
  >
    Register
  </span>
</p>
      </div>
    </div>
  );
}

export default Login;