import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Import Pages
import Dashboard from './pages/Dashboard';
import TasksPage from './pages/TasksPage';
import ProfilePage from './pages/ProfilePage';
import Login from './pages/Login';
import Register from './pages/Register';

// Import Shared Components
import Sidebar from './components/Sidebar';

// Protected Route Wrapper Component
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin mb-4" />
        <span className="text-xs text-dark-400 font-bold uppercase tracking-widest">
          Securing Workspace Session...
        </span>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Layout wrapper for authenticated pages (contains Sidebar)
const AuthenticatedLayout = ({ children }) => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-dark-950 text-dark-100 glowing-grid">
      {/* Dynamic collapsing sidebar */}
      <Sidebar />
      
      {/* Primary content area */}
      <main className="flex-1 flex flex-col min-h-screen lg:pl-72">
        {children}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      {/* Public Unprotected authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Main Workspace Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Dashboard />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <TasksPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <ProfilePage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      {/* Redirect fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
