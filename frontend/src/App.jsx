import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AttendanceCapture from "./components/AttendanceCapture";
// Import other components

function App() {
  return (
    <Router>
      <Routes>
        {/* Other routes */}
        <Route path="/attendance/take" element={<AttendanceCapture />} />
      </Routes>
    </Router>
  );
}

export default App;
