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
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}