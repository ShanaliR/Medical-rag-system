import React, { useState, useNa } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInUser } from "../services/chatService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // For displaying success/error messages
  const [loading, setLoading] = useState(false); // For showing loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
    setLoading(true); // Set loading state

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_MAIN_URL}/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );
      //double check
      // const user = await signInUser(email, password);
      const data = await response.json();

      if (response.ok) {
        // Assuming your backend sends a JWT token in the response data,
        // for example, as data.token or data.jwt
        const jwtToken = data.token || data.jwt; // Adjust 'token' or 'jwt' based on your backend's response structure

        if (jwtToken) {
          // In a real application, you would store this token securely
          // e.g., in localStorage, sessionStorage, or a more sophisticated state management
          localStorage.setItem("jwtToken", jwtToken);
          setMessage("Login successful! Token received.");
          console.log("JWT Token:", jwtToken); // For debugging purposes
          navigate("/");
        } else {
          setMessage("Login successful, but no token received from backend.");
          console.warn(
            "Login successful, but no JWT token found in response:",
            data
          );
        }

        // Clear form fields after successful login
        setEmail("");
        setPassword("");
        window.location.reload();
      } else {
        // Handle non-200 responses from your backend
        let errorMessage =
          data.message || "Login failed. Please check your credentials.";
        setMessage(errorMessage);
        console.error("Backend login error:", data);
      }
    } catch (error) {
      console.error("Network or API call error:", error);
      setMessage(
        `Network error: ${error.message}. Please ensure your backend server is running and accessible.`
      );
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="max-w-full max-h-full mx-auto flex flex-wrap h-screen overflow-hidden">
      <div class="w-full md:w-1/2 xl:w-2/3 hidden md:block relative">
        {/* hero image */}
        <img
          src={process.env.PUBLIC_URL + "/login.jpg"}
          className="w-full h-full object-cover"
          alt="Chat Logo"
        />
        {/* logo */}
        <img
          src={process.env.PUBLIC_URL + "/chatLogo.png"}
          alt="Logo"
          class="w-20 absolute top-4 left-4"
        />
      </div>

      <div className="w-full md:w-1/2 xl:w-1/3 flex flex-col justify-center px-12">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Login</h2>
          <svg
            className="w-8 h-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            ></path>
          </svg>
        </div>

        {/* Message display area */}
        {message && (
          <div
            className={`mb-4 p-3 rounded-md text-sm ${
              message.includes("successful")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out transform hover:scale-105"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Logging In..." : "Login"}
          </button>
          <div className="mt-4 text-sm text-center">
            <Link
              to="/change-password"
              className="text-blue-600 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
