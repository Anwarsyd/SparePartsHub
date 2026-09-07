import { useState } from "react";
import api from "./api/axios";

function App() {
  const [message, setMessage] = useState("");

  const testAPI = async () => {
    try {
      const response = await api.post("/auth/register/", {
        email: "test@example.com",
        password: "TestPassword123",
        first_name: "Test",
        last_name: "User",
      });

      setMessage(response.data.message);
    } catch (error) {
      console.log(error.response?.data);
      setMessage(JSON.stringify(error.response?.data));
    }
};

  return (
    <div>
      <h1>SparePartsHub</h1>

      <button onClick={testAPI}>
        Test API
      </button>

      <p>{message}</p>
    </div>
  );
}

export default App;