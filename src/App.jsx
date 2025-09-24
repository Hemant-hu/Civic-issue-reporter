import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Root from "./components/Root"; // Import the new Root component
import HomePage from "./pages/HomePage";
import ReportIssuePage from "./pages/ReportIssuePage";
import IssueDetailsPage from "./pages/IssueDetailsPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <main className="container">
          <Routes>
            {/* The root path now redirects based on auth status */}
            <Route path="/" element={<Root />} />

            {/* Public login page */}
            <Route path="/login" element={<LoginPage />} />

            {/* --- PROTECTED ROUTES --- */}
            {/* The homepage is now at /home and is protected */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/issue/:id"
              element={
                <ProtectedRoute>
                  <IssueDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report"
              element={
                <ProtectedRoute>
                  <ReportIssuePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
