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

  return (

    <BrowserRouter>

      <Routes>

        {/* ------------------ */}
        {/* Landing */}
        {/* ------------------ */}

        <Route
          path="/"
          element={
            <LandingPage />
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

              <ProtectedRoute>

                <LibraryPage />

              </ProtectedRoute>

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