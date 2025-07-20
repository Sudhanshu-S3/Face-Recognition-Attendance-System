import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaUserPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaCamera,
  FaUserCheck,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { studentService } from "../../services/student.service";
import { useAuth } from "../../App";
import { toast } from "react-toastify";

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [isEditingStudent, setIsEditingStudent] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    enrollmentNo: "",
    email: "",
    course: "",
    year: "",
    semester: "",
    section: "",
  });

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
    exit: { opacity: 0 },
  };

  const itemVariants = {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await studentService.getAll();
      setStudents(response.students || []);
      setFilteredStudents(response.students || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to fetch students");
      setIsLoading(false);
    }
  };

  // Handle search
  useEffect(() => {
    if (searchTerm) {
      const filtered = students.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.enrollmentNo
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchTerm, students]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Form handling
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditingStudent) {
        await studentService.updateStudent(currentStudent._id, formData);
        toast.success("Student updated successfully!");
      } else {
        await studentService.createStudent(formData);
        toast.success("Student added successfully!");
      }

      resetForm();
      fetchStudents();
    } catch (error) {
      console.error("Error saving student:", error);
      toast.error(error.message || "Failed to save student");
    }
  };

  const startEditing = (student) => {
    setCurrentStudent(student);
    setFormData({
      name: student.name,
      enrollmentNo: student.enrollmentNo,
      email: student.email || "",
      course: student.course || "",
      year: student.year || "",
      semester: student.semester || "",
      section: student.section || "",
    });
    setIsEditingStudent(true);
    setIsAddingStudent(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await studentService.deleteStudent(id);
        toast.success("Student deleted successfully");
        fetchStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
        toast.error("Failed to delete student");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      enrollmentNo: "",
      email: "",
      course: "",
      year: "",
      semester: "",
      section: "",
    });
    setIsAddingStudent(false);
    setIsEditingStudent(false);
    setCurrentStudent(null);
    stopCamera();
  };

  // Camera functionality for student photos
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Could not access camera");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
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

  const handleCapture = async () => {
    if (!isCameraActive) {
      toast.warning("Please start the camera first");
      return;
    }

    const imageData = captureImage();
    if (!imageData) {
      toast.error("Failed to capture image");
      return;
    }

    setIsUploading(true);

    try {
      // Convert base64 to blob
      const base64Response = await fetch(imageData);
      const blob = await base64Response.blob();

      // Create FormData object
      const formData = new FormData();
      formData.append("image", blob, "student-photo.jpg");
      formData.append("studentId", currentStudent?._id || "new");

      if (currentStudent) {
        // Upload image for existing student
        await studentService.uploadStudentImage(currentStudent._id, formData);
        toast.success("Photo updated successfully");
      } else {
        // Store temporarily and attach to form data for new student
        toast.info("Photo will be saved with student details");
        // You would need to implement a way to hold this image until the student form is submitted
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload photo");
    } finally {
      setIsUploading(false);
      stopCamera();
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      toast.error("Please select an image file");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("studentId", currentStudent?._id || "new");

      if (currentStudent) {
        await studentService.uploadStudentImage(currentStudent._id, formData);
        toast.success("Photo uploaded successfully");
      } else {
        toast.info("Photo will be saved with student details");
        // Handle temporary storage of the image
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
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
      exit="exit"
      variants={pageVariants}
    >
      {/* Header */}
      <motion.div style={headerStyle} variants={itemVariants}>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          <FaArrowLeft color="#00ccff" size={24} />
        </motion.div>
        <motion.span
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: "20px",
            letterSpacing: "1px",
          }}
        >
          VISUAL<span style={{ color: "#00ccff" }}>ROLL</span> STUDENTS
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

      {/* Main Content */}
      <motion.div
        style={{
          flex: 1,
          padding: "20px",
          display: "flex",
          flexDirection: isAddingStudent ? "column" : "column",
          gap: "20px",
        }}
        variants={itemVariants}
      >
        {/* Student Form (Add/Edit) */}
        {isAddingStudent && (
          <motion.div
            style={sectionStyle}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div style={sectionHeaderStyle}>
              {isEditingStudent ? "EDIT STUDENT" : "ADD NEW STUDENT"}
            </div>

            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                <div style={{ flex: "1 1 300px" }}>
                  <div style={formGroupStyle}>
                    <label htmlFor="name" style={labelStyle}>
                      Full Name*
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      style={inputStyle}
                      required
                      placeholder="Enter student's full name"
                    />
                  </div>

                  <div style={formGroupStyle}>
                    <label htmlFor="enrollmentNo" style={labelStyle}>
                      Roll/Enrollment Number*
                    </label>
                    <input
                      type="text"
                      id="enrollmentNo"
                      name="enrollmentNo"
                      value={formData.enrollmentNo}
                      onChange={handleChange}
                      style={inputStyle}
                      required
                      placeholder="Enter student's roll number"
                    />
                  </div>

                  <div style={formGroupStyle}>
                    <label htmlFor="email" style={labelStyle}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      style={inputStyle}
                      placeholder="Enter student's email"
                    />
                  </div>
                </div>

                <div style={{ flex: "1 1 300px" }}>
                  <div style={formGroupStyle}>
                    <label htmlFor="course" style={labelStyle}>
                      Course/Program
                    </label>
                    <input
                      type="text"
                      id="course"
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      style={inputStyle}
                      placeholder="Enter student's course"
                    />
                  </div>

                  <div style={{ display: "flex", gap: "15px" }}>
                    <div style={{ ...formGroupStyle, flex: 1 }}>
                      <label htmlFor="year" style={labelStyle}>
                        Year
                      </label>
                      <select
                        id="year"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        style={inputStyle}
                      >
                        <option value="">Select</option>
                        <option value="1">First</option>
                        <option value="2">Second</option>
                        <option value="3">Third</option>
                        <option value="4">Fourth</option>
                      </select>
                    </div>

                    <div style={{ ...formGroupStyle, flex: 1 }}>
                      <label htmlFor="semester" style={labelStyle}>
                        Semester
                      </label>
                      <select
                        id="semester"
                        name="semester"
                        value={formData.semester}
                        onChange={handleChange}
                        style={inputStyle}
                      >
                        <option value="">Select</option>
                        <option value="1">First</option>
                        <option value="2">Second</option>
                        <option value="3">Third</option>
                        <option value="4">Fourth</option>
                        <option value="5">Fifth</option>
                        <option value="6">Sixth</option>
                        <option value="7">Seventh</option>
                        <option value="8">Eighth</option>
                      </select>
                    </div>
                  </div>

                  <div style={formGroupStyle}>
                    <label htmlFor="section" style={labelStyle}>
                      Section
                    </label>
                    <input
                      type="text"
                      id="section"
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      style={inputStyle}
                      placeholder="Enter section (e.g. A, B, C)"
                    />
                  </div>
                </div>

                <div
                  style={{
                    flex: "1 1 300px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={photoContainerStyle}>
                    {isCameraActive ? (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "relative",
                        }}
                      >
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        ></video>
                        <canvas
                          ref={canvasRef}
                          style={{ display: "none" }}
                        ></canvas>
                      </div>
                    ) : (
                      <div style={photoPlaceholderStyle}>
                        <FaCamera style={{ fontSize: "40px", opacity: 0.5 }} />
                        <span>Student Photo</span>
                      </div>
                    )}
                  </div>

                  <div
                    style={{ display: "flex", gap: "10px", marginTop: "10px" }}
                  >
                    {isCameraActive ? (
                      <>
                        <motion.button
                          type="button"
                          style={actionButtonStyle}
                          whileHover={{ backgroundColor: "#0088cc" }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCapture}
                          disabled={isUploading}
                        >
                          {isUploading ? "Saving..." : "Capture"}
                        </motion.button>

                        <motion.button
                          type="button"
                          style={{
                            ...actionButtonStyle,
                            backgroundColor: "#555",
                          }}
                          whileHover={{ backgroundColor: "#444" }}
                          whileTap={{ scale: 0.95 }}
                          onClick={stopCamera}
                        >
                          Cancel
                        </motion.button>
                      </>
                    ) : (
                      <>
                        <motion.button
                          type="button"
                          style={actionButtonStyle}
                          whileHover={{ backgroundColor: "#0088cc" }}
                          whileTap={{ scale: 0.95 }}
                          onClick={startCamera}
                        >
                          Camera
                        </motion.button>

                        <motion.button
                          type="button"
                          style={{
                            ...actionButtonStyle,
                            backgroundColor: "#555",
                          }}
                          whileHover={{ backgroundColor: "#444" }}
                          whileTap={{ scale: 0.95 }}
                          onClick={triggerFileInput}
                        >
                          Upload
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept="image/*"
                            style={{ display: "none" }}
                          />
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "15px",
                  marginTop: "30px",
                }}
              >
                <motion.button
                  type="button"
                  style={{ ...actionButtonStyle, backgroundColor: "#555" }}
                  whileHover={{ backgroundColor: "#444" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetForm}
                >
                  <FaTimes style={{ marginRight: "5px" }} /> Cancel
                </motion.button>

                <motion.button
                  type="submit"
                  style={actionButtonStyle}
                  whileHover={{ backgroundColor: "#0088cc" }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isUploading}
                >
                  <FaSave style={{ marginRight: "5px" }} /> Save
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Students List and Actions */}
        {!isAddingStudent && (
          <>
            <motion.div style={actionBarStyle} variants={itemVariants}>
              <div style={searchContainerStyle}>
                <FaSearch
                  color="#555"
                  style={{
                    position: "absolute",
                    left: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
                <input
                  type="text"
                  placeholder="Search by name, roll number or email..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  style={searchInputStyle}
                />
              </div>

              <motion.button
                style={addButtonStyle}
                whileHover={{ backgroundColor: "#0088cc" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAddingStudent(true)}
              >
                <FaUserPlus style={{ marginRight: "8px" }} /> Add Student
              </motion.button>
            </motion.div>

            <motion.div style={sectionStyle} variants={itemVariants}>
              <div style={sectionHeaderStyle}>STUDENTS DIRECTORY</div>

              {isLoading ? (
                <div style={loadingStyle}>
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <p>Loading students...</p>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div style={emptyStateStyle}>
                  {searchTerm ? (
                    <p>No students match your search criteria</p>
                  ) : (
                    <p>No students have been added yet</p>
                  )}
                </div>
              ) : (
                <div style={tableContainerStyle}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={tableHeaderStyle}>#</th>
                        <th style={tableHeaderStyle}>Name</th>
                        <th style={tableHeaderStyle}>Roll Number</th>
                        <th style={tableHeaderStyle}>Course</th>
                        <th style={tableHeaderStyle}>Year</th>
                        <th style={tableHeaderStyle}>Section</th>
                        <th style={tableHeaderStyle}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student, index) => (
                        <tr key={student._id} style={tableRowStyle}>
                          <td style={tableCellStyle}>{index + 1}</td>
                          <td style={tableCellStyle}>{student.name}</td>
                          <td style={tableCellStyle}>{student.enrollmentNo}</td>
                          <td style={tableCellStyle}>
                            {student.course || "-"}
                          </td>
                          <td style={tableCellStyle}>{student.year || "-"}</td>
                          <td style={tableCellStyle}>
                            {student.section || "-"}
                          </td>
                          <td style={tableCellStyle}>
                            <div style={{ display: "flex", gap: "10px" }}>
                              <motion.button
                                style={iconButtonStyle}
                                whileHover={{ backgroundColor: "#333" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => startEditing(student)}
                              >
                                <FaEdit color="#00ccff" />
                              </motion.button>
                              <motion.button
                                style={iconButtonStyle}
                                whileHover={{ backgroundColor: "#333" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDelete(student._id)}
                              >
                                <FaTrash color="#ff5252" />
                              </motion.button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

// Styles
const headerStyle = {
  backgroundColor: "#1e1e1e",
  padding: "18px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
};

const sectionStyle = {
  backgroundColor: "#181818",
  borderRadius: "12px",
  border: "1px solid #2a2a2a",
  boxShadow: "0 8px 16px rgba(0,0,0,0.4)",
  overflow: "hidden",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  paddingBottom: "20px",
};

const sectionHeaderStyle = {
  backgroundColor: "#202020",
  padding: "15px 20px",
  borderBottom: "1px solid #2a2a2a",
  color: "#00ccff",
  fontWeight: "bold",
  fontSize: "14px",
  letterSpacing: "1px",
  marginBottom: "20px",
};

const actionBarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  marginBottom: "10px",
};

const searchContainerStyle = {
  position: "relative",
  flex: 1,
  maxWidth: "500px",
};

const searchInputStyle = {
  backgroundColor: "#222",
  border: "1px solid #333",
  borderRadius: "8px",
  padding: "12px 12px 12px 42px",
  color: "#e0e0e0",
  width: "100%",
  outline: "none",
  transition: "border-color 0.2s ease",
  fontSize: "14px",
};

const addButtonStyle = {
  backgroundColor: "#00aaff",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "12px 20px",
  fontWeight: "600",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  fontSize: "14px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
};

const formGroupStyle = {
  marginBottom: "20px",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#b0b0b0",
  fontSize: "13px",
  fontWeight: "500",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#222",
  border: "1px solid #333",
  borderRadius: "6px",
  color: "#e0e0e0",
  outline: "none",
  transition: "border-color 0.2s ease",
  fontSize: "14px",
};

const actionButtonStyle = {
  backgroundColor: "#00aaff",
  color: "white",
  border: "none",
  borderRadius: "6px",
  padding: "10px 20px",
  fontWeight: "600",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "14px",
};

const photoContainerStyle = {
  width: "100%",
  height: "200px",
  backgroundColor: "#1a1a1a",
  borderRadius: "8px",
  border: "1px dashed #444",
  overflow: "hidden",
};

const photoPlaceholderStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  color: "#666",
  gap: "15px",
};

const tableContainerStyle = {
  width: "100%",
  overflowX: "auto",
  padding: "0 20px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  color: "#e0e0e0",
  fontSize: "14px",
};

const tableHeaderStyle = {
  textAlign: "left",
  padding: "12px 16px",
  backgroundColor: "#202020",
  borderBottom: "2px solid #333",
  color: "#00ccff",
  fontWeight: "bold",
  whiteSpace: "nowrap",
};

const tableRowStyle = {
  borderBottom: "1px solid #2a2a2a",
  transition: "background-color 0.2s ease",
};

const tableCellStyle = {
  padding: "12px 16px",
  whiteSpace: "nowrap",
};

const iconButtonStyle = {
  backgroundColor: "transparent",
  border: "none",
  borderRadius: "4px",
  padding: "6px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background-color 0.2s ease",
};

const loadingStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "50px 0",
  gap: "15px",
  color: "#888",
};

const emptyStateStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "50px 0",
  color: "#888",
};

export default StudentManagement;
