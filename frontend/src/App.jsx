import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DestinationsPage from './pages/DestinationsPage';
import RecommendationsPage from './pages/RecommendationsPage';
import ItinerariesPage from './pages/ItinerariesPage';
import ItineraryDetailPage from './pages/ItineraryDetailPage';
import SharedItineraryPage from './pages/SharedItineraryPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route path="/shared/:token" element={<SharedItineraryPage />} />

      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <RecommendationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/itineraries"
          element={
            <ProtectedRoute>
              <ItinerariesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/itineraries/:id"
          element={
            <ProtectedRoute>
              <ItineraryDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
