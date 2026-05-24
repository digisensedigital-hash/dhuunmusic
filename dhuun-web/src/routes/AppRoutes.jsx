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

export default function
AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ------------------ */}
        {/* Landing Experience */}
        {/* ------------------ */}

        <Route
          path="/"
          element={
            <LandingPage />
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