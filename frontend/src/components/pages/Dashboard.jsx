import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaCamera, FaUserCheck, FaUserPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { attendanceService } from "../../services/attendance.service";
import { studentService } from "../../services/student.service";
import { useAuth } from "../../App";

const AttendancePage = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("ready"); // ready, processing, completed
  const [attendanceResults, setAttendanceResults] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState({
    total: 0,
    present: 0,
    absent: 0,
    rate: 0,
  });
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Fetch students on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await studentService.getAll();
        setStudents(response.students || []);
        setAttendanceSummary((prev) => ({
          ...prev,
          total: response.students?.length || 0,
          absent: response.students?.length || 0,
        }));
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();

    // Cleanup camera on unmount
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg");
  };

  const handleTakeAttendance = async () => {
    if (!cameraActive) {
      alert("Please start the camera first");
      return;
    }

    setProcessingStatus("processing");
    try {
      // Capture image from camera
      const imageData = captureImage();
      if (!imageData) throw new Error("Failed to capture image");

      // Convert base64 to blob
      const base64Response = await fetch(imageData);
      const blob = await base64Response.blob();

      // Create FormData object
      const formData = new FormData();
      formData.append("image", blob, "capture.jpg");

      // Send to server for attendance processing
      const response = await attendanceService.takeCameraAttendance(formData);
      setAttendanceResults(response);

      if (response.success && response.details) {
        // Update attendance summary
        setAttendanceSummary((prev) => {
          const newPresent = prev.present + 1;
          const newAbsent = prev.total - newPresent;
          const newRate = Math.round((newPresent / prev.total) * 100) || 0;

          return {
            ...prev,
            present: newPresent,
            absent: newAbsent,
            rate: newRate,
          };
        });
      }

      setProcessingStatus("completed");
    } catch (error) {
      console.error("Error taking attendance:", error);
      setProcessingStatus("ready");
      alert("Error taking attendance: " + (error.message || "Unknown error"));
    }
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.div
      style={{
        backgroundColor: "#121212",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <motion.div style={headerStyle} variants={itemVariants}>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/students")}
        >
          <FaUserPlus color="#00ccff" size={24} />
        </motion.div>
        <motion.span
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: "20px",
            letterSpacing: "1px",
          }}
        >
          VISUAL<span style={{ color: "#00ccff" }}>ROLL</span>
        </motion.span>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{ cursor: "pointer" }}
          onClick={logout}
        >
          <FaUserCheck color="#00ccff" size={24} />
        </motion.div>
      </motion.div>

      <motion.div style={mainContentStyle} variants={itemVariants}>
        <motion.div
          style={sectionStyle}
          whileHover={{ boxShadow: "0 12px 20px rgba(0,0,0,0.6)" }}
        >
          <div style={cameraTextStyle}>
            <FaCamera /> CAMERA FEED
          </div>
          {cameraActive ? (
            <div
              className="camera-active"
              style={{ width: "100%", height: "100%", position: "relative" }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              ></video>
              <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
              <button
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "10px",
                  backgroundColor: "#ff3b30",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 12px",
                  cursor: "pointer",
                }}
                onClick={stopCamera}
              >
                Stop Camera
              </button>
            </div>
          ) : (
            <div style={cameraPlaceholderStyle}>
              <FaCamera style={cameraIconStyle} />
              <motion.button
                style={{
                  backgroundColor: "#00aaff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 12px",
                  cursor: "pointer",
                }}
                whileHover={{ scale: 1.05, backgroundColor: "#0088cc" }}
                whileTap={{ scale: 0.95 }}
                onClick={startCamera}
              >
                Start Camera
              </motion.button>
            </div>
          )}
        </motion.div>

        <motion.div
          style={sectionStyle}
          whileHover={{ boxShadow: "0 12px 20px rgba(0,0,0,0.6)" }}
        >
          <div style={cameraTextStyle}>
            <FaUserCheck /> RECOGNITION RESULTS
          </div>
          <div style={resultSectionStyle}>
            <div style={resultHeaderStyle}>Class Attendance</div>
            <div style={resultItemStyle}>
              <span>Total Students</span>
              <span>{attendanceSummary.total}</span>
            </div>
            <div style={resultItemStyle}>
              <span>Present</span>
              <span>{attendanceSummary.present}</span>
            </div>
            <div style={resultItemStyle}>
              <span>Absent</span>
              <span>{attendanceSummary.absent}</span>
            </div>
            <div style={resultItemStyle}>
              <span>Attendance Rate</span>
              <span>{attendanceSummary.rate}%</span>
            </div>

            {attendanceResults && attendanceResults.success && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "10px",
                  backgroundColor: "#192234",
                  borderRadius: "8px",
                }}
              >
                <h3 style={{ color: "#00ccff", marginBottom: "8px" }}>
                  Last Recognition:
                </h3>
                <p style={{ color: "#e0e0e0", margin: "4px 0" }}>
                  Name: {attendanceResults.details.name}
                </p>
                <p style={{ color: "#e0e0e0", margin: "4px 0" }}>
                  Roll No: {attendanceResults.details.enrollmentNo}
                </p>
                <p style={{ color: "#e0e0e0", margin: "4px 0" }}>
                  Time: {new Date().toLocaleTimeString()}
                </p>
              </div>
            )}

            <div style={{ marginTop: "20px", fontSize: "14px", opacity: 0.8 }}>
              Last updated:{" "}
              {attendanceResults ? new Date().toLocaleTimeString() : "Never"}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div style={footerStyle} variants={itemVariants}>
        <div style={statusContainerStyle}>
          <div
            style={{
              ...statusIndicatorStyle,
              backgroundColor:
                processingStatus === "ready"
                  ? "#27ae60"
                  : processingStatus === "processing"
                  ? "#f39c12"
                  : "#3498db",
            }}
          ></div>
          <span>
            {processingStatus === "ready"
              ? "Ready"
              : processingStatus === "processing"
              ? "Processing..."
              : "Completed"}
          </span>
        </div>
        <motion.button
          style={submitButtonStyle}
          whileHover={{
            scale: 1.05,
            backgroundColor: "#0088cc",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={handleTakeAttendance}
          disabled={processingStatus === "processing" || !cameraActive}
        >
          {processingStatus === "processing"
            ? "PROCESSING..."
            : "TAKE ATTENDANCE"}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

// Keeping the existing style objects
const headerStyle = {
  backgroundColor: "#1e1e1e",
  padding: "18px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
};

const mainContentStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "row",
  padding: "20px",
  gap: "20px",
};

const sectionStyle = {
  flex: 1,
  backgroundColor: "#181818",
  position: "relative",
  boxShadow: "0 8px 16px rgba(0,0,0,0.4)",
  borderRadius: "12px",
  border: "1px solid #2a2a2a",
  overflow: "hidden",
  minHeight: "300px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const cameraTextStyle = {
  position: "absolute",
  top: "15px",
  left: "15px",
  color: "#00ccff",
  fontWeight: "bold",
  fontSize: "14px",
  backgroundColor: "rgba(0,0,0,0.5)",
  padding: "6px 10px",
  borderRadius: "4px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const footerStyle = {
  backgroundColor: "#1e1e1e",
  padding: "18px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 -4px 6px rgba(0,0,0,0.1)",
};

const statusIndicatorStyle = {
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  backgroundColor: "#27ae60",
  boxShadow: "0 0 8px rgba(0,0,0,0.3)",
  marginRight: "8px",
};

const statusContainerStyle = {
  display: "flex",
  alignItems: "center",
  color: "#e0e0e0",
  fontWeight: "500",
  fontSize: "14px",
  backgroundColor: "#202020",
  padding: "8px 12px",
  borderRadius: "20px",
  border: "1px solid #2a2a2a",
};

const submitButtonStyle = {
  backgroundColor: "#00aaff",
  color: "white",
  padding: "12px 24px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
  transition: "all 0.2s ease",
  letterSpacing: "1px",
};

const cameraIconStyle = {
  fontSize: "64px",
  color: "#333",
  opacity: 0.3,
};

const cameraPlaceholderStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  color: "#666",
  fontSize: "14px",
};

const resultSectionStyle = {
  padding: "15px",
  color: "#e0e0e0",
  width: "100%",
};

const resultHeaderStyle = {
  borderBottom: "1px solid #2a2a2a",
  paddingBottom: "10px",
  marginBottom: "15px",
  fontSize: "16px",
  fontWeight: "bold",
  color: "#00ccff",
};

const resultItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 0",
  borderBottom: "1px solid #222",
};

export default AttendancePage;
