import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import MainLayout
  from '../layouts/MainLayout';

import LandingPage
  from '../pages/LandingPage';

import HomePage
  from '../pages/HomePage';

import PlaylistPage
  from '../pages/PlaylistPage';

import SearchPage
  from '../pages/SearchPage';

import ArtistPage
  from '../pages/ArtistPage';

import TrackDetailsPage
  from '../pages/TrackDetailsPage';

import LibraryPage
  from '../pages/LibraryPage';

import LoginPage
  from '../pages/LoginPage';

import RegisterPage
  from '../pages/RegisterPage';

import ProtectedRoute
  from '../components/auth/ProtectedRoute';

export default function
AppRoutes() {

  /* ----------------------------------- */
  /* Force Logout On Release */
  /* ----------------------------------- */

  const APP_VERSION =
    '2';

  const currentVersion =
    localStorage.getItem(
      'app_version'
    );

  if (
    currentVersion !==
    APP_VERSION
  ) {

    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'user'
    );

    localStorage.setItem(
      'app_version',
      APP_VERSION
    );
  }

  return (

    <BrowserRouter>

      <Routes>

        {/* ------------------ */}
        {/* Landing */}
        {/* ------------------ */}

        <Route
          path="/"
          element={
            localStorage.getItem(
              'token'
            )
              ? (
                  <Navigate
                    to="/app"
                    replace
                  />
                )
              : (
                  <Navigate
                    to="/app/login"
                    replace
                  />
                )
          }
        />

        {/* ------------------ */}
        {/* Standalone Auth */}
        {/* ------------------ */}

        <Route
          path="/app/login"
          element={
            <LoginPage />
          }
        />

        <Route
          path="/app/register"
          element={
            <RegisterPage />
          }
        />

        {/* ------------------ */}
        {/* Streaming App */}
        {/* ------------------ */}

        <Route
          path="/app"
          element={
            <MainLayout />
          }
        >

          <Route
            index
            element={
              <HomePage />
            }
          />

          <Route
            path="playlist/:id"
            element={
              <PlaylistPage />
            }
          />

          <Route
            path="search"
            element={
              <SearchPage />
            }
          />

          <Route
            path="artist/:id"
            element={
              <ArtistPage />
            }
          />

          <Route
            path="track/:identifier"
            element={
              <TrackDetailsPage />
            }
          />

          <Route
            path="library"
            element={
              <LibraryPage />
            }
          />

        </Route>

        {/* ------------------ */}
        {/* Fallback */}
        {/* ------------------ */}

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

    </BrowserRouter>

  );

}