import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Services
import { authService } from './services/auth.service';

// Styles
import './index.css';
import './App.css';

// Lazy loaded components
const Dashboard = lazy(() => import('./components/pages/Dashboard'));
const HomePage = lazy(() => import('./components/pages/HomePage'));
const AdminPanel = lazy(() => import('./components/pages/AdminPanel'));
const LoginForm = lazy(() => import('./components/auth/LoginForm'));
const StudentManagement = lazy(() => import('./components/pages/StudentManagement'));
const SignupForm = lazy(() => import('./components/auth/SignupForm'));

// Loading component for suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Simple layout components for testing
const PublicLayout = ({ children }) => <div className="public-layout">{children}</div>;

// Auth Context with actual implementation
const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  // Check for existing auth on component mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const userData = await authService.login(email, password);
      setUser(userData.teacher);
      setLoading(false);
      toast.success('Login successful');
      return userData;
    } catch (error) {
      setLoading(false);
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    try {
      const response = await authService.signup(userData);
      setUser(response.teacher);
      setLoading(false);
      toast.success('Registration successful');
      return response;
    } catch (error) {
      setLoading(false);
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return React.useContext(AuthContext);
};

// Simple theme provider
const ThemeContext = React.createContext();
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = React.useState('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={
          <PublicLayout>
            <HomePage />
          </PublicLayout>
        } />

        <Route path="/login" element={
          <PublicLayout>
            <LoginForm />
          </PublicLayout>
        } />

        <Route path="/signup" element={
          <PublicLayout>
            <SignupForm />
          </PublicLayout>
        } />

        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        } />

        <Route path="/students" element={
          <ProtectedRoute>
            <StudentManagement />
          </ProtectedRoute>
        } />

        {/* 404 route */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="auto" // This will respect the user's theme preference
          />
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

// Export context hooks for use in other components
export { useAuth, AuthContext };
export default App;

