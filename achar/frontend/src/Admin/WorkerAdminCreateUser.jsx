import React, { useState } from "react";
import axios from "axios";

const WorkerAdminCreateUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [workers, setWorkers] = useState([]);
  const [message, setMessage] = useState("");

  const handleCreateWorker = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data } = await axios.post("/api/workeradmin/create", {
        name,
        email,
        password,
      });

      setMessage("✅ Worker created successfully!");
      setWorkers((prev) => [...prev, data.newWorker]);
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Something went wrong while creating worker"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Create Worker Admin</h2>

      <form
        onSubmit={handleCreateWorker}
        className="bg-white p-6 rounded shadow-md w-full max-w-md mb-8"
      >
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter worker name"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter worker email"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-semibold">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 text-white rounded ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Creating..." : "Create Worker"}
        </button>
      </form>

      {message && (
        <p
          className={`mb-6 text-center font-semibold ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      {/* Worker List Section */}
      <div className="bg-white p-6 rounded shadow-md">
        <h3 className="text-xl font-semibold mb-4">Created Workers</h3>

        {workers.length === 0 ? (
          <p>No workers created yet.</p>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w) => (
                <tr key={w._id} className="text-center">
                  <td className="p-2 border">{w.name}</td>
                  <td className="p-2 border">{w.email}</td>
                  <td className="p-2 border">
                    {w.isBlocked ? "Blocked" : "Active"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default WorkerAdminCreateUser;
