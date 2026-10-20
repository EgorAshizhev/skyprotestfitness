import { Route, Routes } from 'react-router-dom';
import AuthModal from './components/AuthModal';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import CoursePage from './pages/CoursePage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import WorkoutPage from './pages/WorkoutPage';

export default function App() {
  return (
    <div className="mx-auto max-w-290 px-4">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses/:courseId" element={<CoursePage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/workout/:courseId/:workoutId" element={<WorkoutPage />} />
        </Route>
      </Routes>
      <AuthModal />
    </div>
  );
}
