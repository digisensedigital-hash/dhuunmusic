import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import {
  useAuth,
} from '../context/AuthContext';

import AdminLayout
  from '../components/layout/AdminLayout';

import LoginPage
  from '../pages/auth/LoginPage';

import RegisterPage
  from '../pages/auth/RegisterPage';

import DashboardPage
  from '../pages/dashboard/DashboardPage';

import TracksPage
  from '../pages/tracks/TracksPage';

import ArtistsPage
  from '../pages/artists/ArtistsPage';

import PlaylistsPage
  from '../pages/playlists/PlaylistsPage';

import UsersPage
  from '../pages/users/UsersPage';

import AnalyticsPage
  from '../pages/analytics/AnalyticsPage';

import SettingsPage
  from '../pages/settings/SettingsPage';

/* ----------------------------------- */
/* Protected Route */
/* ----------------------------------- */

function ProtectedRoute({
  children,
}) {

  const {
    isAuthenticated,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

export default function AppRoutes() {

  const {
    isAuthenticated,
  } = useAuth();

  return (
    <Routes>

      {/* ----------------------------------- */}
      {/* Login */}
      {/* ----------------------------------- */}

      <Route
        path="/login"
        element={
          isAuthenticated
            ? (
                <Navigate
                  to="/"
                  replace
                />
              )
            : (
                <LoginPage />
              )
        }
      />

      {/* ----------------------------------- */}
      {/* Register */}
      {/* ----------------------------------- 

      <Route
        path="/register"
        element={
          isAuthenticated
            ? (
                <Navigate
                  to="/"
                  replace
                />
              )
            : (
                <RegisterPage />
              )
        }
      />*/}

      {/* ----------------------------------- */}
      {/* Dashboard */}
      {/* ----------------------------------- */}

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <DashboardPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* ----------------------------------- */}
      {/* Tracks */}
      {/* ----------------------------------- */}

      <Route
        path="/tracks"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <TracksPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* ----------------------------------- */}
      {/* Artists */}
      {/* ----------------------------------- */}

      <Route
        path="/artists"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <ArtistsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* ----------------------------------- */}
      {/* Playlists */}
      {/* ----------------------------------- */}

      <Route
        path="/playlists"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <PlaylistsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* ----------------------------------- */}
      {/* Users */}
      {/* ----------------------------------- */}

      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <UsersPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* ----------------------------------- */}
      {/* Analytics */}
      {/* ----------------------------------- */}

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AnalyticsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* ----------------------------------- */}
      {/* Settings */}
      {/* ----------------------------------- */}

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <SettingsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* ----------------------------------- */}
      {/* Fallback */}
      {/* ----------------------------------- */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}