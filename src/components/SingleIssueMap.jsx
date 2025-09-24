import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Icon setup to ensure markers appear correctly
const icon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const SingleIssueMap = ({ location }) => {
  if (!location || !location.lat || !location.lng) {
    return <div>Location data is unavailable.</div>;
  }

  const position = [location.lat, location.lng];

  return (
    <div className="single-map-container">
      <MapContainer
        center={position}
        zoom={16} // Zoom in close to the specific location
        style={{ height: "300px", width: "100%" }}
        scrollWheelZoom={false} // Prevents page scroll hijacking
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position} icon={icon}>
          <Popup>The reported issue is here.</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default SingleIssueMap;
