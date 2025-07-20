import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import { useAuth } from "../../App";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, password, confirmPassword, department } = formData;

    // Validate inputs
    if (!name || !email || !password || !confirmPassword || !department) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Remove confirmPassword before sending to API
      const userData = {
        name,
        email,
        password,
        department,
      };

      await signup(userData);
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add hover effect styles
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .input-hover:hover {
        border-color: #00aaff !important;
        transform: translateY(-2px);
      }
      .input-hover:focus {
        border-color: #00ccff !important;
        box-shadow: 0 0 0 2px rgba(0, 204, 255, 0.2);
      }
      .button-hover:hover {
        background-color: #0088cc !important;
        transform: translateY(-2px);
      }
      .button-hover:active {
        transform: translateY(0px);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  // Styles
  const headerBannerStyle = {
    backgroundColor: "#1e1e1e",
    padding: "18px",
    textAlign: "center",
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#00ccff",
    borderRadius: "8px",
    margin: "15px 0",
    boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
    letterSpacing: "1px",
  };

  const containerStyle = {
    backgroundColor: "#181818",
    border: "1px solid #2a2a2a",
    borderRadius: "12px",
    padding: "30px",
    width: "340px",
    margin: "30px auto",
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
  };

  const logoStyle = {
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    background: "linear-gradient(145deg, #121212, #2a2a2a)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto 30px",
    color: "#00ccff",
    fontWeight: "bold",
    fontSize: "20px",
    boxShadow:
      "0 6px 12px rgba(0,0,0,0.3), inset 0 2px 5px rgba(255,255,255,0.1)",
  };

  const inputStyle = {
    width: "100%",
    padding: "14px",
    margin: "12px 0",
    backgroundColor: "#202020",
    border: "1px solid #3a3a3a",
    color: "#e0e0e0",
    borderRadius: "8px",
    boxSizing: "border-box",
    transition: "border 0.3s ease, transform 0.2s ease",
    outline: "none",
  };

  const submitButtonStyle = {
    width: "100%",
    padding: "16px",
    backgroundColor: "#00aaff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: loading ? "default" : "pointer",
    fontWeight: "bold",
    opacity: loading ? 0.7 : 1,
    transition: "background-color 0.3s ease, transform 0.2s ease",
    boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
    marginTop: "15px",
    letterSpacing: "1px",
  };

  const errorStyle = {
    color: "#ff5252",
    fontSize: "14px",
    textAlign: "center",
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "rgba(255,0,0,0.05)",
    borderRadius: "6px",
    border: "1px solid rgba(255,0,0,0.1)",
  };

  const loginLinkStyle = {
    color: "#00aaff",
    textDecoration: "none",
    fontSize: "14px",
    display: "block",
    textAlign: "center",
    marginTop: "20px",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        backgroundColor: "#121212",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={headerBannerStyle}
      >
        VISUALROLL SIGNUP
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        style={containerStyle}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          style={logoStyle}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
        >
          <FaUserPlus size={40} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <input
            type="text"
            name="name"
            placeholder="FULL NAME"
            className="input-hover"
            style={inputStyle}
            value={formData.name}
            onChange={handleChange}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <input
            type="email"
            name="email"
            placeholder="EMAIL ADDRESS"
            className="input-hover"
            style={inputStyle}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <input
            type="password"
            name="password"
            placeholder="PASSWORD"
            className="input-hover"
            style={inputStyle}
            value={formData.password}
            onChange={handleChange}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <input
            type="password"
            name="confirmPassword"
            placeholder="CONFIRM PASSWORD"
            className="input-hover"
            style={inputStyle}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <input
            type="text"
            name="department"
            placeholder="DEPARTMENT"
            className="input-hover"
            style={inputStyle}
            value={formData.department}
            onChange={handleChange}
            required
          />
        </motion.div>

        {error && (
          <motion.div
            style={errorStyle}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          className={loading ? "pulse" : "button-hover"}
          style={submitButtonStyle}
          variants={itemVariants}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? "SIGNING UP..." : "REGISTER"}
        </motion.button>

        <motion.div variants={itemVariants}>
          <p style={loginLinkStyle} onClick={() => navigate("/login")}>
            Already have an account? Login
          </p>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default SignupForm;
