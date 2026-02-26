import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    doctorId: "",
    fullName: "",
    email: "",
    password: "",
    specialization: "",
    hospital: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(form);
      alert("Signup successful. Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Doctor Signup</h2>

        <input
          name="doctorId"
          placeholder="Doctor ID"
          required
          className="w-full mb-4 px-4 py-2 border rounded"
          onChange={handleChange}
        />
        <input
          name="fullName"
          placeholder="Full Name"
          required
          className="w-full mb-4 px-4 py-2 border rounded"
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          required
          className="w-full mb-4 px-4 py-2 border rounded"
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="w-full mb-4 px-4 py-2 border rounded"
          onChange={handleChange}
        />
        <input
          name="specialization"
          placeholder="Specialization"
          className="w-full mb-4 px-4 py-2 border rounded"
          onChange={handleChange}
        />
        <input
          name="hospital"
          placeholder="Hospital"
          className="w-full mb-4 px-4 py-2 border rounded"
          onChange={handleChange}
        />

        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Sign Up
        </button>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default Signup;