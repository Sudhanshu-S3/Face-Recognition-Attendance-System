## Face Recognition Attendance System - Frontend

This is the frontend for the Face Recognition Attendance System, built with React and Tailwind CSS. It provides a modern, responsive user interface for students, teachers, and administrators to manage attendance, authentication, and user data.

### Features

- User authentication (login/signup)
- Dashboard for attendance management
- Student and teacher management panels
- Real-time attendance status
- Error handling and notifications
- Responsive design for desktop and mobile

### Tech Stack

- React (with Create React App)
- Tailwind CSS
- Axios (API requests)
- Nginx (for production deployment)

### Project Structure

```
frontend/
  public/                # Static files
    index.html
    models/
  src/
    api/                 # API config
    components/
      auth/              # Login/Signup forms
      pages/             # Main pages (Dashboard, AdminPanel, etc.)
    services/            # API service modules
    App.js, App.css      # Main app files
    index.js, index.css  # Entry point
  craco.config.js        # Custom CRA config
  tailwind.config.js     # Tailwind setup
  Dockerfile             # Docker setup
  nginx.conf             # Nginx config
```

### Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the development server:**

   ```bash
   npm start
   ```

   The app will run at [http://localhost:3000](http://localhost:3000).

3. **Build for production:**
   ```bash
   npm run build
   ```
   The optimized build will be in the `build` folder.

### Environment Variables

Create a `.env` file in the `frontend` directory for API endpoints and other config. Example:

```
REACT_APP_API_URL=http://localhost:5000/api
```

### Deployment

You can deploy the frontend using Docker and Nginx. See `Dockerfile` and `nginx.conf` for details.

### Contributing

Feel free to open issues or submit pull requests for improvements.

### License

This project is licensed under the MIT License.
