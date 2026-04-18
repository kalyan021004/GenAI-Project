import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./App.css"

import HomePage from './pages/HomePage';
import SiteDetailPage from './pages/SiteDetailPage';
import TourPage from './pages/TourPage';
import ChatPage from './pages/ChatPage';
import QuizPage from './pages/QuizPage';
import ExplorePage from './pages/ExplorePage';
import CategoryPage from './pages/CategoryPage';
import TrailPage from './pages/TrailPage';
import CommunityPage from './pages/CommunityPage';
import StatePage from './pages/StatePage';
import StatesPage from "./pages/StatesPage";
import BlogPage from './pages/BlogPage';
import AboutPage from './pages/AboutPage';
import SectionPage from "./pages/SectionPage";
import Navbar from './components/HomeComponents/Navbar';
import ProtectedRoute from "./components/ProtectedRoute";
import { LoginPage, RegisterPage } from './pages/AuthPages';
import Footer from './components/HomeComponents/Footer';
import NewBlogPage from './pages/NewBlogPage';
import BlogDetailPage from './pages/BlogDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<HomePage />} />

        {/* PROTECTED ROUTES */}
        <Route path="/site/:slug" element={<ProtectedRoute><SiteDetailPage /></ProtectedRoute>} />
        <Route path="/site/:slug/:section" element={<ProtectedRoute><SectionPage /></ProtectedRoute>} />
        <Route path="/tour/:slug" element={<ProtectedRoute><TourPage /></ProtectedRoute>} />
        <Route path="/chat/:slug" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/quiz/:slug" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
        <Route path="/category" element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />
        <Route path="/trail" element={<ProtectedRoute><TrailPage /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
        <Route path="/state/:stateName" element={<ProtectedRoute><StatePage /></ProtectedRoute>} />
        <Route path="/states" element={<ProtectedRoute><StatesPage /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
        <Route path="/blogs" element={<ProtectedRoute><BlogPage /></ProtectedRoute>} />
        <Route path="/blogs/new" element={<ProtectedRoute><NewBlogPage /></ProtectedRoute>} />
        <Route path="/blogs/:id" element={<ProtectedRoute><BlogDetailPage /></ProtectedRoute>} />

      </Routes>

      <Footer />
    </BrowserRouter>
  );
}