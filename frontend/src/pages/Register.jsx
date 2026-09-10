import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register/", form);

      navigate("/login");
    } catch (error) {
      setError(
        JSON.stringify(error.response?.data)
      );
    }
  };

  return (
    <div className="page" style={{ maxWidth: 420 }}>
      <form
        onSubmit={handleRegister}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <h1>Register</h1>

        <input
          name="first_name"
          placeholder="First Name"
          value={form.first_name}
          onChange={handleChange}
        />

        <input
          name="last_name"
          placeholder="Last Name"
          value={form.last_name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit">
          Register
        </button>

        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default Register;