import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminWorker from "./AdminWorker";

const AdminProtectWorker = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [workerName, setWorkerName] = useState("");

  // Persist login
  useEffect(() => {
    const storedName = localStorage.getItem("workerName");
    if (storedName) setIsAuthorized(true) && setWorkerName(storedName);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "/api/workeradmin/login",
        { email, password }
      );

      // Check if worker is blocked
      if (!data.worker || data.worker.isBlocked) {
        alert("Your account is blocked. Contact Admin.");
        return;
      }

      // Save login info
      localStorage.setItem("workerToken", data.token || "");
      localStorage.setItem("workerName", data.worker.name);
      localStorage.setItem("workerEmail", data.worker.email);
      setWorkerName(data.worker.name);
      setIsAuthorized(true);

      // Log worker action
      const logs = JSON.parse(localStorage.getItem("workerLogs")) || [];
      logs.push({
        worker: data.worker.name,
        action: "Logged In",
        time: new Date().toLocaleString(),
      });
      localStorage.setItem("workerLogs", JSON.stringify(logs));
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  if (isAuthorized) {
    return (
      <AdminWorker
        workerName={workerName}
        onLogout={() => {
          localStorage.removeItem("workerToken");
          localStorage.removeItem("workerName");
          localStorage.removeItem("workerEmail");
          setIsAuthorized(false);
        }}
      />
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-6 border rounded shadow-md bg-white"
      >
        <h2 className="text-xl font-bold text-center">Team Login</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="p-2 border rounded"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminProtectWorker;
