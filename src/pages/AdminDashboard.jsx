import React, { useState, useEffect } from "react";
import { getIssues, updateIssueStatus } from "../api/issueService";
import { Link } from "react-router-dom"; // 1. Make sure Link is imported

const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);

  // This function now sorts the issues by date
  const fetchIssues = async () => {
    try {
      const response = await getIssues();
      const sortedIssues = response.data.sort(
        (a, b) => new Date(b.reportedAt) - new Date(a.reportedAt)
      );
      setIssues(sortedIssues);
    } catch (error) {
      console.error("Failed to fetch issues:", error);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateIssueStatus(id, newStatus);
      fetchIssues();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Could not update status.");
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Manage all reported civic issues.</p>
      <table className="issues-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Reported At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue.id}>
              {/* 2. This line is now a clickable link */}
              <td>
                <Link to={`/issue/${issue.id}`}>{issue.title}</Link>
              </td>
              <td>{issue.category}</td>
              <td>
                <span
                  className={`status-badge status-${issue.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {issue.status}
                </span>
              </td>
              <td>{new Date(issue.reportedAt).toLocaleString()}</td>
              <td className="action-buttons">
                <select
                  defaultValue={issue.status}
                  onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                >
                  <option value="Reported">Reported</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
