import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/AuthService";
import { useUser } from "../context/UserContext";

interface LoginFormProps {
  onClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser(); // Use setUser from UserContext

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login(formData); // Call login service and get user data
      console.log("response", response);
      // Set user data and token in context
      if (response.body.user) {
        setUser({
          name: response.body.user.name,
          email: response.body.user.email,
          profilePicUrl: response.body.user.photoUrl || "/default-profile.jpg", // Use a default if photoUrl is empty
          role: response.body.user.type,
          id: response.body.user._id,
          token: response.body.token,
        });
      } else {
        setUser({
          name: response.body.admin.name,
          email: response.body.admin.email,
          profilePicUrl:
            response?.body?.admin?.photoUrl || "/default-profile.jpg", // Use a default if photoUrl is empty
          role: "admin",
          id: response.body.admin._id,
          token: response.body.token,
        });
      }

      onClose(); // Close the login modal
      if (response?.body?.admin) {
        navigate("/admin"); // Redirect to the home page
      } else {
        navigate("/home"); // Redirect to the home page
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-center mb-4">Login</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
          placeholder="Enter your email"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
          placeholder="Enter your password"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      {error && <p className="text-red-500 text-center">{error}</p>}
    </form>
  );
};

export default LoginForm;
