import React, { useState } from "react";
import axios from "axios";
import { NotificationManager } from "react-notifications";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, password);
    if (username === "" || password === "") {
      setError("Please fill all fields");
      return;
    }
    // setError("");
    axios
      .post("http://localhost:8080/api/auth/admin-login", {
        username,
        password,
      })
      .then((res) => {
        NotificationManager.success(res.data.msg);
        localStorage.setItem("admin_token", res.data.token);
        localStorage.setItem("role", "admin");
        // setIsLoggedIn(true);
        navigate("/adminpanel");
      })
      .catch((err) => {
        console.log(err.response.data.msg);
        NotificationManager.error(err.response.data.msg);
        setError(err.response.data.msg);
      });
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-8 font-bold">Admin Login</h1>
      <form
        className="h-72 w-72 bg-gray-300 p-4 rounded-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <div className="flex flex-col">
          <label className="text-xs font-semibold mb-1">Username</label>
          <input
            type="text"
            className="p-1 rounded-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex flex-col mt-4">
          <label className="text-xs font-semibold mb-1">Password</label>
          <input
            type="password"
            className="p-1 rounded-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <span className="text-xs font-semibold text-red-500 mt-2">
              {error}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-xs font-semibold px-8 py-2 mt-4 text-gray-300"
        >
          LOGIN
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
