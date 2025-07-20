import React from "react";
import { motion } from "framer-motion";
import { FaChartBar, FaFileExport, FaFileUpload, FaCog } from "react-icons/fa";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, when: "beforeChildren", staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

const AdminPanel = () => {
  // Updated colors to match dark theme
  const colors = {
    bgPrimary: "#121212",
    bgSecondary: "#181818",
    bgTertiary: "#1e1e1e",
    accent: "#00aaff",
    accentHover: "#0088cc",
    border: "#2a2a2a",
    text: "#e0e0e0",
    textSecondary: "#b3b3b3",
  };

  // Updated styles with dark theme
  const styles = {
    mainContainer: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      minHeight: "100vh",
      backgroundColor: colors.bgPrimary,
      padding: "20px",
      gap: "20px",
    },
    header: {
      backgroundColor: colors.bgTertiary,
      padding: "18px",
      color: "white",
      fontWeight: "bold",
      fontSize: "20px",
      letterSpacing: "1px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
    },
    topPart: {
      display: "flex",
      gap: "20px",
      height: "auto",
      flexDirection: "row",
      flexWrap: "wrap",
    },
    leftPanel: {
      flex: "1 1 300px",
      backgroundColor: colors.bgSecondary,
      borderRadius: "12px",
      padding: "20px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      boxShadow: "0 8px 16px rgba(0,0,0,0.4)",
      border: `1px solid ${colors.border}`,
      minWidth: "300px",
    },
    rightPanel: {
      flex: "2 1 600px",
      backgroundColor: colors.bgSecondary,
      borderRadius: "12px",
      padding: "20px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      boxShadow: "0 8px 16px rgba(0,0,0,0.4)",
      border: `1px solid ${colors.border}`,
      minWidth: "300px",
    },
    bottomSection: {
      backgroundColor: colors.bgSecondary,
      padding: "20px",
      boxSizing: "border-box",
      borderRadius: "12px",
      boxShadow: "0 8px 16px rgba(0,0,0,0.4)",
      border: `1px solid ${colors.border}`,
    },
    controlsButton: {
      backgroundColor: colors.bgTertiary,
      color: colors.text,
      padding: "12px 15px",
      textAlign: "center",
      borderRadius: "8px",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    takeAttendanceHeader: {
      backgroundColor: colors.bgTertiary,
      color: colors.accent,
      padding: "15px",
      textAlign: "center",
      fontWeight: "bold",
      textTransform: "uppercase",
      borderRadius: "8px",
      letterSpacing: "1px",
    },
    attendanceItem: {
      backgroundColor: colors.bgTertiary,
      padding: "15px",
      borderRadius: "8px",
      color: colors.text,
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      cursor: "pointer",
      transition: "transform 0.2s ease, background-color 0.2s ease",
    },
    graphButton: {
      backgroundColor: colors.bgTertiary,
      color: colors.text,
      padding: "12px 15px",
      textAlign: "center",
      borderRadius: "8px",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      cursor: "pointer",
    },
    graphPlaceholder: {
      backgroundColor: colors.bgTertiary,
      borderRadius: "8px",
      height: "350px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: colors.textSecondary,
      border: `1px dashed ${colors.border}`,
    },
    buttonsContainer: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "20px",
      gap: "15px",
      flexWrap: "wrap",
    },
    actionButton: {
      backgroundColor: colors.bgTertiary,
      color: colors.text,
      padding: "12px 15px",
      textAlign: "center",
      borderRadius: "8px",
      flex: "1 1 150px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontWeight: "500",
      minWidth: "120px",
    },
    rectanglesContainer: {
      display: "flex",
      justifyContent: "space-between",
      gap: "15px",
      flexWrap: "wrap",
    },
    bottomRectangle: {
      backgroundColor: colors.bgTertiary,
      flex: "1 1 45%",
      minHeight: "120px",
      borderRadius: "8px",
      minWidth: "250px",
      padding: "15px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    cardTitle: {
      color: colors.accent,
      fontSize: "14px",
      fontWeight: "bold",
      marginBottom: "10px",
      borderBottom: `1px solid ${colors.border}`,
      paddingBottom: "5px",
    },
    statItem: {
      display: "flex",
      justifyContent: "space-between",
      padding: "8px 0",
      borderBottom: `1px solid ${colors.border}`,
      color: colors.text,
    },
    iconWrapper: {
      color: colors.accent,
      fontSize: "18px",
      marginRight: "5px",
      display: "inline-flex",
      alignItems: "center",
    },
  };

  // Components with animations
  const ControlsButton = () => (
    <motion.div
      style={styles.controlsButton}
      whileHover={{ scale: 1.03, backgroundColor: "#2a2a2a" }}
      whileTap={{ scale: 0.98 }}
    >
      <FaCog /> Controls
    </motion.div>
  );

  const TakeAttendanceHeader = () => (
    <motion.div
      style={styles.takeAttendanceHeader}
      whileHover={{ boxShadow: "0 6px 12px rgba(0,0,0,0.3)" }}
    >
      TAKE ATTENDANCE
    </motion.div>
  );

  const AttendanceItem = ({ name, date }) => (
    <motion.div
      style={styles.attendanceItem}
      whileHover={{ transform: "translateY(-3px)", backgroundColor: "#252525" }}
      whileTap={{ scale: 0.98 }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>{name || "Class Session"}</span>
        <span style={{ color: colors.textSecondary, fontSize: "12px" }}>
          {date || "Today"}
        </span>
      </div>
    </motion.div>
  );

  const GraphButton = () => (
    <motion.div
      style={styles.graphButton}
      whileHover={{ scale: 1.03, backgroundColor: "#2a2a2a" }}
      whileTap={{ scale: 0.98 }}
    >
      <FaChartBar /> ATTENDANCE ANALYTICS
    </motion.div>
  );

  const GraphPlaceholder = () => (
    <motion.div
      style={styles.graphPlaceholder}
      whileHover={{ boxShadow: "0 6px 12px rgba(0,0,0,0.3)" }}
    >
      <span>Graph Visualization Will Appear Here</span>
    </motion.div>
  );

  const FileConverterButton = () => (
    <motion.div
      style={styles.actionButton}
      whileHover={{
        scale: 1.05,
        backgroundColor: colors.accent,
        color: "white",
      }}
      whileTap={{ scale: 0.98 }}
    >
      <FaFileUpload /> IMPORT DATA
    </motion.div>
  );

  const ExportButton = () => (
    <motion.div
      style={styles.actionButton}
      whileHover={{
        scale: 1.05,
        backgroundColor: colors.accent,
        color: "white",
      }}
      whileTap={{ scale: 0.98 }}
    >
      <FaFileExport /> EXPORT DATA
    </motion.div>
  );

  const BottomRectangle = ({ title, data }) => (
    <motion.div
      style={styles.bottomRectangle}
      whileHover={{ boxShadow: "0 6px 12px rgba(0,0,0,0.3)" }}
    >
      <div style={styles.cardTitle}>{title}</div>
      {data.map((item, index) => (
        <div key={index} style={styles.statItem}>
          <span>{item.label}</span>
          <span>{item.value}</span>
        </div>
      ))}
    </motion.div>
  );

  const LeftPanel = () => (
    <motion.div style={styles.leftPanel} variants={itemVariants}>
      <ControlsButton />
      <TakeAttendanceHeader />
      <AttendanceItem name="Morning Class" date="Today, 9:00 AM" />
      <AttendanceItem name="Afternoon Session" date="Today, 1:30 PM" />
      <AttendanceItem name="Evening Class" date="Today, 5:00 PM" />
      <AttendanceItem name="Special Session" date="Tomorrow" />
    </motion.div>
  );

  const RightPanel = () => (
    <motion.div style={styles.rightPanel} variants={itemVariants}>
      <GraphButton />
      <GraphPlaceholder />
    </motion.div>
  );

  const BottomSection = () => (
    <motion.div style={styles.bottomSection} variants={itemVariants}>
      <div style={styles.buttonsContainer}>
        <FileConverterButton />
        <ExportButton />
      </div>
      <div style={styles.rectanglesContainer}>
        <BottomRectangle
          title="WEEKLY SUMMARY"
          data={[
            { label: "Total Classes", value: "15" },
            { label: "Average Attendance", value: "89%" },
            { label: "Absences", value: "23" },
          ]}
        />
        <BottomRectangle
          title="SYSTEM STATUS"
          data={[
            { label: "Database", value: "Connected" },
            { label: "Camera", value: "Ready" },
            { label: "Last Sync", value: "10 min ago" },
          ]}
        />
      </div>
    </motion.div>
  );

  return (
    <motion.div
      style={styles.mainContainer}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div style={styles.header} variants={itemVariants}>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{ cursor: "pointer" }}
        >
          <FaCog color="#00ccff" size={24} />
        </motion.div>
        <motion.span>
          VISUAL<span style={{ color: "#00ccff" }}>ROLL</span> ADMIN
        </motion.span>
        <div></div>
      </motion.div>

      <motion.div style={styles.topPart}>
        <LeftPanel />
        <RightPanel />
      </motion.div>
      <BottomSection />
    </motion.div>
  );
};

export default AdminPanel;
