# Face Recognition Attendance System

This project is a full-stack Face Recognition Attendance System designed to automate and simplify attendance management using facial recognition technology. It consists of a React-based frontend, a Node.js/Express backend, and Python scripts for face detection and recognition.

## Features

- Face recognition-based attendance marking
- Secure authentication for students, teachers, and admins
- Attendance tracking and reporting
- Student and teacher management
- Responsive and modern UI
- RESTful API integration
- Dockerized deployment

## Documentation

- [Frontend Guide](frontend/README.md)
- [Backend Guide](backend/README.md)


## Tech Stack

- **Frontend:** React, Tailwind CSS, Axios, Nginx
- **Backend:** Node.js, Express, MongoDB, JWT
- **Face Recognition:** Python, OpenCV
- **Deployment:** Docker, Docker Compose

## Project Structure

```
Attendance/           # Python scripts for face recognition
backend/              # Node.js/Express backend
frontend/             # React frontend
docker-compose.yml    # Multi-container orchestration
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd VISUAL
   ```
2. **Backend setup:**
   - Navigate to `backend/`
   - Install Node dependencies: `npm install`
   - Configure `.env` for MongoDB and JWT
   - Install Python dependencies: `pip install -r req.txt`
   - Start backend: `npm run start`
3. **Frontend setup:**
   - Navigate to `frontend/`
   - Install dependencies: `npm install`
   - Configure `.env` for API URL
   - Start frontend: `npm start`
4. **Docker deployment:**
   - Use `docker-compose.yml` to run all services together
   - `docker-compose up --build`

## Usage

- Access the frontend at `http://localhost:3000`
- Backend API runs at `http://localhost:5000/api`
- Mark attendance using face recognition via integrated Python scripts

## Contributing

Pull requests and issues are welcome for improvements and bug fixes.

## License

This project is licensed under the MIT License.

## Author

Sudhanshu Shukla