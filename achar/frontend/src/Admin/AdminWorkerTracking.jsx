import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminWorkerTracking = () => {
  const [workerLogs, setWorkerLogs] = useState([]);
  const [visibleLogs, setVisibleLogs] = useState(6); // Initially show 6 logs
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "/api/workeradmin";

  const fetchWorkers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching workers:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
    const logs = JSON.parse(localStorage.getItem("workerLogs")) || [];
    setWorkerLogs(logs.reverse()); // Latest logs first
  }, []);

  const toggleBlockUser = async (id) => {
    try {
      const response = await axios.patch(`${API_URL}/block/${id}`);
      alert(response.data.message);
      fetchWorkers();

      const blockedWorkers = response.data.worker.isBlocked
        ? [response.data.worker.email, ...JSON.parse(localStorage.getItem("blockedWorkers") || "[]")]
        : JSON.parse(localStorage.getItem("blockedWorkers") || "[]").filter(email => email !== response.data.worker.email);

      localStorage.setItem("blockedWorkers", JSON.stringify(blockedWorkers));
    } catch (error) {
      console.error("Error blocking/unblocking worker:", error);
    }
  };

  const loadMoreLogs = () => {
    setVisibleLogs((prev) => prev + 6);
  };

  if (loading) return <p className="p-6 text-gray-600">Loading workers...</p>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen space-y-8">
      {/* Worker Logs Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Worker Activity Logs</h2>
        {workerLogs.length === 0 ? (
          <p className="text-gray-500">No actions yet.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 border-b text-left text-gray-700 font-semibold">Worker</th>
                    <th className="p-3 border-b text-left text-gray-700 font-semibold">Action</th>
                    <th className="p-3 border-b text-left text-gray-700 font-semibold">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {workerLogs.slice(0, visibleLogs).map((log, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition">
                      <td className="p-3 border-b text-gray-600">{log.worker}</td>
                      <td className="p-3 border-b text-gray-600">{log.action}</td>
                      <td className="p-3 border-b text-gray-600">{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {visibleLogs < workerLogs.length && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={loadMoreLogs}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md shadow-md transition"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Manage Workers Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Manage Workers</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 border-b text-left text-gray-700 font-semibold">Name</th>
                <th className="p-3 border-b text-left text-gray-700 font-semibold">Email</th>
                <th className="p-3 border-b text-left text-gray-700 font-semibold">Status</th>
                <th className="p-3 border-b text-left text-gray-700 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                  <td className="p-3 border-b text-gray-600">{user.name}</td>
                  <td className="p-3 border-b text-gray-600">{user.email}</td>
                  <td className={`p-3 border-b font-semibold ${user.isBlocked ? "text-red-600" : "text-green-600"}`}>
                    {user.isBlocked ? "Blocked" : "Active"}
                  </td>
                  <td className="p-3 border-b">
                    <button
                      onClick={() => toggleBlockUser(user._id)}
                      className={`px-4 py-2 rounded-md font-semibold text-white shadow-md transition ${
                        user.isBlocked ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminWorkerTracking;
