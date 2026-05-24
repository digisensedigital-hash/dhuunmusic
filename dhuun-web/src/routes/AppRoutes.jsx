import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import MainLayout
  from '../layouts/MainLayout';

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

      <MainLayout>

        <Routes>

          <Route
            path="/"
            element={
              <HomePage />
            }
          />

          <Route
            path="/playlist/:id"
            element={
              <PlaylistPage />
            }
          />

          <Route
            path="/search"
            element={
              <SearchPage />
            }
          />

          <Route
            path="/artist/:id"
            element={
              <ArtistPage />
            }
          />

          <Route
            path="/track/:identifier"
            element={
              <TrackDetailsPage />
            }
          />

          <Route
            path="/library"
            element={
              <LibraryPage />
            }
          />

        </Routes>

      </MainLayout>

    </BrowserRouter>
  );
}