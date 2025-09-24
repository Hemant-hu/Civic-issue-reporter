import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getIssueById,
  updateIssueStatus,
  reverseGeocode,
} from "../api/issueService";
import { useAuth } from "../context/AuthContext";
import SingleIssueMap from "../components/SingleIssueMap";

const IssueDetailsPage = () => {
  const { user } = useAuth();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("Loading address...");
  const { id } = useParams();

  useEffect(() => {
    getIssueById(id)
      .then((response) => {
        setIssue(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching issue details:", error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (issue && issue.location) {
      const fetchAddress = async () => {
        const formattedAddress = await reverseGeocode(
          issue.location.lat,
          issue.location.lng
        );
        setAddress(formattedAddress);
      };
      fetchAddress();
    }
  }, [issue]);

  const handleStatusChange = async (newStatus) => {
    // ... handleStatusChange logic remains the same
  };

  if (loading) return <p>Loading issue details...</p>;
  if (!issue) return <p>Issue not found.</p>;

  // Helper function to render the correct media type
  const renderMedia = () => {
    if (!issue.imageUrl || issue.imageUrl.includes("No+Media")) {
      return <p>No media was uploaded for this issue.</p>;
    }
    // Check if the URL is our video placeholder
    if (issue.imageUrl.includes("Video+Uploaded")) {
      // In a real app with real video URLs, you would put the URL in the src
      return (
        <div className="media-preview-container">
          <video controls className="media-preview" width="100%">
            <source src="your_video_url.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <p style={{ textAlign: "center", fontStyle: "italic" }}>
            Video was uploaded (placeholder shown).
          </p>
        </div>
      );
    }
    // Otherwise, assume it's an image
    return (
      <div className="media-preview-container">
        <img
          src={issue.imageUrl}
          alt="Uploaded issue media"
          className="media-preview"
        />
      </div>
    );
  };

  return (
    <div className="issue-details-container">
      <Link to="/home" className="back-link">
        ← Back to Home
      </Link>
      <h1>{issue.title}</h1>

      {/* --- NEW: Uploaded Media Section --- */}
      <div className="uploaded-media-section">
        <h3>Uploaded Media</h3>
        {renderMedia()}
      </div>

      <div className="details-main-content">
        <div className="details-info">
          <p>
            <strong>Category:</strong> {issue.category}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`status-badge status-${issue.status
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {issue.status}
            </span>
          </p>
          <p>
            <strong>Description:</strong> {issue.description}
          </p>
          <p>
            <strong>Reported At:</strong>{" "}
            {issue.reportedAt
              ? new Date(issue.reportedAt).toLocaleString()
              : "N/A"}
          </p>
          <p>
            <strong>Address:</strong> {address}
          </p>
        </div>
        <div className="details-map">
          <SingleIssueMap location={issue.location} />
        </div>
      </div>

      {user && user.role === "admin" && (
        <div className="status-update-actions">
          {/* ... admin buttons ... */}
        </div>
      )}
    </div>
  );
};

export default IssueDetailsPage;
