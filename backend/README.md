## Face Recognition Attendance System - Backend

This backend is a Node.js/Express server for the Face Recognition Attendance System. It provides RESTful APIs for authentication, attendance management, and student/teacher data operations. The backend connects to a database and integrates with face recognition scripts for automated attendance.

### Features

- User authentication (JWT-based)
- Attendance tracking and management
- Student and teacher CRUD operations
- Error handling and middleware
- Integration with face recognition Python scripts

### Prerequisites

- Node.js (v14 or above recommended)
- npm
- Database (MongoDB recommended)
- Python (for face recognition scripts)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd backend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   Create a `.env` file in the `backend` directory. Example:
   ```env
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   PORT=5000
   ```
4. **Install Python dependencies:**
   ```bash
   pip install -r req.txt
   ```
5. **Start the backend server:**
   ```bash
   npm run start
   ```

### Project Structure

```
backend/
  Attendance/           # Python scripts for face recognition
  src/
    server.js           # Entry point
    config/             # DB connection
    controllers/        # Route controllers
    middlewares/        # Auth and error middleware
    models/             # Mongoose models
    routes/             # API routes
    utils/              # Utility functions
  req.txt               # Python requirements
  Dockerfile            # Docker setup
  package.json          # Node dependencies
```

### API Endpoints

- **Auth:** `/api/auth` (login, signup)
- **Attendance:** `/api/attendance` (mark, get attendance)
- **Student:** `/api/student` (CRUD operations)

See the controllers and routes for detailed API usage.

### Running with Docker

You can use the provided `Dockerfile` and `docker-compose.yml` for containerized deployment.

### Contributing

Feel free to open issues or submit pull requests for improvements.

### License

This project is licensed under the MIT License.
