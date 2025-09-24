import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import IssueList from "../components/IssueList";
import IssueMap from "../components/IssueMap";
import { getIssues } from "../api/issueService";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { user } = useAuth();
  const location = useLocation(); // Get location object from router
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the highlighted issue ID from the navigation state, if it exists
  const highlightedIssueId = location.state?.newIssueId;

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await getIssues();
        // Sort issues by date, newest first
        const sortedIssues = response.data.sort(
          (a, b) => new Date(b.reportedAt) - new Date(a.reportedAt)
        );
        setIssues(sortedIssues);
      } catch (err) {
        setError("Failed to fetch issues. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  if (loading) return <p>Loading issues...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="home-page">
      <div className="map-container">
        <h2>Issues Map</h2>
        {/* Pass the highlighted ID to the map component */}
        <IssueMap issues={issues} highlightedIssueId={highlightedIssueId} />
      </div>
      <div className="list-container">
        <h2>Reported Issues</h2>
        <IssueList issues={issues} />
        {user && user.role === "public" && (
          <Link to="/report" className="report-button">
            Report a New Issue
          </Link>
        )}
      </div>
    </div>
  );
};

export default HomePage;
