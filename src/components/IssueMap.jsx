import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// --- Marker Icon Setup ---
// We now define an icon for each status

const shadowUrl =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png";
const iconDefaults = {
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
};

// Blue for "Reported" (our new default)
const reportedIcon = new L.Icon({
  ...iconDefaults,
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
});

// Green for "Resolved"
const resolvedIcon = new L.Icon({
  ...iconDefaults,
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
});

// Orange for "In Progress"
const inProgressIcon = new L.Icon({
  ...iconDefaults,
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
});

// Red for "Highlighted" (newly created)
const highlightedIcon = new L.Icon({
  ...iconDefaults,
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
});

// --- Helper Components (No changes here) ---
function MapEffect({ issues, highlightedIssueId }) {
  const map = useMap();
  useEffect(() => {
    if (highlightedIssueId) {
      const highlightedIssue = issues.find(
        (issue) => issue.id === highlightedIssueId
      );
      if (highlightedIssue) {
        const { lat, lng } = highlightedIssue.location;
        map.flyTo([lat, lng], 16, { animate: true, duration: 1.5 });
      }
    }
  }, [map, highlightedIssueId, issues]);
  return null;
}

const IssueMap = ({ issues, highlightedIssueId }) => {
  const defaultPosition = [21.0991, 78.9771]; // Wanadongri, Maharashtra

  // Helper function to determine which icon to use
  const getIconForIssue = (issue) => {
    // A newly submitted issue should always be red to stand out
    if (issue.id === highlightedIssueId) {
      return highlightedIcon;
    }
    // Otherwise, choose the icon based on its status
    switch (issue.status) {
      case "Resolved":
        return resolvedIcon;
      case "In Progress":
        return inProgressIcon;
      case "Reported":
      default:
        return reportedIcon;
    }
  };

  return (
    <MapContainer
      center={defaultPosition}
      zoom={14}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {issues.map((issue) => (
        <Marker
          key={issue.id}
          position={[issue.location.lat, issue.location.lng]}
          // Use our helper function to set the icon dynamically
          icon={getIconForIssue(issue)}
        >
          <Popup>
            <b>{issue.title}</b>
            <br />
            Status: {issue.status}
          </Popup>
        </Marker>
      ))}
      <MapEffect issues={issues} highlightedIssueId={highlightedIssueId} />
    </MapContainer>
  );
};

export default IssueMap;
