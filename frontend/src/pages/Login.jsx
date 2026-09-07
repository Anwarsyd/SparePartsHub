import { useState } from "react";
import api from "../api/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login/", {
        email,
        password,
      });

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      console.log("Login successful");
      
    } catch (error) {
      console.log(error.response?.data);
    }
  };

    const getProfile = async () => {
        try {
            const response = await api.get("/auth/me/");
            console.log(response.data);
        } catch (error) {
            console.log(error.response?.data);
        }
    };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>

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

      <button type="submit">Login</button>

      <button type="button" onClick={getProfile}>
        Get Profile
        </button>
    </form>
  );
}

export default Login;