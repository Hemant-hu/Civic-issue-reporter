// ... other imports
import { useAuth } from "../context/AuthContext";

const IssueForm = () => {
  const { user } = useAuth(); // Get user from auth context
  const navigate = useNavigate();
  // ... other state hooks

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to report an issue.");
      navigate("/login");
      return;
    }

    const newIssue = {
      // ... other fields
      userId: user.id, // Add the logged-in user's ID
      // ...
    };
    // ... same try/catch block for createIssue
  };
  // ... rest of the component
};
// NOTE: Make sure to import useAuth and get the user in the ReportIssuePage or IssueForm component
