import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUserCheck,
  FaChalkboardTeacher,
  FaCamera,
  FaChartBar,
} from "react-icons/fa";

const HomePage = () => {
  const navigate = useNavigate();

  // Navigation handlers
  const handleLogin = () => navigate("/login");
  const handleSignup = () => navigate("/signup");

  // Animation variants for staggered children
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

  // Custom hover CSS
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .button-hover:hover {
        background-color: #0088cc !important;
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0,204,255,0.3) !important;
      }
      .button-hover:active {
        transform: translateY(0px);
      }
      .card-hover:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 24px rgba(0,0,0,0.4) !important;
      }
      .highlight {
        color: #00ccff;
        font-weight: 600;
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
        color: "#e0e0e0",
      }}
    >
      {/* Navigation Bar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          boxSizing: "border-box",
          position: "fixed",
          top: 0,
          backgroundColor: "rgba(18, 18, 18, 0.9)",
          backdropFilter: "blur(10px)",
          zIndex: 100,
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#00ccff",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <FaUserCheck /> VISUALROLL
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <motion.button
            className="button-hover"
            onClick={handleLogin}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "10px 20px",
              backgroundColor: "#1e1e1e",
              color: "#00ccff",
              border: "1px solid #00ccff",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.3s ease",
            }}
          >
            LOGIN
          </motion.button>
          <motion.button
            className="button-hover"
            onClick={handleSignup}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "10px 20px",
              backgroundColor: "#00aaff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 8px rgba(0,170,255,0.3)",
            }}
          >
            SIGN UP
          </motion.button>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          width: "100%",
          minHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "120px 20px 40px",
          background: "linear-gradient(135deg, #121212, #1a1a1a)",
        }}
      >
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          style={{
            fontSize: "3.5rem",
            marginBottom: "1rem",
            background: "linear-gradient(45deg, #00ccff, #0077b6)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 2px 10px rgba(0,204,255,0.3)",
          }}
        >
          Attendance Made Visual
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          style={{
            fontSize: "1.2rem",
            maxWidth: "700px",
            lineHeight: "1.6",
            color: "#b0b0b0",
            marginBottom: "2rem",
          }}
        >
          Simplify classroom attendance with our advanced facial recognition
          system. Save time, increase accuracy, and focus more on teaching.
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <motion.button
            className="button-hover"
            onClick={handleSignup}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "16px 32px",
              backgroundColor: "#00aaff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "600",
              letterSpacing: "1px",
              boxShadow: "0 4px 12px rgba(0,170,255,0.3)",
            }}
          >
            GET STARTED
          </motion.button>

          <motion.button
            className="button-hover"
            onClick={handleLogin}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "16px 32px",
              backgroundColor: "transparent",
              color: "#00ccff",
              border: "2px solid #00aaff",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "600",
              letterSpacing: "1px",
            }}
          >
            LEARN MORE
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          width: "100%",
          padding: "60px 20px",
          backgroundColor: "#181818",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <motion.h2
          variants={itemVariants}
          style={{
            fontSize: "2.2rem",
            marginBottom: "60px",
            color: "#ffffff",
            textAlign: "center",
          }}
        >
          Powerful <span className="highlight">Features</span>
        </motion.h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "30px",
            maxWidth: "1200px",
          }}
        >
          {[
            {
              icon: <FaCamera size={32} />,
              title: "Facial Recognition",
              description:
                "Take attendance automatically with advanced facial recognition technology.",
            },
            {
              icon: <FaChalkboardTeacher size={32} />,
              title: "Easy Management",
              description:
                "Manage students, classes, and attendance records effortlessly.",
            },
            {
              icon: <FaChartBar size={32} />,
              title: "Detailed Analytics",
              description:
                "Get insightful reports and analytics on attendance patterns.",
            },
            {
              icon: <FaUserCheck size={32} />,
              title: "Secure & Private",
              description:
                "Enterprise-level security ensures student data remains protected.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="card-hover"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              style={{
                backgroundColor: "#1e1e1e",
                borderRadius: "12px",
                padding: "30px",
                width: "260px",
                border: "1px solid #2a2a2a",
                boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  color: "#00aaff",
                  marginBottom: "20px",
                  background: "linear-gradient(145deg, #121212, #2a2a2a)",
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 6px 12px rgba(0,0,0,0.3)",
                }}
              >
                {feature.icon}
              </div>
              <h3
                style={{
                  fontSize: "1.3rem",
                  marginBottom: "15px",
                  color: "#ffffff",
                }}
              >
                {feature.title}
              </h3>
              <p style={{ color: "#b0b0b0", lineHeight: "1.6" }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Call to Action Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          width: "100%",
          padding: "80px 20px",
          backgroundColor: "#121212",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            fontSize: "2.2rem",
            marginBottom: "1.5rem",
            color: "#ffffff",
          }}
        >
          Ready to Transform Your Attendance System?
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            fontSize: "1.1rem",
            maxWidth: "700px",
            lineHeight: "1.6",
            color: "#b0b0b0",
            marginBottom: "2rem",
          }}
        >
          Join thousands of educators who have modernized their attendance
          process with VisualRoll.
        </motion.p>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="button-hover"
          onClick={handleSignup}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: "18px 36px",
            backgroundColor: "#00aaff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "600",
            letterSpacing: "1px",
            boxShadow: "0 4px 12px rgba(0,170,255,0.3)",
          }}
        >
          CREATE FREE ACCOUNT
        </motion.button>
      </motion.div>

      {/* Footer */}
      <div
        style={{
          padding: "30px 20px",
          backgroundColor: "#0a0a0a",
          width: "100%",
          textAlign: "center",
          color: "#707070",
          fontSize: "14px",
        }}
      >
        <p>© 2025 VisualRoll. All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default HomePage;
