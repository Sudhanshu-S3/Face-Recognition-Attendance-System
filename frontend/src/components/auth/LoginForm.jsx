import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../App";
import { motion } from "framer-motion";
import { FaUserLock, FaArrowLeft } from "react-icons/fa";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Login failed. Please try again.");
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
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 0.9; }
            100% { opacity: 0.6; }
          }
          .pulse {
            animation: pulse 1.5s infinite ease-in-out;
          }
        `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#121212",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transition: "background-color 0.5s ease",
      }}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
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
          width: "340px",
        }}
      >
        VISUALROLL LOGIN
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#181818",
          border: "1px solid #2a2a2a",
          borderRadius: "12px",
          padding: "30px",
          width: "340px",
          margin: "30px auto",
          boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          style={{
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
          }}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
        >
          <FaUserLock size={40} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-hover"
            style={{
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
            }}
            placeholder="EMAIL ADDRESS"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-hover"
            style={{
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
            }}
            placeholder="PASSWORD"
          />
        </motion.div>

        {error && (
          <motion.div
            style={{
              color: "#ff5252",
              fontSize: "14px",
              textAlign: "center",
              marginTop: "15px",
              padding: "10px",
              backgroundColor: "rgba(255,0,0,0.05)",
              borderRadius: "6px",
              border: "1px solid rgba(255,0,0,0.1)",
            }}
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
          style={{
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
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            marginTop: "15px",
            letterSpacing: "1px",
          }}
          variants={itemVariants}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? "LOGGING IN..." : "SIGN IN"}
        </motion.button>

        <motion.div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
          }}
          variants={itemVariants}
        >
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              color: "#00ccff",
              gap: "8px",
              textDecoration: "none",
            }}
          >
            <FaArrowLeft /> Back to Home
          </Link>
        </motion.div>
        <motion.div variants={itemVariants}>
          <p
            style={{
              color: "#00aaff",
              textDecoration: "none",
              fontSize: "14px",
              display: "block",
              textAlign: "center",
              marginTop: "20px",
              cursor: "pointer",
            }}
            onClick={() => navigate("/signup")}
          >
            Don't have an account? Sign up
          </p>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default LoginForm;
