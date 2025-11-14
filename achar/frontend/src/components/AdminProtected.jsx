import React, { useState } from "react";
import Admin from "../Admin/Admin";

const AdminProtected = () => {
  const [enteredPassword, setEnteredPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const correctPassword = "12345"; // Change this to your desired password

  const handleSubmit = (e) => {
    e.preventDefault();
    if (enteredPassword === correctPassword) {
      setIsAuthorized(true);
    } else {
      alert("Incorrect password!");
      setEnteredPassword("");
    }
  };

  if (isAuthorized) {
    return <Admin />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-6 border rounded shadow-md bg-white"
      >
        <h2 className="text-xl font-bold text-center">Enter Admin Password</h2>
        <input
          type="password"
          value={enteredPassword}
          onChange={(e) => setEnteredPassword(e.target.value)}
          placeholder="Password"
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AdminProtected;
