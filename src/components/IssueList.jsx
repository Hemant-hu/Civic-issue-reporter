import React from "react";
import { Link } from "react-router-dom";

const IssueList = ({ issues }) => {
  if (!issues || issues.length === 0) {
    return <p>No issues reported yet.</p>;
  }

  return (
    <ul className="issue-list">
      {issues.map((issue) => (
        <li key={issue.id} className="issue-list-item">
          <Link to={`/issue/${issue.id}`}>
            <h3>{issue.title}</h3>
            <p>Category: {issue.category}</p>
            <p>
              Status:{" "}
              <span
                className={`status-badge status-${issue.status.toLowerCase()}`}
              >
                {issue.status}
              </span>
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default IssueList;
